import { texts } from '../domain/texts';
import type { Campaign } from '../domain/types';

type Props = {
  campaigns: Campaign[];
  onSelect?: (campaignId: string) => void;
  selectedId: string | null;
};

function CampaignList({ campaigns, onSelect, selectedId }: Props) {
  const hasCampaigns = campaigns.length > 0;

  return (
    <section className="card">
      <h2 id="campaigns-title">{texts.list.title}</h2>

      {!hasCampaigns ? (
        <p className="muted" role="status">
          {texts.list.empty}
        </p>
      ) : (
        <ul className="list" role="list">
          {campaigns.map((c) => {
            const isSelected = selectedId === c.id;

            return (
              <li key={c.id} className="listItem">
                <div>
                  <div className="title">{c.name}</div>

                  {c.content ? (
                    <div className="muted small">{c.content}</div>
                  ) : null}
                </div>

                {
                  <button
                    type="button"
                    className="pill"
                    onClick={() => onSelect?.(c.id)}
                    title={texts.list.selectButtonTitle}
                  >
                    Ver más
                  </button>
                }
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CampaignList;
