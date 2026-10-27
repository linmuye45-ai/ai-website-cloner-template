/**
 * Exact spritesheet geometry for the SunnyLand CC0 pack (WispSnow/SunnyLand).
 * Values are taken from the project's Tiled actor.tsj so animations line up
 * pixel-perfectly with the original art.
 */
export const FRAMES = {
  foxy: { frameWidth: 33, frameHeight: 32, columns: 6 },
  frog: { frameWidth: 35, frameHeight: 32, columns: 4 },
  opossum: { frameWidth: 36, frameHeight: 28, columns: 6 },
  eagle: { frameWidth: 40, frameHeight: 41, columns: 4 },
  cherry: { frameWidth: 21, frameHeight: 21, columns: 5 },
  gem: { frameWidth: 15, frameHeight: 13, columns: 5 },
  enemyDeath: { frameWidth: 40, frameHeight: 41, columns: 6 },
  itemFx: { frameWidth: 32, frameHeight: 32, columns: 5 },
} as const;

/** Foxy hitbox from actor.tsj: 11x19 at offset (11,13). */
export const FOXY_BODY = { width: 11, height: 19, offsetX: 11, offsetY: 13 };
export const MAX_HP = 3;

export type HudState = {
  hp: number;
  maxHp: number;
  gems: number;
  gemTotal: number;
  fruits: number;
  status: 'play' | 'dead' | 'win';
};
