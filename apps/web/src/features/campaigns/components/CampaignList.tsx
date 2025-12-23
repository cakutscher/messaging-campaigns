import { texts } from '../domain/texts';
import type { Campaign } from '../domain/types';

type Props = {
  campaigns: Campaign[];
  onSelect: (campaignId: string) => void;
  selectedId: string | null;
};

const pillColorMap: Record<Campaign['status'], string> = {
  draft: 'pill-blue',
  ready: 'pill-yellow',
  running: 'pill-indigo',
  completed: 'pill-green',
  cancelled: 'pill-red',
};

function CampaignList({ campaigns, onSelect, selectedId }: Props) {
  const hasCampaigns = campaigns.length > 0;

  return (
    <div className="card">
      <h2 className="card-header">{texts.list.title}</h2>

      {!hasCampaigns ? (
        <div className="empty-state" role="status">
          <p>{texts.list.empty}</p>
        </div>
      ) : (
        <ul className="campaign-list" aria-labelledby="campaigns-title">
          {campaigns.map((c) => {
            const isSelected = selectedId === c.id;
            const pillClass = pillColorMap[c.status] ?? 'pill-blue';

            return (
              <li key={c.id} className="campaign-list-item">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-pressed={isSelected}
                  className={isSelected ? 'selected' : ''}
                >
                  <div className="campaign-list-item__content">
                    <span className="campaign-list-item__title">{c.name}</span>
                    <span className="campaign-list-item__date">
                      {texts.list.created}{' '}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`pill ${pillClass}`}>{c.status}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CampaignList;
