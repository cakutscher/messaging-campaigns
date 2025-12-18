import { MESSAGING_ENDPOINT } from './constants';
import { isSuccessfulResponse, readErrorMessage } from './http';
import type { ApiResult, SendMessageParams } from './types';

export async function sendMessage(
  params: SendMessageParams
): Promise<ApiResult> {
  const body = {
    recipient_phone_number: params.recipientPhoneNumber,
    service: params.service,
    message: params.message,
  };

  try {
    const response = await fetch(MESSAGING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (isSuccessfulResponse(response)) return { ok: true };

    return { ok: false, error: await readErrorMessage(response) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : '',
    };
  }
}
