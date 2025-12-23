import Papa from 'papaparse';

type RecipientRow = {
  name: string;
  phone: string;
  channel: 'sms' | 'whatsapp';
};

type ParseResult =
  | { ok: true; data: RecipientRow[] }
  | { ok: false; errors: { line: number; message: string }[] };

export function parseRecipientsCsv(text: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    transformHeader: (h) => h.trim().toLowerCase(),
    transform: (v) => (typeof v === 'string' ? v.trim() : v),
    delimiter: '',
  });

  const errors: { line: number; message: string }[] = [];

  for (const e of result.errors) {
    errors.push({
      line: (e.row ?? 0) + 1,
      message: e.message,
    });
  }

  const required = ['name', 'phone', 'channel'];
  const fields = result.meta.fields ?? [];
  const missing = required.filter((r) => !fields.includes(r));
  if (missing.length) {
    errors.push({ line: 1, message: `Missing headers: ${missing.join(', ')}` });
  }

  const rows: RecipientRow[] = [];
  const phoneRe = /^\+[1-9]\d{7,14}$/;

  result.data.forEach((row, i) => {
    const line = i + 2;
    const name = (row.name ?? '').trim();
    const phone = (row.phone ?? '').trim();
    const channel = (row.channel ?? '').trim().toLowerCase();

    if (name.length < 1) errors.push({ line, message: 'Name is required.' });
    if (!phoneRe.test(phone)) errors.push({ line, message: 'Phone must be E.164 (+569...).'});
    if (channel !== 'sms' && channel !== 'whatsapp') {
      errors.push({ line, message: "Channel must be 'sms' or 'whatsapp'." });
    }

    if (errors.every((e) => e.line !== line)) {
      rows.push({ name, phone, channel: channel as 'sms' | 'whatsapp' });
    }
  });

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: rows };
}
