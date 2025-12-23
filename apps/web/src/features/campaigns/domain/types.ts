export type Campaign = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  status: CampaignStatus;
  recipients: Recipient[];
};

export type CampaignInput = {
  name: string;
  content: string;
};

export type CampaignStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'completed'
  | 'cancelled';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type Recipient = {
  id: string;
  campaignId?: string;
  name: string;
  phone: string;
  channel: 'sms' | 'whatsapp';
  status: 'pending' | 'sent' | 'error';
  errorMessage?: string | null;
};

export type IncomingMessage = {
  id: string;
  senderPhoneNumber: string;
  service: 'sms' | 'whatsapp';
  message: string;
  receivedAt: string;
};
