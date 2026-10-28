export function initProjectCatalogues() {
  document.querySelectorAll<HTMLElement>('[data-project-catalogue]').forEach(catalogue => {
    if (catalogue.dataset.enhanced === 'true') return;
    const track = catalogue.querySelector<HTMLElement>('.catalogue__track')!;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.project'));
    if (cards.length === 0) return;
    catalogue.dataset.enhanced = 'true';
    const controls = catalogue.querySelector<HTMLElement>('.catalogue__controls')!;
    const previous = catalogue.querySelector<HTMLButtonElement>('.catalogue__previous')!;
    const next = catalogue.querySelector<HTMLButtonElement>('.catalogue__next')!;
    const status = catalogue.querySelector<HTMLElement>('.catalogue__position')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    function update() {
      const left = track.scrollLeft;
      const right = left + track.clientWidth;
      controls.hidden = track.scrollWidth <= track.clientWidth + 2;
      previous.disabled = left <= 2;
      next.disabled = right >= track.scrollWidth - 2;
      const visible = cards.map((card, index) => ({ card, index })).filter(({ card }) => card.offsetLeft + card.offsetWidth > left + 4 && card.offsetLeft < right - 4);
      if (visible.length) {
        const message = `Proyectos ${visible[0].index + 1}–${visible.at(-1)!.index + 1} de ${cards.length}`;
        if (status.textContent !== message) status.textContent = message;
      }
    }
    function moveTo(index: number) {
      const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
      track.scrollTo({ left: card.offsetLeft - 2, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
    function move(direction: number) {
      const current = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - 2 - track.scrollLeft) < Math.abs(cards[best].offsetLeft - 2 - track.scrollLeft) ? index : best, 0);
      moveTo(current + direction);
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (event.key === 'Home') moveTo(0);
      else if (event.key === 'End') moveTo(cards.length - 1);
      else move(event.key === 'ArrowRight' ? 1 : -1);
    });
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }, { passive: true });
    new ResizeObserver(update).observe(track);
    update();
  });
}
