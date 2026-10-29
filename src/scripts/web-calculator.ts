import { webPricing, calculateWebQuote, describeWebQuote, formatWebPrice } from '../data/webPricing';

export function initWebCalculator(root: HTMLElement) {
  if (root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  root.querySelectorAll<HTMLFieldSetElement>('[data-options]').forEach(fieldset => fieldset.disabled = false);
  const radios = [...root.querySelectorAll<HTMLInputElement>('[name="web-type"]')];
  const checkboxes = [...root.querySelectorAll<HTMLInputElement>('[name="web-extra"]')];
  const pages = root.querySelector<HTMLInputElement>('[name="additional-pages"]')!;
  const notice = root.querySelector<HTMLElement>('[data-compatibility]')!;
  let current = calculateWebQuote({ typeId: webPricing.defaultType, extraIds: [], additionalPages: 0 });

  function update() {
    const id = radios.find(input => input.checked)?.value || webPricing.defaultType;
    let removed = false;
    webPricing.extras.forEach(extra => {
      const compatible = (extra.compatibleWith as readonly string[]).includes(id);
      const input = extra.quantity ? pages : checkboxes.find(input => input.value === extra.id)!;
      if (!compatible) {
        if (input === pages) { removed ||= Number(pages.value) > 0; pages.value = '0'; }
        else { removed ||= input.checked; input.checked = false; }
      }
      input.disabled = !compatible;
    });
    current = calculateWebQuote({ typeId: id, extraIds: checkboxes.filter(input => input.checked).map(input => input.value), additionalPages: Number(pages.value) });
    if (Number(pages.value) > webPricing.maxAdditionalPages || Number(pages.value) < 0 || !Number.isInteger(Number(pages.value))) {
      const pageLine = current.lines.find(line => line.id === 'pages');
      pages.value = String(pageLine?.quantity || 0);
    }
    notice.textContent = removed ? 'Se han retirado extras incompatibles con el tipo de web elegido.' : '';
    root.querySelector<HTMLElement>('[data-selected-type]')!.textContent = current.type.name;
    root.querySelector<HTMLElement>('[data-included-title]')!.textContent = current.totalCents === null ? 'Antes de presupuestar' : `Incluido en el precio base${current.type.includedPages ? ` · ${current.type.includedPages} ${current.type.includedPages === 1 ? 'página' : 'páginas'}` : ''}`;
    const included = root.querySelector<HTMLElement>('[data-included]')!;
    included.replaceChildren(...current.type.included.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    const lines = root.querySelector<HTMLElement>('[data-quote-lines]')!;
    const entries = current.type.baseCents === null ? [] : [{ name: 'Precio base', amountCents: current.type.baseCents }, ...current.lines.map(line => ({ name: `${line.name}${line.quantity > 1 ? ` × ${line.quantity}` : ''}`, amountCents: line.amountCents }))];
    lines.replaceChildren(...entries.map(line => {
      const row = document.createElement('div');
      const name = document.createElement('dt'); name.textContent = line.name;
      const value = document.createElement('dd'); value.textContent = formatWebPrice(line.amountCents);
      row.append(name, value); return row;
    }));
    const total = root.querySelector<HTMLOutputElement>('[data-quote-total]')!;
    total.textContent = current.totalCents === null ? 'A medida' : formatWebPrice(current.totalCents);
    root.querySelector<HTMLElement>('[data-quote-tax]')!.hidden = current.totalCents === null;
    root.querySelector<HTMLElement>('[data-custom-message]')!.hidden = current.totalCents !== null;
    root.querySelector<HTMLElement>('[data-provisional]')!.hidden = !current.provisional || current.totalCents === null;
  }

  root.addEventListener('change', update);
  pages.addEventListener('input', update);
  update();
  root.querySelector<HTMLAnchorElement>('[data-request-quote]')!.addEventListener('click', () => {
    update();
    const input = document.querySelector<HTMLInputElement>('#web-contact-form [name="budget_summary"]');
    const preview = document.querySelector<HTMLElement>('[data-budget-preview]');
    const wrapper = document.querySelector<HTMLElement>('[data-budget-selection]');
    const summary = describeWebQuote(current);
    if (input) input.value = summary;
    if (preview) preview.textContent = current.totalCents === null ? `${current.type.name} · presupuesto personalizado` : `${current.type.name} · ${formatWebPrice(current.totalCents)} + IVA${current.provisional ? ' · provisional' : ''}`;
    if (wrapper) wrapper.hidden = false;
  });
}
