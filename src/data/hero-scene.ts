import heroImage from '../images/hero/hero-projector.webp?url';
import wallBackgroundImage from '../images/hero/hero-wall-mobile.webp?url';

// Calibración sobre la fotografía 4K definitiva del proyector (3840 × 2145).
// Rectángulo iluminado en la pared detectado por gradiente de luminancia:
// x ∈ [1643, 3424], y ∈ [209, 1305] → 1781 × 1096 px (relación 1.625).
export const heroScene = {
  width: 3840,
  height: 2145,
  image: heroImage,
  wallBackgroundImage,
  screen: {
    left: 1643 / 3840,
    top: 209 / 2145,
    width: 1781 / 3840,
    height: 1096 / 2145,
  },
  // Encuadre en modo cinematográfico: mantiene siempre visible
  // toda la proyección y el proyector sin recortar el borde derecho.
  objectPosition: {
    desktop: { x: 0.5, y: 0.45 },
    compact: { x: 0.56, y: 0.45 },
  },
  scrollViewports: 2,
  // El acercamiento llega a escala 1:1 en este punto: libera el pin al instante.
  handoffProgress: 0.75,
} as const;
