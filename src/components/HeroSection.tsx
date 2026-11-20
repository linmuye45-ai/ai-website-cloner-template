"use client";

import React from "react";
import { ArrowRight, Database, PhoneForwarded, FileCheck2 } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "给医院内网用的软件",
      "zh-TW": "給醫院內網用的軟體",
      en: "Software for hospital intranets",
      ja: "病院内網向けソフトウェア",
    },
    headline: {
      "zh-CN": "不承诺诊断，不修改处方。",
      "zh-TW": "不承諾診斷，不修改處方。",
      en: "No diagnostic promises. No prescription changes.",
      ja: "診断を約束しない。処方を変更しない。",
    },
    sub: {
      "zh-CN": "FHIR R4 归档，肾功精准折算，32 路发声前否决栅栏。数据不出院内网。",
      "zh-TW": "FHIR R4 歸檔，腎功精準折算，32 路發聲前否決柵欄。數據不出院內網。",
      en: "FHIR R4 archiving, precision renal dosing, 32 pre-speech veto gates. Data stays inside the hospital.",
      ja: "FHIR R4 アーカイブ、腎機能精密減量、32 の発話前否決ゲート。データは院内に残る。",
    },
    cta: {
      "zh-CN": "申请科室试点",
      "zh-TW": "申請科室試點",
      en: "Request Department Pilot",
      ja: "科室パイロットを申請",
    },
    safety: {
      "zh-CN": "查看非诊断边界声明",
      "zh-TW": "查看非診斷邊界聲明",
      en: "Non-Diagnostic Boundary Statement",
      ja: "非診断境界声明を表示",
    },
    stat1Label: { "zh-CN": "累计随访通话", "zh-TW": "累計隨訪通話", en: "Follow-up Calls", ja: "フォローアップ通話数" },
    stat1Sub: { "zh-CN": "来自试点科室审计", "zh-TW": "來自試點科室審計", en: "Pilot department audits", ja: "パイロット科室監査" },
    stat2Label: { "zh-CN": "严重不良事件", "zh-TW": "嚴重不良事件", en: "Severe Adverse Events", ja: "重篤な有害事象" },
    stat2Sub: { "zh-CN": "零伤害记录", "zh-TW": "零傷害記錄", en: "Zero harm record", ja: "ゼロ害記録" },
    stat3Label: { "zh-CN": "危急值转接护师", "zh-TW": "危急值轉接護師", en: "RN Bridge Handoff", ja: "RN ブリッジハンドオフ" },
    stat3Sub: { "zh-CN": "关键数值升级", "zh-TW": "關鍵數值升級", en: "Critical value escalation", ja: "クリティカル値エスカレーション" },
    stat4Label: { "zh-CN": "医护盲测准确率", "zh-TW": "醫護盲測準確率", en: "Clinical Accuracy", ja: "臨床正確性" },
    stat4Sub: { "zh-CN": "第三方验证进行中", "zh-TW": "第三方驗證進行中", en: "Third-party validation in progress", ja: "第三者検証進行中" },
    role1Title: { "zh-CN": "循证药典与肾功折算", "zh-TW": "循證藥典與腎功折算", en: "Evidence Formulary & Renal Dosing", ja: "エビデンス製剤集・腎機能減量" },
    role1Desc: { "zh-CN": "eGFR 阈值，KDIGO 2024，NRDL 定价，多药配伍禁忌核验。", "zh-TW": "eGFR 閾值，KDIGO 2024，NRDL 定價，多藥配伍禁忌核驗。", en: "eGFR cutoffs · KDIGO 2024 · NRDL pricing · multi-drug DDI checks.", ja: "eGFR カットオフ · KDIGO 2024 · NRDL 価格 · 多薬相互作用チェック。" },
    role2Title: { "zh-CN": "院外语音随访", "zh-TW": "院外語音隨訪", en: "Post-Discharge Voice Follow-up", ja: "退院後音声フォローアップ" },
    role2Desc: { "zh-CN": "32 路发声前否决，1.6 秒护师转接，CTCAE v5.0。", "zh-TW": "32 路發聲前否決，1.6 秒護師轉接，CTCAE v5.0。", en: "32 pre-speech veto gates · 1.6s RN bridge · CTCAE v5.0.", ja: "32 の発話前否決ゲート · 1.6 秒 RN ブリッジ · CTCAE v5.0。" },
    role3Title: { "zh-CN": "原声锚定 SOAP 与 FHIR 归档", "zh-TW": "原聲錨定 SOAP 與 FHIR 歸檔", en: "Audio-Anchored SOAP & FHIR R4", ja: "音声アンカー SOAP & FHIR R4" },
    role3Desc: { "zh-CN": "ICD-10 自动编码，DRG 权重，一键医师签字。", "zh-TW": "ICD-10 自動編碼，DRG 權重，一鍵醫師簽字。", en: "ICD-10 auto-coding · DRG weights · 1-click clinician sign.", ja: "ICD-10 自動コーディング · DRG ウェイト · 1 クリック医師サイン。" },
    enterWorkbench: { "zh-CN": "进入工作台", "zh-TW": "進入工作台", en: "Enter Workbench", ja: "ワークベンチへ" },
  };
  return map[key][l] || key;
}

