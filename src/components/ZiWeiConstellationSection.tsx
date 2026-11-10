"use client";

import React, { useState } from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import {
  CONSTELLATION_SUPERVISORS,
  ZIWEI_MODEL_TIERS,
} from "@/lib/constellation-and-content";

export function ZiWeiConstellationSection() {
  const { locale, t, openDemoModal } = useI18n();
  const [selectedId, setSelectedId] = useState<string>(
    CONSTELLATION_SUPERVISORS[0].id
  );

  const activeSup =
    CONSTELLATION_SUPERVISORS.find((s) => s.id === selectedId) ??
    CONSTELLATION_SUPERVISORS[0];

  const stageLabels =
    locale === "en"
      ? [
          "01 · Dialect ASR Front-End (34ms)",
          "02 · 671B Dialogue Draft (162ms)",
          "03 · 32-Model Parallel Veto Gate (<65ms)",
          "04 · Verified Speech / 1.6s RN Bridge",
        ]
      : locale === "ja"
        ? [
            "01 · 方言・高齢者音響認識 (34ms)",
            "02 · 671B 臨床対話生成 (162ms)",
            "03 · 32専門モデル並列拒否権監査 (<65ms)",
            "04 · 安全性確認済音声出力 / 1.6s 看護師接続",
          ]
        : locale === "zh-TW"
          ? [
              "01 · 方言與高齡聲學前端 (34ms)",
              "02 · 671B 對話主模型擬稿 (162ms)",
              "03 · 32 個專科小模型一票否決閘 (<65ms)",
              "04 · 合規語音輸出 / 1.6s 護理師熱轉接",
            ]
          : [
              "01 · 方言与老年声学前端 (34ms)",
              "02 · 671B 临床主模型拟稿 (162ms)",
              "03 · 32 个专科小模型一票否决闸 (<65ms)",
              "04 · 合规语音输出 / 1.6s 护师转接",
            ];

  return (
    <section
      id="constellation"
      className="bg-zj-navy text-white py-20 lg:py-28 border-b border-zj-border-hud scroll-mt-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-px bg-zj-cyan-bright" />
            <span className="text-[12.5px] font-medium tracking-wide text-zj-cyan-bright">
              {t.constellation.eyebrow}
            </span>
          </div>
          <h2 className="font-serif-editorial text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.2] tracking-[-0.02em] text-white font-normal">
            {t.constellation.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-zj-hud-muted">
            {t.constellation.subtitle}
          </p>
        </div>

        {/* Deterministic Pre-Speech Verification Pipeline Instrument */}
        <div className="border border-zj-border-hud rounded-[4px] overflow-hidden bg-zj-navy-card">
          {/* 4-Stage Deterministic Audio Pipeline Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zj-border-hud border-b border-zj-border-hud">
            {stageLabels.map((label, idx) => (
              <div
                key={label}
                className={`px-4 py-3 text-[12px] font-mono-hud ${
                  idx === 2
                    ? "bg-zj-navy-elevated text-zj-cyan-bright font-medium"
                    : "bg-zj-navy text-zj-hud-muted"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Left 7 Cols: 8 Specialist Verification Lanes | Right 5 Cols: Active Veto Specification */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 divide-y divide-zj-border-hud">
              <div className="px-5 py-3 bg-zj-navy/60 flex items-center justify-between text-[11.5px] text-zj-hud-muted">
                <span>{t.constellation.clickHint}</span>
                <span className="font-mono-hud">Latency / Pass Rate</span>
              </div>

              {CONSTELLATION_SUPERVISORS.map((sup) => {
                const active = sup.id === activeSup.id;
                const widthPct = Math.min(
                  100,
                  Math.max(28, Math.round((sup.latencyMs / 70) * 100))
                );
                return (
                  <button
                    key={sup.id}
                    type="button"
                    onClick={() => setSelectedId(sup.id)}
                    className={`w-full text-left px-5 py-3.5 transition-colors cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center ${
                      active
                        ? "bg-zj-navy-elevated border-l-2 border-l-zj-cyan-bright"
                        : "hover:bg-zj-navy/50"
                    }`}
                  >
                    <div className="sm:col-span-7">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-hud text-[11px] text-zj-hud-muted">
                          {sup.code}
                        </span>
                        <span className="font-mono-hud text-[10.5px] px-1.5 py-0.5 rounded-[2px] bg-zj-navy text-zj-cyan-bright">
                          {sup.paramsLabel}
                        </span>
                      </div>
                      <div className="mt-1 text-[14px] font-medium text-white">
                        {sup.name[locale]}
                      </div>
                    </div>

                    <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-4">
                      <div className="w-24 hidden sm:block">
                        <div className="h-1.5 bg-zj-navy rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zj-cyan-bright rounded-full"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-mono-hud text-[12px] text-zj-hud-muted w-12 text-right">
                        {sup.latencyMs}ms
                      </span>
                      <span className="font-mono-hud text-[12px] text-zj-safe-bright font-medium w-14 text-right">
                        {sup.passRate}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 5 Columns: Selected Specialist Verifier Rule Sheet */}
            <div className="lg:col-span-5 bg-zj-navy p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-zj-border-hud flex flex-col justify-between">
              <div>
                <div className="pb-5 border-b border-zj-border-hud">
                  <div className="font-mono-hud text-[11.5px] text-zj-cyan-bright">
                    {activeSup.code} · {activeSup.paramsLabel} Specialist Model
                  </div>
                  <h3 className="mt-2 text-[20px] font-semibold text-white">
                    {activeSup.name[locale]}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-zj-hud-muted">
                    {activeSup.role[locale]}
                  </p>
                </div>

                {/* Deterministic Veto Rule Box */}
                <div className="mt-6 p-4 bg-zj-navy-card border-l-2 border-zj-safe-bright">
                  <div className="flex items-center gap-2 text-[11.5px] font-medium text-zj-safe-bright">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Deterministic Pre-Speech Gate</span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white font-medium">
                    {activeSup.deterministicRule[locale]}
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-px bg-zj-border-hud border border-zj-border-hud">
                  <div className="bg-zj-navy-card p-3">
                    <dt className="text-[11px] text-zj-hud-muted">Parameters</dt>
                    <dd className="mt-1 font-mono-hud text-[15px] font-semibold text-white">
                      {activeSup.paramsLabel}
                    </dd>
                  </div>
                  <div className="bg-zj-navy-card p-3">
                    <dt className="text-[11px] text-zj-hud-muted">Audit Time</dt>
                    <dd className="mt-1 font-mono-hud text-[15px] font-semibold text-zj-cyan-bright">
                      {activeSup.latencyMs}ms
                    </dd>
                  </div>
                  <div className="bg-zj-navy-card p-3">
                    <dt className="text-[11px] text-zj-hud-muted">Blind Test</dt>
                    <dd className="mt-1 font-mono-hud text-[15px] font-semibold text-zj-safe-bright">
                      {activeSup.passRate}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 pt-5 border-t border-zj-border-hud">
                <div className="text-[12.5px] font-medium text-white">
                  {t.constellation.centerNodeTitle}
                </div>
                <div className="mt-1 text-[12px] text-zj-hud-muted">
                  {t.constellation.centerNodeSub}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Flush 4-Column Model Specification & Sizing Matrix */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-2xl mb-8">
            <h3 className="font-serif-editorial text-[24px] sm:text-[30px] text-white font-normal">
              {t.constellation.tierTitle}
            </h3>
            <p className="mt-2 text-[14.5px] text-zj-hud-muted leading-relaxed">
              {t.constellation.tierSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zj-border-hud border border-zj-border-hud">
            {ZIWEI_MODEL_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-6 flex flex-col justify-between ${
                  tier.highlighted ? "bg-zj-navy-elevated" : "bg-zj-navy-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-hud text-[11px] text-zj-cyan-bright">
                      {tier.badge}
                    </span>
                    <span className="font-mono-hud text-[11px] text-zj-hud-muted">
                      {tier.latencySla}
                    </span>
                  </div>

                  <h4 className="mt-2 text-[18px] font-semibold text-white">
                    {tier.name[locale]}
                  </h4>
                  <p className="mt-1.5 text-[13px] text-zj-hud-muted leading-relaxed min-h-[40px]">
                    {tier.tagline[locale]}
                  </p>

                  <div className="mt-5 pt-4 border-t border-zj-border-hud">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono-hud text-[26px] font-semibold text-white">
                        {tier.priceDisplay[locale]}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-zj-hud-muted mt-0.5">
                      {tier.priceUnit[locale]}
                    </div>
                  </div>

                  <div className="mt-4 py-2.5 border-y border-zj-border-hud flex items-center justify-between text-[12px]">
                    <span className="text-zj-hud-muted">
                      {t.constellation.creditsLabel}
                    </span>
                    <span className="font-mono-hud text-white font-medium">
                      {tier.creditsPerHr}x · {tier.supervisorsActive.split(" ")[0]}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openDemoModal(tier.name[locale])}
                  className={`mt-6 w-full py-2.5 px-4 text-[13px] font-medium rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    tier.highlighted
                      ? "bg-white text-zj-navy hover:bg-zj-mist"
                      : "bg-zj-navy hover:bg-zj-navy-elevated text-white border border-zj-border-hud"
                  }`}
                >
                  {t.constellation.selectTierBtn}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
