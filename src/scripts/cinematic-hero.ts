import { heroScene } from '../data/hero-scene';
import {
  computeCameraTransform,
  computeSceneLayout,
  resolveHeroMode,
  type HeroMode,
  type Rect,
} from './hero-projection';
import { applyCinematicHandoff } from './cinematic-handoff';
import { createCinematicLinks } from './cinematic-links';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

interface FramingFit {
  scale: number;
  offsetY: number;
}

type GsapModules = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

let gsapPromise: Promise<GsapModules> | null = null;
function loadGsap(): Promise<GsapModules> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }
  return gsapPromise;
}

export async function initCinematicHero() {
  const root = document.querySelector<HTMLElement>('.cinematic-hero');
  const surface = document.querySelector<HTMLElement>('main > .services-surface');
  if (!root || !surface || root.dataset.heroInitialized === 'true') return;
  root.dataset.heroInitialized = 'true';

  const hero: HTMLElement = root;
  const stage = hero.querySelector<HTMLElement>('.cinematic-hero__stage')!;
  const camera = hero.querySelector<HTMLElement>('.cinematic-hero__camera')!;
  const photo = hero.querySelector<HTMLElement>('.cinematic-hero__photo')!;
  const image = photo.querySelector<HTMLImageElement>('img')!;
  const projection = hero.querySelector<HTMLElement>('.cinematic-hero__projection')!;
  const bloom = hero.querySelector<HTMLElement>('.cinematic-hero__bloom')!;
  const optical = hero.querySelector<HTMLElement>('.cinematic-hero__optical')!;
  const outside = hero.querySelector<HTMLElement>('.cinematic-hero__outside')!;
  const header = document.querySelector<HTMLElement>('body > header.header');

  function getHeaderHeight(): number {
    return header ? Math.round(header.getBoundingClientRect().height) : 84;
  }

  function createReplica() {
    const replica = surface!.cloneNode(true) as HTMLElement;
    replica.classList.add('cinematic-hero__replica');
    replica.removeAttribute('id');

    replica.querySelectorAll('[id], [aria-labelledby], [aria-describedby]').forEach(element => {
      element.removeAttribute('id');
      element.removeAttribute('aria-labelledby');
      element.removeAttribute('aria-describedby');
    });

    // Conserva la apariencia visual de los enlaces sin duplicar foco ni controles accesibles.
    replica.querySelectorAll('a').forEach(link => {
      const visual = document.createElement('span');
      for (const attribute of link.attributes) {
        if (
          attribute.name === 'class' ||
          attribute.name === 'style' ||
          attribute.name.startsWith('data-astro-cid-')
        ) {
          visual.setAttribute(attribute.name, attribute.value);
        }
      }
      visual.innerHTML = link.innerHTML;
      link.replaceWith(visual);
    });
    replica.querySelectorAll('button, input, select, textarea, [tabindex]').forEach(element => element.remove());
    projection.replaceChildren(replica);
    return replica;
  }

  function resetAllStyles() {
    hero.classList.remove('cinematic-ready', 'cinematic-complete', 'cinematic-projected');
    stage.style.removeProperty('--projection-left');
    stage.inert = false;
    outside.inert = false;
    surface!.inert = false;
    projection.replaceChildren();
    for (const el of [stage, camera, photo, projection, optical, bloom, outside]) {
      el.hidden = false;
      el.removeAttribute('style');
    }
  }

  /**
   * Escala proporcional `min(projW / contentW, projH / contentH)` para que el encabezado
   * y las tres tarjetas de servicios permanezcan completas dentro del rectángulo de luz.
   */
  function computeDesktopFraming(
    replica: HTMLElement | null,
    stageWidth: number,
    visibleLogicalHeight: number,
  ): FramingFit {
    if (!replica) return { scale: 1, offsetY: 64 };
    const servicesEl = replica.querySelector<HTMLElement>('.services');
    const headingEl = replica.querySelector<HTMLElement>('.services__heading');
    const bentoEl = replica.querySelector<HTMLElement>('.services__bento');
    if (!servicesEl || !headingEl || !bentoEl) return { scale: 1, offsetY: 64 };

    const contentWidth = servicesEl.offsetWidth;
    const headingTop = headingEl.offsetTop;
    const bentoBottom = bentoEl.offsetTop + bentoEl.offsetHeight;
    const contentHeight = Math.max(1, bentoBottom - headingTop);

    const maxScaleX = stageWidth / (contentWidth + 44);
    const maxScaleY = visibleLogicalHeight / (contentHeight + 48);
    const scale = Math.min(1.2, maxScaleX, maxScaleY);

    const logicalAvailable = visibleLogicalHeight / scale;
    const extraY = Math.max(18, (logicalAvailable - contentHeight) * 0.44);
    const offsetY = Math.max(0, headingTop - extraY);

    return { scale, offsetY };
  }

  function applyDesktopGeometry() {
    const width = stage.clientWidth;
    const height = stage.clientHeight || window.innerHeight;
    if (width <= 0 || height <= 0) return null;

    const headerH = getHeaderHeight();
    const frame: Rect = { x: 0, y: headerH, width, height: Math.max(300, height - headerH) };
    const objectPosition =
      width / frame.height < 1.72 ? heroScene.objectPosition.compact : heroScene.objectPosition.desktop;
    const layout = computeSceneLayout(heroScene, frame, heroScene.screen, objectPosition);

    stage.style.setProperty('--projection-left', `${layout.screenRect.x.toFixed(2)}px`);

    photo.style.left = `${layout.photoRect.x}px`;
    photo.style.top = `${layout.photoRect.y}px`;
    photo.style.width = `${layout.photoRect.width}px`;
    photo.style.height = `${layout.photoRect.height}px`;

    bloom.style.left = `${layout.screenRect.x}px`;
    bloom.style.top = `${layout.screenRect.y}px`;
    bloom.style.width = `${layout.screenRect.width}px`;
    bloom.style.height = `${layout.screenRect.height}px`;

    const fitScale = layout.screenRect.width / width;
    const visibleLogicalHeight = layout.screenRect.height / fitScale;
    const projHeight = Math.max(height, Math.ceil(visibleLogicalHeight));
    const initialClipBottom = Math.max(0, projHeight - visibleLogicalHeight);

    projection.style.width = `${width}px`;
    projection.style.height = `${projHeight}px`;
    const replica = projection.firstElementChild as HTMLElement | null;
    if (replica) {
      replica.style.width = `${width}px`;
      replica.style.minHeight = `${projHeight}px`;
      replica.style.transform = 'none';
    }

    optical.style.width = `${width}px`;
    optical.style.height = `${projHeight}px`;

    const framing = computeDesktopFraming(replica, width, visibleLogicalHeight);

    return { width, height, layout, fitScale, initialClipBottom, framing, replica };
  }

  function mountCinematicStatic() {
    createReplica();
    hero.classList.add('cinematic-projected');

    function align() {
      const measured = applyDesktopGeometry();
      if (!measured) return;
      const { layout, fitScale, initialClipBottom, framing, replica } = measured;
      const transform = `translate3d(${layout.screenRect.x}px, ${layout.screenRect.y}px, 0) scale(${fitScale})`;
      const clip = initialClipBottom > 0.5 ? `inset(0px 0px ${initialClipBottom.toFixed(2)}px 0px)` : 'none';
      camera.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
      projection.style.transform = transform;
      projection.style.clipPath = clip;
      projection.style.opacity = '0.91';
      if (replica) {
        replica.style.transform = `scale(${framing.scale}) translate3d(0px, ${-framing.offsetY}px, 0)`;
      }
      optical.style.transform = transform;
      optical.style.clipPath = clip;
      optical.style.opacity = '1';
      bloom.style.opacity = '1';
    }

    align();

    return {
      onResize: align,
      cleanup: resetAllStyles,
    };
  }

  async function mountCinematicAnimated(isCurrent: () => boolean) {
    const [{ gsap, ScrollTrigger }] = await Promise.all([
      loadGsap(),
      document.fonts.ready,
      image.decode().catch(() => undefined),
    ]);
    if (!isCurrent()) return null;

    createReplica();
    hero.classList.add('cinematic-ready', 'cinematic-projected');

    const state = { progress: 0 };
    const visualEnd = heroScene.handoffProgress;
    let pastEnd = false;
    let width = 0;
    let height = 0;
    let screenRect: Rect = { x: 0, y: 0, width: 1, height: 1 };
    let initialClipBottom = 0;
    let framing: FramingFit = { scale: 1, offsetY: 0 };
    let replicaEl: HTMLElement | null = projection.firstElementChild as HTMLElement | null;

    const handoff = {
      hero,
      stage,
      layers: [camera, projection, optical, outside],
    };
    const interaction = createCinematicLinks(hero, projection, surface!);

    let lastComplete: boolean | null = null;
    let lastOutsideInert: boolean | null = null;
    let lastClipPath = '';
    let lastOutsideOpacity = '';
    let lastOpticalOpacity = '';
    let lastPhotoOpacity = '';

    function render() {
      if (width <= 0 || height <= 0) return;
      const p = state.progress;
      const complete = pastEnd || p >= visualEnd;

      // Si ya se completó el traspaso al bento real, evitar cálculos y escrituras DOM en capas ocultas.
      if (complete && lastComplete === true) return;

      if (!complete && lastComplete !== false) {
        applyCinematicHandoff(handoff, false);
        lastComplete = false;
      }

      const outsideOpacity = String(1 - smoothstep((p - 0.04) / 0.22));
      if (outsideOpacity !== lastOutsideOpacity) {
        outside.style.opacity = outsideOpacity;
        lastOutsideOpacity = outsideOpacity;
      }
      const nextOutsideInert = p > 0.26;
      if (nextOutsideInert !== lastOutsideInert) {
        outside.inert = nextOutsideInert;
        lastOutsideInert = nextOutsideInert;
      }

      const approach = smoothstep((p - 0.08) / (visualEnd - 0.08));
      const cam = computeCameraTransform(screenRect, { width, height }, approach);

      camera.style.transform = `translate3d(${cam.tx}px, ${cam.ty}px, 0) scale(${cam.scale})`;

      const projTransform = `translate3d(${cam.screenX}px, ${cam.screenY}px, 0) scale(${cam.netScale})`;
      projection.style.transform = projTransform;
      optical.style.transform = projTransform;

      const boostFactor = 1 - approach;
      const curBoost = 1 + (framing.scale - 1) * boostFactor;
      const curOffsetY = framing.offsetY * boostFactor;
      const innerTransform = `scale(${curBoost}) translate3d(0px, ${-curOffsetY}px, 0)`;
      if (replicaEl) {
        replicaEl.style.transform = innerTransform;
      }

      const revealBottom = smoothstep((p - 0.46) / (visualEnd - 0.52));
      const clipPx = initialClipBottom * (1 - revealBottom);
      const clipPath = clipPx > 0.5 ? `inset(0px 0px ${clipPx.toFixed(2)}px 0px)` : 'none';
      if (clipPath !== lastClipPath) {
        projection.style.clipPath = clipPath;
        optical.style.clipPath = clipPath;
        lastClipPath = clipPath;
      }

      const opticalPresence = 1 - smoothstep((p - 0.12) / 0.42);
      const opticalStr = String(opticalPresence);
      if (opticalStr !== lastOpticalOpacity) {
        projection.style.opacity = String(1 - 0.09 * opticalPresence);
        optical.style.opacity = opticalStr;
        bloom.style.opacity = opticalStr;
        lastOpticalOpacity = opticalStr;
      }

      const photoOpacity = String(1 - smoothstep((p - (visualEnd - 0.14)) / 0.11));
      if (photoOpacity !== lastPhotoOpacity) {
        camera.style.opacity = photoOpacity;
        lastPhotoOpacity = photoOpacity;
      }

      interaction.render(projTransform, innerTransform, clipPath, complete);

      if (complete) {
        applyCinematicHandoff(handoff, true);
        lastComplete = true;
      }
    }

    function measure() {
      lastComplete = null;
      lastClipPath = '';
      lastOutsideOpacity = '';
      lastOpticalOpacity = '';
      lastPhotoOpacity = '';
      camera.hidden = false;
      projection.hidden = false;
      optical.hidden = false;

      const measured = applyDesktopGeometry();
      if (!measured) return;

      width = measured.width;
      height = measured.height;
      screenRect = measured.layout.screenRect;
      initialClipBottom = measured.initialClipBottom;
      framing = measured.framing;
      replicaEl = measured.replica;

      interaction.measure();
      render();
    }

    let timeline!: ReturnType<typeof gsap.timeline>;
    const ctx = gsap.context(() => {
      measure();
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${(stage.clientHeight || window.innerHeight) * heroScene.scrollViewports * visualEnd}`,
          pin: stage,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: self => {
            measure();
            pastEnd = self.progress >= 1;
            state.progress = self.progress * visualEnd;
            render();
          },
          onLeave: () => {
            pastEnd = true;
            state.progress = visualEnd;
            render();
          },
          onEnterBack: self => {
            pastEnd = false;
            state.progress = self.progress * visualEnd;
            render();
          },
        },
      });
      timeline.to(state, { progress: visualEnd, ease: 'none', duration: 1, onUpdate: render });
    }, hero);

    ScrollTrigger.refresh();
    const restoration = requestAnimationFrame(() => {
      const trigger = timeline.scrollTrigger;
      if (!trigger) return;
      pastEnd = trigger.progress >= 1;
      state.progress = trigger.progress * visualEnd;
      timeline.progress(trigger.progress);
      render();
    });

    let refreshTimer: number | undefined;
    return {
      onResize: () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      },
      cleanup: () => {
        window.clearTimeout(refreshTimer);
        cancelAnimationFrame(restoration);
        ctx.revert();
        interaction.destroy();
        resetAllStyles();
      },
    };
  }

  // Orquestador único de los 2 modos (`cinematic` ↔ `simplified`): limpieza total sin duplicaciones.
  const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let currentKey = '';
  let generation = 0;
  let activeController: { onResize: () => void; cleanup: () => void } | null = null;
  let rafId = 0;

  async function syncMode(forceResize = false) {
    const mode: HeroMode = resolveHeroMode(
      window.innerWidth,
      window.innerHeight,
      getHeaderHeight(),
      heroScene,
      heroScene.screen,
    );
    const reduced = reducedMotionQuery.matches;
    const nextKey = `${mode}:${reduced ? 'reduced' : 'motion'}`;

    if (nextKey === currentKey) {
      if (forceResize) activeController?.onResize();
      return;
    }

    const token = ++generation;
    activeController?.cleanup();
    activeController = null;
    currentKey = nextKey;
    hero.dataset.heroMode = mode;

    if (mode === 'simplified') {
      resetAllStyles();
      return;
    }

    if (reduced) {
      activeController = mountCinematicStatic();
      return;
    }

    const mounted = await mountCinematicAnimated(() => token === generation);
    if (token === generation && mounted) {
      activeController = mounted;
    } else {
      mounted?.cleanup();
    }
  }

  const scheduleSync = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      void syncMode(true);
    });
  };

  const resizeObserver = new ResizeObserver(scheduleSync);
  resizeObserver.observe(hero);
  if (header) resizeObserver.observe(header);
  window.addEventListener('resize', scheduleSync, { passive: true });
  reducedMotionQuery.addEventListener('change', scheduleSync);

  await syncMode(false);
}
