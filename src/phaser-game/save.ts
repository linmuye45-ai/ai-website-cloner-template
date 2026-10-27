/**
 * localStorage save profile for Sunny Land: level unlocks, best stats and
 * audio settings. All access is guarded so private-mode failures degrade
 * silently to in-memory defaults.
 */

export type LevelMeta = {
  key: string;
  title: string;
  subtitle: string;
  musicKey: 'music' | 'music2';
};

export const LEVELS: LevelMeta[] = [
  { key: 'level1', title: '林间小径', subtitle: 'Sunny Land · 关卡 1', musicKey: 'music' },
  { key: 'level2', title: '暮色高台', subtitle: 'Sunny Land · 关卡 2', musicKey: 'music' },
  { key: 'level3', title: '遗迹混编', subtitle: 'Remix · 关卡 3', musicKey: 'music2' },
];

export type BestStats = { gems: number; total: number; fruits: number };
export type SaveData = {
  unlocked: number;
  best: Record<string, BestStats>;
  settings: { muted: boolean; volume: number };
};

const STORAGE_KEY = 'sunnyland-save-v1';
const DEFAULTS: SaveData = {
  unlocked: 1,
  best: {},
  settings: { muted: false, volume: 1 },
};

export function loadSave(): SaveData {
  if (typeof window === 'undefined') return structuredClone(DEFAULTS);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      unlocked: Math.min(Math.max(parsed.unlocked ?? 1, 1), LEVELS.length),
      best: parsed.best ?? {},
      settings: { ...DEFAULTS.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function persistSave(data: SaveData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — play session still works */
  }
}

/** Records a clear: unlocks the next stage and keeps the best gem haul. */
export function recordClear(
  data: SaveData,
  index: number,
  stats: Omit<BestStats, 'total'> & { total: number },
): SaveData {
  const key = LEVELS[index].key;
  const prev = data.best[key];
  const next: SaveData = {
    ...data,
    unlocked: Math.max(data.unlocked, Math.min(index + 2, LEVELS.length)),
    best: {
      ...data.best,
      [key]: {
        gems: Math.max(prev?.gems ?? 0, stats.gems),
        total: stats.total,
        fruits: Math.max(prev?.fruits ?? 0, stats.fruits),
      },
    },
  };
  persistSave(next);
  return next;
}

export function saveSettings(
  data: SaveData,
  settings: SaveData['settings'],
): SaveData {
  const next = { ...data, settings };
  persistSave(next);
  return next;
}
