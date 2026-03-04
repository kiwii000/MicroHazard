import { RNG } from '../core/RNG';

const smooth = (t: number): number => t * t * (3 - 2 * t);

const hash2D = (seed: number, x: number, y: number): number => {
  const v = RNG.hash(seed, x, y);
  return ((v >>> 0) & 0xffffffff) / 0x100000000;
};

export const valueNoise2D = (seed: number, x: number, y: number): number => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash2D(seed, ix, iy);
  const b = hash2D(seed, ix + 1, iy);
  const c = hash2D(seed, ix, iy + 1);
  const d = hash2D(seed, ix + 1, iy + 1);

  const ux = smooth(fx);
  const uy = smooth(fy);
  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return (ab + (cd - ab) * uy) * 2 - 1;
};
