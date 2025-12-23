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

function CampaignDetail({ campaign, recipients = [], onImport, onExecute, onCancel }: Props) {
  return (
    <div className="card">
      <h2 className="card-header">{texts.detail.title}</h2>

      {!campaign ? (
        <div className="empty-state">
          <p>{texts.detail.empty}</p>
        </div>
      ) : (
        <div className="card-body">
          <div className="section">
            <h3 className="section-title">{campaign.name}</h3>
            <p>{campaign.content}</p>
          </div>

          <div className="section">
            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={() => onExecute?.(campaign.id)}
                disabled={campaign.status !== 'ready'}
              >
                {texts.detail.executeButton}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onCancel?.(campaign.id)}
                disabled={campaign.status !== 'running'}
              >
                {texts.detail.cancelButton}
              </button>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">Destinatarios</h3>
            {recipients.length === 0 ? (
              <CampaignRecipientsUpload
                campaignId={campaign.id}
                onImport={(id, recs) => onImport?.(id, recs)}
              />
            ) : (
              <>
                <CampaignMonitor recipients={recipients} />
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <p style={{ marginBottom: 'var(--space-2)' }}>
                    {texts.recipients.parsedInfo(recipients.length)}
                  </p>

                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{texts.table.name}</th>
                          <th>{texts.table.phone}</th>
                          <th>{texts.table.channel}</th>
                          <th>{texts.table.status}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipients.map((r) => (
                          <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.phone}</td>
                            <td>{r.channel}</td>
                            <td>
                              <span className="pill pill-blue">{r.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignDetail;
