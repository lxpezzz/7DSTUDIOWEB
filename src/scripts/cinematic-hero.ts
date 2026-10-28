import { heroScene } from '../data/hero-scene';
import { coverQuad, createPhotoProjector, projectiveMatrix, type Quad } from './hero-projection';
import { applyCinematicHandoff } from './cinematic-handoff';
import { createCinematicLinks } from './cinematic-links';

export async function initCinematicHero() {
  const root = document.querySelector<HTMLElement>('.cinematic-hero');
  const surface = document.querySelector<HTMLElement>('main > .services-surface');
  if (!root || !surface) return;
  const hero: HTMLElement = root;
  const stage = hero.querySelector<HTMLElement>('.cinematic-hero__stage')!;
  const image = hero.querySelector<HTMLImageElement>('img')!;
  const photo = hero.querySelector<HTMLElement>('.cinematic-hero__photo')!;
  const foreground = hero.querySelector<HTMLElement>('.cinematic-hero__foreground')!;
  const projection = hero.querySelector<HTMLElement>('.cinematic-hero__projection')!;
  function createReplica() {
    const replica = surface!.cloneNode(true) as HTMLElement;
    replica.removeAttribute('id');
    replica.querySelectorAll('[id], [aria-labelledby], [aria-describedby]').forEach(element => {
      element.removeAttribute('id');
      element.removeAttribute('aria-labelledby');
      element.removeAttribute('aria-describedby');
    });
    // Conserva el aspecto de los CTA en la proyección, sin duplicar enlaces ni foco.
    replica.querySelectorAll('a').forEach(link => {
      const visual = document.createElement('span');
      for (const attribute of link.attributes) {
        if (attribute.name === 'class' || attribute.name === 'style' || attribute.name.startsWith('data-astro-cid-')) {
          visual.setAttribute(attribute.name, attribute.value);
        }
      }
      visual.innerHTML = link.innerHTML;
      link.replaceWith(visual);
    });
    replica.querySelectorAll('button, input, select, textarea, [tabindex]').forEach(element => element.remove());
    projection.replaceChildren(replica);
  }
  function staticScreen() {
    createReplica();
    hero.classList.add('cinematic-projected');
    function align() {
      const width = stage.clientWidth, height = window.innerHeight;
      const left = photo.offsetLeft, top = photo.offsetTop;
      const [x, y] = getComputedStyle(image).objectPosition.split(' ').map(value => Number.parseFloat(value) / 100);
      const points = coverQuad(heroScene.screen, heroScene, { width: photo.clientWidth, height: photo.clientHeight }, { x, y })
        .map(point => ({ x: point.x + left, y: point.y + top })) as Quad;
      projection.style.width = `${width}px`;
      projection.style.height = `${height}px`;
      projection.style.transform = projectiveMatrix(points, width, height);
      foreground.style.top = `${top}px`;
      foreground.style.left = `${left}px`;
      foreground.style.width = `${photo.clientWidth}px`;
      foreground.style.height = `${photo.clientHeight}px`;
      foreground.querySelector('svg')!.setAttribute('preserveAspectRatio', x === 0 ? 'xMinYMid slice' : 'xMidYMid slice');
    }
    const observer = new ResizeObserver(align);
    observer.observe(stage);
    observer.observe(photo);
    align();
    return () => {
      observer.disconnect();
      hero.classList.remove('cinematic-projected');
      projection.replaceChildren();
      projection.removeAttribute('style');
      foreground.removeAttribute('style');
    };
  }
  const media = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  // No descarga GSAP en la experiencia móvil/reducida inicial.
  if (!media.matches) {
    const staticMedia = matchMedia('(min-width: 768px) and (prefers-reduced-motion: reduce)');
    let cleanup = staticMedia.matches ? staticScreen() : undefined;
    const updateStaticScreen = () => {
      cleanup?.();
      cleanup = staticMedia.matches ? staticScreen() : undefined;
    };
    staticMedia.addEventListener('change', updateStaticScreen);
    media.addEventListener('change', () => {
      if (media.matches) {
        staticMedia.removeEventListener('change', updateStaticScreen);
        cleanup?.();
        void initCinematicHero();
      }
    }, { once: true });
    return;
  }
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  await document.fonts.ready;
  await image.decode().catch(() => undefined);
  const outside = hero.querySelector<HTMLElement>('.cinematic-hero__outside')!;
  const debug = hero.querySelector<HTMLElement>('.cinematic-hero__debug')!;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: reduce)', staticScreen);
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    // La proyección nunca añade controles, IDs, foco ni contenido al árbol accesible.
    createReplica();
    hero.classList.add('cinematic-ready', 'cinematic-projected');
    const state = { progress: 0 };
    const visualEnd = heroScene.handoffProgress;
    let pastEnd = false;
    let width = 0, height = 0, quad: Quad, center = { x: 0, y: 0 }, zoom = 1;
    let projectPhoto: ReturnType<typeof createPhotoProjector>;
    const debugMode = import.meta.env.DEV && new URLSearchParams(location.search).has('debugScreen');
    const handoff = { hero, stage, layers: [photo, foreground, projection, outside], debug, debugMode };
    const interaction = createCinematicLinks(hero, projection, surface);
    debug.hidden = !debugMode;
    if (debugMode) {
      debug.innerHTML = '<svg width="100%" height="100%" style="overflow:visible"><polygon fill="none" stroke="#3159e8" stroke-width="2"/><g></g></svg>';
    }
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
    function render() {
      const p = state.progress;
      const approach = smooth((p - .15) / .60);
      const straighten = smooth((p - .45) / .30);
      const scale = Math.exp(Math.log(zoom) * approach);
      const x = center.x * (1 - scale) + (width / 2 - center.x) * approach;
      const y = center.y * (1 - scale) + (height / 2 - center.y) * approach;
      const corners: Quad = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
      const current = quad.map((point, i) => {
        const px = point.x * scale + x, py = point.y * scale + y;
        return { x: px + (corners[i].x - px) * straighten, y: py + (corners[i].y - py) * straighten };
      }) as Quad;
      const camera = projectPhoto(current);
      photo.style.transform = camera;
      foreground.style.transform = camera;
      const screenMatrix = projectiveMatrix(current, width, height);
      projection.style.transform = screenMatrix;
      outside.style.opacity = String(1 - smooth((p - .15) / .22));
      outside.inert = p > .37;
      // La foto original desaparece sin reaparecer debajo de la interfaz nueva.
      const photoOpacity = String(1 - smooth((p - .68) / .07));
      photo.style.opacity = photoOpacity;
      foreground.style.opacity = photoOpacity;
      const complete = pastEnd || p >= visualEnd;
      // Reverse: reveal the stage before transferring keyboard focus into it.
      if (!complete) applyCinematicHandoff(handoff, false);
      interaction.render(screenMatrix, complete, Number(photoOpacity) > 0);
      if (complete) applyCinematicHandoff(handoff, true);
      if (debugMode && !complete) {
        debug.querySelector('polygon')!.setAttribute('points', current.map(point => `${point.x},${point.y}`).join(' '));
        debug.querySelector('g')!.innerHTML = current.map((point, i) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#3159e8"/><text x="${point.x + 9}" y="${point.y - 9}" fill="#3159e8">${i + 1}</text>`).join('');
      }
    }
    function measure() {
      // hidden retira las imágenes del layout al completar. Medirlas temporalmente
      // bajo el escenario oculto y volver a aplicar el estado antes del siguiente paint.
      photo.hidden = false;
      foreground.hidden = false;
      width = stage.clientWidth;
      height = stage.clientHeight;
      projection.style.width = `${width}px`;
      projection.style.height = `${height}px`;
      const [px, py] = getComputedStyle(image).objectPosition.split(' ').map(value => Number.parseFloat(value) / 100);
      const position = { x: px ?? heroScene.objectPosition.x, y: py ?? heroScene.objectPosition.y };
      const frame = { width: photo.clientWidth, height: photo.clientHeight };
      const left = photo.offsetLeft, top = photo.offsetTop;
      foreground.querySelector('svg')!.setAttribute('preserveAspectRatio', position.x === 0 ? 'xMinYMid slice' : 'xMidYMid slice');
      quad = coverQuad(heroScene.screen, heroScene, frame, position).map(point => ({ x: point.x + left, y: point.y + top })) as Quad;
      projectPhoto = createPhotoProjector(quad, { x: left, y: top, ...frame });
      center = { x: quad.reduce((sum, point) => sum + point.x, 0) / 4, y: quad.reduce((sum, point) => sum + point.y, 0) / 4 };
      zoom = Math.max(width / (quad[1].x - quad[0].x), height / (quad[3].y - quad[0].y)) * 1.12;
      // Read the clone's untransformed layout, including after a completed resize.
      projection.hidden = false;
      const screenInverse = new DOMMatrix(projectiveMatrix(quad, width, height)).inverse();
      const opening = heroScene.opening.split(' ').map(pair => {
        const [x, y] = pair.split(',').map(Number);
        return [x / heroScene.width, y / heroScene.height] as const;
      });
      const aperture = coverQuad(opening, heroScene, frame, position).map(point => {
        const local = new DOMPoint(point.x + left, point.y + top).matrixTransform(screenInverse);
        return `${local.x / local.w}px ${local.y / local.w}px`;
      });
      interaction.measure(`polygon(${aperture.join(',')})`);
      render();
    }
    measure();
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top', end: () => `+=${height * heroScene.scrollViewports * visualEnd}`,
        // Un único reloj de scroll: no queda un tween con retraso que pueda volver
        // a pintar la foto o el clon después de mostrar el HTML real.
        pin: stage, pinSpacing: true, scrub: true, invalidateOnRefresh: true,
        onRefreshInit: measure,
        onLeave: () => { pastEnd = true; state.progress = visualEnd; render(); },
        onEnterBack: self => { pastEnd = false; state.progress = self.progress * visualEnd; render(); },
      },
    });
    timeline.to(state, { progress: visualEnd, ease: 'none', duration: 1, onUpdate: render });
    // Recupera el mismo encuadre tras recargar a mitad del recorrido.
    ScrollTrigger.refresh();
    const restoration = requestAnimationFrame(() => {
      const trigger = timeline.scrollTrigger!;
      pastEnd = trigger.progress >= 1;
      state.progress = trigger.progress * visualEnd;
      timeline.progress(trigger.progress);
      render();
    });
    return () => {
      cancelAnimationFrame(restoration);
      interaction.destroy();
      hero.classList.remove('cinematic-ready', 'cinematic-complete', 'cinematic-projected');
      for (const layer of handoff.layers) layer.hidden = false;
      stage.inert = false;
      projection.replaceChildren();
      for (const element of [photo, foreground, projection, outside]) element.removeAttribute('style');
      outside.inert = false;
      debug.hidden = true;
    };
  });
}
