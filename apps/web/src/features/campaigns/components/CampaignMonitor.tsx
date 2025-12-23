import { texts } from '../domain/texts';
import type { Recipient } from '../domain/types';

type Props = {
  recipients: Recipient[];
};

export default function CampaignMonitor({ recipients }: Props) {
  if (recipients.length === 0) {
    return (
      <div className="empty-state">
        <p>{texts.monitor.empty}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="monitor-grid">
        {recipients.map((recipient) => {
          const tooltip = texts.monitor.tooltip(recipient);

          return (
            <div key={recipient.id} className="monitor-cell">
              <div
                className={`monitor-square monitor-square-${recipient.status}`}
                aria-hidden="true"
              />
              <div className="monitor-tooltip" role="tooltip">
                {tooltip}
              </div>
            </div>
          );
        })}
      </div>

      <div className="monitor-legend">
        <span className="monitor-legend-item">
          <span className="monitor-square monitor-square-sent" />
          <span>{texts.monitor.status.sent}</span>
        </span>

        <span className="monitor-legend-item">
          <span className="monitor-square monitor-square-pending" />
          <span>{texts.monitor.status.pending}</span>
        </span>

        <span className="monitor-legend-item">
          <span className="monitor-square monitor-square-error" />
          <span>{texts.monitor.status.error}</span>
        </span>
      </div>
    </div>
  );
}
