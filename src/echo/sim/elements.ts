import type { BurstKind } from './types';

export type ElementId = 'fire' | 'frost' | 'volt' | 'void';

export interface ElementDef {
  id: ElementId;
  name: string;
  cn: string;
  color: number;
  css: string;
  /** Short pitch for the upgrade card. */
  tagline: string;
}

export const ELEMENTS: Record<ElementId, ElementDef> = {
  fire: {
    id: 'fire',
    name: 'FIRE',
    cn: '焰',
    color: 0xff5c33,
    css: '#ff5c33',
    tagline: '灼烧：命中后持续掉血',
  },
  frost: {
    id: 'frost',
    name: 'FROST',
    cn: '霜',
    color: 0x46e0ff,
    css: '#46e0ff',
    tagline: '凝滞：命中后减速',
  },
  volt: {
    id: 'volt',
    name: 'VOLT',
    cn: '雷',
    color: 0xffe14d,
    css: '#ffe14d',
    tagline: '电弧：连锁跳跃至附近敌人',
  },
  void: {
    id: 'void',
    name: 'VOID',
    cn: '虚',
    color: 0xc77dff,
    css: '#c77dff',
    tagline: '牵引：把敌人拉向回声',
  },
};

export const ELEMENT_ORDER: ElementId[] = ['fire', 'frost', 'volt', 'void'];

export interface ResonanceDef {
  kind: BurstKind;
  name: string;
  cn: string;
  color: number;
  /** Damage multiplier over the base burst. */
  power: number;
  detail: string;
  /** Radius multiplier over the base burst radius. */
  spread: number;
}

/**
 * Six element pairings, each with its own shape of destruction.
 * This table is the whole build-crafting surface: what you own decides
 * which detonations you can create by crossing your own trails.
 */
const PAIRS: Record<string, ResonanceDef> = {
  'fire|frost': {
    kind: 'steam',
    name: 'STEAM BURST',
    cn: '蒸汽爆',
    color: 0xfff1d6,
    power: 1.4,
    spread: 1.25,
    detail: '蒸汽冲击：大范围高额伤害并击退',
  },
  'fire|volt': {
    kind: 'plasma',
    name: 'PLASMA CHAIN',
    cn: '等离子链',
    color: 0xffc94d,
    power: 1.15,
    spread: 1,
    detail: '电弧跳跃：连锁命中远处 6 个敌人',
  },
  'fire|void': {
    kind: 'singularity',
    name: 'SINGULARITY',
    cn: '奇点',
    color: 0xff8ae0,
    power: 1.3,
    spread: 1.1,
    detail: '塌缩：把敌人吸入后引爆',
  },
  'frost|volt': {
    kind: 'superconduct',
    name: 'SUPERCONDUCT',
    cn: '超导',
    color: 0xa8f0ff,
    power: 0.9,
    spread: 1.35,
    detail: '绝对零度：全场冻结后碎裂',
  },
  'frost|void': {
    kind: 'crystal',
    name: 'CRYSTAL CAGE',
    cn: '晶牢',
    color: 0x8ee7ff,
    power: 1,
    spread: 1.15,
    detail: '结晶：定身并持续割伤范围内敌人',
  },
  'void|volt': {
    kind: 'annihilate',
    name: 'ANNIHILATE',
    cn: '湮灭',
    color: 0xdfff7a,
    power: 1.6,
    spread: 1,
    detail: '湮灭光束：沿两回声连线贯穿',
  },
};

export function pairKey(a: ElementId, b: ElementId): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function resonanceFor(a: ElementId, b: ElementId): ResonanceDef {
  const def = PAIRS[pairKey(a, b)];
  if (!def) throw new Error(`no resonance defined for ${pairKey(a, b)}`);
  return def;
}

export const RESONANCE_LIST: ResonanceDef[] = Object.values(PAIRS);
