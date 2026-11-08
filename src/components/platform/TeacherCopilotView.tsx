"use client";

import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";
import { SUPERVISION_QUEUE_SEED, UI_COPY } from "@/lib/i18n-ui";
import { buildInstantVariants } from "@/lib/tutor-engine";
import type {
  CoursePack,
  MemoryTraceL1,
  QuizVariantItem,
  SupervisionQueueItem,
  WhiteLabelConfig,
} from "@/types/platform";

interface TeacherCopilotViewProps {
  brand: WhiteLabelConfig;
  selectedCourse: CoursePack;
  memoryLog: MemoryTraceL1[];
}

function buildLocalizedDossier(
  brand: WhiteLabelConfig,
  learnerName: string,
  courseTitle: string,
  baseline: string,
  projected: string,
  prescription: string
): string {
  if (brand.locale === "en") {
    return [
      `[${brand.brandName} — Weekly Competence Dossier]`,
      `Learner: ${learnerName} | Track: ${courseTitle}`,
      `Baseline: ${baseline} -> Projected: ${projected}`,
      `Next 7-Day Prescription: ${prescription}`,
    ].join("\n");
  }
  if (brand.locale === "ja") {
    return [
      `【${brand.brandName} 週次到達度レポート】`,
      `受講生：${learnerName} ｜ コース：${courseTitle}`,
      `入塾時基準：${baseline} → 閉巻実績予測：${projected}`,
      `来週の重点方針：${prescription}`,
    ].join("\n");
  }
  if (brand.locale === "es") {
    return [
      `[${brand.brandName} — Informe Semanal de Dominio]`,
      `Alumno: ${learnerName} | Programa: ${courseTitle}`,
      `Base: ${baseline} -> Proyección: ${projected}`,
      `Plan próxima semana: ${prescription}`,
    ].join("\n");
  }
  return [
    `【${brand.brandName} · 周度闭卷精熟档案】`,
    `学员：${learnerName} ｜ 模块：${courseTitle}`,
    `入班基线：${baseline} → 闭卷实测预测：${projected}`,
    `下周督学处方：${prescription}`,
  ].join("\n");
}

