const interpolation = (
  p0: number,
  p1: number,
  m0: number,
  m1: number,
  t: number
) => {
  const t2 = t * t;
  const t3 = t2 * t;

  return (
    (2 * t3 - 3 * t2 + 1) * p0 +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * p1 +
    (t3 - t2) * m1
  );
};

const tangent = (points: { x: number; y: number }[], k: number) => {
  if (k === 0) {
    return 0.0;
  }
  if (k >= points.length - 1) {
    return 0.0;
  }

  const p0 = points[k - 1];
  const p1 = points[k + 1];

  return (p1.y - p0.y) / (p1.x - p0.x);
};

export const cardinalSpline = (
  points: { x: number; y: number }[],
  tension: number
) => {
  const ps = [...points];
  ps.sort((a, b) => a.x - b.x);

  const result = [];
  for (let t = 0.0; t < 1.0; t += 0.01) {
    const k = ps.findIndex((p) => p.x > t) - 1;

    const m0 = (1 - tension) * tangent(ps, k);
    const m1 = (1 - tension) * tangent(ps, k + 1);

    const p0 = ps[k];
    const p1 = ps[k + 1];

    result.push({
      x: t,
      y: interpolation(p0.y, p1.y, m0, m1, t - p0.x),
    });
  }

  return result;
};
