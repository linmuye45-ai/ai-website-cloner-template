// Locale configuration shared by server pages, client components and the engine.
export const LOCALES = ["en", "zh", "ja", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  ja: "日本語",
  es: "Español",
};

// BCP-47 tags used for <html lang>, hreflang and Open Graph locale tags.
export const LOCALE_HTML: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
  ja: "ja",
  es: "es",
};

export const LOCALE_OG: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  es: "es_ES",
};

export const LOCALE_STORAGE_KEY = "duskfall-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// First-visit detection: saved preference first, then browser language,
// falling back to English. Runs client-side only.
export function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // storage may be unavailable (private mode) — fall through
  }
  const langs = window.navigator.languages ?? [window.navigator.language];
  for (const raw of langs) {
    const lang = raw.toLowerCase();
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
