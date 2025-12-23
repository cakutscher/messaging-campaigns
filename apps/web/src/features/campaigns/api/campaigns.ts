const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3001';

type ApiErr = { status: 'error'; error: string };
type ApiOk<T> = { status: 'ok' } & T;

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const data = (await readJson(res)) as ApiOk<T> | ApiErr | null;

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && 'status' in data && (data as ApiErr).status === 'error'
        ? (data as ApiErr).error
        : `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  if (data == null) return undefined as T;

  if (typeof data === 'object' && 'status' in data && (data as ApiErr).status === 'error') {
    throw new Error((data as ApiErr).error);
  }

  return data as ApiOk<T> as unknown as T;
}

export async function apiListCampaigns() {
  const res = await fetch(`${API_BASE}/api/campaigns`);
  const data = await unwrap<{ campaigns: unknown[] }>(res);
  return data.campaigns;
}

export async function apiCreateCampaign(input: { name: string; content: string }) {
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await unwrap<{ campaign: unknown }>(res);
  return data.campaign;
}

export async function apiUploadRecipients(campaignId: string, recipients: unknown[]) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/recipients`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(recipients),
  });

  await unwrap<void>(res);
}

export async function apiListRecipients(campaignId: string) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/recipients`);
  const data = await unwrap<{ recipients: unknown[] }>(res);
  return data.recipients;
}

export async function apiExecuteCampaign(campaignId: string) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/execute`, {
    method: 'POST',
  });

  await unwrap<void>(res);
}

export async function apiCancelCampaign(campaignId: string) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/cancel`, {
    method: 'POST',
  });

  await unwrap<void>(res);
}
