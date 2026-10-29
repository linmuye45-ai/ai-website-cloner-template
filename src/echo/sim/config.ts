/**
 * All tuning lives here so balance passes never touch game logic.
 * Units: pixels, seconds.
 */

export const WORLD = { w: 3000, h: 2000 } as const;
export const VIEW = { w: 1280, h: 720 } as const;

/** Survive this long and the final boss awakens; kill it to win. */
export const RUN_DURATION = 360;
/** Boss waves (seconds). Last entry spawns the final boss. */
export const BOSS_TIMES = [60, 140, 240, 330] as const;

export const PLAYER = {
  speed: 210,
  maxHp: 100,
  radius: 13,
  /** Breathing room after a hit so swarms cannot chain-stun you. */
  invuln: 0.75,
  magnet: 104,
  regen: 0,
} as const;

export const ECHO = {
  /** Seconds between echo births (lowered by upgrades). */
  interval: 1.5,
  intervalMin: 0.55,
  /** How much of your past each echo copies. */
  window: 5,
  /** Extra seconds an echo keeps damaging after finishing its path. */
  linger: 0.8,
  radius: 26,
  damage: 6,
  recordHz: 30,
  /** Per-enemy damage throttle so stacked echoes do not melt bosses instantly. */
  hitCd: 0.12,
  /** Playback runs slower than real time, which spreads echoes along the path. */
  stretch: 1.5,
  maxEchoes: 16,
} as const;

/**
 * The web. Echoes stamp grid cells as they travel; enemies walking into a
 * stamped cell get cut, and a cell stamped by a second element detonates.
 * This is what turns your movement trail into a weapon.
 */
export const WEB = {
  cell: 36,
  /** Seconds a stamped cell stays dangerous. */
  threadLife: 5.5,
} as const;

export const RESONANCE = {
  radius: 90,
  /** Per-echo cooldown so a crossing pair cannot loop-detonate. */
  cooldown: 0.55,
  burstDamage: 26,
} as const;

export const XP = { base: 5, growth: 4.2 } as const;

export const LIMITS = {
  enemies: 260,
  particles: 700,
  fields: 24,
  projectiles: 90,
} as const;

/** Difficulty curve: how many enemies the director wants alive. */
export function targetEnemyCount(time: number): number {
  return Math.floor(16 + time * 0.62);
}

/** Seconds between spawn pulses; tightens over the run. */
export function spawnInterval(time: number): number {
  return Math.max(0.16, 0.72 - time * 0.0011);
}
