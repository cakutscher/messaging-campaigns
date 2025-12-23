type MessagingService = 'sms' | 'whatsapp';

export type SendMessageParams = {
  recipientPhoneNumber: string;
  service: MessagingService;
  message: string;
};

export type ApiResult = { ok: true } | { ok: false; error: string };
