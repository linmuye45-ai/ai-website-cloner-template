export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export type Rng = () => number;

/** Deterministic PRNG: headless tests and live runs share identical logic. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const approach = (v: number, target: number, delta: number): number => {
  if (v < target) return Math.min(v + delta, target);
  return Math.max(v - delta, target);
};

export const sign = (v: number): number => (v > 0 ? 1 : v < 0 ? -1 : 0);
