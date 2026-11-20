"use client";

import React from "react";
import { ShieldCheck, TrendingUp, Lock, Coins } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: { "zh-CN": "价值主张", "zh-TW": "價值主張", en: "Value Proposition", ja: "バリュープロポジション" },
    title: {
      "zh-CN": "四件医院买单的事",
      "zh-TW": "四件醫院買單的事",
      en: "Four Things Hospitals Pay For",
      ja: "病院が支払う四つのこと",
    },
    sub: {
      "zh-CN": "不是口号，是真实的运营改善。每一项都对应一个可量化的科室痛点。",
      "zh-TW": "不是口號，是真實的運營改善。每一項都對應一個可量化的科室痛點。",
      en: "Not slogans. Real operational improvement. Each maps to a measurable department pain point.",
      ja: "スローガンではない。実際の運用改善。各項目が測定可能な診療科の課題に対応する。",
    },
    v1Title: { "zh-CN": "患者安全第一", "zh-TW": "患者安全第一", en: "Patient Safety First", ja: "患者安全が最優先" },
    v1Desc: {
      "zh-CN": "32 路发声前否决栅栏，覆盖 LOINC 危急值与 CTCAE v5.0。零诊断越界，最终决策权在医师。",
      "zh-TW": "32 路發聲前否決柵欄，覆蓋 LOINC 危急值與 CTCAE v5.0。零診斷越界，最終決策權在醫師。",
      en: "32 pre-speech veto gates covering LOINC critical values and CTCAE v5.0. Zero diagnostic overreach. Final decision authority rests with the physician.",
      ja: "32の発話前否決ゲートがLOINCクリティカル値とCTCAE v5.0をカバー。診断逸脱ゼロ。最終意思決定権は医師にある。",
    },
    v2Title: { "zh-CN": "工作流效率", "zh-TW": "工作流效率", en: "Workflow Efficiency", ja: "ワークフロー効率化" },
    v2Desc: {
      "zh-CN": "原声锚定 SOAP，ICD-10 自动编码，一键医师签字写入 EMR。减少医护文书负担。",
      "zh-TW": "原聲錨定 SOAP，ICD-10 自動編碼，一鍵醫師簽字寫入 EMR。減少醫護文書負擔。",
      en: "Audio-anchored SOAP, ICD-10 auto-coding, one-click clinician sign-to-EMR. Reduces documentation burden.",
      ja: "音声アンカーSOAP、ICD-10自動コーディング、1クリック医師サインでEMRへ。文書作成負担を軽減。",
    },
    v3Title: { "zh-CN": "数据主权", "zh-TW": "數據主權", en: "Data Sovereignty", ja: "データ主権" },
    v3Desc: {
      "zh-CN": "100% 院内部署，SM4 加密，零公有云上传。数据所有权始终归属医疗机构。",
      "zh-TW": "100% 院內部署，SM4 加密，零公有雲上傳。數據所有權始終歸屬醫療機構。",
      en: "100% on-premise deployment, SM4 encryption, zero public-cloud upload. Data ownership remains with the medical institution.",
      ja: "100%院内導入、SM4暗号化、パブリッククラウドアップロードゼロ。データ所有権は常に医療機関に帰属する。",
    },
    v4Title: { "zh-CN": "付费精准", "zh-TW": "付費精準", en: "Payment Precision", ja: "支払い精度" },
    v4Desc: {
      "zh-CN": "ICD-10-CM 国家临床版 2.0，DRG 权重，年龄调整基点，医保支付与患者自付实时估算。",
      "zh-TW": "ICD-10-CM 國家臨床版 2.0，DRG 權重，年齡調整基點，醫療保險支付與患者自付即時估算。",
      en: "ICD-10-CM CN clinical v2.0, DRG weights, age-adjusted base points, real-time insurance and co-pay estimation.",
      ja: "ICD-10-CM中国臨床版2.0、DRGウェイト、年齢調整基点、保険支払いと患者自己負担のリアルタイム見積もり。",
    },
    m1Label: { "zh-CN": "危急值处理时效", "zh-TW": "危急值處理時效", en: "Critical Value Turnaround", ja: "クリティカル値対応時間" },
    m1Val: { "zh-CN": "5x 以上", "zh-TW": "5x 以上", en: "5x+", ja: "5倍以上" },
    m2Label: { "zh-CN": "文书时间下降", "zh-TW": "文書時間下降", en: "Documentation Time Reduced", ja: "文書作成時間の削減" },
    m2Val: { "zh-CN": "15-30%", "zh-TW": "15-30%", en: "15-30%", ja: "15-30%" },
    m3Label: { "zh-CN": "合规审计通过率", "zh-TW": "合規審計通過率", en: "Compliance Audit Pass Rate", ja: "コンプライアンス監査合格率" },
    m3Val: { "zh-CN": "100%", "zh-TW": "100%", en: "100%", ja: "100%" },
  };
  return map[key][l] || key;
}

