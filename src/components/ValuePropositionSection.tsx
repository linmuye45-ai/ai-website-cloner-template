"use client";

import React from "react";
import { ShieldCheck, Activity, Lock, TrendingUp } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "核心价值",
      "zh-TW": "核心價值",
      en: "Core Value",
      ja: "コアバリュー",
    },
    title: {
      "zh-CN": "四件事，医院买单",
      "zh-TW": "四件事，醫院買單",
      en: "Four Things Hospitals Pay For",
      ja: "病院が支払う四つのこと",
    },
    sub: {
      "zh-CN": "不讲宏大叙事，只讲院长、信息科主任、科室主任在会议室里能说明白的事。",
      "zh-TW": "不講宏大敘事，只講院長、資訊科主任、科室主任在會議室裡能說明白的事。",
      en: "No grand narratives. Only what a hospital president, IT director, and department head can explain clearly in a meeting room.",
      ja: "壮大な物語は語らない。病院長、IT責任者、診療部長が会議室で説明できることだけを語る。",
    },
    p1Title: { "zh-CN": "患者安全至上", "zh-TW": "患者安全至上", en: "Patient Safety First", ja: "患者安全を最優先" },
    p1Desc: {
      "zh-CN": "32 路发声前否决栅栏，覆盖 LOINC 危急值、CTCAE v5.0 症状分级与处方边界锁恒。确保每一次输出都经安全审查。",
      "zh-TW": "32 路發聲前否決柵欄，覆蓋 LOINC 危急值、CTCAE v5.0 症狀分級與處方邊界鎖恆。確保每一次輸出都經安全審查。",
      en: "32 pre-speech veto gates covering LOINC critical values, CTCAE v5.0 symptom grading, and prescription boundary locks. Every output is safety-reviewed before delivery.",
      ja: "32の発話前否決ゲートがLOINCクリティカル値、CTCAE v5.0症状グレード、処方境界ロックをカバー。すべての出力は安全レビューを経てから提供される。",
    },
    p1Metric: { "zh-CN": "0 例", "zh-TW": "0 例", en: "0 cases", ja: "0例" },
    p1MetricLabel: { "zh-CN": "严重不良事件", "zh-TW": "嚴重不良事件", en: "Severe adverse events", ja: "重篤な有害事象" },
    p2Title: { "zh-CN": "临床工作效率", "zh-TW": "臨床工作效率", en: "Clinical Workflow Efficiency", ja: "臨床ワークフロー効率化" },
    p2Desc: {
      "zh-CN": "原声锚定 SOAP 与 FHIR R4 归档，ICD-10 自动编码与 DRG 权重计算，一键医师签字写入 EMR，释放医护文书时间。",
      "zh-TW": "原聲錨定 SOAP 與 FHIR R4 歸檔，ICD-10 自動編碼與 DRG 權重計算，一鍵醫師簽字寫入 EMR，釋放醫護文書時間。",
      en: "Audio-anchored SOAP with FHIR R4 archiving, ICD-10 auto-coding and DRG weight calculation. One-click clinician sign-to-EMR.",
      ja: "音声アンカーSOAPとFHIR R4アーカイブ、ICD-10自動コーディングとDRGウェイト計算。1クリックで医師がEMRにサイン。",
    },
    p2Metric: { "zh-CN": "1.6s", "zh-TW": "1.6s", en: "1.6s", ja: "1.6秒" },
    p2MetricLabel: { "zh-CN": "危急值转接护师", "zh-TW": "危急值轉接護師", en: "RN bridge handoff", ja: "RN ブリッジハンドオフ" },
    p3Title: { "zh-CN": "院内数据主权", "zh-TW": "院內數據主權", en: "In-Hospital Data Sovereignty", ja: "院内データ主権" },
    p3Desc: {
      "zh-CN": "100% 院内部署，SM4 加密，零公有云上传。数据所有权始终归属医疗机构。",
      "zh-TW": "100% 院內部署，SM4 加密，零公有雲上傳。數據所有權始終歸屬醫療機構。",
      en: "100% on-premise deployment, SM4 encryption, zero public-cloud upload. Data ownership remains with the medical institution.",
      ja: "100%院内導入、SM4暗号化、パブリッククラウドアップロードゼロ。データ所有権は常に医療機関に帰属する。",
    },
    p3Metric: { "zh-CN": "零", "zh-TW": "零", en: "Zero", ja: "ゼロ" },
    p3MetricLabel: { "zh-CN": "云上传", "zh-TW": "雲上傳", en: "Cloud uploads", ja: "クラウドアップロード" },
    p4Title: { "zh-CN": "医疗付费精准", "zh-TW": "醫療付費精準", en: "Payment & DRG Precision", ja: "医療支払い精度" },
    p4Desc: {
      "zh-CN": "ICD-10-CM 国家临床版 2.0，DRG/DIP 付费模拟，年龄调整基点与超额床日附加，医保支付与患者自付实时估算。",
      "zh-TW": "ICD-10-CM 國家臨床版 2.0，DRG/DIP 付費模擬，年齡調整基點與超額床日附加，醫療保險支付與患者自付即時估算。",
      en: "ICD-10-CM CN clinical v2.0, DRG/DIP payment simulation, age-adjusted base points and excess bed-day surcharges, real-time insurance and patient co-pay estimation.",
      ja: "ICD-10-CM中国臨床版2.0、DRG/DIP支払いシミュレーション、年齢調整基点と超過床日加算、保険支払いと患者自己負担のリアルタイム見積もり。",
    },
    p4Metric: { "zh-CN": "2.0", "zh-TW": "2.0", en: "v2.0", ja: "v2.0" },
    p4MetricLabel: { "zh-CN": "国家临床版", "zh-TW": "國家臨床版", en: "CN clinical version", ja: "中国臨床版" },
  };
  return map[key][l] || key;
}