export function TeacherCopilotView({
  brand,
  selectedCourse,
  memoryLog,
}: TeacherCopilotViewProps) {
  const t = UI_COPY[brand.locale].cohort;
  const activeQueue: SupervisionQueueItem[] =
    SUPERVISION_QUEUE_SEED[brand.locale];

  const [dispatchedIds, setDispatchedIds] = useState<Record<string, boolean>>(
    {}
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [weakPointInput, setWeakPointInput] = useState<string>(
    selectedCourse.sections[0]?.title ?? ""
  );
  const [variants, setVariants] = useState<QuizVariantItem[]>(
    selectedCourse.defaultVariants
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  const [reportText, setReportText] = useState<string>("");
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  const profile = selectedCourse.studentProfile;

  const handleDispatch = async (item: SupervisionQueueItem) => {
    setDispatchedIds((prev) => ({ ...prev, [item.id]: true }));
    const dossier = buildLocalizedDossier(
      brand,
      item.learnerName,
      item.track,
      profile.baselineScore,
      profile.currentPredictedScore,
      item.triggerReason
    );
    setReportText(dossier);
    try {
      await navigator.clipboard.writeText(dossier);
    } catch {
      // Ignore clipboard permission errors
    }
    setToastMsg(t.dispatchedToast);
    window.setTimeout(() => setToastMsg(null), 2600);
  };

  const handleGenerateVariants = () => {
    setSelectedAnswers({});
    const next = buildInstantVariants(
      weakPointInput || selectedCourse.title,
      selectedCourse.title,
      selectedCourse.sections[0]?.pageNumber ?? 14,
      brand.locale
    );
    setVariants(next);
  };

  const handleCompileDossier = async () => {
    const recentEvidence = memoryLog
      .slice(0, 1)
      .map((m) => m.evidence)
      .join("; ");
    const dossier = buildLocalizedDossier(
      brand,
      profile.studentName,
      selectedCourse.title,
      profile.baselineScore,
      profile.currentPredictedScore,
      recentEvidence
        ? `${profile.l3SynthesisStrategy} (${recentEvidence})`
        : profile.l3SynthesisStrategy
    );
    setReportText(dossier);
    try {
      await navigator.clipboard.writeText(dossier);
      setCopiedDossier(true);
      window.setTimeout(() => setCopiedDossier(false), 1800);
    } catch {
      // Ignore
    }
  };

  const statusText = (st: SupervisionQueueItem["status"]) => {
    if (st === "intervention") return t.statusIntervention;
    if (st === "checkin_sent") return t.statusCheckin;
    return t.statusVerified;
  };

  return (
    <div className="mx-auto max-w-[1380px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Section 1: 1:150 Hybrid Accountability Supervision Queue */}
      <section className="no-print surface-elevated space-y-4 rounded-xl border border-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              {t.supervisionTitle}
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {t.supervisionSub}
            </p>
          </div>
          <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-foreground">
            {t.ratioMetric}
          </span>
        </div>

        {toastMsg && (
          <div className="rounded-md border border-brand/40 bg-brand-soft/30 px-3.5 py-2 text-xs text-foreground">
            {toastMsg}
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-medium text-muted-foreground">
                <th className="px-3.5 py-2.5">{t.colLearner}</th>
                <th className="px-3.5 py-2.5">{t.colTrack}</th>
                <th className="px-3.5 py-2.5">{t.colTrigger}</th>
                <th className="px-3.5 py-2.5 text-right">{t.colBlindRate}</th>
                <th className="px-3.5 py-2.5">{t.colStatus}</th>
                <th className="px-3.5 py-2.5 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeQueue.map((item) => {
                const sent = Boolean(dispatchedIds[item.id]);
                const effectiveStatus: SupervisionQueueItem["status"] = sent
                  ? "checkin_sent"
                  : item.status;
                return (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-3.5 py-3 font-medium text-foreground">
                      <div>{item.learnerName}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {item.lastActive}
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-muted-foreground">
                      {item.track}
                    </td>
                    <td className="max-w-xs px-3.5 py-3 text-foreground/90">
                      {item.triggerReason}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono font-semibold tabular-nums text-foreground">
                      {item.blindGatePassRate}%
                    </td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                          effectiveStatus === "verified"
                            ? "text-brand"
                            : effectiveStatus === "intervention"
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            effectiveStatus === "verified"
                              ? "bg-brand"
                              : effectiveStatus === "intervention"
                              ? "bg-destructive"
                              : "bg-foreground/60"
                          }`}
                        />
                        <span>{statusText(effectiveStatus)}</span>
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        type="button"
                        disabled={sent || effectiveStatus === "verified"}
                        onClick={() => void handleDispatch(item)}
                        className="rounded-sm border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors duration-100 hover:bg-muted disabled:opacity-45"
                      >
                        {t.dispatchAction}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Split 3-Tier Exam Press + FSRS Retention & Family Dossier */}
      <div className="surface-elevated grid divide-y divide-border overflow-hidden rounded-xl border border-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* Left: Exam Press */}
        <div className="space-y-4 p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {t.examPressTitle}
              </h2>
              <p className="text-xs text-muted-foreground">{t.examPressSub}</p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{t.printBtn}</span>
            </button>
          </div>

          <div className="no-print flex gap-2">
            <input
              type="text"
              value={weakPointInput}
              onChange={(e) => setWeakPointInput(e.target.value)}
              placeholder={t.variantPlaceholder}
              className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={handleGenerateVariants}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-xs font-medium text-background"
            >
              <span>{t.generateBtn}</span>
            </button>
          </div>

          <div className="divide-y divide-border rounded-md border border-border">
            {variants.map((q, idx) => {
              const chosen = selectedAnswers[q.id];
              const hasAnswered = chosen !== undefined;
              return (
                <article key={q.id} className="space-y-2.5 p-4 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                      0{idx + 1} · {q.tier}
                    </span>
                    <span className="font-mono tabular-nums">
                      p.{q.sourcePage}
                    </span>
                  </div>

                  <p className="text-[13px] font-medium leading-relaxed text-foreground">
                    {q.stem}
                  </p>

                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {q.options.map((opt, optIdx) => {
                      const picked = chosen === optIdx;
                      const right = optIdx === q.correctIndex;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: optIdx,
                            }))
                          }
                          className={`rounded-sm border px-3 py-2 text-left transition-colors duration-100 ${
                            hasAnswered && right
                              ? "border-brand bg-brand-soft/40 font-medium text-foreground"
                              : picked && !right
                              ? "border-destructive bg-muted/40 font-medium text-foreground"
                              : "border-border bg-background hover:bg-muted/30"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className="rounded-sm bg-muted/40 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {chosen === q.correctIndex
                          ? t.correctRubric
                          : t.boundaryHit}
                        :{" "}
                      </span>
                      {q.rubricAndAnalysis}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Right: 30-Day FSRS Retention & Zero-Friction Family Dossier */}
        <div className="no-print space-y-5 bg-muted/15 p-6 lg:col-span-5">
          {/* FSRS Stability Comparison */}
          <div className="space-y-3 rounded-md border border-border bg-card p-4 text-xs">
            <div className="font-semibold text-foreground">
              {t.retentionTitle}
            </div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-foreground">{t.fsrsLine}</span>
                  <span className="font-mono font-semibold text-brand">92%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 w-11/12 rounded-full bg-brand" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>{t.decayLine}</span>
                  <span className="font-mono">23%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 w-1/4 rounded-full bg-muted-foreground/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Family Dossier */}
          <div className="space-y-3 rounded-md border border-border bg-card p-4 text-xs">
            <div className="font-semibold text-foreground">
              {t.dossierTitle}
            </div>

            <div className="grid grid-cols-2 divide-x divide-border rounded-sm border border-border bg-muted/20">
              <div className="p-2.5">
                <div className="text-[11px] text-muted-foreground">
                  {t.baselineLabel}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  {profile.baselineScore}
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-[11px] text-muted-foreground">
                  {t.projectedLabel}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-brand">
                  {profile.currentPredictedScore}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-muted-foreground">
                {t.prescriptionLabel}
              </div>
              <p className="mt-1 leading-relaxed text-foreground/90">
                {profile.l3SynthesisStrategy}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompileDossier}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background"
            >
              {copiedDossier ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{t.copyDossierBtn}</span>
            </button>

            {reportText && (
              <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-sm border border-border bg-muted/25 p-3 font-sans text-[11px] leading-relaxed text-foreground/90">
                {reportText}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
