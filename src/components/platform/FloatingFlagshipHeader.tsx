"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  DownloadSimple,
  MagnifyingGlass,
  MoonStars,
  SunDim,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/platform/BrandMark";
import type {
  CoursePack,
  LocaleCode,
  WhiteLabelConfig,
  WorkspaceTab,
} from "@/types/platform";

export type AppSurfaceMode = "official" | "studio";

interface FloatingFlagshipHeaderProps {
  surfaceMode: AppSurfaceMode;
  onChangeSurfaceMode: (mode: AppSurfaceMode) => void;
  activeTab: WorkspaceTab;
  onSelectStudioTab: (tab: WorkspaceTab) => void;
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

const HEADER_COPY: Record<
  LocaleCode,
  {
    brandMain: string;
    navCapabilities: string;
    navSubjects: string;
    navSchools: string;
    navArchitecture: string;
    navPricing: string;
    enterStudio: string;
    backOfficial: string;
    primaryCta: string;
    room01: string;
    room02: string;
    room03: string;
    room04: string;
    room05: string;
    offlineHtml: string;
    searchLabel: string;
    themeLabel: string;
    menuLabel: string;
  }
> = {
  zh: {
    brandMain: "知微 DeepScholar",
    navCapabilities: "批改与推导",
    navSubjects: "学科专栏",
    navSchools: "学校与白标",
    navArchitecture: "百角兽账本",
    navPricing: "方案与答疑",
    enterStudio: "打开工作台",
    backOfficial: "官网首页",
    primaryCta: "查看示例",
    room01: "真题精改台",
    room02: "一对一推导",
    room03: "双人音频课",
    room04: "学校与白标",
    room05: "人才与账本",
    offlineHtml: "离线单文件",
    searchLabel: "快捷搜索",
    themeLabel: "切换明暗外观",
    menuLabel: "打开或关闭菜单",
  },
  en: {
    brandMain: "DeepScholar",
    navCapabilities: "Capabilities",
    navSubjects: "Subjects",
    navSchools: "Institutions",
    navArchitecture: "$108B Architecture",
    navPricing: "Pricing & FAQ",
    enterStudio: "Open studio",
    backOfficial: "Official site",
    primaryCta: "Grade free answer",
    room01: "Grading desk",
    room02: "1 on 1 studio",
    room03: "Audio seminar",
    room04: "School OEM",
    room05: "Talent & ledger",
    offlineHtml: "Offline HTML",
    searchLabel: "Quick jump",
    themeLabel: "Switch appearance",
    menuLabel: "Toggle menu",
  },
  ja: {
    brandMain: "DeepScholar 叡智",
    navCapabilities: "添削と演習",
    navSubjects: "対応科目",
    navSchools: "法人OEM",
    navArchitecture: "8年事業計画",
    navPricing: "料金と質問",
    enterStudio: "演習室を開く",
    backOfficial: "公式サイト",
    primaryCta: "無料で1問添削",
    room01: "答案添削",
    room02: "1対1演習",
    room03: "音声ゼミ",
    room04: "学校OEM",
    room05: "人材と台帳",
    offlineHtml: "オフライン保存",
    searchLabel: "クイック検索",
    themeLabel: "外観切り替え",
    menuLabel: "メニュー開閉",
  },
  es: {
    brandMain: "DeepScholar",
    navCapabilities: "Capacidades",
    navSubjects: "Asignaturas",
    navSchools: "Centros OEM",
    navArchitecture: "Plan $108B",
    navPricing: "Precios y dudas",
    enterStudio: "Abrir estudio",
    backOfficial: "Sitio oficial",
    primaryCta: "Corregir gratis",
    room01: "Corrección",
    room02: "Estudio 1 a 1",
    room03: "Seminario",
    room04: "Centros OEM",
    room05: "Talento y plan",
    offlineHtml: "HTML sin red",
    searchLabel: "Búsqueda rápida",
    themeLabel: "Cambiar tema",
    menuLabel: "Menú",
  },
};

const LOCALE_OPTIONS: Array<{ code: LocaleCode; label: string }> = [
  { code: "zh", label: "CN ¥" },
  { code: "en", label: "US $" },
  { code: "ja", label: "JP ¥" },
  { code: "es", label: "ES €" },
];

export function FloatingFlagshipHeader({
  surfaceMode,
  onChangeSurfaceMode,
  activeTab,
  onSelectStudioTab,
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
}: FloatingFlagshipHeaderProps) {
  const locale = brand.locale;
  const t = HEADER_COPY[locale];
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const isDefaultBrand =
    brand.brandName.includes("DeepScholar") ||
    brand.brandName.includes("知微") ||
    brand.brandName.includes("叡智") ||
    brand.brandName.includes("Aula");

  const brandDisplay = isDefaultBrand ? t.brandMain : brand.brandName;

  const studioRooms: Array<{ tab: WorkspaceTab; label: string }> = [
    { tab: "overview", label: t.room01 },
    { tab: "workbench", label: t.room02 },
    { tab: "seminar", label: t.room03 },
    { tab: "cohort", label: t.room04 },
    { tab: "talent", label: t.room05 },
  ];

  const officialAnchors = [
    { href: "#capabilities", label: t.navCapabilities },
    { href: "#subjects", label: t.navSubjects },
    { href: "#schools", label: t.navSchools },
    { href: "#architecture", label: t.navArchitecture },
    { href: "#pricing", label: t.navPricing },
  ];

  const handleGoStudioRoom = (tab: WorkspaceTab) => {
    onSelectStudioTab(tab);
    onChangeSurfaceMode("studio");
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoOfficial = () => {
    onChangeSurfaceMode("official");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Skip-to-content accessibility link (B10 requirement) */}
      <a
        href="#main-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background button-sm"
      >
        Skip to content
      </a>

      {/* Floating Translucent Top Bar (B7: floats off top edge, concentric radii rounded-2xl -> p-2 -> rounded-lg) */}
      <header className="sticky top-3 z-40 mx-auto w-full max-w-[1280px] px-3 sm:px-6">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-background/85 p-2 backdrop-blur-xl"
        >
          {/* Left: Brand Mark + Surface Context */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoOfficial}
              className="inline-flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-300 motion-decel hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BrandMark size={26} />
              <span className="title-4 font-semibold text-foreground">
                {brandDisplay}
              </span>
            </button>

            {surfaceMode === "studio" && (
              <button
                type="button"
                onClick={handleGoOfficial}
                className="hidden items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 caption-4 text-muted-foreground transition-colors duration-300 motion-decel hover:text-foreground sm:inline-flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" weight="bold" />
                <span>{t.backOfficial}</span>
              </button>
            )}
          </div>

          {/* Center Desktop Navigation */}
          {surfaceMode === "official" ? (
            <div className="hidden items-center gap-1 lg:flex">
              {officialAnchors.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 title-4 text-muted-foreground transition-colors duration-300 motion-decel hover:bg-card hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : (
            <div className="hidden items-center gap-1 lg:flex">
              {studioRooms.map((room) => {
                const isActive =
                  activeTab === room.tab ||
                  (room.tab === "cohort" && activeTab === "enterprise");
                return (
                  <button
                    key={room.tab}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleGoStudioRoom(room.tab)}
                    className={`rounded-lg px-3 py-1.5 title-4 transition-colors duration-300 motion-decel ${
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {room.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Controls */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {surfaceMode === "studio" && (
              <select
                aria-label="Course Track"
                value={selectedCourse.id}
                onChange={(e) => onSelectCourseId(e.target.value)}
                className="max-w-[168px] truncate rounded-lg border border-border bg-card px-2.5 py-1.5 caption-4 text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}

            <select
              aria-label="Locale and currency"
              value={locale}
              onChange={(e) => onSwitchLocale(e.target.value as LocaleCode)}
              className="rounded-lg border border-border bg-card px-2 py-1.5 caption-4 text-foreground tnum focus-visible:ring-2 focus-visible:ring-ring"
            >
              {LOCALE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label={t.searchLabel}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 caption-4 text-muted-foreground transition-colors duration-300 motion-decel hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MagnifyingGlass className="h-3.5 w-3.5" weight="bold" />
              <span className="font-mono">⌘K</span>
            </button>

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={t.themeLabel}
              className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground transition-colors duration-300 motion-decel hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isDark ? (
                <SunDim className="h-4 w-4" weight="bold" />
              ) : (
                <MoonStars className="h-4 w-4" weight="bold" />
              )}
            </button>

            <button
              type="button"
              onClick={onDownloadStandalone}
              title={t.offlineHtml}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 caption-4 text-muted-foreground transition-colors duration-300 motion-decel hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <DownloadSimple className="h-3.5 w-3.5" weight="bold" />
              <span className="hidden xl:inline">{t.offlineHtml}</span>
            </button>

            {surfaceMode === "official" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleGoStudioRoom("workbench")}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 button-sm text-foreground transition-colors duration-300 motion-decel hover:bg-card"
                >
                  <span>{t.enterStudio}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" weight="bold" />
                </button>
                <a
                  href="#live-grading-stage"
                  className="btn-primary-flagship inline-flex items-center rounded-lg px-3.5 py-2 button-sm"
                >
                  {t.primaryCta}
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onOpenCashier(activeLicenseBadge ? "redeem" : "c_end")
                }
                className="btn-primary-flagship inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 button-sm"
              >
                {activeLicenseBadge ? (
                  <>
                    <CheckCircle className="h-4 w-4" weight="fill" />
                    <span>{activeLicenseBadge}</span>
                  </>
                ) : (
                  <span className="tnum">
                    {locale === "zh"
                      ? `学习卡 · 闭卷通过 ${proofCount}`
                      : `Pass · ${proofCount} checks`}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Actions + Animated 2-Bar Toggle (B7) */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={() =>
                surfaceMode === "official"
                  ? handleGoStudioRoom("workbench")
                  : handleGoOfficial()
              }
              className="btn-primary-flagship rounded-lg px-3 py-1.5 button-xsm"
            >
              {surfaceMode === "official" ? t.enterStudio : t.backOfficial}
            </button>

            <button
              type="button"
              aria-label={t.menuLabel}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="sr-only">{t.menuLabel}</span>
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 bg-current transition-transform duration-500 motion-decel ${
                  mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 bg-current transition-transform duration-500 motion-decel ${
                  mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Height Mobile Menu Panel (B7: full-height panel, staggered link arrival 60ms apart) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex min-h-dvh flex-col justify-between bg-background/95 px-6 pt-24 pb-8 backdrop-blur-2xl lg:hidden">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="caption-3 text-muted-foreground">
                {locale === "zh" ? "官网导航" : "Official site"}
              </p>
              <div className="flex flex-col gap-1">
                {officialAnchors.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      onChangeSurfaceMode("official");
                      setMobileOpen(false);
                    }}
                    className="rounded-lg px-3 py-2.5 heading-6 text-foreground transition-colors duration-300 hover:bg-card"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
              <p className="caption-3 text-muted-foreground">
                {locale === "zh" ? "实测工作台" : "Interactive studios"}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {studioRooms.map((room) => (
                  <button
                    key={room.tab}
                    type="button"
                    onClick={() => handleGoStudioRoom(room.tab)}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 title-3 text-foreground"
                  >
                    <span>{room.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              {LOCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onSwitchLocale(opt.code)}
                  className={`rounded-lg px-2.5 py-1.5 caption-3 tnum ${
                    opt.code === locale
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleDark}
                className="rounded-lg border border-border bg-card px-3 py-1.5 caption-3 text-foreground"
              >
                {isDark ? "Light" : "Dark"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDownloadStandalone();
                  setMobileOpen(false);
                }}
                className="rounded-lg border border-border bg-card px-3 py-1.5 caption-3 text-foreground"
              >
                {t.offlineHtml}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
