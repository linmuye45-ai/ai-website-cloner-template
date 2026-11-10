"use client";

import React from "react";
import { Database, ShieldCheck, FileText, PhoneForwarded, Lock, Activity } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "临床能力",
      "zh-TW": "臨床能力",
      en: "Clinical Capabilities",
      ja: "臨床機能",
    },
    title: {
      "zh-CN": "六件确定的事",
      "zh-TW": "六件確定的事",
      en: "Six Deterministic Things",
      ja: "確定的な六つのこと",
    },
    sub: {
      "zh-CN": "基于 KDIGO 2024、NCI CTCAE v5.0、ICD-10-CM、LOINC、NRDL 等权威公开临床数据。",
      "zh-TW": "基於 KDIGO 2024、NCI CTCAE v5.0、ICD-10-CM、LOINC、NRDL 等權威公開臨床數據。",
      en: "Built on authoritative open clinical data — KDIGO 2024, NCI CTCAE v5.0, ICD-10-CM, LOINC, NRDL.",
      ja: "KDIGO 2024、NCI CTCAE v5.0、ICD-10-CM、LOINC、NRDLなどの権威ある公開臨床データに基づく。",
    },
    c1Title: { "zh-CN": "循证药典引擎", "zh-TW": "循證藥典引擎", en: "Evidence Formulary Engine", ja: "エビデンス製剤集エンジン" },
    c1Desc: {
      "zh-CN": "确定性 eGFR 肾功剂量、KDIGO 2024 阈值、NRDL 定价，多药配伍禁忌核验。毫秒级响应，离线院内运行。",
      "zh-TW": "確定性 eGFR 腎功劑量、KDIGO 2024 閾值、NRDL 定價，多藥配伍禁忌核驗。毫秒級反應，離線院內運行。",
      en: "Deterministic eGFR renal dosing, KDIGO 2024 thresholds, NRDL pricing, multi-drug DDI checks. Millisecond response, offline on-premise operation.",
      ja: "決定論的eGFR腎機能減量、KDIGO 2024閾値、NRDL価格、多薬相互作用チェック。ミリ秒応答、オフライン院内動作。",
    },
    c1Badge: { "zh-CN": "KDIGO 2024 · NRDL", "zh-TW": "KDIGO 2024 · NRDL", en: "KDIGO 2024 · NRDL", ja: "KDIGO 2024 · NRDL" },
    c2Title: { "zh-CN": "发声前否决栅栏", "zh-TW": "發聲前否決柵欄", en: "Pre-Speech Veto Gates", ja: "発話前否決ゲート" },
    c2Desc: {
      "zh-CN": "32 路发声前确定性核验门，覆盖 LOINC 危急值、CTCAE v5.0、处方边界与非诊断锁恒。零诊断越界。",
      "zh-TW": "32 路發聲前確定性核驗門，覆蓋 LOINC 危急值、CTCAE v5.0、處方邊界與非診斷鎖恆。零診斷越界。",
      en: "32 deterministic pre-speech verification gates covering LOINC critical values, CTCAE v5.0, prescription boundaries, and non-diagnostic locks. Zero diagnostic overreach.",
      ja: "32の決定論的発話前検証ゲートがLOINCクリティカル値、CTCAE v5.0、処方境界、非診断ロックをカバー。診断逸脱ゼロ。",
    },
    c2Badge: { "zh-CN": "32 栅栏 · 1.6s 护师", "zh-TW": "32 柵欄 · 1.6s 護師", en: "32 Gates · 1.6s RN", ja: "32ゲート · 1.6s 看護師" },
    c3Title: { "zh-CN": "原声锚定 SOAP", "zh-TW": "原聲錨定 SOAP", en: "Audio-Anchored SOAP", ja: "音声アンカーSOAP" },
    c3Desc: {
      "zh-CN": "FHIR R4 结构化临床记录，带时间戳原声证据锚点，ICD-10 自动编码，DRG 权重，一键医师签字写入 EMR。",
      "zh-TW": "FHIR R4 結構化臨床記録，帶時間戳原聲證據錨點，ICD-10 自動編碼，DRG 權重，一鍵醫師簽字寫入 EMR。",
      en: "FHIR R4 structured clinical notes with timestamped audio evidence anchors, ICD-10 auto-coding, DRG weights, one-click clinician sign-to-EMR.",
      ja: "FHIR R4構造化臨床記録、タイムスタンプ付き音声証拠アンカー、ICD-10自動コーディング、DRGウェイト、1クリック医師サインでEMRへ。",
    },
    c3Badge: { "zh-CN": "FHIR R4 · ICD-10", "zh-TW": "FHIR R4 · ICD-10", en: "FHIR R4 · ICD-10", ja: "FHIR R4 · ICD-10" },
    c4Title: { "zh-CN": "语音随访与护师转接", "zh-TW": "語音隨訪與護師轉接", en: "Voice Follow-up & RN Bridge", ja: "音声フォローアップ & RNブリッジ" },
    c4Desc: {
      "zh-CN": "出院后患者主动随访，CTCAE v5.0 症状检测，SBAR 转接工单，1.6 秒人工护师桥接。",
      "zh-TW": "出院後患者主動隨訪，CTCAE v5.0 症狀檢測，SBAR 轉接工單，1.6 秒人工護師橋接。",
      en: "Post-discharge patient outreach with CTCAE v5.0 symptom detection, SBAR escalation tickets, and 1.6-second live nurse bridging.",
      ja: "退院後患者への主動フォローアップ、CTCAE v5.0症状検出、SBARエスカレーションチケット、1.6秒のライブ看護師ブリッジ。",
    },
    c4Badge: { "zh-CN": "CTCAE v5.0 · SBAR", "zh-TW": "CTCAE v5.0 · SBAR", en: "CTCAE v5.0 · SBAR", ja: "CTCAE v5.0 · SBAR" },
    c5Title: { "zh-CN": "院内数据主权", "zh-TW": "院內數據主權", en: "In-Hospital Data Sovereignty", ja: "院内データ主権" },
    c5Desc: {
      "zh-CN": "100% 院内部署，SM4 加密，零公有云上传。支持三甲纯内网断网，完整审计痕迹保留 5 年以上。",
      "zh-TW": "100% 院內部署，SM4 加密，零公有雲上傳。支持三甲純內網斷網，完整審計痕跡保留 5 年以上。",
      en: "100% on-premise deployment, SM4 encryption, zero public-cloud upload. Air-gapped Tier-3 support; audit trails retained 5+ years.",
      ja: "100%院内導入、SM4暗号化、パブリッククラウドアップロードゼロ。三次救急病院の院内網断ネットワーク対応。完全な監査証跡を5年以上保持。",
    },
    c5Badge: { "zh-CN": "SM4 · 断网支持", "zh-TW": "SM4 · 斷網支持", en: "SM4 · Air-Gapped", ja: "SM4 · 院内網断" },
    c6Title: { "zh-CN": "DRG/DIP 付费模拟", "zh-TW": "DRG/DIP 付費模擬", en: "DRG/DIP Payment Simulation", ja: "DRG/DIP 支払いシミュレーション" },
    c6Desc: {
      "zh-CN": "ICD-10-CM 国家临床版 2.0，DRG 权重，年龄调整基点，超额床日附加，医保支付与患者自付实时估算。",
      "zh-TW": "ICD-10-CM 國家臨床版 2.0，DRG 權重，年齡調整基點，超額床日附加，醫療保險支付與患者自付即時估算。",
      en: "ICD-10-CM CN clinical v2.0, DRG weights, age-adjusted base points, excess bed-day surcharges, real-time insurance and patient co-pay estimation.",
      ja: "ICD-10-CM中国臨床版2.0、DRGウェイト、年齢調整基点、超過床日加算、保険支払いと患者自己負担のリアルタイム見積もり。",
    },
    c6Badge: { "zh-CN": "DRG/DIP · 人民币", "zh-TW": "DRG/DIP · 人民幣", en: "DRG/DIP · CNY", ja: "DRG/DIP · CNY" },
  };
  return map[key][l] || key;
}

