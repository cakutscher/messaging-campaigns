import type { CampaignInput, FieldErrors } from './types';

export function validateCampaign(
  input: CampaignInput
): FieldErrors<CampaignInput> {
  const errors: FieldErrors<CampaignInput> = {};

  const name = input.name.trim();
  const content = input.content.trim();

  if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 80) {
    errors.name = 'Name must be at most 80 characters.';
  }

  if (content.length > 0 && content.length < 2) {
    errors.content = 'content must be at least 2 characters.';
  } else if (content.length > 500) {
    errors.content = 'content must be at most 500 characters.';
  }

  return errors;
}
