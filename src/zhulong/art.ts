import { ASSET_BASE } from '@/phaser-game/assets';

/**
 * Art contract for ZHULONG.
 *
 * Every pixel on screen comes from a Kenney CC0 pack, copied into
 * `public/vendor/zhulong` and catalogued in ATTRIBUTION.md. This module is the
 * only place that knows file names; the scene only knows semantic keys.
 */

const ROOT = `${ASSET_BASE}/vendor/zhulong`;

export const rockUrl = (i: number): string =>
  `${ROOT}/rock/tile_${String(i).padStart(4, '0')}.png`;
export const propUrl = (name: string): string => `${ROOT}/props/${name}.png`;
export const lightUrl = (name: string): string => `${ROOT}/light/${name}.png`;

/** Solid, bevel-edged stone blocks — the pack's intended "carved block" look. */
export const ROCK_TILES = [9, 10, 13, 14] as const;
/** Denser, cross-jointed variants used for the deeper, harder stone. */
export const DEEP_TILES = [0, 1, 2] as const;

export const PROP_KEYS = [
  'wizard', 'skeleton', 'skeleton2', 'skeleton3', 'ghoul', 'knight', 'knight2',
  'slime', 'demon', 'demon2', 'dwarf', 'hunter', 'elder', 'girl',
  'barrel', 'chest', 'skull_altar', 'torch', 'sword', 'sword2', 'spear', 'axe',
  'potion_red', 'potion_green', 'potion_blue',
] as const;

export type PropKey = (typeof PROP_KEYS)[number];

export const LIGHT_KEYS = ['circle_a', 'circle_b', 'circle_a_noise', 'circle_a_streaks'] as const;

/** Palette. Warmth only exists where fire or ore exists; stone goes cold. */
export const C = {
  void: 0x05030a,
  ink: 0x0b0913,
  panel: 0x120e1c,
  line: 0x2c2540,
  stone: 0x8b8aa3,
  paper: 0xe8e3f0,
  dim: 0x7c7893,
  ember: 0xff7a2f,
  emberHot: 0xffc46b,
  emberDeep: 0xd2412a,
  jade: 0x49a8b0,
  jadeLight: 0x9fe3dd,
  gold: 0xf7c948,
  blood: 0x9c3540,
  bloodLight: 0xd15c52,
  tide: 0xb02a3c,
} as const;

export const hex = (n: number): string => `#${n.toString(16).padStart(6, '0')}`;

export { hash2 } from './sim/math';
