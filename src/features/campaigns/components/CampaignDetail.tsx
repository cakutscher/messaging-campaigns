import { texts } from '@campaigns/domain/texts';
import type { Campaign, Recipient } from '@campaigns/domain/types';
import CampaignMonitor from './CampaignMonitor';
import CampaignRecipientsUpload from './CampaignRecipientsUpload';

type Props = {
  campaign: Campaign | null;
  recipients?: Recipient[];
  onImport?: (campaignId: string, recipients: Recipient[]) => void;
  onExecute?: (campaignId: string) => void;
  onCancel?: (campaignId: string) => void;
};

function CampaignDetail({
  campaign,
  recipients = [],
  onImport,
  onExecute,
  onCancel,
}: Props) {
  return (
    <section className="card">
      <h2>{texts.detail.title}</h2>

      {!campaign ? (
        <p className="muted">{texts.detail.empty}</p>
      ) : (
        <div className="detailBlock">
          <div className="detailTitle">{campaign.name}</div>
          <div className="muted small">{campaign.content}</div>

          <div className="detailMeta">
            <div>
              <span className="muted small">{texts.detail.created}</span>{' '}
              {new Date(campaign.createdAt).toLocaleString()}
            </div>
          </div>

          <hr />

          <div>
            <CampaignRecipientsUpload
              campaignId={campaign.id}
              onImport={(id, recs) => onImport?.(id, recs)}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button className="btn" onClick={() => onExecute?.(campaign.id)}>
                {texts.detail.executeButton}
              </button>
              <button className="btn" onClick={() => onCancel?.(campaign.id)}>
                {texts.detail.cancelButton}
              </button>
            </div>

            <CampaignMonitor recipients={recipients} />
          </div>
        </div>
      )}
    </section>
  );
}

export default CampaignDetail;