const CAPABILITIES = [
  { key: "c1", icon: Database, titleKey: "c1Title", descKey: "c1Desc", badgeKey: "c1Badge", highlight: true },
  { key: "c2", icon: ShieldCheck, titleKey: "c2Title", descKey: "c2Desc", badgeKey: "c2Badge" },
  { key: "c3", icon: FileText, titleKey: "c3Title", descKey: "c3Desc", badgeKey: "c3Badge" },
  { key: "c4", icon: PhoneForwarded, titleKey: "c4Title", descKey: "c4Desc", badgeKey: "c4Badge" },
  { key: "c5", icon: Lock, titleKey: "c5Title", descKey: "c5Desc", badgeKey: "c5Badge" },
  { key: "c6", icon: Activity, titleKey: "c6Title", descKey: "c6Desc", badgeKey: "c6Badge" },
];

export function ProductCapabilitiesSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="capabilities" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-zj-safe-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <BentoGrid cols={3} gap="gap-7">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <BentoGridItem
                key={cap.key}
                title={isZh ? T(cap.titleKey, l) : T(cap.titleKey, l)}
                description={isZh ? T(cap.descKey, l) : T(cap.descKey, l)}
                icon={<Icon className="w-5 h-5 text-zj-cobalt" />}
                variant={cap.highlight ? "highlight" : "default"}
              >
                <Badge variant="soft">{isZh ? T(cap.badgeKey, l) : T(cap.badgeKey, l)}</Badge>
              </BentoGridItem>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
