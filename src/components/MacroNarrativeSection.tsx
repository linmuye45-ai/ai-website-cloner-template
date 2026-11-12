"use client";

import React from "react";
import { TrendingUp, Shield, FileText, Clock, Building2 } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "为什么是现在",
      "zh-TW": "為什麼是現在",
      en: "Why Now",
      ja: "なぜ今なのか",
    },
    title: {
      "zh-CN": "政策、合规、效率三重窗口期同时打开",
      "zh-TW": "政策、合規、效率三重窗口期同時打開",
      en: "Three Windows Open at Once — Policy, Compliance, Efficiency",
      ja: "政策・コンプライアンス・効率。三つのウィンドウが同時に開く。",
    },
    sub: {
      "zh-CN": "政策窗口开了，合规要求到了，医院急着用。时候到了。",
      "zh-TW": "政策窗口開了，合規要求到了，醫院急著用。時候到了。",
      en: "The policy window is open. Compliance requirements are here. Hospitals need it now. The time has come.",
      ja: "政策の窓が開いた。コンプライアンス要件が整った。病院が必要としている。時は来た。",
    },
    w1Title: {
      "zh-CN": "DRG/DIP 支付方式改革",
      "zh-TW": "DRG/DIP 支付方式改革",
      en: "DRG/DIP Payment Reform",
      ja: "DRG/DIP 診療報酬改革",
    },
    w1Desc: {
      "zh-CN": "全国推进疾病诊断相关分组付费。医院需要精准的 ICD-10 编码与 DRG 权重模拟，控制医疗成本，优化医保结算。",
      "zh-TW": "全國推進疾病診斷相關分組付費。醫院需要精確的 ICD-10 編碼與 DRG 權重模擬，控制醫療成本，優化醫療保險結算。",
      en: "Nationwide DRG/DIP payment reform. Hospitals need precise ICD-10 coding and DRG weight simulation to control costs and optimize insurance settlement.",
      ja: "全国的DRG/DIP診療報酬改革。病院はICD-10コーディングとDRGウェイトシミュレーションを必要とし、医療費を制御し保険審査を最適化する。",
    },
    w2Title: {
      "zh-CN": "等保 2.0 与数据安全法",
      "zh-TW": "等保 2.0 與數據安全法",
      en: "Cybersecurity Classified Protection 2.0",
      ja: "サイバーセキュリティ分類保護2.0",
    },
    w2Desc: {
      "zh-CN": "三级公立医院必须满足等保三级要求。院内数据主权与 SM4 加密不再是选项，是入场券。",
      "zh-TW": "三級公立醫院必須滿足等保三級要求。院內數據主權與SM4加密不再是選項，是入場券。",
      en: "Tier-3 public hospitals must meet Level 3 protection requirements. Data sovereignty and SM4 encryption are no longer options — they are entry tickets.",
      ja: "三次救急病院はレベル3保護要件を満たさなければならない。データ主権とSM4暗号化はオプションではなく参入条件だ。",
    },
    w3Title: {
      "zh-CN": "电子病历系统应用水平分级",
      "zh-TW": "電子病歷系統應用水平分級",
      en: "EMR Adoption Grading",
      ja: "電子カルテシステム導入水準評価",
    },
    w3Desc: {
      "zh-CN": "国家电子病历系统应用水平分级评价对临床工作流数字化提出更高标准。结构化 SOAP 与 FHIR R4 归档是医院晋级的关键指标。",
      "zh-TW": "國家電子病歷系統應用水平分級評鑑對臨床工作流數位化提出更高標準。結構化 SOAP 與 FHIR R4 歸檔是醫院晉級的關鍵指標。",
      en: "National EMR adoption grading raises the bar for clinical workflow digitization. Structured SOAP and FHIR R4 archiving are key indicators for hospital advancement.",
      ja: "全国電子カルテシステム導入水準評価が臨床ワークフローのデジタル化に更高い基準を課す。構造化SOAPとFHIR R4アーカイブは病院昇格の主要指標だ。",
    },
    w4Title: {
      "zh-CN": "医护人力成本与效率压力",
      "zh-TW": "醫護人力成本與效率壓力",
      en: "Labor Cost & Efficiency Pressure",
      ja: "医療従事者の人件費と効率圧力",
    },
    w4Desc: {
      "zh-CN": "医护文书负担持续加重。危急值处理时效与出院随访覆盖率已纳入医疗质量考核。自动化与语音随访是刚需。",
      "zh-TW": "醫護文書負擔持續加重。危急值處理時效與出院隨訪覆蓋率已納入醫療品質考核。自動化與語音隨訪是剛需。",
      en: "Clinician documentation burden keeps rising. Critical value turnaround time and post-discharge follow-up coverage are now part of quality assessment. Automation and voice follow-up are urgent needs.",
      ja: "医療従事者の文書作成負担は高まる。クリティカル値対応時間と退院後フォローアップカバー率は医療品質評価に組み込まれた。自動化と音声フォローアップは緊急の必要性だ。",
    },
    w5Title: {
      "zh-CN": "健康中国 2030 与智慧医院",
      "zh-TW": "健康中國 2030 與智慧醫院",
      en: "Healthy China 2030 & Smart Hospital",
      ja: "健康中国2030 とスマートホスピタル",
    },
    w5Desc: {
      "zh-CN": "智慧医院建设进入深水区。医院需要一套可落地、可审计、可安全扩展的临床 AI 操作系统，而不是孤立的点对点工具。",
      "zh-TW": "智慧醫院建設進入深水區。醫院需要一套可落地、可審計、可安全擴展的臨床 AI 操作系統，而不是孤立的點對點工具。",
      en: "Smart hospital construction enters deep water. Hospitals need an auditable, securely scalable clinical AI operating system — not isolated point solutions.",
      ja: "スマートホスピタル建設は深化段階に入った。病院は実装可能で、監査可能で、安全に拡張可能な臨床AIオペレーティングシステムを必要としている。孤立した点対点ツールではない。",
    },
  };
  return map[key][l] || key;
}

