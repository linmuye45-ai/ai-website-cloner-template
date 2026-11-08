"use client";

import React, { useState } from "react";
import {
  Download,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import type {
  CoursePack,
  LocaleCode,
  WhiteLabelConfig,
  WorkspaceTab,
} from "@/types/platform";

interface EditorialSpineNavProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  brand: WhiteLabelConfig;
  onSwitchLocale: (locale: LocaleCode) => void;
  courses: CoursePack[];
  selectedCourse: CoursePack;
  onSelectCourseId: (courseId: string) => void;
  proofCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  activeLicenseBadge: string | null;
  onOpenCommandPalette: () => void;
  onOpenCashier: (mode: "c_end" | "b_end" | "redeem") => void;
  onDownloadStandalone: () => void;
}

const SPINE_COPY: Record<
  LocaleCode,
  {
    brandMain: string;
    groupLearn: string;
    groupOrg: string;
    room01: string;
    room02: string;
    room03: string;
    room04: string;
    room05: string;
    courseLabel: string;
    checkProgress: string;
    openPlan: string;
    unlockedPrefix: string;
    cmdk: string;
    exportHtml: string;
  }
> = {
  zh: {
    brandMain: "知微 DeepScholar",
    groupLearn: "备考与批改",
    groupOrg: "机构与结算网络",
    room01: "真题精改台",
    room02: "一对一推导室",
    room03: "双人圆桌电台",
    room04: "学校督学与白标",
    room05: "人才库与八年账本",
    courseLabel: "当前科目",
    checkProgress: "闭卷达标记录",
    openPlan: "开通学习卡 · ¥68 起",
    unlockedPrefix: "已开通 · ",
    cmdk: "快捷跳转",
    exportHtml: "导出离线 .html",
  },
  en: {
    brandMain: "DeepScholar",
    groupLearn: "Study & Grading",
    groupOrg: "Schools & Clearing",
    room01: "Exam Grading Desk",
    room02: "1-on-1 Practice",
    room03: "Two-Host Audio",
    room04: "School OS & OEM",
    room05: "Talent & 8-Yr Ledger",
    courseLabel: "Active Track",
    checkProgress: "Closed-Book Checks",
    openPlan: "Study Pass · From $19",
    unlockedPrefix: "Active · ",
    cmdk: "Quick Jump",
    exportHtml: "Offline .html",
  },
  ja: {
    brandMain: "DeepScholar 叡智",
    groupLearn: "添削・演習",
    groupOrg: "法人・精算台帳",
    room01: "答案添削デスク",
    room02: "1対1 記述演習室",
    room03: "対話型音声ゼミ",
    room04: "塾・学校OEM管理",
    room05: "認定人材と8年収支",
    courseLabel: "選択中の科目",
    checkProgress: "白紙テスト合格数",
    openPlan: "受講パス · ¥2,480〜",
    unlockedPrefix: "有効 · ",
    cmdk: "検索",
    exportHtml: ".html 保存",
  },
  es: {
    brandMain: "DeepScholar",
    groupLearn: "Corrección y Práctica",
    groupOrg: "Centros y Liquidación",
    room01: "Mesa de Corrección",
    room02: "Práctica 1 a 1",
    room03: "Seminario Audio",
    room04: "Centros y Marca Blanca",
    room05: "Talento y Plan 8 Años",
    courseLabel: "Asignatura",
    checkProgress: "Pruebas Superadas",
    openPlan: "Pase · Desde €15",
    unlockedPrefix: "Activo · ",
    cmdk: "Buscar",
    exportHtml: "Guardar .html",
  },
};

const LOCALE_PILLS: Array<{ code: LocaleCode; short: string }> = [
  { code: "zh", short: "CN ¥" },
  { code: "en", short: "US $" },
  { code: "ja", short: "JP ¥" },
  { code: "es", short: "ES €" },
];

