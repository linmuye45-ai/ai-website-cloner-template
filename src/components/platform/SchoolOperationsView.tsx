"use client";

import React from "react";
import { EnterpriseConsoleView } from "./EnterpriseConsoleView";
import { TeacherCopilotView } from "./TeacherCopilotView";
import type {
  CoursePack,
  GatewayConfig,
  MemoryTraceL1,
  WhiteLabelConfig,
  WorkspaceTab,
} from "@/types/platform";

interface SchoolOperationsViewProps {
  mode: "cohort" | "enterprise";
  onSwitchMode: (next: WorkspaceTab) => void;
  brand: WhiteLabelConfig;
  onUpdateBrand: (next: WhiteLabelConfig) => void;
  selectedCourse: CoursePack;
  memoryLog: MemoryTraceL1[];
  gateway: GatewayConfig;
  onUpdateGateway: (next: GatewayConfig) => void;
  onDownloadStandalone: () => void;
  onExportWorkspaceJson: () => void;
  onImportWorkspaceJson: (raw: string) => boolean;
  onOpenCashier: (mode?: "c_end" | "b_end" | "redeem") => void;
}

export function SchoolOperationsView({
  mode,
  onSwitchMode,
  brand,
  onUpdateBrand,
  selectedCourse,
  memoryLog,
  gateway,
  onUpdateGateway,
  onDownloadStandalone,
  onExportWorkspaceJson,
  onImportWorkspaceJson,
  onOpenCashier,
}: SchoolOperationsViewProps) {
  const locale = brand.locale;

  return (
    <div className="space-y-2">
      <div className="no-print border-b border-border bg-card/70 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs text-muted-foreground">
            04 / SCHOOL SUPERVISION & WHITE-LABEL OEM SUITE
          </div>

          <div className="inline-flex gap-1 rounded-lg border border-border bg-background p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onSwitchMode("cohort")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                mode === "cohort"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "zh"
                ? "1:150 督学队列与组卷"
                : locale === "ja"
                ? "1:150 指導・作問"
                : "1:150 Cohort & Exam Press"}
            </button>
            <button
              type="button"
              onClick={() => onSwitchMode("enterprise")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                mode === "enterprise"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "zh"
                ? "白标品牌、卡密与离线包"
                : locale === "ja"
                ? "OEMブランド・キー発行"
                : "White-Label Brand & Keys"}
            </button>
          </div>
        </div>
      </div>

      {mode === "cohort" ? (
        <TeacherCopilotView
          brand={brand}
          selectedCourse={selectedCourse}
          memoryLog={memoryLog}
        />
      ) : (
        <EnterpriseConsoleView
          brand={brand}
          onUpdateBrand={onUpdateBrand}
          gateway={gateway}
          onUpdateGateway={onUpdateGateway}
          onDownloadStandalone={onDownloadStandalone}
          onExportWorkspaceJson={onExportWorkspaceJson}
          onImportWorkspaceJson={onImportWorkspaceJson}
          onOpenCashier={onOpenCashier}
        />
      )}
    </div>
  );
}
