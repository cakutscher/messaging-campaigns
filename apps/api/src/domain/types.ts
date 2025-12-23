export type Channel = "sms" | "whatsapp";

export type CampaignStatus =
  | "draft"
  | "ready"
  | "running"
  | "completed"
  | "cancelled";

export type RecipientStatus = "pending" | "sent" | "error";

export type Campaign = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  status: CampaignStatus;
};

export type Recipient = {
  id: string;
  campaignId: string;
  name: string;
  phone: string;
  channel: Channel;
  status: RecipientStatus;
  errorMessage: string | null;
  reply: string | null;
};

export type RecipientInput = Pick<
  Recipient,
  "id" | "name" | "phone" | "channel"
>;
