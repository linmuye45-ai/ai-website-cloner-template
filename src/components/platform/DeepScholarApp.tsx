"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/asset-path";
import { getCoursesForLocale } from "@/lib/demo-courses";
import { GLOBAL_BRAND_PRESETS } from "@/lib/global-markets";
import { triggerDownloadStandaloneHtml } from "@/lib/standalone-exporter";
import { CheckoutCashierModal } from "@/components/platform/CheckoutCashierModal";
import { ClearinghouseLedgerView } from "@/components/platform/ClearinghouseLedgerView";
import { CommandPaletteModal } from "@/components/platform/CommandPaletteModal";
import { EditorialSpineNav } from "@/components/platform/EditorialSpineNav";
import { ExamDiagnosticDeskView } from "@/components/platform/ExamDiagnosticDeskView";
import { ImmersiveTutorView } from "@/components/platform/ImmersiveTutorView";
import { InteractiveClassroomView } from "@/components/platform/InteractiveClassroomView";
import { SchoolOperationsView } from "@/components/platform/SchoolOperationsView";
import type {
  DocumentSection,
  GatewayConfig,
  LocaleCode,
  MemoryTraceL1,
  ProofOfMasteryRecord,
  WhiteLabelConfig,
  WorkspaceTab,
} from "@/types/platform";