const ROLES = [
  { tab: "evidence" as const, icon: Database, titleKey: "role1Title", descKey: "role1Desc" },
  { tab: "simulate" as const, icon: PhoneForwarded, titleKey: "role2Title", descKey: "role2Desc" },
  { tab: "scribe" as const, icon: FileCheck2, titleKey: "role3Title", descKey: "role3Desc" },
];

// Mock product preview panel — geometric, no stock imagery
function ProductPreview() {
  return (
    <div className="relative h-[520px] w-full rounded-[20px] border border-zj-border bg-zj-card shadow-lg overflow-hidden reveal" style={{ animationDelay: "0.2s" }}>
      <div className="absolute inset-0 bg-zj-cobalt-soft/40 rounded-[20px] pointer-events-none" />
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-zj-bg-soft border-b border-zj-border/50 flex items-center px-6 z-10">
        <div className="flex items-center gap-2 text-[11px] font-medium text-zj-slate">
          <span className="w-2 h-2 rounded-full bg-zj-clinical-rose" />
          <span className="w-2 h-2 rounded-full bg-zj-clinical-amber" />
          <span className="w-2 h-2 rounded-full bg-zj-clinical-green" />
          <span className="ml-3 text-zj-muted">Zhongjing Clinical OS · Production</span>
        </div>
      </div>
      <div className="absolute top-[64px] left-0 right-0 bottom-0 p-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left panel — formulary */}
        <div className="col-span-1 md:col-span-1 space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-[6px] bg-zj-cobalt-soft flex items-center justify-center shrink-0 border border-zj-border-cobalt/30">
              <Database className="w-4 h-4 text-zj-cobalt" />
            </div>
            <h4 className="text-[13px] font-semibold text-zj-ink">循证药典引擎</h4>
          </div>
          <div className="space-y-3">
            {[["eGFR 阈值 · KDIGO 2024", "NRDL 定价 · 多药配伍"], ["肾功精准折算 · 毫秒级响应", "离线院内运行 · 无公有云"]].map((row, i) => (
              <div key={i} className="p-3 rounded-[8px] bg-zj-bg-soft border border-zj-border/50">
                <div className="text-[11px] font-medium text-zj-cobalt mb-1">{row[0]}</div>
                <div className="text-[11px] text-zj-slate">{row[1]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right panel — follow-up */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-[6px] bg-zj-clinical-green-soft flex items-center justify-center shrink-0 border border-zj-border-green/30">
              <PhoneForwarded className="w-4 h-4 text-zj-clinical-green" />
            </div>
            <h4 className="text-[13px] font-semibold text-zj-ink">院外语音随访</h4>
          </div>
          <div className="space-y-3">
            {[["32 路发声前否决栅栏", "零诊断越界"], ["1.6 秒护师转接 · CTCAE v5.0", "危急值处理升级"]].map((row, i) => (
              <div key={i} className="p-3 rounded-[8px] bg-zj-bg-soft border border-zj-border/50">
                <div className="text-[11px] font-medium text-zj-clinical-green mb-1">{row[0]}</div>
                <div className="text-[11px] text-zj-slate">{row[1]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom — SOAP */}
        <div className="md:col-span-2 p-3 rounded-[8px] bg-zj-bg-soft border border-zj-border/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-zj-clinical-teal-soft flex items-center justify-center shrink-0 border border-zj-border-cobalt/30">
            <FileCheck2 className="w-4 h-4 text-zj-clinical-teal" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-medium text-zj-clinical-teal mb-1">原声锚定 SOAP · FHIR R4 归档</div>
            <div className="text-[11px] text-zj-slate">ICD-10 自动编码 · DRG 权重 · 一键医师签字写入 EMR</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zj-cobalt shrink-0" />
        </div>
      </div>
      {/* Bottom decorative dots */}
      <div className="absolute bottom-6 left-6 flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-zj-muted/30" />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section className="relative overflow-hidden bg-zj-bg border-b border-zj-border">
      <div className="absolute inset-0 geom-grid" />
      <div className="geom-circle w-[800px] h-[800px] bg-zj-cobalt-soft top-[-20%] left-[-10%] rounded-full blur-[120px]" />
      <div className="geom-circle w-[600px] h-[600px] bg-zj-clinical-green-soft bottom-[-10%] right-[-10%] rounded-full blur-[100px]" />

      <div className="relative section-container pt-24 pb-32 lg:pt-40 lg:pb-48 reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: Editorial + CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center reveal" style={{ animationDelay: "0.1s" }}>
            <span className="eyebrow text-zj-clinical-green mb-8 block tracking-[0.18em]">
              {get("eyebrow")}
            </span>

            <h1 className="font-serif-editorial text-[40px] sm:text-[56px] lg:text-[80px] xl:text-[100px] leading-[1.05] tracking-[-0.03em] text-zj-ink font-normal mb-10">
              {get("headline")}
            </h1>

            <p className="max-w-[52ch] text-[17px] sm:text-[20px] leading-[1.85] text-zj-ink-soft mb-14">
              {get("sub")}
            </p>

            <div className="flex flex-wrap items-center gap-5 mb-16">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("zj-open-demo"))}
                className="btn-base btn-primary"
              >
                {get("cta")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("zj-open-safety"))}
                className="btn-base btn-ghost"
              >
                {get("safety")}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border border-zj-border bg-zj-card rounded-[16px] p-8 shadow-lg reveal" style={{ animationDelay: "0.3s" }}>
              {[
                { label: get("stat1Label"), value: "3.68亿", sub: get("stat1Sub") },
                { label: get("stat2Label"), value: "0 例", sub: get("stat2Sub") },
                { label: get("stat3Label"), value: "1.6s", sub: get("stat3Sub") },
                { label: get("stat4Label"), value: "99.91%", sub: get("stat4Sub") },
              ].map((s) => (
                <div key={s.label}>
                  <div className="stat-value text-[24px] sm:text-[32px] leading-none text-zj-ink font-mono-hud mb-2">
                    {s.value}
                  </div>
                  <div className="text-[10px] font-medium tracking-wider text-zj-clinical-green uppercase mb-1.5">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-zj-muted">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2.5 reveal" style={{ animationDelay: "0.4s" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-zj-muted shrink-0" />
              <span className="text-[10px] text-zj-muted">
                {isZh ? "数据来自试点科室审计 · 第三方验证进行中" : "Data from pilot department audits · Third-party validation in progress"}
              </span>
            </div>
          </div>

          {/* Right: Product preview */}
          <div className="lg:col-span-6 flex justify-center reveal" style={{ animationDelay: "0.2s" }}>
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
