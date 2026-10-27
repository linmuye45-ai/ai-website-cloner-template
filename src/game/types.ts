// Core type definitions for Duskfall Survivors

export type ScreenId =
  | "title"
  | "select"
  | "howto"
  | "collection"
  | "game";

export interface PlayerStats {
  maxHp: number;
  speed: number; // px / second
  armor: number; // flat damage reduction
  might: number; // damage multiplier (1 = +0%)
  cooldown: number; // cooldown multiplier (1 = normal)
  area: number; // area / size multiplier
  magnet: number; // pickup radius in px
  regen: number; // hp per second
  growth: number; // xp gain multiplier
  luck: number; // upgrade choice bonus (0..1+)
}

export type WeaponBehavior =
  | "bolt"
  | "whip"
  | "axe"
  | "dagger"
  | "aura"
  | "orbital"
  | "lightning"
  | "nova";

export interface WeaponLevelStat {
  damage: number;
  count: number;
  cooldown: number; // seconds
  speed?: number;
  area?: number;
  duration?: number;
  pierce?: number;
}

export interface WeaponDef {
  id: string;
  name: string;
  icon: string; // sprite key
  behavior: WeaponBehavior;
  desc: string;
  maxLevel: number;
  color: string;
  levels: WeaponLevelStat[];
}

export type PassiveStat =
  | "might"
  | "cooldown"
  | "area"
  | "speed"
  | "maxHp"
  | "magnet"
  | "regen"
  | "armor"
  | "growth"
  | "luck";

export interface PassiveDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  stat: PassiveStat;
  perLevel: number;
  maxLevel: number;
  additive?: boolean; // true = add raw value, false = multiplicative stack
}

export interface CharacterDef {
  id: string;
  name: string;
  title: string;
  desc: string;
  sprite: string;
  accent: string;
  cost: number; // coins, 0 = free
  stats: PlayerStats;
  weapon: string;
  unlockHint: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  sprite: string;
  hp: number;
  speed: number;
  damage: number;
  xp: number;
  radius: number;
  coin: number;
  minMinute: number;
  weight: number;
  boss?: boolean;
  elite?: boolean;
  tint?: Record<string, string>;
  behavior?: "chaser" | "ranged" | "charger" | "exploder" | "splitter";
  castInterval?: number;
  fuseRadius?: number;
}

export interface StageSpawn {
  enemy: string;
  weight: number;
}

export interface StageDef {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  duration: number; // seconds to victory
  hpScale: number;
  dmgScale: number;
  ground: {
    base: string;
    speckle: string[];
    tile: number;
  };
  fog: string;
  dark: string; // "r,g,b" triplet used by the night lighting overlay
  weather: "fog" | "spores" | "embers";
  props: string[];
  spawns: StageSpawn[];
  bosses: { at: number; enemy: string }[];
  accent: string;
}

export interface UpgradeChoice {
  kind: "weapon" | "passive";
  id: string;
  level: number; // resulting level (1 for new)
  maxLevel: number;
  name: string;
  desc: string;
  icon: string;
  color: string;
  isNew: boolean;
}

export interface RunStats {
  time: number;
  kills: number;
  level: number;
  coins: number;
  damageTaken: number;
  gems: number;
  victory: boolean;
  stageId: string;
  characterId: string;
  weapons: string[];
}

export interface HudState {
  hp: number;
  maxHp: number;
  xpPct: number;
  level: number;
  time: number;
  kills: number;
  coins: number;
  bossHp: number | null;
  bossName: string | null;
  weapons: { id: string; level: number; icon: string }[];
  passives: { id: string; level: number; icon: string }[];
  paused: boolean;
  rerolls: number;
}

export interface SaveData {
  coins: number;
  totalCoins: number;
  totalRuns: number;
  totalKills: number;
  owned: string[];
  seenEnemies: string[];
  achievements: string[];
  best: Record<
    string,
    { time: number; kills: number; level: number; victory: boolean }
  >;
  settings: { sfx: number; music: number };
}

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
}
