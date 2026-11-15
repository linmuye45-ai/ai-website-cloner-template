import type { RunStats, SaveData } from "./types";

const KEY = "duskfall-survivors-save-v1";

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  totalCoins: 0,
  totalRuns: 0,
  totalKills: 0,
  owned: ["aldric", "vesna"],
  seenEnemies: [],
  achievements: [],
  best: {},
  settings: { sfx: 0.8, music: 0.55 },
};

export function loadSave(): SaveData {
  if (typeof window === "undefined") return { ...DEFAULT_SAVE };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings ?? {}) },
      best: parsed.best ?? {},
      owned: parsed.owned?.length ? parsed.owned : DEFAULT_SAVE.owned,
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function persistSave(data: SaveData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — run still works, just not persisted
  }
}

export function defaultSave(): SaveData {
  return { ...DEFAULT_SAVE };
}

export interface RunResult {
  save: SaveData;
  newAchievements: string[];
}

// Applies a finished run to the save and evaluates achievements.
export function commitRun(prev: SaveData, stats: RunStats): RunResult {
  const save: SaveData = {
    ...prev,
    best: { ...prev.best },
    owned: [...prev.owned],
    seenEnemies: [...prev.seenEnemies],
    achievements: [...prev.achievements],
  };

  save.coins += stats.coins;
  save.totalCoins += stats.coins;
  save.totalRuns += 1;
  save.totalKills += stats.kills;

  const prior = save.best[stats.stageId];
  if (!prior || stats.time > prior.time || (stats.victory && !prior.victory)) {
    save.best[stats.stageId] = {
      time: Math.max(stats.time, prior?.time ?? 0),
      kills: Math.max(stats.kills, prior?.kills ?? 0),
      level: Math.max(stats.level, prior?.level ?? 0),
      victory: prior?.victory || stats.victory,
    };
  }

  const grant = (id: string, cond: boolean): void => {
    if (cond && !save.achievements.includes(id)) save.achievements.push(id);
  };
  grant("first_blood", stats.kills >= 1);
  grant("kill_100", stats.kills >= 100);
  grant("kill_500", stats.kills >= 500);
  grant("survive_5", stats.time >= 300);
  grant("survive_10", stats.time >= 600);
  grant("win_one", stats.victory);
  grant("level_20", stats.level >= 20);
  grant("max_weapon", false); // evaluated live by engine
  grant("rich_1000", save.totalCoins >= 1000);
  grant("bestiary_half", save.seenEnemies.length >= 8);

  const newAchievements = save.achievements.filter((a) => !prev.achievements.includes(a));
  persistSave(save);
  return { save, newAchievements };
}
