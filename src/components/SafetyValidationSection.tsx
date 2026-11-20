"use client";

import React from "react";
import { useI18n } from "@/context/i18n-context";
import { SAFETY_BENCHMARKS } from "@/lib/constellation-and-content";

export function SafetyValidationSection() {
  const { locale, t, openSafetyModal } = useI18n();

  return (
    <section
      id="safety"
      className="bg-zj-mist border-b border-zj-border py-20 lg:py-28 scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-px bg-zj-cobalt" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cobalt">
              {t.safety.eyebrow}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] tracking-[-0.02em] text-zj-ink font-normal">
            {t.safety.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-slate">
            {t.safety.subtitle}
          </p>
        </div>

        {/* Peer-Reviewed Evidence Layout: Left 5-Stage Protocol (5 Cols) | Right Blind-Test Figure (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 5 Columns: Sequential Clinical Admission Protocol */}
          <div className="lg:col-span-5 bg-zj-white border border-zj-border divide-y divide-zj-border">
            {t.safety.phases.map((phase) => (
              <div key={phase.step} className="p-5 flex items-start gap-4">
                <span className="font-mono-hud text-[13px] font-semibold text-zj-cobalt pt-0.5 shrink-0">
                  {phase.step}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-zj-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.68] text-zj-slate">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right 7 Columns: Double-Blind Clinical Evaluation Figure */}
          <div className="lg:col-span-7 bg-zj-white border border-zj-border p-6 sm:p-8">
            <div className="pb-5 border-b border-zj-border flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="font-mono-hud text-[11px] text-zj-muted">
                  FIGURE 1 · DOUBLE-BLIND CLINICAL REVIEW BOARD
                </div>
                <h3 className="mt-1 text-[17px] font-semibold text-zj-ink">
                  {t.safety.chartTitle}
                </h3>
                <p className="mt-1 text-[13px] text-zj-slate">
                  {t.safety.chartSub}
                </p>
              </div>
            </div>

            {/* Horizontal Comparative Harm Bars */}
            <div className="mt-6 space-y-6">
              {SAFETY_BENCHMARKS.map((row) => {
                const isFlagship = Boolean(row.isFlagship);
                return (
                  <div key={row.id} className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span
                          className={`text-[14px] ${
                            isFlagship
                              ? "font-semibold text-zj-cobalt"
                              : "font-medium text-zj-ink"
                          }`}
                        >
                          {row.modelName[locale]}
                        </span>
                        <span className="ml-2 font-mono-hud text-[11px] text-zj-muted">
                          {row.paramsTag}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono-hud text-[12px]">
                        <span className="font-semibold text-zj-ink">
                          {row.correctAdvicePct.toFixed(2)}%
                        </span>
                        {row.severeHarmPct > 0 ? (
                          <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded-[2px] text-[11px]">
                            Severe {row.severeHarmPct.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-zj-safe bg-zj-mint-soft px-1.5 py-0.5 rounded-[2px] text-[11px]">
                            Severe 0.00%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Solid Stacked Journal Bar */}
                    <div className="h-3.5 w-full bg-zj-surface rounded-[2px] overflow-hidden flex">
                      <div
                        style={{ width: `${row.correctAdvicePct}%` }}
                        className={
                          isFlagship ? "bg-zj-cobalt" : "bg-zj-teal/85"
                        }
                        title={`${t.safety.legendCorrect}: ${row.correctAdvicePct}%`}
                      />
                      <div
                        style={{ width: `${row.benignDeviationPct}%` }}
                        className="bg-zj-sky"
                        title={`${t.safety.legendBenign}: ${row.benignDeviationPct}%`}
                      />
                      {row.minorHarmPct > 0 && (
                        <div
                          style={{ width: `${row.minorHarmPct}%` }}
                          className="bg-zj-amber-bright"
                          title={`${t.safety.legendMinor}: ${row.minorHarmPct}%`}
                        />
                      )}
                      {row.severeHarmPct > 0 && (
                        <div
                          style={{ width: `${row.severeHarmPct}%` }}
                          className="bg-red-600"
                          title={`${t.safety.legendSevere}: ${row.severeHarmPct}%`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Academic Legend & Charter Trigger */}
            <div className="mt-8 pt-5 border-t border-zj-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-zj-slate">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-zj-cobalt inline-block rounded-[1px]" />
                  {t.safety.legendCorrect}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-zj-sky inline-block rounded-[1px]" />
                  {t.safety.legendBenign}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-zj-amber-bright inline-block rounded-[1px]" />
                  {t.safety.legendMinor}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-600 inline-block rounded-[1px]" />
                  {t.safety.legendSevere}
                </span>
              </div>

              <button
                type="button"
                onClick={openSafetyModal}
                className="text-[12.5px] font-medium text-zj-cobalt hover:text-zj-blue underline underline-offset-4 cursor-pointer"
              >
                {t.hero.nonDiagLink}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