const PILLARS = [
  { key: "p1", icon: ShieldCheck, titleKey: "p1Title", descKey: "p1Desc", metricKey: "p1Metric", metricLabelKey: "p1MetricLabel" },
  { key: "p2", icon: Activity, titleKey: "p2Title", descKey: "p2Desc", metricKey: "p2Metric", metricLabelKey: "p2MetricLabel" },
  { key: "p3", icon: Lock, titleKey: "p3Title", descKey: "p3Desc", metricKey: "p3Metric", metricLabelKey: "p3MetricLabel" },
  { key: "p4", icon: TrendingUp, titleKey: "p4Title", descKey: "p4Desc", metricKey: "p4Metric", metricLabelKey: "p4MetricLabel" },
];

export function ValuePropositionSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="value" className="bg-zj-mist border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute right-0 top-0 w-64 h-64 bg-zj-cyan-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.key}
                variant="default"
                padding="lg"
                hover="lift"
                className="border-zj-border/60"
              >
                <div className="w-12 h-12 rounded-[8px] bg-zj-cobalt-soft flex items-center justify-center mb-5 shrink-0">
                  <Icon className="w-6 h-6 text-zj-cobalt" />
                </div>
                <h3 className="text-[15px] font-semibold text-zj-ink mb-2.5 leading-snug">
                  {isZh ? T(p.titleKey, l) : T(p.titleKey, l)}
                </h3>
                <p className="text-[13.5px] leading-[1.7] text-zj-slate mb-5">
                  {isZh ? T(p.descKey, l) : T(p.descKey, l)}
                </p>
                <div className="pt-4 border-t border-zj-border/40">
                  <div className="flex items-baseline gap-1">
                    <span className="stat-value text-[20px] font-bold text-zj-ink">
                      {isZh ? T(p.metricKey, l) : T(p.metricKey, l)}
                    </span>
                    <span className="text-[10px] font-medium tracking-wide text-zj-cobalt uppercase ml-1">
                      {isZh ? T(p.metricLabelKey, l) : T(p.metricLabelKey, l)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
