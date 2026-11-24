export type HeroMode = 'cinematic' | 'simplified';

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FocalPoint {
  x: number;
  y: number;
}

export interface SceneLayout {
  photoRect: Rect;
  screenRect: Rect;
}

export interface CameraTransform {
  scale: number;
  tx: number;
  ty: number;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  netScale: number;
}

/**
 * Decide entre los dos únicos modos del hero (`cinematic` y `simplified`) a partir
 * del espacio geométrico real disponible (ancho, altura bajo el header y relación de
 * aspecto), independiente de los breakpoints de navegación.
 */
export function resolveHeroMode(
  viewportWidth: number,
  viewportHeight: number,
  headerHeight: number,
  source: Size,
  screen: NormalizedRect,
): HeroMode {
  if (viewportWidth < 1024 || viewportHeight < 520) return 'simplified';

  const availHeight = Math.max(1, viewportHeight - headerHeight);
  const coverScale = Math.max(viewportWidth / source.width, availHeight / source.height);
  const projectedWidth = screen.width * source.width * coverScale;
  const remainingLeft = viewportWidth - projectedWidth;
  const availAspect = viewportWidth / availHeight;

  // Modo cinematográfico solo cuando el bloque comercial cabe sin invadir la proyección
  // (>= 510px libres) y `cover` no recorta el borde derecho de la superficie iluminada.
  return remainingLeft >= 510 && availAspect >= 1.55 ? 'cinematic' : 'simplified';
}

/**
 * Calcula en un único sistema de coordenadas la caja real de la fotografía
 * renderizada (`object-fit: cover`) y la caja exacta del rectángulo proyectado
 * a partir de sus coordenadas normalizadas.
 */
export function computeSceneLayout(
  source: Size,
  frame: Rect,
  screen: NormalizedRect,
  objectPosition: FocalPoint,
): SceneLayout {
  const coverScale = Math.max(frame.width / source.width, frame.height / source.height);
  const renderedWidth = source.width * coverScale;
  const renderedHeight = source.height * coverScale;
  const offsetX = (frame.width - renderedWidth) * objectPosition.x;
  const offsetY = (frame.height - renderedHeight) * objectPosition.y;

  const photoRect: Rect = {
    x: frame.x + offsetX,
    y: frame.y + offsetY,
    width: renderedWidth,
    height: renderedHeight,
  };

  const screenRect: Rect = {
    x: photoRect.x + screen.left * photoRect.width,
    y: photoRect.y + screen.top * photoRect.height,
    width: screen.width * photoRect.width,
    height: screen.height * photoRect.height,
  };

  return { photoRect, screenRect };
}

/**
 * Dolly óptico puro desde el rectángulo proyectado hasta el viewport completo.
 * Fotografía y proyección comparten exactamente el mismo punto de fuga y escala,
 * garantizando error de registro nulo (0 px) en cualquier frame y resolución.
 */
export function computeCameraTransform(
  screenRect: Rect,
  stage: Size,
  approach: number,
): CameraTransform {
  const fitScale = screenRect.width / stage.width;
  const targetScale = stage.width / screenRect.width;
  const scale = Math.exp(Math.log(targetScale) * approach);

  const denom = targetScale - 1;
  const fx = denom > 1e-4 ? (screenRect.x * targetScale) / denom : 0;
  const fy = denom > 1e-4 ? (screenRect.y * targetScale) / denom : 0;

  const tx = fx * (1 - scale);
  const ty = fy * (1 - scale);

  return {
    scale,
    tx,
    ty,
    screenX: screenRect.x * scale + tx,
    screenY: screenRect.y * scale + ty,
    screenWidth: screenRect.width * scale,
    screenHeight: screenRect.height * scale,
    netScale: fitScale * scale,
  };
}
