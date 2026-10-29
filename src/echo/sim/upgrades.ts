import { ECHO, PLAYER, RESONANCE } from './config';
import { ELEMENT_ORDER, type ElementId } from './elements';
import { shuffled, type Rng } from './math';

export type UpgradeId =
  | 'echoRate'
  | 'memory'
  | 'linger'
  | 'echoPower'
  | 'echoRadius'
  | 'resonance'
  | 'resonanceRadius'
  | 'speed'
  | 'magnet'
  | 'maxHp'
  | 'regen'
  | 'elFrost'
  | 'elVolt'
  | 'elVoid';

export type UpgradeKind = 'echo' | 'resonance' | 'body' | 'element';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  cn: string;
  kind: UpgradeKind;
  max: number;
  /** Card body for the *next* level of this upgrade. */
  describe: (nextLevel: number) => string;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'echoRate',
    name: 'ECHO RATE',
    cn: '回声频率',
    kind: 'echo',
    max: 6,
    describe: (lv) => `回声生成间隔 ${(ECHO.interval - 0.16 * lv).toFixed(2)}s`,
  },
  {
    id: 'memory',
    name: 'MEMORY DEPTH',
    cn: '记忆深度',
    kind: 'echo',
    max: 6,
    describe: (lv) => `回声复制您过去 ${(ECHO.window + 1.1 * lv).toFixed(1)}s 的轨迹`,
  },
  {
    id: 'linger',
    name: 'AFTERGLOW',
    cn: '余韵',
    kind: 'echo',
    max: 5,
    describe: (lv) => `回声抵达后额外滞留 ${(ECHO.linger + 0.9 * lv).toFixed(1)}s`,
  },
  {
    id: 'echoPower',
    name: 'ECHO POWER',
    cn: '回声强度',
    kind: 'echo',
    max: 6,
    describe: (lv) => `回声单次斩击伤害 ${(ECHO.damage * (1 + 0.32 * lv)).toFixed(1)}`,
  },
  {
    id: 'echoRadius',
    name: 'ECHO RADIUS',
    cn: '回声半径',
    kind: 'echo',
    max: 5,
    describe: (lv) => `回声判定半径 ${(ECHO.radius + 5 * lv).toFixed(0)}px`,
  },
  {
    id: 'resonance',
    name: 'RESONANCE',
    cn: '共振强度',
    kind: 'resonance',
    max: 6,
    describe: (lv) => `共振爆炸伤害 ×${(1 + 0.45 * lv).toFixed(2)}`,
  },
  {
    id: 'resonanceRadius',
    name: 'RESONANCE FIELD',
    cn: '共振范围',
    kind: 'resonance',
    max: 4,
    describe: (lv) => `共振触发与爆炸范围 ${(RESONANCE.radius + 18 * lv).toFixed(0)}px`,
  },
  {
    id: 'speed',
    name: 'SWIFTNESS',
    cn: '疾行',
    kind: 'body',
    max: 4,
    describe: (lv) => `移动速度 ${PLAYER.speed + 15 * lv}`,
  },
  {
    id: 'magnet',
    name: 'MAGNET',
    cn: '磁吸',
    kind: 'body',
    max: 3,
    describe: (lv) => `经验拾取范围 ${PLAYER.magnet + 34 * lv}px`,
  },
  {
    id: 'maxHp',
    name: 'VITALITY',
    cn: '体魄',
    kind: 'body',
    max: 4,
    describe: (lv) => `最大生命 ${PLAYER.maxHp + 25 * lv}，立即回复 25`,
  },
  {
    id: 'regen',
    name: 'REGENERATION',
    cn: '再生',
    kind: 'body',
    max: 3,
    describe: (lv) => `每秒回复 ${(0.9 * lv).toFixed(1)} 生命`,
  },
  {
    id: 'elFrost',
    name: 'FROST CORE',
    cn: '霜之核',
    kind: 'element',
    max: 1,
    describe: () => '解锁霜元素回声：减速敌人，可与焰/雷/虚共振',
  },
  {
    id: 'elVolt',
    name: 'VOLT CORE',
    cn: '雷之核',
    kind: 'element',
    max: 1,
    describe: () => '解锁雷元素回声：电弧连锁，可与焰/霜/虚共振',
  },
  {
    id: 'elVoid',
    name: 'VOID CORE',
    cn: '虚之核',
    kind: 'element',
    max: 1,
    describe: () => '解锁虚元素回声：牵引敌人，可与任何元素共振',
  },
];

