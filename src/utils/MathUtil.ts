export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

export const length = (x: number, y: number): number => Math.hypot(x, y);

export const normalize = (x: number, y: number): { x: number; y: number } => {
  const len = Math.hypot(x, y);
  if (len <= 0.000001) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
