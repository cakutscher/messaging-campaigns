import { parseRecipientsCsv } from '@campaigns/domain/csv';
import { texts } from '@campaigns/domain/texts';
import type { Recipient } from '@campaigns/domain/types';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

type Props = {
  campaignId: string;
  onImport: (campaignId: string, recipients: Recipient[]) => void;
};

const FILE_ID = 'recipients-file';

function CampaignRecipientsUpload({ campaignId, onImport }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ line: number; message: string }[]>([]);
  const [parsedRecipients, setParsedRecipients] = useState<Recipient[]>([]);

  const preview = parsedRecipients.slice(0, 50);

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

  const shownErrors = errors.slice(0, 10);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={FILE_ID} className="btn btn-secondary file-upload-label">
          {texts.recipients.selectFile}
        </label>
        <input
          id={FILE_ID}
          type="file"
          name="file"
          accept=".csv"
          onChange={onFile}
          className="file-upload-input"
        />
        {fileName && (
          <span className="file-upload-filename">
            {texts.recipients.selectedFile} {fileName}
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <div className="form-error-list">
          <strong>{texts.recipients.errorsTitle}</strong>
          <ul>
            {shownErrors.map((e, i) => (
              <li key={i}>{texts.recipients.errorLine(e.line, e.message)}</li>
            ))}
          </ul>
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="table-wrapper">
            <p style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}>
              {texts.recipients.previewTitle}
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>{texts.table.name}</th>
                  <th>{texts.table.phone}</th>
                  <th>{texts.table.channel}</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-primary"
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
