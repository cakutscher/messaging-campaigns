import type { Campaign, CampaignInput } from './types';
import { uid } from './utils';

export function createCampaignFromInput(input: CampaignInput): Campaign {
  return {
    id: `cmp_${uid()}`,
    name: input.name.trim(),
    content: input.content.trim(),
    createdAt: new Date().toISOString(),
    status: 'draft',
  };
}
