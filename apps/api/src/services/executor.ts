import {
  getCampaign,
  setCampaignStatus,
} from "../repositories/campaignsRepo.js";
import {
  listRecipients,
  updateRecipientResult,
} from "../repositories/recipientsRepo.js";
import { sendMessage } from "./messagingProvider.js";

const abortControllers = new Map<string, AbortController>();

export async function executeCampaign(campaignId: string) {
  if (abortControllers.has(campaignId)) return;

  const campaign = getCampaign(campaignId);
  if (!campaign) return;

  const controller = new AbortController();
  abortControllers.set(campaignId, controller);

  setCampaignStatus(campaignId, "running");

  const recipients = listRecipients(campaignId);

  for (const recipient of recipients) {
    if (controller.signal.aborted) break;

    try {
      const result = await sendMessage({
        recipientPhoneNumber: recipient.phone,
        service: recipient.channel,
        message: campaign.content,
      });

      updateRecipientResult(
        recipient.id,
        result.ok ? "sent" : "error",
        result.ok ? null : result.error
      );
    } catch (err) {
      updateRecipientResult(
        recipient.id,
        "error",
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  if (controller.signal.aborted) {
    setCampaignStatus(campaignId, "cancelled");
  } else {
    setCampaignStatus(campaignId, "completed");
  }

  abortControllers.delete(campaignId);
}

export function cancelCampaign(campaignId: string) {
  abortControllers.get(campaignId)?.abort();
}
