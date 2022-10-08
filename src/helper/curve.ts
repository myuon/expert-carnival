import Spline from "cubic-spline";

export const curve = (points: { x: number; y: number }[]) => {
  const ps = [...points];
  ps.sort((a, b) => a.x - b.x);

  const spline = new Spline(
    points.map((p) => p.x),
    points.map((p) => p.y)
  );

  const result = [];
  for (let t = 0.0; t < 1.0; t += 0.01) {
    result.push(spline.at(t));
  }

  return result;
};