const WINDOWS = [
  { key: "w1", icon: TrendingUp, titleKey: "w1Title", descKey: "w1Desc", accent: "bg-zj-cobalt-soft" },
  { key: "w2", icon: Shield, titleKey: "w2Title", descKey: "w2Desc", accent: "bg-zj-safe-soft" },
  { key: "w3", icon: FileText, titleKey: "w3Title", descKey: "w3Desc", accent: "bg-zj-aqua-soft" },
  { key: "w4", icon: Clock, titleKey: "w4Title", descKey: "w4Desc", accent: "bg-zj-amber-soft" },
  { key: "w5", icon: Building2, titleKey: "w5Title", descKey: "w5Desc", accent: "bg-zj-mint-soft" },
];

export function MacroNarrativeSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="why-now" className="bg-zj-mist border-b border-zj-border py-20 lg:py-32 reveal">
      <div className="relative section-container">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zj-cyan-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {WINDOWS.map((w, i) => {
            const Icon = w.icon;
            return (
              <Card
                key={w.key}
                variant="default"
                padding="xl"
                hover="lift"
                className={`border-zj-border/60 bg-zj-white ${i === 0 ? "border-zj-cobalt/60 shadow-sm" : ""}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-[8px] ${w.accent} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-zj-cobalt" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide uppercase ${
                    i === 0 ? "text-zj-cobalt" : "text-zj-muted"
                  }`}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-zj-ink mb-3.5 leading-snug">
                  {isZh ? T(w.titleKey, l) : T(w.titleKey, l)}
                </h3>
                <p className="text-[14px] leading-[1.8] text-zj-slate">
                  {isZh ? T(w.descKey, l) : T(w.descKey, l)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
