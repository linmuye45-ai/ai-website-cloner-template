/**
 * ZHULONG · 烛龙 — a descent into the Long Vein.
 *
 * Art direction: 「烛火照古龙」. One ember is the only light source, so stone
 * reads cold blue-grey and warmth only exists where fire or ore exists.
 * All sprites come from Kenney's CC0 packs (see public/vendor/zhulong).
 */

export const TILE = 32;
/** Camera magnification. At 16px tiles this shows ~40x22 tiles, i.e. a
 *  side-scrolling action game rather than a poster. */
export const ZOOM = 3;
export const VIEW = { w: 1280, h: 720 } as const;

export const WORLD = { w: 110, h: 700 } as const;

export const T = {
  AIR: 0,
  ROCK: 1,
  DEEP: 2,
  ORE: 3,
  RICH: 4,
  BRAZIER: 5,
  BEDROCK: 6,
} as const;

export const TILE_HP: Record<number, number> = {
  [T.ROCK]: 3,
  [T.DEEP]: 6,
  // Ore is far softer than rock: a seam carved by a parry is also a way through.
  // That is how 「刀痕成矿」 pays for itself twice — essence and shortcuts.
  [T.ORE]: 1,
  [T.RICH]: 1,
  [T.BRAZIER]: 999,
  [T.BEDROCK]: 9999,
};

export const PLAYER = {
  w: 18,
  h: 24,
  speed: 118,
  accel: 1500,
  friction: 1900,
  jump: 322,
  gravity: 980,
  maxFall: 540,
  maxHp: 100,
  coyote: 0.1,
  buffer: 0.12,
  attackDur: 0.24,
  attackCd: 0.32,
  reach: 34,
  damage: 14,
  minePower: 1,
  parryActive: 0.22,
  parryCd: 0.34,
  iframes: 0.55,
} as const;

export const ENEMY = {
  windup: 0.46,
  parryWindow: 0.2,
  damage: 13,
  staggerTime: 1.1,
} as const;

export interface Band {
  from: number;
  name: string;
  line: string;
  /** Tint multiplied over the rock atlas, so one tileset spans all depths. */
  tint: number;
  /** Ambient darkness of the layer behind the rock. */
  backdrop: number;
}

export const BANDS: Band[] = [
  { from: 0, name: '残垣', line: '刀还在，人不在。', tint: 0xa8bcd8, backdrop: 0x0d0b14 },
  { from: 120, name: '断脉', line: '石头记得每一次呼吸。', tint: 0x94a6bf, backdrop: 0x0a0911 },
  { from: 280, name: '烛骸', line: '火照过的地方，才有影子。', tint: 0xb59a80, backdrop: 0x100a10 },
  { from: 450, name: '无回', line: '往下的人，不数台阶。', tint: 0x8f88b8, backdrop: 0x0b0814 },
  { from: 590, name: '龙喉', line: '它睡了很久，等你很久。', tint: 0xc08872, backdrop: 0x140810 },
];

export function bandAt(row: number): Band {
  let b = BANDS[0];
  for (const band of BANDS) if (row >= band.from) b = band;
  return b;
}

export const SAVE_KEY = 'zhulong-v2';
