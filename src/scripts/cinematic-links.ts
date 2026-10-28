// The visual clone stays inert. These three semantic links use its local layout
// coordinates and the exact same projective matrix, never viewport hotspots.
export function createCinematicLinks(hero: HTMLElement, projection: HTMLElement, surface: HTMLElement) {
  const layer = hero.querySelector<HTMLElement>('.cinematic-hero__interaction')!;
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
  layer.replaceChildren(...links);
  let eligible = false;
  let complete = false;
  let active = false;
  let aperture = 'none';

  function sync(nextComplete: boolean) {
    complete = nextComplete;
    const nextActive = eligible && !complete;
    if (nextActive === active) return;
    const focused = document.activeElement;
    const from = nextActive ? cards : links;
    const to = nextActive ? links : cards;
    const focusedIndex = from.findIndex(link => link === focused);
    // Enable the destination before moving focus; hide the source only afterward.
    if (nextActive) layer.hidden = false;
    else surface.inert = false;
    if (focusedIndex >= 0) to[focusedIndex].focus({ preventScroll: true });
    surface.inert = nextActive;
    layer.hidden = !nextActive;
    active = nextActive;
  }

  function measure(clipPath: string) {
    aperture = clipPath;
    // Below 1024 the clone may be a clipped, single-column Bento. Keep native
    // Services navigation instead of exposing tiny or unreachable tablet targets.
    eligible = hero.clientWidth >= 1024 && links.length === 3 && visuals.length === 3;
    if (eligible) {
      layer.style.width = projection.style.width;
      layer.style.height = projection.style.height;
      visuals.forEach((card, index) => {
        let x = 0, y = 0;
        for (let element: HTMLElement | null = card; element && element !== projection; element = element.offsetParent as HTMLElement | null) {
          x += element.offsetLeft;
          y += element.offsetTop;
        }
        const style = getComputedStyle(card);
        Object.assign(links[index].style, { left: `${x}px`, top: `${y}px`, width: style.width, height: style.height, borderRadius: style.borderRadius });
      });
    }
    sync(complete);
  }

  return {
    measure,
    render(matrix: string, nextComplete: boolean, photoVisible: boolean) {
      layer.style.transform = matrix;
      // The notch/hand mask also clips hit-testing, not only the photograph.
      layer.style.clipPath = photoVisible ? aperture : 'none';
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
