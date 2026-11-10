"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { UI_COPY } from "@/lib/i18n-ui";
import type { LocaleCode, WorkspaceTab } from "@/types/platform";

interface CommandPaletteModalProps {
  open: boolean;
  locale: LocaleCode;
  onClose: () => void;
  onSelectTab: (tab: WorkspaceTab) => void;
  onSelectOfficialSite: () => void;
  onSwitchLocale: (locale: LocaleCode) => void;
  onToggleDark: () => void;
  onDownloadStandalone: () => void;
  onOpenCashier: (mode?: "c_end" | "b_end" | "redeem") => void;
}

interface CommandItem {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPaletteModal({
  open,
  locale,
  onClose,
  onSelectTab,
  onSelectOfficialSite,
  onSwitchLocale,
  onToggleDark,
  onDownloadStandalone,
  onOpenCashier,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const t = UI_COPY[locale];

  const officialSiteLabel = {
    zh: "返回官网首页",
    en: "Official flagship homepage",
    ja: "公式サイトトップ",
    es: "Sitio oficial principal",
  }[locale];

  const overviewLabel = {
    zh: "真题精改台",
    en: "Exam grading desk",
    ja: "答案添削デスク",
    es: "Mesa de corrección",
  }[locale];

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-official",
        group: t.cmdk.groupNavigate,
        label: officialSiteLabel,
        hint: "0",
        run: () => onSelectOfficialSite(),
      },
      {
        id: "nav-overview",
        group: t.cmdk.groupNavigate,
        label: overviewLabel,
        hint: "1",
        run: () => onSelectTab("overview"),
      },
      {
        id: "nav-workbench",
        group: t.cmdk.groupNavigate,
        label: t.rail.workbench,
        hint: "2",
        run: () => onSelectTab("workbench"),
      },
      {
        id: "nav-seminar",
        group: t.cmdk.groupNavigate,
        label: t.rail.seminar,
        hint: "3",
        run: () => onSelectTab("seminar"),
      },
      {
        id: "nav-cohort",
        group: t.cmdk.groupNavigate,
        label: t.rail.cohort,
        hint: "4",
        run: () => onSelectTab("cohort"),
      },
      {
        id: "nav-talent",
        group: t.cmdk.groupNavigate,
        label: t.rail.talent,
        hint: "5",
        run: () => onSelectTab("talent"),
      },
      {
        id: "nav-enterprise",
        group: t.cmdk.groupNavigate,
        label: t.rail.enterprise,
        hint: "6",
        run: () => onSelectTab("enterprise"),
      },
      {
        id: "loc-zh",
        group: t.cmdk.groupMarket,
        label: "中文 · CNY (¥)",
        hint: "ZH",
        run: () => onSwitchLocale("zh"),
      },
      {
        id: "loc-en",
        group: t.cmdk.groupMarket,
        label: "English · USD ($)",
        hint: "EN",
        run: () => onSwitchLocale("en"),
      },
      {
        id: "loc-ja",
        group: t.cmdk.groupMarket,
        label: "日本語 · JPY (¥)",
        hint: "JA",
        run: () => onSwitchLocale("ja"),
      },
      {
        id: "loc-es",
        group: t.cmdk.groupMarket,
        label: "Español · EUR (€)",
        hint: "ES",
        run: () => onSwitchLocale("es"),
      },
      {
        id: "sys-theme",
        group: t.cmdk.groupSystem,
        label: t.cmdk.toggleTheme,
        hint: "D",
        run: () => onToggleDark(),
      },
      {
        id: "sys-export",
        group: t.cmdk.groupSystem,
        label: t.cmdk.exportOffline,
        hint: ".html",
        run: () => onDownloadStandalone(),
      },
      {
        id: "sys-license",
        group: t.cmdk.groupSystem,
        label: t.cmdk.verifyLicense,
        hint: "Key",
        run: () => onOpenCashier("redeem"),
      },
    ],
    [
      officialSiteLabel,
      overviewLabel,
      t,
      onSelectOfficialSite,
      onSelectTab,
      onSwitchLocale,
      onToggleDark,
      onDownloadStandalone,
      onOpenCashier,
    ]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  const clampedIndex =
    filtered.length > 0 ? Math.min(activeIndex, filtered.length - 1) : 0;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length > 0 ? (prev + 1) % filtered.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length > 0
            ? (prev - 1 + filtered.length) % filtered.length
            : 0
        );
      } else if (e.key === "Enter" && filtered[clampedIndex]) {
        e.preventDefault();
        filtered[clampedIndex].run();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, clampedIndex, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover p-2 surface-elevated"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
          <MagnifyingGlass
            className="h-4 w-4 shrink-0 text-muted-foreground"
            weight="bold"
          />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={t.cmdk.placeholder}
            className="w-full bg-transparent body-6 text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="rounded-md border border-border bg-card px-2 py-0.5 font-mono caption-4 text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto pt-1">
          {filtered.map((item, idx) => {
            const active = idx === clampedIndex;
            const prevGroup = idx > 0 ? filtered[idx - 1].group : null;
            return (
              <div key={item.id}>
                {item.group !== prevGroup && (
                  <div className="px-3 pt-2.5 pb-1 caption-3 text-muted-foreground">
                    {item.group}
                  </div>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left body-5 transition-colors duration-200 motion-decel ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/90 hover:bg-card"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono caption-4 text-muted-foreground">
                    {item.hint}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
