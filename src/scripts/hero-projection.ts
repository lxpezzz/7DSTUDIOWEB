export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Matrix = [number, number, number, number, number, number, number, number, number];

function homography(points: Quad): Matrix {
  const [a, b, c, d] = points;
  const dx1 = b.x - c.x, dx2 = d.x - c.x;
  const dy1 = b.y - c.y, dy2 = d.y - c.y;
  const sx = a.x - b.x + c.x - d.x;
  const sy = a.y - b.y + c.y - d.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / determinant;
  const h = (dx1 * sy - sx * dy1) / determinant;
  return [b.x - a.x + g * b.x, d.x - a.x + h * d.x, a.x,
    b.y - a.y + g * b.y, d.y - a.y + h * d.y, a.y, g, h, 1];
}

function inverse([a, b, c, d, e, f, g, h, i]: Matrix): Matrix {
  const cofactors: Matrix = [e*i-f*h, c*h-b*i, b*f-c*e, f*g-d*i, a*i-c*g, c*d-a*f, d*h-e*g, b*g-a*h, a*e-b*d];
  const determinant = a * cofactors[0] + b * cofactors[3] + c * cofactors[6];
  return cofactors.map(value => value / determinant) as Matrix;
}

function transform(matrix: Matrix, point: Point): Point {
  const w = matrix[6] * point.x + matrix[7] * point.y + matrix[8];
  return { x: (matrix[0] * point.x + matrix[1] * point.y + matrix[2]) / w,
    y: (matrix[3] * point.x + matrix[4] * point.y + matrix[5]) / w };
}

// La foto y su primer plano reciben exactamente la misma homografía que la pantalla.
// Se cachea la inversa inicial en cada refresh, nunca se consulta layout al animar.
export function createPhotoProjector(source: Quad, frame: { x: number; y: number; width: number; height: number }) {
  const sourceInverse = inverse(homography(source));
  const corners: Quad = [{ x: frame.x, y: frame.y }, { x: frame.x + frame.width, y: frame.y },
    { x: frame.x + frame.width, y: frame.y + frame.height }, { x: frame.x, y: frame.y + frame.height }];
  const local = corners.map(point => transform(sourceInverse, point));
  return (destination: Quad) => {
    const target = homography(destination);
    const mapped = local.map(point => {
      const projected = transform(target, point);
      return { x: projected.x - frame.x, y: projected.y - frame.y };
    }) as Quad;
    return projectiveMatrix(mapped, frame.width, frame.height);
  };
}

// Homografía: rectángulo HTML (w × h) → cuatro vértices en perspectiva.
// Sólo la matriz cambia por frame; no hay lecturas de layout durante el scroll.
export function projectiveMatrix(points: Quad, width: number, height: number): string {
  const [a, b, c, d, e, f, g, h] = homography(points);
  const matrix = [
    a / width, d / width, 0, g / width,
    b / height, e / height, 0, h / height,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${matrix.join(',')})`;
}

export function coverQuad(
  screen: readonly (readonly [number, number])[],
  source: { width: number; height: number },
  viewport: { width: number; height: number },
  position: { x: number; y: number },
): Quad {
  const scale = Math.max(viewport.width / source.width, viewport.height / source.height);
  const offsetX = (viewport.width - source.width * scale) * position.x;
  const offsetY = (viewport.height - source.height * scale) * position.y;
  return screen.map(([x, y]) => ({
    x: x * source.width * scale + offsetX,
    y: y * source.height * scale + offsetY,
  })) as Quad;
}
