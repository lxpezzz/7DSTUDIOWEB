// El clon visual permanece inert. Estos tres enlaces semánticos usan sus
// coordenadas locales exactas y la misma transformación 2D que la proyección.
export function createCinematicLinks(hero: HTMLElement, projection: HTMLElement, surface: HTMLElement) {
  const layer = hero.querySelector<HTMLElement>('.cinematic-hero__interaction')!;
  const inner = document.createElement('div');
  inner.className = 'cinematic-hero__interaction-inner';
  const cards = [...surface.querySelectorAll<HTMLAnchorElement>('a.service-card')];
  const visuals = [...projection.querySelectorAll<HTMLElement>('.service-card')];
  const links = cards.map(card => {
    const link = document.createElement('a');
    link.href = card.getAttribute('href')!;
    link.dataset.service = card.dataset.service;
    link.setAttribute('aria-label', card.getAttribute('aria-label') || card.querySelector('h3')!.textContent!.trim());
    link.draggable = false;
    return link;
  });
  inner.replaceChildren(...links);
  layer.replaceChildren(inner);

  let eligible = false;
  let complete = false;
  let active = false;
  let lastClipPath = '';

  function sync(nextComplete: boolean) {
    complete = nextComplete;
    const nextActive = eligible && !complete;
    if (nextActive === active) return;
    const focused = document.activeElement;
    const from = nextActive ? cards : links;
    const to = nextActive ? links : cards;
    const focusedIndex = from.findIndex(link => link === focused);
    // Activar el destino antes de mover el foco; ocultar el origen después.
    if (nextActive) layer.hidden = false;
    else surface.inert = false;
    if (focusedIndex >= 0) to[focusedIndex].focus({ preventScroll: true });
    surface.inert = nextActive;
    layer.hidden = !nextActive;
    active = nextActive;
  }

  function measure() {
    eligible = links.length === 3 && visuals.length === 3;
    if (eligible) {
      layer.style.width = projection.style.width;
      layer.style.height = projection.style.height;
      inner.style.width = projection.style.width;
      inner.style.height = projection.style.height;
      const replica = projection.firstElementChild as HTMLElement | null;
      visuals.forEach((card, index) => {
        let x = 0, y = 0;
        for (let element: HTMLElement | null = card; element && element !== replica && element !== projection; element = element.offsetParent as HTMLElement | null) {
          x += element.offsetLeft;
          y += element.offsetTop;
        }
        const style = getComputedStyle(card);
        Object.assign(links[index].style, {
          left: `${x}px`,
          top: `${y}px`,
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
        });
      });
    }
    sync(complete);
  }

  return {
    measure,
    render(outerTransform: string, innerTransform: string, clipPath: string, nextComplete: boolean) {
      layer.style.transform = outerTransform;
      inner.style.transform = innerTransform;
      if (clipPath !== lastClipPath) {
        layer.style.clipPath = clipPath;
        lastClipPath = clipPath;
      }
      sync(nextComplete);
    },
    destroy() {
      eligible = false;
      sync(true);
      surface.inert = false;
      layer.hidden = true;
      layer.replaceChildren();
      layer.removeAttribute('style');
    },
  };
}
