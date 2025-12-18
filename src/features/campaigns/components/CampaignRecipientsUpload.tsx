import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { parseRecipientsCsv } from '@campaigns/domain/csv';
import { texts } from '@campaigns/domain/texts';
import type { Recipient } from '@campaigns/domain/types';

type Props = {
  campaignId: string;
  onImport: (campaignId: string, recipients: Recipient[]) => void;
};

function CampaignRecipientsUpload({ campaignId, onImport }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ line: number; message: string }[]>([]);
  const [parsedRecipients, setParsedRecipients] = useState<Recipient[]>([]);

  const preview = parsedRecipients.slice(0, 50).map((r) => ({
    name: r.name,
    phone: r.phone,
    channel: r.channel,
    status: r.status,
  }));

  const canImport = parsedRecipients.length > 0 && errors.length === 0;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    setFileName(file.name);
    setErrors([]);
    setParsedRecipients([]);

    const text = await file.text();
    const parsed = parseRecipientsCsv(text);

    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }

    const batchId = Date.now();

    const recipients: Recipient[] = parsed.data.map((row, i) => ({
      id: `${campaignId}-r-${batchId}-${i + 1}`,
      campaignId,
      name: row.name,
      phone: row.phone,
      channel: row.channel,
      status: 'pending' as const,
      errorMessage: null,
    }));

    setParsedRecipients(recipients);
  }

  function handleImport() {
    if (!canImport) return;

    onImport(campaignId, parsedRecipients);

    setFileName(null);
    setErrors([]);
    setParsedRecipients([]);
  }

  const totalRows = parsedRecipients.length;
  const shownErrors = errors.slice(0, 10);

  return (
    <div className="upload">
      <h3>{texts.recipients.title}</h3>

      <input type="file" name="file" accept=".csv" onChange={onFile} />
      {fileName && (
        <div className="muted small">
          {texts.recipients.selectedFile} {fileName}
        </div>
      )}

      {totalRows > 0 && (
        <div className="muted small" style={{ marginTop: 8 }}>
          {texts.recipients.parsedInfo(totalRows)}{' '}
          {errors.length
            ? texts.recipients.errorsInfo(errors.length)
            : texts.recipients.noErrorsInfo}
        </div>
      )}

      {errors.length > 0 && (
        <div className="error" style={{ marginTop: 8 }}>
          <strong>{texts.recipients.errorsTitle}</strong>
          <ul>
            {shownErrors.map((e, i) => (
              <li key={i}>{texts.recipients.errorLine(e.line, e.message)}</li>
            ))}
          </ul>
          {errors.length > shownErrors.length && (
            <div className="muted small">
              {texts.recipients.showingErrors(shownErrors.length)}
            </div>
          )}
        </div>
      )}

      {preview.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div className="muted small">
            {texts.recipients.previewTitle(preview.length)}
          </div>

          <table className="table small">
            <thead>
              <tr>
                <th>{texts.table.name}</th>
                <th>{texts.table.phone}</th>
                <th>{texts.table.channel}</th>
                <th>{texts.table.status}</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.channel}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn"
            type="button"
            onClick={handleImport}
            disabled={!canImport}
          >
            {texts.recipients.importButton}
          </button>
        </div>
      )}
    </div>
  );
}

export default CampaignRecipientsUpload;