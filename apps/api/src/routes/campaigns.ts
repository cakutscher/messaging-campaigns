import { Router } from "express";
import { z } from "zod";

import type { RecipientInput } from "../domain/types.js";
import {
  createCampaign,
  getCampaign,
  listCampaigns,
  setCampaignStatus,
} from "../repositories/campaignsRepo.js";
import {
  listRecipients,
  replaceRecipients,
} from "../repositories/recipientsRepo.js";
import { cancelCampaign, executeCampaign } from "../services/executor.js";

export const campaignsRouter = Router();

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// ---- validation ----
const createCampaignSchema = z.object({
  name: z.string().min(2).max(80),
  content: z.string().min(1).max(500),
});

const recipientInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(8),
  channel: z.union([z.literal("sms"), z.literal("whatsapp")]),
});

const recipientsUploadSchema = z.array(recipientInputSchema).min(1);

// ---- routes ----

// POST /api/campaigns
campaignsRouter.post("/", (req, res) => {
  const parsed = createCampaignSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ status: "error", error: "Invalid campaign input" });
  }

  const id = makeId("cmp");
  const campaign = createCampaign({
    id,
    name: parsed.data.name,
    content: parsed.data.content,
  });

  return res.json({ status: "ok", campaign });
});

// GET /api/campaigns
campaignsRouter.get("/", (_req, res) => {
  const campaigns = listCampaigns();
  return res.json({ status: "ok", campaigns });
});

// GET /api/campaigns/:id
campaignsRouter.get("/:id", (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign)
    return res.status(404).json({ status: "error", error: "Not found" });
  return res.json({ status: "ok", campaign });
});

// POST /api/campaigns/:id/recipients
campaignsRouter.post("/:id/recipients", (req, res) => {
  const campaignId = req.params.id;

  const campaign = getCampaign(campaignId);
  if (!campaign)
    return res.status(404).json({ status: "error", error: "Not found" });

  if (campaign.status !== "draft") {
    return res
      .status(400)
      .json({ status: "error", error: "Campaign is not editable" });
  }

  const parsed = recipientsUploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ status: "error", error: "Invalid recipients payload" });
  }

  const recipients: RecipientInput[] = parsed.data.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    channel: r.channel,
  }));

  replaceRecipients(campaignId, recipients);
  setCampaignStatus(campaignId, "ready");

  return res.json({ status: "ok" });
});

// GET /api/campaigns/:id/recipients
campaignsRouter.get("/:id/recipients", (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign)
    return res.status(404).json({ status: "error", error: "Not found" });

  const recipients = listRecipients(req.params.id);
  return res.json({ status: "ok", recipients });
});

// POST /api/campaigns/:id/execute
campaignsRouter.post("/:id/execute", (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign)
    return res.status(404).json({ status: "error", error: "Not found" });

  if (campaign.status !== "ready") {
    return res
      .status(400)
      .json({ status: "error", error: "Campaign is not ready" });
  }
  void executeCampaign(campaign.id);

  return res.status(202).json({ status: "ok" });
});

// POST /api/campaigns/:id/cancel
campaignsRouter.post("/:id/cancel", (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign)
    return res.status(404).json({ status: "error", error: "Not found" });

  cancelCampaign(campaign.id);
  return res.json({ status: "ok" });
});
