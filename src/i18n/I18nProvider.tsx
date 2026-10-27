"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_HTML,
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  LOCALES,
  detectLocale,
  isLocale,
  type Locale,
} from "./config";
import { getDictionary, interpolate, type Dictionary } from ".";
import { setGameLocale } from "@/game/i18n";
import { ACHIEVEMENTS, CHARACTERS, ENEMIES, PASSIVES, STAGES, WEAPONS } from "@/game/content";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  dict: Dictionary;
  weaponName: (id: string) => string;
  weaponDesc: (id: string) => string;
  passiveName: (id: string) => string;
  passiveDesc: (id: string) => string;
  characterName: (id: string) => string;
  characterTitle: (id: string) => string;
  characterDesc: (id: string) => string;
  characterUnlock: (id: string) => string;
  enemyName: (id: string) => string;
  stageName: (id: string) => string;
  stageSubtitle: (id: string) => string;
  stageDesc: (id: string) => string;
  achievementName: (id: string) => string;
  achievementDesc: (id: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readPath(dict: Dictionary, path: string): unknown {
  let cur: unknown = dict;
  for (const key of path.split(".")) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window === "undefined" ? DEFAULT_LOCALE : detectLocale(),
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setGameLocale(next);
    if (typeof document !== "undefined") document.documentElement.lang = LOCALE_HTML[next];
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // storage unavailable — language still applies for this session
    }
  }, []);

  // Sync the engine and document language on first mount and every change.
  useEffect(() => {
    setGameLocale(locale);
    document.documentElement.lang = LOCALE_HTML[locale];
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = getDictionary(locale);

    const t = (path: string, vars?: Record<string, string | number>): string => {
      const found = readPath(dict, path);
      if (typeof found === "string") return interpolate(found, vars);
      return path;
    };

    return {
      locale,
      setLocale,
      t,
      dict,
      weaponName: (id) => dict.content.weapon[id]?.name ?? WEAPONS[id]?.name ?? id,
      weaponDesc: (id) => dict.content.weapon[id]?.desc ?? WEAPONS[id]?.desc ?? id,
      passiveName: (id) => dict.content.passive[id]?.name ?? PASSIVES[id]?.name ?? id,
      passiveDesc: (id) => dict.content.passive[id]?.desc ?? PASSIVES[id]?.desc ?? id,
      characterName: (id) => dict.content.character[id]?.name ?? CHARACTERS.find((c) => c.id === id)?.name ?? id,
      characterTitle: (id) => dict.content.character[id]?.title ?? CHARACTERS.find((c) => c.id === id)?.title ?? id,
      characterDesc: (id) => dict.content.character[id]?.desc ?? CHARACTERS.find((c) => c.id === id)?.desc ?? id,
      characterUnlock: (id) => dict.content.character[id]?.unlock ?? CHARACTERS.find((c) => c.id === id)?.unlockHint ?? "",
      enemyName: (id) => dict.content.enemy[id] ?? ENEMIES[id]?.name ?? id,
      stageName: (id) => dict.content.stage[id]?.name ?? STAGES.find((s) => s.id === id)?.name ?? id,
      stageSubtitle: (id) => dict.content.stage[id]?.subtitle ?? STAGES.find((s) => s.id === id)?.subtitle ?? id,
      stageDesc: (id) => dict.content.stage[id]?.desc ?? STAGES.find((s) => s.id === id)?.desc ?? id,
      achievementName: (id) =>
        dict.content.achievement[id]?.name ?? ACHIEVEMENTS.find((a) => a.id === id)?.name ?? id,
      achievementDesc: (id) =>
        dict.content.achievement[id]?.desc ?? ACHIEVEMENTS.find((a) => a.id === id)?.desc ?? id,
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

// Compact language switcher for in-game menus. The marketing site uses the
// same component inside its client island.
export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  return (
    <label className="flex items-center gap-1.5">
      {!compact && <span className="font-pixel text-[9px] tracking-widest text-slate-500">LANG</span>}
      <select
        value={locale}
        onChange={(e) => isLocale(e.target.value) && setLocale(e.target.value)}
        className="hud-chip pixel-corners cursor-pointer border border-white/15 bg-black/50 px-2 py-1 font-pixel text-[10px] text-slate-200 outline-none [&>option]:bg-[#141b24]"
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