export function EditorialSpineNav({
  activeTab,
  onSelectTab,
  brand,
  onSwitchLocale,
  courses,
  selectedCourse,
  onSelectCourseId,
  proofCount,
  isDark,
  onToggleDark,
  activeLicenseBadge,
  onOpenCommandPalette,
  onOpenCashier,
  onDownloadStandalone,
}: EditorialSpineNavProps) {
  const locale = brand.locale;
  const t = SPINE_COPY[locale];
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDefaultBrand =
    brand.brandName.includes("DeepScholar") ||
    brand.brandName.includes("知微") ||
    brand.brandName.includes("叡智") ||
    brand.brandName.includes("Aula");

  const titleDisplay = isDefaultBrand ? t.brandMain : brand.brandName;

  const isSchoolActive = activeTab === "cohort" || activeTab === "enterprise";

  const handleNav = (tab: WorkspaceTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  const spineBody = (
    <div className="flex h-full flex-col justify-between bg-sidebar p-4 text-sidebar-foreground">
      <div className="space-y-6">
        {/* Masthead */}
        <div className="space-y-3 border-b border-sidebar-border pb-4">
          <button
            type="button"
            onClick={() => handleNav("overview")}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              {titleDisplay}
            </span>
            <span className="rounded-sm border border-sidebar-border bg-card px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              v9
            </span>
          </button>

          {/* 4-Market Switcher */}
          <div className="grid grid-cols-4 gap-1 rounded-md border border-sidebar-border bg-card/70 p-0.5">
            {LOCALE_PILLS.map((m) => (
              <button
                key={m.code}
                type="button"
                onClick={() => onSwitchLocale(m.code)}
                className={`rounded-sm py-1 font-mono text-[11px] font-medium transition-colors ${
                  m.code === locale
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.short}
              </button>
            ))}
          </div>
        </div>

        {/* Group 1: Learner Rooms */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-medium text-muted-foreground">
            {t.groupLearn}
          </div>
          {[
            { id: "overview" as const, num: "01", label: t.room01 },
            { id: "workbench" as const, num: "02", label: t.room02 },
            { id: "seminar" as const, num: "03", label: t.room03 },
          ].map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors ${
                  active
                    ? "bg-card font-semibold text-foreground shadow-2xs ring-1 ring-sidebar-border"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
                }`}
              >
                <span
                  className={`font-mono text-[11px] ${
                    active ? "text-brand font-bold" : "text-muted-foreground/70"
                  }`}
                >
                  {item.num}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Group 2: School & Clearinghouse */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-medium text-muted-foreground">
            {t.groupOrg}
          </div>
          <button
            type="button"
            onClick={() => handleNav("cohort")}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors ${
              isSchoolActive
                ? "bg-card font-semibold text-foreground shadow-2xs ring-1 ring-sidebar-border"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
            }`}
          >
            <span
              className={`font-mono text-[11px] ${
                isSchoolActive
                  ? "text-brand font-bold"
                  : "text-muted-foreground/70"
              }`}
            >
              04
            </span>
            <span className="truncate">{t.room04}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav("talent")}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors ${
              activeTab === "talent"
                ? "bg-card font-semibold text-foreground shadow-2xs ring-1 ring-sidebar-border"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2.5 truncate">
              <span
                className={`font-mono text-[11px] ${
                  activeTab === "talent"
                    ? "text-brand font-bold"
                    : "text-muted-foreground/70"
                }`}
              >
                05
              </span>
              <span className="truncate">{t.room05}</span>
            </span>
            <span className="rounded-sm bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand">
              $108B
            </span>
          </button>
        </div>

        {/* Contextual Course Selector */}
        <div className="space-y-1.5 border-t border-sidebar-border pt-4">
          <label
            htmlFor="spine-course-select"
            className="block px-1 text-[11px] font-medium text-muted-foreground"
          >
            {t.courseLabel}
          </label>
          <select
            id="spine-course-select"
            value={selectedCourse.id}
            onChange={(e) => onSelectCourseId(e.target.value)}
            className="w-full rounded-lg border border-sidebar-border bg-card px-2.5 py-2 text-xs font-medium text-foreground"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Status & Plan Dock */}
      <div className="space-y-3 border-t border-sidebar-border pt-4">
        <button
          type="button"
          onClick={() => handleNav("talent")}
          className="w-full rounded-lg border border-sidebar-border bg-card p-3 text-left hover:border-brand/40"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t.checkProgress}</span>
            <span className="font-mono font-semibold text-foreground">
              {proofCount} / 15
            </span>
          </div>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 15 }).map((_, idx) => (
              <span
                key={`mini-bar-${idx}`}
                className={`h-1.5 flex-1 rounded-xs ${
                  idx < proofCount ? "bg-brand" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCashier(isSchoolActive ? "b_end" : "c_end")}
          className={`w-full rounded-lg py-2.5 text-xs font-semibold ${
            activeLicenseBadge
              ? "border border-signal/35 bg-signal-soft text-signal"
              : "btn-lovable-dark"
          }`}
        >
          {activeLicenseBadge
            ? `${t.unlockedPrefix}${activeLicenseBadge}`
            : t.openPlan}
        </button>

        <div className="flex items-center justify-between pt-0.5 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span>⌘K</span>
          </button>

          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-foreground"
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onDownloadStandalone}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            <span>.html</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Spine */}
      <aside className="no-print hidden w-60 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-dvh overflow-y-auto">{spineBody}</div>
      </aside>

      {/* Mobile Sticky Top Bar */}
      <div className="no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => handleNav("overview")}
          className="text-sm font-semibold text-foreground"
        >
          {titleDisplay}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenCashier("c_end")}
            className="btn-lovable-dark rounded-md px-3 py-1.5 text-xs font-semibold"
          >
            {activeLicenseBadge ? activeLicenseBadge : "¥68 起"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Menu"
            className="rounded-md border border-border bg-card p-1.5 text-foreground"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full w-68 max-w-[82vw] border-r border-sidebar-border shadow-2xl">
            {spineBody}
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/40"
          />
        </div>
      )}
    </>
  );
}
