/**
 * Locked 52-colour palette from docs/art-bible/palette.json.
 * Index 0 is reserved transparency, so ink is 1.
 *
 * Art direction: 「烛火照古龙」 — everything is lit by a single ember source,
 * so stone reads cold and blue, and only fire/ore carry warmth.
 */
export const PAL = {
  ink: 0x16131f,
  panel: 0x211c2e,
  stone1: 0x2a2733,
  stone2: 0x3a3646,
  stone3: 0x4e495c,
  stone4: 0x676078,
  stone5: 0x857d94,
  stone6: 0xa79fb4,
  stone7: 0xcbc3d6,
  teal1: 0x10282c,
  teal2: 0x173f47,
  teal3: 0x1f5c66,
  teal4: 0x2d7f8a,
  teal5: 0x49a8b0,
  teal6: 0x86d4d2,
  red1: 0x3a1420,
  red2: 0x6a2230,
  red3: 0x9c3540,
  red4: 0xd15c52,
  red5: 0xf29578,
  ember1: 0x5c2417,
  ember2: 0xa8451e,
  ember3: 0xe8782c,
  ember4: 0xf7b733,
  ember5: 0xffe9a8,
  parch1: 0xd8c9a3,
  parch2: 0xf0e6c8,
  metal3: 0x6b7686,
  metal4: 0xb9c4d2,
} as const;

export const toCss = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;

export const TILE = 24;
export const VIEW = { w: 1280, h: 720 } as const;

/** Tile ids kept as small ints so the world can live in a typed array. */
export const T = {
  AIR: 0,
  STONE: 1,
  DEEP: 2,
  ORE: 3,
  ORE_RICH: 4,
  BRAZIER: 5,
  BEDROCK: 6,
} as const;

/** Tile hardness in sword hits. */
export const TILE_HP: Record<number, number> = {
  [T.STONE]: 4,
  [T.DEEP]: 8,
  [T.ORE]: 3,
  [T.ORE_RICH]: 4,
  [T.BRAZIER]: 99,
  [T.BEDROCK]: 999,
};

export const WORLD = { w: 96, h: 1600 } as const; // in tiles → 2304 x 38400 px

export const PLAYER = {
  w: 15,
  h: 21,
  speed: 178,
  accel: 1900,
  friction: 2400,
  jump: 430,
  gravity: 1350,
  maxFall: 820,
  maxHp: 100,
  /** Frames of coyote time, in seconds. */
  coyote: 0.1,
  /** Buffered jump input window. */
  buffer: 0.12,
  attackDur: 0.26,
  attackCd: 0.34,
  attackReach: 42,
  attackDamage: 11,
  mineDamage: 1,
  parryActive: 0.2,
  parryCd: 0.42,
  iframes: 0.5,
} as const;

export const COMBAT = {
  /** Enemy strike windup; the last `parryWindow` seconds are parryable. */
  windup: 0.5,
  parryWindow: 0.22,
  enemyDamage: 14,
  postureBreak: 1.15,
} as const;

/** Depth bands: name, flavour line, and the tile/ore gradient they use. */
export interface Band {
  from: number;
  name: string;
  line: string;
  wall: number;
  wallDark: number;
}

export const BANDS: Band[] = [
  {
    from: 0,
    name: '残垣',
    line: '刀还在，人不在。',
    wall: PAL.stone3,
    wallDark: PAL.stone2,
  },
  {
    from: 280,
    name: '断脉',
    line: '石头记得每一次呼吸。',
    wall: PAL.stone2,
    wallDark: PAL.stone1,
  },
  {
    from: 620,
    name: '烛骸',
    line: '火照过的地方，才有影子。',
    wall: 0x3a2c3a,
    wallDark: 0x241a26,
  },
  {
    from: 1000,
    name: '无回',
    line: '往下的人，不数台阶。',
    wall: 0x2c2436,
    wallDark: 0x1a1522,
  },
  {
    from: 1350,
    name: '龙喉',
    line: '它睡了很久，等你很久。',
    wall: 0x3a1c22,
    wallDark: 0x220f16,
  },
];

export function bandAt(row: number): Band {
  let band = BANDS[0];
  for (const b of BANDS) {
    if (row >= b.from) band = b;
  }
  return band;
}

export const SAVE_KEY = 'zhulong-v1';
