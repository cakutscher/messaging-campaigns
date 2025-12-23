import { sqlite } from "../db/index.js";
import type {
  Recipient,
  RecipientInput,
  RecipientStatus,
} from "../domain/types.js";

type RecipientRow = {
  id: string;
  campaign_id: string;
  name: string;
  phone: string;
  channel: "sms" | "whatsapp";
  status: RecipientStatus;
  error_message: string | null;
  reply: string | null;
};

function mapRecipient(row: RecipientRow): Recipient {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    phone: row.phone,
    channel: row.channel,
    status: row.status,
    errorMessage: row.error_message ?? null,
    reply: row.reply ?? null,
  };
}

const qDeleteByCampaign = sqlite.prepare(`
  DELETE FROM recipients
  WHERE campaign_id = ?
`);

const qInsert = sqlite.prepare(`
  INSERT INTO recipients (
    id, campaign_id, name, phone, channel, status, error_message, reply
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const qListByCampaign = sqlite.prepare(`
  SELECT id, campaign_id, name, phone, channel, status, error_message, reply
  FROM recipients
  WHERE campaign_id = ?
  ORDER BY id ASC
`);

const qUpdateSendResult = sqlite.prepare(`
  UPDATE recipients
  SET status = ?, error_message = ?
  WHERE id = ?
`);

const qAttachReplyByPhone = sqlite.prepare(`
  UPDATE recipients
  SET reply = ?
  WHERE phone = ?
`);

export function replaceRecipients(
  campaignId: string,
  recipients: RecipientInput[]
) {
  const tx = sqlite.transaction(() => {
    qDeleteByCampaign.run(campaignId);

    for (const r of recipients) {
      qInsert.run(
        r.id,
        campaignId,
        r.name.trim(),
        r.phone.trim(),
        r.channel,
        "pending",
        null,
        null
      );
    }
  });

  tx();
}

export function listRecipients(campaignId: string): Recipient[] {
  const rows = qListByCampaign.all(campaignId) as RecipientRow[];
  return rows.map(mapRecipient);
}

export function updateRecipientResult(
  recipientId: string,
  status: RecipientStatus,
  errorMessage: string | null
) {
  qUpdateSendResult.run(status, errorMessage, recipientId);
}

export function attachReplyByPhone(phone: string, reply: string) {
  qAttachReplyByPhone.run(reply, phone);
}
