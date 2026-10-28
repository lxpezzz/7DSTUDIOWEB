// Shared behavior for the existing Web3Forms integration and WhatsApp fallback.
// No credentials or submitted data are logged or persisted in the browser.
export function initContactForm(form: HTMLFormElement) {
  const feedback = form.querySelector<HTMLElement>('.contact__feedback')!;
  const button = form.querySelector<HTMLButtonElement>('.contact__submit')!;
  const continueLink = form.querySelector<HTMLAnchorElement>('.contact__continue')!;
  let submitting = false;
  button.disabled = form.dataset.privacyReady !== 'true';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || form.dataset.privacyReady !== 'true' || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('botcheck') || data.get('privacy') !== 'accepted') return;
    feedback.textContent = '';
    continueLink.hidden = true;

    if (form.dataset.configured !== 'true') {
      const text = `Hola, soy ${data.get('name')}.\nMi email: ${data.get('email')}\nServicio: ${data.get('service')}\n\n${data.get('message')}`;
      continueLink.href = `${form.action}?text=${encodeURIComponent(text)}`;
      continueLink.hidden = false;
      feedback.textContent = 'Tu mensaje está preparado, pero todavía no se ha enviado. Ábrelo en WhatsApp para revisarlo y enviarlo.';
      feedback.focus();
      return;
    }

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
      button.disabled = form.dataset.privacyReady !== 'true';
      button.removeAttribute('aria-busy');
      feedback.focus();
    }
  });
}
