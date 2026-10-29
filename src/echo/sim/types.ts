import type { ElementId } from './elements';

export type RunStatus = 'title' | 'playing' | 'levelup' | 'dead' | 'win';

export type EnemyKind =
  | 'crawler'
  | 'dasher'
  | 'splitter'
  | 'shard'
  | 'spitter'
  | 'brute'
  | 'boss';

export interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  r: number;
  speed: number;
  dmg: number;
  xp: number;
  kind: EnemyKind;
  alive: boolean;
  /** Hit flash timer (render only). */
  flash: number;
  burnT: number;
  burnDps: number;
  slowT: number;
  freezeT: number;
  rootT: number;
  /** Per-enemy echo damage throttle. */
  hitCd: number;
  shootT: number;
  minionT: number;
  phase: number;
  boss: boolean;
}

export interface Echo {
  id: number;
  element: ElementId;
  /** Flat [x0,y0,x1,y1,...] snapshot of the recorded path. */
  path: Float32Array;
  n: number;
  /** Playback progress 0..1 while replaying; 1 once lingering. */
  progress: number;
  x: number;
  y: number;
  /** Birth position, handy for fades. */
  x0: number;
  y0: number;
  /** Seconds spent replaying. */
  t: number;
  /** Seconds the path replay takes (1:1 with the player's original speed). */
  replayDur: number;
  linger: number;
  alive: boolean;
  /** Volt chain throttle. */
  chainCd: number;
  /** Last travel direction, for threads stamped while lingering. */
  lastDir: number;
  radius: number;
  damage: number;
  born: number;
}

/** One stamped cell of thread — the net that damages enemies. */
export interface WebMark {
  x: number;
  y: number;
  element: ElementId;
  /** Timestamp of the last stamp. */
  t: number;
  dmg: number;
  /** Direction of travel when stamped (radians) — used for crossing tests. */
  dir: number;
  /** Earliest time this cell may detonate again. */
  resUntil: number;
}

export type BurstKind = 'steam' | 'plasma' | 'superconduct' | 'singularity' | 'crystal' | 'annihilate';

export interface Burst {
  x: number;
  y: number;
  r0: number;
  r1: number;
  t: number;
  dur: number;
  color: number;
  kind: BurstKind;
  angle: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  drag: number;
}

export type FieldKind = 'pull' | 'crystal';

export interface Field {
  x: number;
  y: number;
  r: number;
  t: number;
  dur: number;
  kind: FieldKind;
  color: number;
  power: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  dmg: number;
  life: number;
  color: number;
}

export interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: number;
  t: number;
  life: number;
}

export type SimEventType =
  | 'echo'
  | 'resonance'
  | 'levelup'
  | 'hurt'
  | 'kill'
  | 'boss'
  | 'win'
  | 'dead'
  | 'pickup';

export interface SimEvent {
  type: SimEventType;
  x?: number;
  y?: number;
  /** Resonance flavour, for distinct audio/visual handling. */
  kind?: BurstKind;
  value?: number;
}

export interface RunSummary {
  survived: number;
  kills: number;
  resonances: number;
  weave: number;
  level: number;
  win: boolean;
}

export interface InputState {
  x: number;
  y: number;
}