export const UPGRADE_BY_ID: Record<UpgradeId, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
) as Record<UpgradeId, UpgradeDef>;

export type UpgradeLevels = Record<UpgradeId, number>;

export function emptyLevels(): UpgradeLevels {
  return {
    echoRate: 0,
    memory: 0,
    linger: 0,
    echoPower: 0,
    echoRadius: 0,
    resonance: 0,
    resonanceRadius: 0,
    speed: 0,
    magnet: 0,
    maxHp: 0,
    regen: 0,
    elFrost: 0,
    elVolt: 0,
    elVoid: 0,
  };
}

export interface DerivedStats {
  echoInterval: number;
  echoWindow: number;
  echoLinger: number;
  echoDamage: number;
  echoRadius: number;
  resonancePower: number;
  resonanceRadius: number;
  speed: number;
  magnet: number;
  maxHp: number;
  regen: number;
  elements: ElementId[];
}

export function computeStats(levels: UpgradeLevels): DerivedStats {
  const owned = new Set<ElementId>(['fire']);
  if (levels.elFrost > 0) owned.add('frost');
  if (levels.elVolt > 0) owned.add('volt');
  if (levels.elVoid > 0) owned.add('void');
  return {
    echoInterval: Math.max(ECHO.intervalMin, ECHO.interval - 0.16 * levels.echoRate),
    echoWindow: ECHO.window + 1.1 * levels.memory,
    echoLinger: ECHO.linger + 0.9 * levels.linger,
    echoDamage: ECHO.damage * (1 + 0.32 * levels.echoPower),
    echoRadius: ECHO.radius + 5 * levels.echoRadius,
    resonancePower: 1 + 0.45 * levels.resonance,
    resonanceRadius: RESONANCE.radius + 18 * levels.resonanceRadius,
    speed: PLAYER.speed + 15 * levels.speed,
    magnet: PLAYER.magnet + 34 * levels.magnet,
    maxHp: PLAYER.maxHp + 25 * levels.maxHp,
    regen: 0.9 * levels.regen,
    elements: ELEMENT_ORDER.filter((e) => owned.has(e)),
  };
}

/** Picks `count` distinct offers, favouring new elements while the web is thin. */
export function rollUpgrades(rng: Rng, levels: UpgradeLevels, count = 3): UpgradeId[] {
  const available = UPGRADES.filter((u) => levels[u.id] < u.max);
  const ownedCount = 1 + (levels.elFrost ? 1 : 0) + (levels.elVolt ? 1 : 0) + (levels.elVoid ? 1 : 0);
  const weighted: UpgradeId[] = [];
  for (const u of available) {
    let weight = 3;
    if (u.kind === 'element') weight = ownedCount < 3 ? 5 : 2;
    if (u.kind === 'body') weight = 2;
    for (let i = 0; i < weight; i += 1) weighted.push(u.id);
  }
  const picked: UpgradeId[] = [];
  const pool = shuffled(rng, weighted);
  for (const id of pool) {
    if (picked.length >= count) break;
    if (!picked.includes(id)) picked.push(id);
  }
  // Fallback for a fully maxed build (extremely late runs).
  if (picked.length < count) {
    for (const u of shuffled(rng, UPGRADES)) {
      if (picked.length >= count) break;
      if (!picked.includes(u.id)) picked.push(u.id);
    }
  }
  return picked;
}

export function xpForLevel(level: number): number {
  return Math.round(5 + 4.2 * Math.pow(level, 1.15));
}
