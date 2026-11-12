"use client";

import React from "react";
import { ShieldCheck, Building2, FileCheck, Award } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "合规与行业认可",
      "zh-TW": "合規與業界認可",
      en: "Compliance & Recognition",
      ja: "コンプライアンスと評価",
    },
    title: {
      "zh-CN": "证书在墙上，客户在院里",
      "zh-TW": "證書在牆上，客戶在院裡",
      en: "Certificates on the Wall. Partners in the Hospitals.",
      ja: "証明書は壁に。パートナーは病院の中に。",
    },
    sub: {
      "zh-CN": "系统设计以医院最高级别的安全与合规要求为准。已在多家三级医院科室完成试点部署。",
      "zh-TW": "系統設計以醫院最高級別的安全與合規要求為準。已在多家三級醫院科室完成試點部署。",
      en: "System design follows the highest hospital-level security and compliance requirements. Piloted across multiple Tier-3 hospital departments.",
      ja: "システム設計は病院レベルの最高セキュリティとコンプライアンス要件に従う。複数の三次救急病院の診療科でパイロット導入を完了。",
    },
    b1Title: { "zh-CN": "等保三级合规", "zh-TW": "等保三級合規", en: "Level 3 Protection Compliance", ja: "レベル3保護準拠" },
    b1Desc: { "zh-CN": "系统架构已通过内部安全评估与渗透测试。", "zh-TW": "系統架構已通過內部安全評估與滲透測試。", en: "System architecture passed internal security assessment and penetration testing.", ja: "システムアーキテクチャは内部セキュリティ評価と侵入テストを通過。" },
    b2Title: { "zh-CN": "纯内网断网部署", "zh-TW": "純內網斷網部署", en: "Air-Gapped Intranet Deployment", ja: "院内網断ネット導入" },
    b2Desc: { "zh-CN": "支持完全脱离公有网络的院内运行。", "zh-TW": "支持完全脫離公有網絡的院內運行。", en: "Supports fully offline intranet operation.", ja: "パブリックネットワークから完全に切り離した院内運転をサポート。" },
    b3Title: { "zh-CN": "FHIR R4 数据标准", "zh-TW": "FHIR R4 數據標準", en: "FHIR R4 Data Standard", ja: "FHIR R4 データ標準" },
    b3Desc: { "zh-CN": "临床记录与医疗数据交换遵循 HL7 FHIR R4 规范。", "zh-TW": "臨床記録與醫療データ交換遵循 HL7 FHIR R4 規格。", en: "Clinical records and healthcare data exchange follow HL7 FHIR R4 specifications.", ja: "臨床記録と医療データ交換はHL7 FHIR R4仕様に準拠。" },
    b4Title: { "zh-CN": "零严重不良事件记录", "zh-TW": "零嚴重不良事件記録", en: "Zero Severe Adverse Event Record", ja: "重篤な有害事象記録ゼロ" },
    b4Desc: { "zh-CN": "32 路发声前否决栅栏确保未发生由系统引发的严重不良临床事件。", "zh-TW": "32 路發聲前否決柵欄確保未發生由系統引發的嚴重不良臨床事件。", en: "32 pre-speech veto gates ensure zero severe adverse clinical events attributed to the system.", ja: "32の発話前否決ゲートにより、システム起因の重篤な有害臨床事象は発生していない。" },
    partnersLabel: { "zh-CN": "代表性合作临床中心", "zh-TW": "代表性合作臨床中心", en: "Representative Partner Clinical Centers", ja: "代表的な協力臨床センター" },
    partnersSub: { "zh-CN": "多省区三甲医院与专科中心已完成科室试点", "zh-TW": "多省區三級醫院與專科中心已完成科室試點", en: "Multi-region Tier-3 and specialty centers completed department pilots", ja: "複数の三次救急病院と専科センターが科室パイロットを完了" },
  };
  return map[key][l] || key;
}

type Partner = {
  name: { "zh-CN": string; "zh-TW": string; en: string; ja: string };
  sector: { "zh-CN": string; "zh-TW": string; en: string; ja: string };
};

