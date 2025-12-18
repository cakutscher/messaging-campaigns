import type { FormEvent } from 'react';
import { useState } from 'react';

import { texts } from '../domain/texts';
import type { CampaignInput } from '../domain/types';
import { validateCampaign } from '../domain/validation';

type Props = {
  onCreate: (input: CampaignInput) => void | Promise<void>;
};

const NAME_ID = 'campaign-name';
const CONTENT_ID = 'campaign-content';

function CampaignForm({ onCreate }: Props) {
  const [values, setValues] = useState<CampaignInput>({
    name: '',
    content: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    content: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = validateCampaign(values);

  const showNameError = touched.name && !!errors.name;
  const showDescError = touched.content && !!errors.content;

  const canSubmit = !isSubmitting && !errors.name && !errors.content;

  function handleChangeName(next: string) {
    setValues((v) => ({ ...v, name: next }));
  }

  function handleChangeContent(next: string) {
    setValues((v) => ({ ...v, content: next }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ name: true, content: true });

    if (!canSubmit) return;

    const payload: CampaignInput = {
      name: values.name.trim(),
      content: values.content.trim(),
    };

    try {
      setIsSubmitting(true);
      await onCreate(payload);

      setValues({ name: '', content: '' });
      setTouched({ name: false, content: false });
    } catch {
      setSubmitError(texts.form.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card">
      <h2>{texts.form.title}</h2>

      <form onSubmit={handleSubmit} className="form" noValidate>
        {submitError && <p className="error">{submitError}</p>}

        <div className="field">
          <label className="label" htmlFor={NAME_ID}>
            {texts.form.nameLabel}
          </label>

          <input
            id={NAME_ID}
            name="name"
            type="text"
            value={values.name}
            onChange={(e) => handleChangeName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            maxLength={80}
            disabled={isSubmitting}
            autoComplete="off"
          />

          {showNameError && <small className="fieldError">{errors.name}</small>}
        </div>

        <div className="field">
          <label className="label" htmlFor={CONTENT_ID}>
            {texts.form.contentLabel}
          </label>

          <textarea
            id={CONTENT_ID}
            name="content"
            value={values.content}
            onChange={(e) => handleChangeContent(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, content: true }))}
            placeholder={texts.form.contentPlaceholder}
            maxLength={500}
            rows={4}
            disabled={isSubmitting}
          />

          {showDescError && (
            <small className="fieldError">{errors.content}</small>
          )}
        </div>

        <button className="btn" type="submit" disabled={!canSubmit}>
          {isSubmitting ? texts.form.creatingButton : texts.form.createButton}
        </button>
      </form>
    </section>
  );
}

export default CampaignForm;
