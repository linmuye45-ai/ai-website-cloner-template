import { T } from './config';
import { hash2 } from './math';

/** How one solid cell should be drawn: which mass frame, what tint, which
 * faces are open (for the rim-light pass) and whether it emits. */
/**
 * `public/vendor/zhulong/rockmass.png` is a seamless 64x128 stone wall from the
 * Retro Textures Fantasy pack. Sliced into 4x8 = 32 frames of 16x16, adjacent
 * world cells sample adjacent frames, so the wall reads as one continuous mass
 * instead of a stack of crates.
 */
export const MASS_COLS = 4;
export const MASS_ROWS = 8;
export const MASS_FRAMES = MASS_COLS * MASS_ROWS;

export function frameAt(tx: number, ty: number): number {
  const cx = ((tx % MASS_COLS) + MASS_COLS) % MASS_COLS;
  const cy = ((ty % MASS_ROWS) + MASS_ROWS) % MASS_ROWS;
  return cy * MASS_COLS + cx;
}

export interface TileLook {
  /** Frame index into the 4x8 grid sliced from the seamless rock mass. */
  file: number;
  /** Multiplicative tint, already band-graded. */
  tint: number;
  /** Sides that face open air, so the renderer can rim-light them. */
  open: [number, number, number, number];
  /** 0 none, 1 ore, 2 rich — drives the emissive glow. */
  glow: number;
}

const AIRY = (n: number): boolean => n === T.AIR || n === T.BRAZIER;

function scaleColor(color: number, mul: number): number {
  const r = Math.min(255, Math.round(((color >> 16) & 0xff) * mul));
  const g = Math.min(255, Math.round(((color >> 8) & 0xff) * mul));
  const b = Math.min(255, Math.round((color & 0xff) * mul));
  return (r << 16) | (g << 8) | b;
}

export function tileLook(
  get: (x: number, y: number) => number,
  tx: number,
  ty: number,
  bandTint: number,
  isAir: (n: number) => boolean = AIRY,
): TileLook {
  const tile = get(tx, ty);
  const h = hash2(tx, ty);

  if (tile === T.BEDROCK) {
    return { file: frameAt(tx, ty), tint: 0x3a3a46, open: [0, 0, 0, 0], glow: 0 };
  }

  const o = [
    isAir(get(tx, ty - 1)) ? 1 : 0,
    isAir(get(tx + 1, ty)) ? 1 : 0,
    isAir(get(tx, ty + 1)) ? 1 : 0,
    isAir(get(tx - 1, ty)) ? 1 : 0,
  ] as [number, number, number, number];
  const open = o[0] + o[1] + o[2] + o[3] > 0;
  void open;

  if (tile === T.ORE || tile === T.RICH) {
    const rich = tile === T.RICH;
    return {
      file: frameAt(tx, ty),
      tint: scaleColor(rich ? 0xffd27a : 0xc9a24a, 1),
      open: o,
      glow: rich ? 2 : 1,
    };
  }

  const deep = tile === T.DEEP;
  // Rock sits in shadow; the light plate and rim pass do the shaping.
  let tint = scaleColor(bandTint, deep ? 0.58 : 0.74);
  if (o[0]) tint = scaleColor(tint, deep ? 1.34 : 1.22);
  tint = scaleColor(tint, 0.95 + ((h % 7) / 7) * 0.1);

  // Mass is flat slab; the cave silhouette is cut by rim light, not by rims
  // baked into every block (which is what makes this kit look like crates).
  return { file: frameAt(tx, ty), tint, open: o, glow: 0 };
}
