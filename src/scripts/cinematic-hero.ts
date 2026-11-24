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
  const poster = hero.querySelector<HTMLElement>('.cinematic-hero__poster');
  const POSTER_SCALE = 0.35;
  function configurePoster(width: number, height: number): { width: number; height: number } | null {
    if (!poster) return null;
    let src = '';
    let baseW = 0;
    let baseH = 0;
    // Selecciona la captura que coincide con los tamaños tipográficos y .container de cada rango.
    if (width >= 1520) {
      src = heroScene.screenPoster1920;
      baseW = 1920;
      baseH = 1080;
    } else if (width >= 1360) {
      src = heroScene.screenPoster1440;
      baseW = 1440;
      baseH = 900;
    } else if (width >= 1220) {
      src = heroScene.screenPoster1280;
      baseW = 1280;
      baseH = 800;
    } else {
      poster.hidden = true;
      return null;
    }
    const posterW = width * POSTER_SCALE;
    const posterH = height * POSTER_SCALE;
    poster.style.width = `${posterW}px`;
    poster.style.height = `${posterH}px`;
    let img = poster.querySelector<HTMLImageElement>('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      poster.replaceChildren(img);
    }
    if (img.dataset.src !== src) {
      img.src = src;
      img.dataset.src = src;
    }
    img.style.width = `${baseW * POSTER_SCALE}px`;
    img.style.height = `${baseH * POSTER_SCALE}px`;
    return { width: posterW, height: posterH };
  }
  function createReplica() {
    const replica = surface!.cloneNode(true) as HTMLElement;
    replica.classList.add('cinematic-hero__replica');
    replica.removeAttribute('id');
    const siteHeader = document.querySelector<HTMLElement>('body > header.header');
    if (siteHeader) {
      const headerClone = siteHeader.cloneNode(true) as HTMLElement;
      headerClone.classList.add('cinematic-hero__replica-header');
      headerClone.classList.remove('header--scrolled');
      replica.prepend(headerClone);
    }
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
      const width = stage.clientWidth, height = stage.clientHeight || window.innerHeight;
      const left = photo.offsetLeft, top = photo.offsetTop;
      const [x, y] = getComputedStyle(image).objectPosition.split(' ').map(value => Number.parseFloat(value) / 100);
      const posX = Number.isFinite(x) ? x : heroScene.objectPosition.x;
      const posY = Number.isFinite(y) ? y : heroScene.objectPosition.y;
      const points = coverQuad(heroScene.screen, heroScene, { width: photo.clientWidth, height: photo.clientHeight }, { x: posX, y: posY })
        .map(point => ({ x: point.x + left, y: point.y + top })) as Quad;
      projection.style.width = `${width}px`;
      projection.style.height = `${height}px`;
      (projection.firstElementChild as HTMLElement).style.width = `${width}px`;
      projection.style.transform = projectiveMatrix(points, width, height);
      const posterSize = configurePoster(width, height);
      if (poster && posterSize) {
        poster.hidden = false;
        poster.style.opacity = '1';
        poster.style.transform = projectiveMatrix(points, posterSize.width, posterSize.height);
      }
      foreground.style.top = `${top}px`;
      foreground.style.left = `${left}px`;
      foreground.style.width = `${photo.clientWidth}px`;
      foreground.style.height = `${photo.clientHeight}px`;
      foreground.querySelector('svg')!.setAttribute('preserveAspectRatio', posX === 0 ? 'xMinYMid slice' : posX === 1 ? 'xMaxYMid slice' : 'xMidYMid slice');
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
      if (poster) {
        poster.hidden = true;
        poster.replaceChildren();
        poster.removeAttribute('style');
      }
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
    let posterSize: { width: number; height: number } | null = null;
    let projectPhoto: ReturnType<typeof createPhotoProjector>;
    const debugMode = import.meta.env.DEV && new URLSearchParams(location.search).has('debugScreen');
    // El póster gestiona su propia visibilidad (showPoster) para evitar alternar hidden en cada frame.
    const handoff = { hero, stage, layers: [photo, foreground, projection, outside], debug, debugMode };
    const interaction = createCinematicLinks(hero, projection, surface);
    debug.hidden = !debugMode;
    if (debugMode) {
      debug.innerHTML = '<svg width="100%" height="100%" style="overflow:visible"><polygon fill="none" stroke="#3159e8" stroke-width="2"/><g></g></svg>';
    }
    let lastComplete: boolean | null = null;
    let lastNativeRes: boolean | null = null;
    let lastOutsideInert: boolean | null = null;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
    function render() {
      const p = state.progress;
      // Con póster activo, el clon HTML permanece siempre a resolución nativa 1×:
      // evita el reflujo y re-rasterización síncrona de zoom:2 al cruzar p=0.40 durante el scroll.
      const nativeRes = Boolean(posterSize) || p >= .68;
      if (nativeRes !== lastNativeRes) {
        hero.classList.toggle('cinematic-native-resolution', nativeRes);
        lastNativeRes = nativeRes;
      }
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
      const nextOutsideInert = p > .37;
      if (nextOutsideInert !== lastOutsideInert) {
        outside.inert = nextOutsideInert;
        lastOutsideInert = nextOutsideInert;
      }
      // La foto original desaparece sin reaparecer debajo de la interfaz nueva.
      const photoOpacity = String(1 - smooth((p - .68) / .07));
      photo.style.opacity = photoOpacity;
      foreground.style.opacity = photoOpacity;
      const complete = pastEnd || p >= visualEnd;
      // Reverse: reveal the stage before transferring keyboard focus into it.
      if (!complete && lastComplete !== false) {
        applyCinematicHandoff(handoff, false);
        lastComplete = false;
      }
      if (poster) {
        // Transición cuando la pantalla supera ~0.55x (p=0.42→0.54) y el HTML real ya es nítido.
        const posterOpacity = posterSize ? 1 - smooth((p - .42) / .12) : 0;
        const showPoster = !complete && Boolean(posterSize) && posterOpacity > .001;
        if (poster.hidden !== !showPoster) poster.hidden = !showPoster;
        if (showPoster && posterSize) {
          poster.style.transform = projectiveMatrix(current, posterSize.width, posterSize.height);
          poster.style.opacity = String(posterOpacity);
        }
      }
      interaction.render(screenMatrix, complete, Number(photoOpacity) > 0);
      if (complete && lastComplete !== true) {
        applyCinematicHandoff(handoff, true);
        lastComplete = true;
      }
      if (debugMode && !complete) {
        debug.querySelector('polygon')!.setAttribute('points', current.map(point => `${point.x},${point.y}`).join(' '));
        debug.querySelector('g')!.innerHTML = current.map((point, i) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#3159e8"/><text x="${point.x + 9}" y="${point.y - 9}" fill="#3159e8">${i + 1}</text>`).join('');
      }
    }
    function measure() {
      // hidden retira las imágenes del layout al completar. Medirlas temporalmente
      // bajo el escenario oculto y volver a aplicar el estado antes del siguiente paint.
      lastComplete = null;
      photo.hidden = false;
      foreground.hidden = false;
      width = stage.clientWidth;
      height = stage.clientHeight;
      projection.style.width = `${width}px`;
      projection.style.height = `${height}px`;
      (projection.firstElementChild as HTMLElement).style.width = `${width}px`;
      posterSize = configurePoster(width, height);
      const [px, py] = getComputedStyle(image).objectPosition.split(' ').map(value => Number.parseFloat(value) / 100);
      const position = {
        x: Number.isFinite(px) ? px : heroScene.objectPosition.x,
        y: Number.isFinite(py) ? py : heroScene.objectPosition.y,
      };
      const frame = { width: photo.clientWidth, height: photo.clientHeight };
      const left = photo.offsetLeft, top = photo.offsetTop;
      foreground.querySelector('svg')!.setAttribute(
        'preserveAspectRatio',
        position.x === 0 ? 'xMinYMid slice' : position.x === 1 ? 'xMaxYMid slice' : 'xMidYMid slice',
      );
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
        trigger: hero, start: 'top top', end: () => `+=${(stage.clientHeight || window.innerHeight) * heroScene.scrollViewports * visualEnd}`,
        // Un único reloj de scroll: no queda un tween con retraso que pueda volver
        // a pintar la foto o el clon después de mostrar el HTML real.
        pin: stage, pinSpacing: true, scrub: true, invalidateOnRefresh: true,
        // onRefresh corre DESPUÉS de que ScrollTrigger revierte y remide el pin de stage,
        // evitando medir dimensiones obsoletas del viewport anterior.
        onRefresh: self => {
          measure();
          pastEnd = self.progress >= 1;
          state.progress = self.progress * visualEnd;
          render();
        },
        onLeave: () => { pastEnd = true; state.progress = visualEnd; render(); },
        onEnterBack: self => { pastEnd = false; state.progress = self.progress * visualEnd; render(); },
      },
    });
    timeline.to(state, { progress: visualEnd, ease: 'none', duration: 1, onUpdate: render });
    // Observa cambios del contenedor que no disparan resize de ventana (p. ej. cambio de altura o layout)
    // y agrupa el refresh sin recalcular en cada frame.
    let refreshTimer: number | undefined;
    let lastObservedW = hero.clientWidth;
    let lastObservedH = window.innerHeight;
    let lastPhotoTop = photo.offsetTop;
    const resizeObserver = new ResizeObserver(() => {
      const nextW = hero.clientWidth;
      const nextH = window.innerHeight;
      const nextTop = photo.offsetTop;
      if (nextW === lastObservedW && nextH === lastObservedH && nextTop === lastPhotoTop) return;
      lastObservedW = nextW;
      lastObservedH = nextH;
      lastPhotoTop = nextTop;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    });
    resizeObserver.observe(hero);
    resizeObserver.observe(photo);
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
      window.clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      cancelAnimationFrame(restoration);
      interaction.destroy();
      hero.classList.remove('cinematic-ready', 'cinematic-complete', 'cinematic-projected', 'cinematic-native-resolution');
      for (const layer of handoff.layers) layer.hidden = false;
      stage.inert = false;
      projection.replaceChildren();
      if (poster) {
        poster.hidden = true;
        poster.replaceChildren();
        poster.removeAttribute('style');
      }
      for (const element of [photo, foreground, projection, outside]) element.removeAttribute('style');
      outside.inert = false;
      debug.hidden = true;
    };
  });
}
