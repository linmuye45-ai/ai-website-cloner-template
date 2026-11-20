"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { Locale, SovereignNodeId } from "@/types/zhongjing";
import { UI_DICTIONARY, type UiDictionary } from "@/lib/ui-dictionary";

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: UiDictionary;
  sovereignNode: SovereignNodeId;
  setSovereignNode: (node: SovereignNodeId) => void;
  demoOpen: boolean;
  demoPresetContext: string;
  openDemoModal: (contextLabel?: string) => void;
  closeDemoModal: () => void;
  safetyOpen: boolean;
  openSafetyModal: () => void;
  closeSafetyModal: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const LOCALE_EVENT = "zj-locale-change";

function subscribeLocale(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(LOCALE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCALE_EVENT, callback);
  };
}

function getClientLocaleSnapshot(): Locale {
  try {
    const saved = window.localStorage.getItem("zj_locale");
    if (
      saved === "zh-CN" ||
      saved === "zh-TW" ||
      saved === "en" ||
      saved === "ja"
    ) {
      return saved;
    }
  } catch {
    // Ignore storage read restrictions
  }
  return "zh-CN";
}

function getServerLocaleSnapshot(): Locale {
  return "zh-CN";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getClientLocaleSnapshot,
    getServerLocaleSnapshot
  );
  const [sovereignNode, setSovereignNode] = useState<SovereignNodeId>("CN-BJ");
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoPresetContext, setDemoPresetContext] = useState("");
  const [safetyOpen, setSafetyOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem("zj_locale", next);
      window.dispatchEvent(new Event(LOCALE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const openDemoModal = useCallback((contextLabel?: string) => {
    setDemoPresetContext(contextLabel ?? "");
    setDemoOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setDemoOpen(false);
  }, []);

  const openSafetyModal = useCallback(() => {
    setSafetyOpen(true);
  }, []);

  const closeSafetyModal = useCallback(() => {
    setSafetyOpen(false);
  }, []);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: UI_DICTIONARY[locale],
    sovereignNode,
    setSovereignNode,
    demoOpen,
    demoPresetContext,
    openDemoModal,
    closeDemoModal,
    safetyOpen,
    openSafetyModal,
    closeSafetyModal,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
