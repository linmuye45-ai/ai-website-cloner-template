import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";
import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { zh } from "./dictionaries/zh";
import { ja } from "./dictionaries/ja";
import { es } from "./dictionaries/es";

const DICTIONARIES: Record<Locale, Dictionary> = { en, zh, ja, es };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

// {name}-style interpolation, e.g. interpolate("{name} enrages", { name: "Reaper" })
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export type { Dictionary };
