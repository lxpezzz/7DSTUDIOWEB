import heroImage from '../images/hero/hero-7dstudio.webp?url';

// Calibración sobre el PNG original de 1672 × 941, no sobre un recorte CSS.
// Orden: superior izquierda, superior derecha, inferior derecha, inferior izquierda.
export const heroScene = {
  width: 1672,
  height: 941,
  image: heroImage,
  screen: [
    [592 / 1672, 382 / 941],
    [1035 / 1672, 374 / 941],
    [1080 / 1672, 676 / 941],
    [632 / 1672, 700 / 941],
  ],
  // Apertura visible: conserva la muesca, la mano y la silueta sobre el cristal.
  // Estos puntos son píxeles de la misma imagen original.
  opening: '592,382 795,378 797,385 842,384 844,378 1035,374 1073,622 1065,635 1062,650 1063,665 1059,677 1000,679 991,668 981,659 972,658 962,660 954,663 945,662 935,663 924,658 915,656 903,657 895,663 892,671 883,670 873,675 868,689 632,700',
  objectPosition: { x: 0.5, y: 0.5 },
  scrollViewports: 2,
  // El zoom original llega a pantalla completa aquí: liberar el pin en ese punto,
  // sin conservar el último 25% como una pantalla decorativa no interactiva.
  handoffProgress: 0.75,
} as const;
