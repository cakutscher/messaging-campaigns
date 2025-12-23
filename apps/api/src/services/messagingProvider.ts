export type SendMessageParams = {
  recipientPhoneNumber: string;
  service: "sms" | "whatsapp";
  message: string;
};

export type ApiResult = { ok: true } | { ok: false; error: string };

const BASE_URL = process.env.MESSAGING_BASE_URL;

export async function sendMessage(
  params: SendMessageParams
): Promise<ApiResult> {
  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        recipient_phone_number: params.recipientPhoneNumber,
        service: params.service,
        message: params.message,
      }),
    });

    if (res.status === 202) return { ok: true };

    try {
      const json = (await res.json()) as { error?: unknown };
      if (typeof json.error === "string" && json.error.trim()) {
        return { ok: false, error: json.error };
      }
    } catch {
      // ignore
    }

    return { ok: false, error: `Request failed (${res.status})` };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
