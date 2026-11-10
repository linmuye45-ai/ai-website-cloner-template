"use client";

import React from "react";
import { ShieldCheck, Lock, Database, FileText, Activity, Barcode, Award, Clock } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "临床标准合规",
      "zh-TW": "臨床標準合規",
      en: "Clinical Standards Compliance",
      ja: "臨床基準コンプライアンス",
    },
    title: {
      "zh-CN": "六条红线，不逾越",
      "zh-TW": "六條紅線，不過越",
      en: "Six Red Lines. Not Crossed.",
      ja: "六つのレッドライン。超えない。",
    },
    sub: {
      "zh-CN": "合规不是营销话术，是医院采购的硬门槛。",
      "zh-TW": "合規不是營銷話術，是醫院採購的硬門檻。",
      en: "Compliance is not marketing talk. It is a hard threshold for hospital procurement.",
      ja: "コンプライアンスはマーケティングの言葉ではない。病院調達のハードルだ。",
    },
    s1Title: { "zh-CN": "非诊断边界", "zh-TW": "非診斷邊界", en: "Non-Diagnostic Boundary", ja: "非診断境界" },
    s1Desc: { "zh-CN": "不承诺诊断，不修改处方。AI 只提供参考信息，最终决策权在医师。", "zh-TW": "不承諾診斷，不修改處方。AI 只提供參考資訊，最終決策權在醫師。", en: "No diagnostic promises, no prescription changes. AI provides reference information only. Final decision authority rests with the physician.", ja: "診断を約束せず、処方を変更しない。AIは参考情報のみを提供し、最終的な意思決定権は医師にある。" },
    s1Detail: { "zh-CN": "零诊断越界", "zh-TW": "零診斷越界", en: "Zero diagnostic overreach", ja: "診断逸脱ゼロ" },
    s2Title: { "zh-CN": "数据主权", "zh-TW": "數據主權", en: "Data Sovereignty", ja: "データ主権" },
    s2Desc: { "zh-CN": "100% 院内部署，SM4 加密，零公有云上传。数据所有权始终归属医疗机构。", "zh-TW": "100% 院內部署，SM4 加密，零公有雲上傳。數據所有權始終歸屬醫療機構。", en: "100% on-premise deployment, SM4 encryption, zero public-cloud upload. Data ownership remains with the medical institution.", ja: "100%院内導入、SM4暗号化、パブリッククラウドアップロードゼロ。データ所有権は常に医療機関に帰属する。" },
    s2Detail: { "zh-CN": "零云上传", "zh-TW": "零雲上傳", en: "Zero cloud uploads", ja: "クラウドアップロードゼロ" },
    s3Title: { "zh-CN": "确定性引擎", "zh-TW": "確定性引擎", en: "Deterministic Engine", ja: "決定論的エンジン" },
    s3Desc: { "zh-CN": "相同输入始终得到相同输出。无幻觉，无随机性，可审计、可重现。", "zh-TW": "相同輸入始終得到相同輸出。無幻覺，無隨機性，可審計、可重現。", en: "Same input always produces same output. No hallucination, no randomness. Auditable and reproducible.", ja: "同じ入力には常に同じ出力が返される。ハルシネーションなし、ランダム性なし。監査可能、再現可能。" },
    s3Detail: { "zh-CN": "可审计可重现", "zh-TW": "可審計可重現", en: "Auditable · Reproducible", ja: "監査可能 · 再現可能" },
    s4Title: { "zh-CN": "FHIR R4 归档", "zh-TW": "FHIR R4 歸檔", en: "FHIR R4 Archiving", ja: "FHIR R4 アーカイブ" },
    s4Desc: { "zh-CN": "临床记录与医疗数据交换遵循 HL7 FHIR R4 规范，确保系统间互操作性。", "zh-TW": "臨床記録與醫療データ交換遵循 HL7 FHIR R4 規格，確保系統間互操作性。", en: "Clinical records and healthcare data exchange follow HL7 FHIR R4 specifications for interoperability.", ja: "臨床記録と医療データ交換はHL7 FHIR R4仕様に準拠し、システム間の相互運用性を確保。" },
    s4Detail: { "zh-CN": "HL7 FHIR R4", "zh-TW": "HL7 FHIR R4", en: "HL7 FHIR R4", ja: "HL7 FHIR R4" },
    s5Title: { "zh-CN": "发声前否决", "zh-TW": "發聲前否決", en: "Pre-Speech Veto", ja: "発話前否決" },
    s5Desc: { "zh-CN": "32 路发声前确定性核验门，覆盖 LOINC 危急值、CTCAE v5.0、处方边界。", "zh-TW": "32 路發聲前確定性核驗門，覆蓋 LOINC 危急值、CTCAE v5.0、處方邊界。", en: "32 deterministic pre-speech verification gates covering LOINC critical values, CTCAE v5.0, and prescription boundaries.", ja: "32の決定論的発話前検証ゲートがLOINCクリティカル値、CTCAE v5.0、処方境界をカバー。" },
    s5Detail: { "zh-CN": "32 路否决栅栏", "zh-TW": "32 路否決柵欄", en: "32 Veto Gates", ja: "32の否決ゲート" },
    s6Title: { "zh-CN": "合规红线", "zh-TW": "合規紅線", en: "Compliance Redlines", ja: "コンプライアンスレッドライン" },
    s6Desc: { "zh-CN": "等保三级、NMPA 医疗器械注册、数据安全法合规审计。", "zh-TW": "等保三級、NMPA 醫療器械登錄、數據安全法合規審計。", en: "Level 3 protection, NMPA device registration, Data Security Law audit.", ja: "レベル3保護、NMPA医療機器登録、データセキュリティ法監査。" },
    s6Detail: { "zh-CN": "合规里程碑", "zh-TW": "合規里程碑", en: "Compliance Milestones", ja: "コンプライアンスマイルストーン" },
    c1Title: { "zh-CN": "等保三级合规", "zh-TW": "等保三級合規", en: "Level 3 Protection Compliance", ja: "レベル3保護準拠" },
    c1Date: { "zh-CN": "2024 Q4", "zh-TW": "2024 Q4", en: "Q4 2024", ja: "2024 Q4" },
    c1Status: { "zh-CN": "已完成", "zh-TW": "已完成", en: "Completed", ja: "完了" },
    c2Title: { "zh-CN": "NMPA 医疗器械注册", "zh-TW": "NMPA 醫療器械登錄", en: "NMPA Device Registration", ja: "NMPA 医療機器登録" },
    c2Date: { "zh-CN": "2025 Q2", "zh-TW": "2025 Q2", en: "Q2 2025", ja: "2025 Q2" },
    c2Status: { "zh-CN": "申报中", "zh-TW": "申報中", en: "Filing", ja: "申請中" },
    c3Title: { "zh-CN": "数据安全法合规审计", "zh-TW": "數據安全法合規審計", en: "Data Security Law Audit", ja: "データセキュリティ法監査" },
    c3Date: { "zh-CN": "2025 Q3", "zh-TW": "2025 Q3", en: "Q3 2025", ja: "2025 Q3" },
    c3Status: { "zh-CN": "规划中", "zh-TW": "規劃中", en: "Planned", ja: "計画中" },
  };
  return map[key][l] || key;
}