export function DeepScholarApp() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [brand, setBrand] = useState<WhiteLabelConfig>(
    GLOBAL_BRAND_PRESETS.zh[0]
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ap-calc");
  const [customSectionsByCourse, setCustomSectionsByCourse] = useState<
    Record<string, DocumentSection[]>
  >({});
  const [extraL1Traces, setExtraL1Traces] = useState<MemoryTraceL1[]>([]);
  const [proofs, setProofs] = useState<ProofOfMasteryRecord[]>([
    {
      hash: "0x7c1a…84f0",
      courseCode: "AP-CALC-BC",
      conceptTitle: "Lagrange Remainder Upper Bound",
      verifiedAt: "09:42",
      elapsedSeconds: 28,
      stabilityDays: 21,
    },
    {
      hash: "0x9b2e…31c4",
      courseCode: "IELTS-8.0",
      conceptTitle: "Scoped Concession & Rebuttal",
      verifiedAt: "Yesterday",
      elapsedSeconds: 34,
      stabilityDays: 14,
    },
  ]);

  const [isDark, setIsDark] = useState<boolean>(false);
  const [cmdkOpen, setCmdkOpen] = useState<boolean>(false);
  const [activeLicenseBadge, setActiveLicenseBadge] = useState<string | null>(
    null
  );

  const [cashierOpen, setCashierOpen] = useState<boolean>(false);
  const [cashierMode, setCashierMode] = useState<"c_end" | "b_end" | "redeem">(
    "c_end"
  );

  const [gateway, setGateway] = useState<GatewayConfig>({
    providerLabel: "OpenAI-Compatible Gateway",
    baseUrl: "https://api.deepseek.com/v1",
    apiKey: "",
    modelName: "deepseek-chat",
  });

  // Register Service Worker strictly in production builds; never in dev HMR
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register(withBasePath("/sw.js")).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Global ⌘K + 1-5 room shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const shortcutMap: Record<string, WorkspaceTab> = {
        "1": "overview",
        "2": "workbench",
        "3": "seminar",
        "4": "cohort",
        "5": "talent",
      };
      const next = shortcutMap[e.key];
      if (next) {
        setActiveTab(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const localeCourses = getCoursesForLocale(brand.locale);
  const selectedCourse =
    localeCourses.find((c) => c.id === selectedCourseId) ?? localeCourses[0];

  const handleSwitchLocale = (nextLocale: LocaleCode) => {
    const nextBrand = GLOBAL_BRAND_PRESETS[nextLocale][0];
    const nextCourses = getCoursesForLocale(nextLocale);
    setBrand(nextBrand);
    if (nextCourses[0]) {
      setSelectedCourseId(nextCourses[0].id);
    }
  };

  const handleOpenCashier = (mode: "c_end" | "b_end" | "redeem" = "c_end") => {
    setCashierMode(mode);
    setCashierOpen(true);
  };

  const handleAddCustomSection = (sec: DocumentSection) => {
    setCustomSectionsByCourse((prev) => ({
      ...prev,
      [selectedCourse.id]: [sec, ...(prev[selectedCourse.id] ?? [])],
    }));
  };

  const handleRecordMemoryNote = (
    action: string,
    evidence: string,
    sourceRef: string
  ) => {
    const trace: MemoryTraceL1 = {
      id: `live-l1-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      action,
      evidence,
      sourceRef,
      masteryDelta: "+FSRS",
    };
    setExtraL1Traces((prev) => [trace, ...prev]);
  };

  const handleMintProof = (proof: ProofOfMasteryRecord) => {
    setProofs((prev) => [proof, ...prev]);
  };

  const handleEnterStudio = (courseId?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    setActiveTab("workbench");
  };

  const handleExportWorkspaceJson = () => {
    const payload = JSON.stringify(
      {
        version: "9.0-editorial-desk",
        brand,
        customSectionsByCourse,
        proofs,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand.id}-workspace.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportWorkspaceJson = (raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw) as {
        brand?: WhiteLabelConfig;
        customSectionsByCourse?: Record<string, DocumentSection[]>;
        proofs?: ProofOfMasteryRecord[];
      };
      if (parsed.brand) setBrand(parsed.brand);
      if (parsed.customSectionsByCourse) {
        setCustomSectionsByCourse(parsed.customSectionsByCourse);
      }
      if (Array.isArray(parsed.proofs)) {
        setProofs(parsed.proofs);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div
      data-brand={brand.theme}
      className="flex min-h-dvh flex-col bg-background text-foreground lg:flex-row"
    >
      <EditorialSpineNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        brand={brand}
        onSwitchLocale={handleSwitchLocale}
        courses={localeCourses}
        selectedCourse={selectedCourse}
        onSelectCourseId={setSelectedCourseId}
        proofCount={proofs.length}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        activeLicenseBadge={activeLicenseBadge}
        onOpenCommandPalette={() => setCmdkOpen(true)}
        onOpenCashier={handleOpenCashier}
        onDownloadStandalone={() =>
          triggerDownloadStandaloneHtml(brand, localeCourses)
        }
      />

      <main id="main-workspace" className="min-w-0 flex-1">
        {activeTab === "overview" && (
          <ExamDiagnosticDeskView
            key={`${brand.locale}-desk`}
            brand={brand}
            courses={localeCourses}
            activeCourse={selectedCourse}
            onSelectCourse={setSelectedCourseId}
            onEnterStudio={handleEnterStudio}
            onEnterAudioSeminar={() => setActiveTab("seminar")}
            onEnterSchoolSuite={() => setActiveTab("cohort")}
            onEnterClearinghouse={() => setActiveTab("talent")}
            onOpenCashier={(mode = "c_end") => handleOpenCashier(mode)}
            isProUnlocked={Boolean(activeLicenseBadge)}
          />
        )}

        {activeTab === "workbench" && (
          <ImmersiveTutorView
            key={`${selectedCourse.id}-${brand.id}`}
            brand={brand}
            selectedCourse={selectedCourse}
            customSections={customSectionsByCourse[selectedCourse.id] ?? []}
            onAddCustomSection={handleAddCustomSection}
            gateway={gateway}
            onRecordMemoryNote={handleRecordMemoryNote}
            onMintProof={handleMintProof}
          />
        )}

        {activeTab === "seminar" && (
          <InteractiveClassroomView
            key={`${selectedCourse.id}-${brand.locale}-seminar`}
            brand={brand}
            selectedCourse={selectedCourse}
          />
        )}

        {(activeTab === "cohort" || activeTab === "enterprise") && (
          <SchoolOperationsView
            key={`${selectedCourse.id}-${brand.locale}-school`}
            mode={activeTab === "enterprise" ? "enterprise" : "cohort"}
            onSwitchMode={setActiveTab}
            brand={brand}
            onUpdateBrand={setBrand}
            selectedCourse={selectedCourse}
            memoryLog={[
              ...extraL1Traces,
              ...selectedCourse.studentProfile.l1Traces,
            ]}
            gateway={gateway}
            onUpdateGateway={setGateway}
            onDownloadStandalone={() =>
              triggerDownloadStandaloneHtml(brand, localeCourses)
            }
            onExportWorkspaceJson={handleExportWorkspaceJson}
            onImportWorkspaceJson={handleImportWorkspaceJson}
            onOpenCashier={handleOpenCashier}
          />
        )}

        {activeTab === "talent" && (
          <ClearinghouseLedgerView
            locale={brand.locale}
            proofs={proofs}
            onGoToStudio={() => setActiveTab("workbench")}
            onGoToSchoolSuite={() => setActiveTab("cohort")}
          />
        )}
      </main>

      <CommandPaletteModal
        open={cmdkOpen}
        locale={brand.locale}
        onClose={() => setCmdkOpen(false)}
        onSelectTab={setActiveTab}
        onSwitchLocale={handleSwitchLocale}
        onToggleDark={() => setIsDark((prev) => !prev)}
        onDownloadStandalone={() =>
          triggerDownloadStandaloneHtml(brand, localeCourses)
        }
        onOpenCashier={handleOpenCashier}
      />

      <CheckoutCashierModal
        open={cashierOpen}
        initialMode={cashierMode}
        brand={brand}
        onClose={() => setCashierOpen(false)}
        onActivatedLicense={(badge) => {
          setActiveLicenseBadge(badge);
          setCashierOpen(false);
        }}
      />
    </div>
  );
}