const PARTNERS: Partner[] = [
  { name: { "zh-CN": "某三甲医院心内科", "zh-TW": "某三甲醫院心內科", en: "Tier-3 Hospital Cardiology", ja: "三次救急病院 循環器内科" }, sector: { "zh-CN": "心血管内科", "zh-TW": "心血管內科", en: "Cardiology", ja: "循環器内科" } },
  { name: { "zh-CN": "某三甲医院肾内科", "zh-TW": "某三甲醫院腎內科", en: "Tier-3 Hospital Nephrology", ja: "三次救急病院 腎臓内科" }, sector: { "zh-CN": "肾脏内科", "zh-TW": "腎臓內科", en: "Nephrology", ja: "腎臓内科" } },
  { name: { "zh-CN": "某三甲医院病案室", "zh-TW": "某三甲醫院病案室", en: "Tier-3 Hospital Medical Records", ja: "三次救急病院 医事課" }, sector: { "zh-CN": "病案信息", "zh-TW": "病案資訊", en: "Medical Records", ja: "医事課" } },
  { name: { "zh-CN": "某省级人民医院药剂科", "zh-TW": "某省級人民醫院藥劑科", en: "Provincial People's Hospital Pharmacy", ja: "県立病院 薬剤科" }, sector: { "zh-CN": "药学", "zh-TW": "藥學", en: "Pharmacy", ja: "薬剤科" } },
  { name: { "zh-CN": "某三甲医院护理站", "zh-TW": "某三甲醫院護理站", en: "Tier-3 Hospital Nursing Station", ja: "三次救急病院 看護ステーション" }, sector: { "zh-CN": "护理", "zh-TW": "護理", en: "Nursing", ja: "看護" } },
  { name: { "zh-CN": "某医保局合作医院", "zh-TW": "某醫保局合作醫院", en: "Medical Insurance Bureau Partner Hospital", ja: "医療保険局 連携病院" }, sector: { "zh-CN": "医保管理", "zh-TW": "醫保管理", en: "Insurance Management", ja: "医療保険管理" } },
];

const COMPLIANCE_BADGES = [
  { icon: ShieldCheck, titleKey: "b1Title", descKey: "b1Desc" },
  { icon: Building2, titleKey: "b2Title", descKey: "b2Desc" },
  { icon: FileCheck, titleKey: "b3Title", descKey: "b3Desc" },
  { icon: Award, titleKey: "b4Title", descKey: "b4Desc" },
];

export function TrustBadgesSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="badges" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-zj-cyan-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-16">
          {COMPLIANCE_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.titleKey} variant="default" padding="lg" hover="lift" className="border-zj-border/60">
                <div className="w-10 h-10 rounded-[6px] bg-zj-cobalt-soft flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-zj-cobalt" />
                </div>
                <h3 className="text-[14px] font-semibold text-zj-ink mb-2">{isZh ? T(b.titleKey, l) : T(b.titleKey, l)}</h3>
                <p className="text-[13px] leading-[1.65] text-zj-slate">{isZh ? T(b.descKey, l) : T(b.descKey, l)}</p>
              </Card>
            );
          })}
        </div>

        <div className="border-t border-zj-border pt-16">
          <div className="flex items-baseline justify-between gap-4 mb-10">
            <div>
              <h3 className="text-[16px] font-semibold text-zj-ink">{get("partnersLabel")}</h3>
              <p className="text-[12.5px] text-zj-muted mt-1">{get("partnersSub")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-zj-border">
            {PARTNERS.map((inst) => {
              const key = locale === "zh-TW" ? "zh-TW" : locale === "en" ? "en" : locale === "ja" ? "ja" : "zh-CN";
              return (
                <div key={inst.name.en} className="bg-zj-white px-4 py-4 flex flex-col justify-between hover:bg-zj-mist/60 transition-colors border-b border-zj-border/30 last:border-0">
                  <div className="text-[10px] font-medium tracking-wide text-zj-muted mb-2">{inst.sector[key]}</div>
                  <div className="text-[12.5px] font-medium text-zj-ink leading-snug">{inst.name[key]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
