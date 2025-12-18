import { useCallback, useState } from 'react';

import { CampaignForm } from './CampaignForm';
import { CampaignList } from './CampaignList';
import { createCampaignFromInput } from './factory';
import { texts } from './texts';
import type { Campaign, CampaignInput } from './types';

export function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleCreateCampaign = useCallback((input: CampaignInput) => {
    const newCampaign = createCampaignFromInput(input);
    setCampaigns((prev) => [newCampaign, ...prev]);
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>{texts.dashboard.title}</h1>
      </header>

      <div className="grid">
        <CampaignForm onCreate={handleCreateCampaign} />
        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
