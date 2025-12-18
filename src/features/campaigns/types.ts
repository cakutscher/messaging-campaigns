export type Campaign = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  status: CampaignStatus;
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