const STANDARDS = [
  { icon: ShieldCheck, titleKey: "s1Title", descKey: "s1Desc", detailKey: "s1Detail" },
  { icon: Lock, titleKey: "s2Title", descKey: "s2Desc", detailKey: "s2Detail" },
  { icon: Database, titleKey: "s3Title", descKey: "s3Desc", detailKey: "s3Detail" },
  { icon: FileText, titleKey: "s4Title", descKey: "s4Desc", detailKey: "s4Detail" },
  { icon: Activity, titleKey: "s5Title", descKey: "s5Desc", detailKey: "s5Detail" },
  { icon: Barcode, titleKey: "s6Title", descKey: "s6Desc", detailKey: "s6Detail" },
];

const MILESTONES = [
  { icon: ShieldCheck, titleKey: "c1Title", dateKey: "c1Date", statusKey: "c1Status" },
  { icon: Clock, titleKey: "c2Title", dateKey: "c2Date", statusKey: "c2Status" },
  { icon: Database, titleKey: "c3Title", dateKey: "c3Date", statusKey: "c3Status" },
];

export function ClinicalStandardsSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="standards" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 scroll-mt-20 reveal">
      <div className="relative section-container">
        <div className="absolute right-0 top-0 w-64 h-64 bg-zj-cyan-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        {/* Six clinical standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20">
          {STANDARDS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.titleKey} className="p-8 bg-zj-mist/30 border border-zj-border rounded-[10px] hover:border-zj-cobalt/50 transition-colors">
                <div className="w-11 h-11 rounded-[8px] bg-zj-cobalt-soft flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-zj-cobalt" />
                </div>
                <h3 className="text-[15px] font-semibold text-zj-ink mb-2 leading-snug">{isZh ? T(s.titleKey, l) : T(s.titleKey, l)}</h3>
                <p className="text-[13.5px] leading-[1.7] text-zj-slate mb-4">{isZh ? T(s.descKey, l) : T(s.descKey, l)}</p>
                <div className="font-mono-hud text-[11px] text-zj-muted border-t border-zj-border pt-3">
                  {isZh ? T(s.detailKey, l) : T(s.detailKey, l)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance milestones */}
        <div className="pt-10 border-t border-zj-border bg-zj-mist/20 rounded-[9px] p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[12px] font-bold tracking-wider text-zj-cobalt uppercase">{get("s6Detail")}</span>
              <h3 className="text-[20px] font-semibold text-zj-ink mt-1">系统合规与认证进度</h3>
            </div>
            <Award className="w-6 h-6 text-zj-cobalt" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {MILESTONES.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.titleKey} className="p-6 bg-zj-white border border-zj-border rounded-[8px]">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-5 h-5 text-zj-cobalt shrink-0" />
                    <div className="text-[10px] font-bold tracking-wide text-zj-safe">{isZh ? T(m.statusKey, l) : T(m.statusKey, l)}</div>
                  </div>
                  <h4 className="text-[14px] font-semibold text-zj-ink mb-1">{isZh ? T(m.titleKey, l) : T(m.titleKey, l)}</h4>
                  <p className="text-[11.5px] text-zj-muted mb-3">{isZh ? T(m.dateKey, l) : T(m.dateKey, l)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
