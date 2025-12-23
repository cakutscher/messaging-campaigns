import CampaignDetail from '@campaigns/components/CampaignDetail';
import CampaignForm from '@campaigns/components/CampaignForm';
import CampaignList from '@campaigns/components/CampaignList';
import Modal from '@campaigns/components/Modal';
import { texts } from '@campaigns/domain/texts';
import { useCampaigns } from '@campaigns/hooks/useCampaigns';
import { useState } from 'react';

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAndClose = (data: { name: string; content: string }) => {
    handleCreate(data);
    setIsModalOpen(false);
  };

  return (
    <div className="page">
      <header className="header">
        <h1>{texts.dashboard.title}</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            {texts.form.createButton}
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <CampaignList campaigns={campaigns} onSelect={setSelectedId} selectedId={selectedId} />

        <CampaignDetail
          campaign={selectedCampaign}
          recipients={selectedRecipients}
          onImport={handleImportRecipients}
          onExecute={handleExecute}
          onCancel={handleCancel}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CampaignForm onCreate={handleCreateAndClose} />
      </Modal>
    </div>
  );
}

export default CampaignDashboard;
