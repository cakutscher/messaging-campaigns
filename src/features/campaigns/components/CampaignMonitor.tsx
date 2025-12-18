import { texts } from '../domain/texts';
import type { Recipient } from '../domain/types';

type Props = {
  recipients: Recipient[];
};

function squareColor(status: string) {
  switch (status) {
    case 'sent':
      return '#2ecc71';
    case 'error':
      return '#e74c3c';
    case 'pending':
    default:
      return '#95a5a6';
  }
}

function CampaignMonitor({ recipients }: Props) {
  if (!recipients || recipients.length === 0) {
    return <div className="muted">{texts.monitor.empty}</div>;
  }

  return (
    <div>
      <h3>{texts.monitor.title}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 22px)',
          gap: 8,
        }}
      >
        {recipients.map((r) => (
          <div
            key={r.id}
            title={texts.monitor.tooltip(r)}
            style={{
              width: 22,
              height: 22,
              background: squareColor(r.status),
              borderRadius: 3,
            }}
          />
        ))}
      </div>
      <div className="muted small" style={{ marginTop: 8 }}>
        {texts.monitor.legend}{' '}
        <span style={{ color: '#2ecc71' }}>{texts.monitor.status.sent}</span> /{' '}
        <span style={{ color: '#95a5a6' }}>
          {texts.monitor.status.pending}
        </span>{' '}
        / <span style={{ color: '#e74c3c' }}>{texts.monitor.status.error}</span>
      </div>
    </div>
  );
}

export default CampaignMonitor;