const PILLARS = [
  { key: "v1", icon: ShieldCheck, titleKey: "v1Title", descKey: "v1Desc", accent: "text-zj-clinical-green" },
  { key: "v2", icon: TrendingUp, titleKey: "v2Title", descKey: "v2Desc", accent: "text-zj-cobalt" },
  { key: "v3", icon: Lock, titleKey: "v3Title", descKey: "v3Desc", accent: "text-zj-clinical-teal" },
  { key: "v4", icon: Coins, titleKey: "v4Title", descKey: "v4Desc", accent: "text-zj-clinical-amber" },
];

export function ValuePropositionSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  const METRICS = [
    { label: get("m1Label"), val: get("m1Val") },
    { label: get("m2Label"), val: get("m2Val") },
    { label: get("m3Label"), val: get("m3Val") },
  ];

  return (
    <section id="value" className="bg-zj-bg border-b border-zj-border py-20 lg:py-32 reveal">
      <div className="relative section-container">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-zj-cobalt-soft/50 rounded-full blur-[160px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        {/* Four pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.key}
                className={`card-base group hover:border-zj-border-cobalt/50`}
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border border-zj-border/40 group-hover:border-zj-cobalt/50 transition-colors duration-300 bg-zj-card/50`}>
                    <Icon className={`w-6 h-6 ${p.accent === "text-zj-clinical-green" ? "text-zj-clinical-green" : p.accent === "text-zj-cobalt" ? "text-zj-cobalt" : p.accent === "text-zj-clinical-teal" ? "text-zj-clinical-teal" : "text-zj-clinical-amber"} group-hover:text-zj-cobalt transition-colors duration-300`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${p.accent === "text-zj-clinical-green" ? "text-zj-clinical-green" : p.accent === "text-zj-cobalt" ? "text-zj-cobalt" : p.accent === "text-zj-clinical-teal" ? "text-zj-clinical-teal" : "text-zj-clinical-amber"}`}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-zj-ink mb-3.5 leading-snug reveal" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  {T(p.titleKey, l)}
                </h3>
                <p className="text-[14px] leading-[1.8] text-zj-slate reveal" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  {T(p.descKey, l)}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Metrics strip */}
        <div className="border border-zj-border rounded-[20px] bg-zj-card shadow-md p-10 lg:p-16 reveal" style={{ animationDelay: "0.5s" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div>
              <h3 className="text-[16px] font-semibold text-zj-ink">可量化的改善</h3>
              <p className="text-[12px] text-zj-slate mt-1">基于试点科室真实运营数据</p>
            </div>
            <div className="flex gap-8 text-right md:text-left">
              {METRICS.map((m, i) => (
                <div key={m.label} className="text-right md:text-left reveal" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="text-[30px] font-serif-editorial font-bold text-zj-ink mb-1 leading-none">{m.val}</div>
                  <div className="text-[12px] text-zj-slate">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
