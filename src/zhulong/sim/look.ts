import { T } from './config';
import { hash2 } from './math';

/**
 * Tile table, built from the Frogatto dungeon set.
 *
 * The art is not an autotile set: `dungeon-walls` is loose rock faces and
 * `dungeon-floor-cement` is a room kit whose cells 26 / 30 / 35 / 42 carry the
 * load-bearing idea — a lit stone cap over a dark void. That cap is what makes
 * a 32px platform readable at a glance, so rock is drawn as cap + shaft rather
 * than as a repeated block.
 */

/** Cell indices inside `dungeon-floor-cement.png` (8 per row). */
export const CAP = 26; // verified: opaque stone cap, 1024/1024 px
/** Cap with a finished left end, used at ledge starts. */
export const CAP_LEFT = 30; // cap with a finished left end
export const CAP_RIGHT = 35;
/** Full lit slab: used for one-tile-thick ledges. */
export const SLAB = 29; // thinner cap, used for one-tile ledges
/** Solid packed dirt/cement fill. */
export const FILL = 50;
export const FILL_ALT = 51;

/** `dungeon-walls` rock faces; every one of these is a full 32x32 tile. */
/**
 * `dungeon-walls` cells verified opaque by pixel audit (see the import script's
 * manifest). Anything outside this list draws nothing, which is how the earlier
 * pass produced olive squares: it sampled empty cells.
 */
export const ROCK_FACES = [16, 17, 18, 24, 25, 26, 40, 41, 42, 43] as const;
/** Sparse rock clusters: only used as deep-background chatter, never as mass. */
export const ROCK_SPARSE = [0, 1, 2, 3, 5, 8, 9, 10, 11, 14] as const;

/** `cave.png` mossy overgrowth, for the deeper bands. */
/** `cave` cells verified opaque: mossy teal growth over dark rock. */
export const MOSS = [1, 5, 7, 8, 13, 15, 16, 17, 18, 19, 24, 25, 26, 30, 31, 39, 46, 47, 48, 49, 50, 51] as const;

/** `dungeon-parallax-wall.png` — 64x64 far wall, 4 cells. */
export const FAR_WALL = 0;

/**
 * Frogatto's wall cells are *decals*: a handful of rocks floating on alpha, meant
 * to be stamped over a flat dark plate. Drawn as solid mass they tile into a
 * field of holes, so the renderer does two passes — a solid base colour for the
 * mass, then the rock cell on top as texture.
 */
export interface TileLook {
  /** Solid base colour for the mass pass. */
  base: number;
  /** Atlas name the renderer should sample: 'walls' | 'floor' | 'cave'. */
  sheet: 'walls' | 'floor' | 'cave';
  /** Cell index inside that sheet. */
  cell: number;
  /** Multiplicative tint, already band-graded. */
  tint: number;
  /** Sides facing open air: [top, right, bottom, left]. */
  open: [number, number, number, number];
  /** 0 none, 1 ore, 2 rich — drives the emissive core. */
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

  const o: [number, number, number, number] = [
    isAir(get(tx, ty - 1)) ? 1 : 0,
    isAir(get(tx + 1, ty)) ? 1 : 0,
    isAir(get(tx, ty + 1)) ? 1 : 0,
    isAir(get(tx - 1, ty)) ? 1 : 0,
  ];

  if (tile === T.BEDROCK) {
    return { base: 0x080a12, sheet: 'walls', cell: ROCK_FACES[h % ROCK_FACES.length], tint: 0x232a3c, open: [0, 0, 0, 0], glow: 0 };
  }

  if (tile === T.ORE || tile === T.RICH) {
    const rich = tile === T.RICH;
    // Ore is solid crystal-bearing rock: a fully opaque slab, never a decal.
    return {
      base: scaleColor(rich ? 0x8a6a24 : 0x6b5a22, 1),
      sheet: 'floor',
      cell: CAP,
      tint: scaleColor(rich ? 0xffe0a0 : 0xd8b25c, 1),
      open: o,
      glow: rich ? 2 : 1,
    };
  }

  // Deep rock grows moss over the same structure.
  const deep = tile === T.DEEP;
  const sheet: TileLook['sheet'] = 'walls';
  // Deliberate high-contrast grade: the rock is pushed to near-black so it
  // reads as *mass*, and every platform is legible only from its lit rim.
  // Letting the source art keep its own mid-grey is what made earlier passes
  // look like grey brick wallpaper.
  // Mid-dark, not black: the mass stays readable, but it sits well under the
  // lit rim so silhouette still does the work.
  let tint = scaleColor(deep ? 0x5c6480 : 0x6e7488, 0.78 + ((h % 5) / 5) * 0.2);
  if (o[0]) tint = scaleColor(tint, 1.35);
  void bandTint;

  // Must sit on the cave backdrop: the wall cells are decals with alpha gaps,
  // and any contrast here prints a visible square around every tile.
  // Matched to the cave backdrop. The wall cells are decals with alpha gaps, so
  // a contrasting plate prints a square around every tile; at the backdrop value
  // the gaps simply become shadow.
  const base = deep ? 0x05070c : 0x06080e;
  // Deep rock uses the same dense faces; only the tint turns cold. The mossy
  // `cave` art is painted over black and reads as a box when tiled as mass, so
  // it is reserved for the sparse decal pass in the renderer.
  return { base, sheet: 'walls', cell: ROCK_FACES[(h >>> 2) % ROCK_FACES.length], tint, open: o, glow: 0 };
}

/**
 * Ledges are drawn as a lit cap with a dark under-shank, which is how the
 * source art builds its own platforms. Returns null for cells that are plain
 * mass (those come from {@link tileLook}).
 */
export function ledgeLook(
  get: (x: number, y: number) => number,
  tx: number,
  ty: number,
  bandTint: number,
): { cell: number; tint: number; oneWide: boolean } | null {
  const tile = get(tx, ty);
  if (tile !== T.ROCK && tile !== T.DEEP) return null;
  const airAbove = AIRY(get(tx, ty - 1));
  if (!airAbove) return null;
  const airLeft = AIRY(get(tx - 1, ty));
  const airRight = AIRY(get(tx + 1, ty));
  const airBelow = AIRY(get(tx, ty + 1));
  const oneWide = airLeft && airRight;
  const cell = oneWide ? SLAB : airLeft ? CAP_LEFT : airRight ? CAP_RIGHT : CAP;
  void airBelow;
  return { cell, tint: scaleColor(bandTint, 1.06), oneWide };
}
