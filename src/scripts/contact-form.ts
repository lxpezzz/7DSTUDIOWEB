// Shared Web3Forms behavior. WhatsApp remains an independent, explicit contact link.
// No credentials or submitted data are logged or persisted in the browser.
export function initContactForm(form: HTMLFormElement) {
  const feedback = form.querySelector<HTMLElement>('.contact__feedback')!;
  const button = form.querySelector<HTMLButtonElement>('.contact__submit')!;
  const continueLink = form.querySelector<HTMLAnchorElement>('.contact__continue')!;
  let submitting = false;
  button.disabled = form.dataset.privacyReady !== 'true' || form.dataset.configured !== 'true';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || form.dataset.privacyReady !== 'true' || form.dataset.configured !== 'true' || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('botcheck') || data.get('privacy') !== 'accepted') return;
    feedback.textContent = '';
    continueLink.hidden = true;

    submitting = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    feedback.textContent = 'Enviando tu consulta…';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, signal: AbortSignal.timeout(20000),
      });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || !result.success) throw new Error('Submission failed');
      feedback.textContent = 'Tu consulta se ha enviado. Gracias por contarnos tu proyecto.';
      form.reset();
    } catch {
      feedback.textContent = 'No hemos podido enviar tu consulta. Tus datos siguen aquí: inténtalo de nuevo o escríbenos por WhatsApp.';
    } finally {
      submitting = false;
      button.disabled = form.dataset.privacyReady !== 'true' || form.dataset.configured !== 'true';
      button.removeAttribute('aria-busy');
      feedback.focus();
    }
  });
}
