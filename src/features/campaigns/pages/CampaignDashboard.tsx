import CampaignDetail from '../components/CampaignDetail';
import CampaignForm from '../components/CampaignForm';
import CampaignList from '../components/CampaignList';
import { texts } from '../domain/texts';
import { useCampaigns } from '../hooks/useCampaigns';

function CampaignDashboard() {
  const {
    campaigns,
    selectedId,
    selectedCampaign,
    selectedRecipients,
    handleCreate,
    handleImportRecipients,
    handleExecute,
    handleCancel,
    setSelectedId,
  } = useCampaigns();

  return (
    <div className="page">
      <header className="header">
        <h1>{texts.dashboard.title}</h1>
      </header>

      <div className="grid3">
        <CampaignForm onCreate={handleCreate} />

        <CampaignList
          campaigns={campaigns}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />

        <CampaignDetail
          campaign={selectedCampaign}
          recipients={selectedRecipients}
          onImport={handleImportRecipients}
          onExecute={handleExecute}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default CampaignDashboard;
