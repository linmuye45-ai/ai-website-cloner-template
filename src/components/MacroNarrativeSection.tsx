"use client";

import React from "react";
import { TrendingUp, Shield, FileText, Clock, Building2, Coins } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: { "zh-CN": "为什么是现在", "zh-TW": "為什麼是現在", en: "Why Now", ja: "なぜ今なのか" },
    title: {
      "zh-CN": "窗口期已打开",
      "zh-TW": "窗口期已打開",
      en: "The Window Is Open",
      ja: "窓が開いた",
    },
    sub: {
      "zh-CN": "政策落地，合规到位，医院迫切需要。十年愿景：成为顶级百角兽，高利润，用户掌控最大股份。",
      "zh-TW": "政策落地，合規到位，醫院迫切需要。十年願景：成為頂級百角獸，高利潤，用戶掌控最大股份。",
      en: "Policy lands, compliance arrives, hospitals need it now. Ten-year vision: a top-tier decacorn, high margin, users holding the largest stake.",
      ja: "政策が実装され、コンプライアンスが整い、病院が必要としている。十年ビジョン：トップクラスのデカコーン、高利益、ユーザーが最大株を保有。",
    },
    w1Title: { "zh-CN": "DRG/DIP 支付方式改革", "zh-TW": "DRG/DIP 支付方式改革", en: "DRG/DIP Payment Reform", ja: "DRG/DIP 診療報酬改革" },
    w1Desc: {
      "zh-CN": "全国推进疾病诊断相关分组付费。医院需要精准的 ICD-10 编码与 DRG 权重模拟，控制医疗成本，优化医保结算。",
      "zh-TW": "全國推進疾病診斷相關分組付費。醫院需要精確的 ICD-10 編碼與 DRG 權重模擬，控制醫療成本，優化醫療保險結算。",
      en: "Nationwide DRG/DIP payment reform. Hospitals need precise ICD-10 coding and DRG weight simulation to control costs and optimize insurance settlement.",
      ja: "全国のDRG/DIP診療報酬改革。病院はICD-10コーディングとDRGウェイトシミュレーションを必要とし、医療費を制御し保険審査を最適化する。",
    },
    w2Title: { "zh-CN": "等保 2.0 与数据安全法", "zh-TW": "等保 2.0 與數據安全法", en: "Cybersecurity Classified Protection 2.0", ja: "サイバーセキュリティ分類保護2.0" },
    w2Desc: {
      "zh-CN": "三级公立医院必须满足等保三级要求。院内数据主权与 SM4 加密不再是选项，是入场券。",
      "zh-TW": "三級公立醫院必須滿足等保三級要求。院內數據主權與SM4加密不再是選項，是入場券。",
      en: "Tier-3 public hospitals must meet Level 3 protection requirements. Data sovereignty and SM4 encryption are no longer options — they are entry tickets.",
      ja: "三次救急病院はレベル3保護要件を満たさなければならない。データ主権とSM4暗号化はオプションではなく参入条件だ。",
    },
    w3Title: { "zh-CN": "电子病历系统应用水平分级", "zh-TW": "電子病歷系統應用水平分級", en: "EMR Adoption Grading", ja: "電子カルテシステム導入水準評価" },
    w3Desc: {
      "zh-CN": "国家电子病历系统应用水平分级评价对临床工作流数字化提出更高标准。结构化 SOAP 与 FHIR R4 归档是医院晋级的关键指标。",
      "zh-TW": "國家電子病歷系統應用水平分級評鑑對臨床工作流數位化提出更高標準。結構化 SOAP 與 FHIR R4 歸檔是醫院晉級的關鍵指標。",
      en: "National EMR adoption grading raises the bar for clinical workflow digitization. Structured SOAP and FHIR R4 archiving are key indicators for hospital advancement.",
      ja: "全国電子カルテシステム導入水準評価が臨床ワークフローのデジタル化に更高い基準を課す。構造化SOAPとFHIR R4アーカイブは病院昇格の主要指標だ。",
    },
    w4Title: { "zh-CN": "医护人力成本与效率压力", "zh-TW": "醫護人力成本與效率壓力", en: "Labor Cost & Efficiency Pressure", ja: "医療従事者の人件費と効率圧力" },
    w4Desc: {
      "zh-CN": "医护文书负担持续加重。危急值处理时效与出院随访覆盖率已纳入医疗质量考核。自动化与语音随访是刚需。",
      "zh-TW": "醫護文書負擔持續加重。危急值處理時效與出院隨訪覆蓋率已納入醫療品質考核。自動化與語音隨訪是剛需。",
      en: "Clinician documentation burden keeps rising. Critical value turnaround time and post-discharge follow-up coverage are now part of quality assessment. Automation and voice follow-up are urgent needs.",
      ja: "医療従事者の文書作成負担は高まる。クリティカル値対応時間と退院後フォローアップカバー率は医療品質評価に組み込まれた。自動化と音声フォローアップは緊急の必要性だ。",
    },
    w5Title: { "zh-CN": "健康中国 2030 与智慧医院", "zh-TW": "健康中國 2030 與智慧醫院", en: "Healthy China 2030 & Smart Hospital", ja: "健康中国2030 とスマートホスピタル" },
    w5Desc: {
      "zh-CN": "智慧医院建设进入深水区。医院需要一套可落地、可审计、可安全扩展的临床 AI 操作系统，而不是孤立的点对点工具。",
      "zh-TW": "智慧醫院建設進入深水區。醫院需要一套可落地、可審計、可安全擴展的臨床 AI 操作系統，而不是孤立的點對點工具。",
      en: "Smart hospital construction enters deep water. Hospitals need an auditable, securely scalable clinical AI operating system — not isolated point solutions.",
      ja: "スマートホスピタル建設は深化段階に入った。病院は実装可能で、監査可能で、安全に拡張可能な臨床AIオペレーティングシステムを必要としている。孤立した点対点ツールではない。",
    },
    // Commercial narrative
    cTitle: { "zh-CN": "商业逻辑", "zh-TW": "商業邏輯", en: "Business Logic", ja: "ビジネスロジック" },
    c1Label: { "zh-CN": "高毛利", "zh-TW": "高毛利", en: "High Gross Margin", ja: "高粗利" },
    c1Val: { "zh-CN": "70-85%", "zh-TW": "70-85%", en: "70-85%", ja: "70-85%" },
    c1Note: { "zh-CN": "SaaS 订阅与企业合同，边际成本极低。", "zh-TW": "SaaS 訂閱與企業合約，邊際成本極低。", en: "SaaS subscriptions and enterprise contracts. Near-zero marginal cost.", ja: "SaaSサブスクリプションとエンタープライズ契約。限りなくゼロに近い限界費用。" },
    c2Label: { "zh-CN": "高净利润", "zh-TW": "高淨利潤", en: "High Net Profit", ja: "高純利" },
    c2Val: { "zh-CN": "可持续", "zh-TW": "可持續", en: "Sustainable", ja: "持続可能" },
    c2Note: { "zh-CN": "产品卓越与设计驱动增长，从不以贬低竞争对手为策略。", "zh-TW": "產品卓越與設計驅動增長，從不以貶低競爭對手為策略。", en: "Growth driven by product excellence and design — never by disparaging competitors.", ja: "製品の卓越とデザインによる成長。競合他社を誹謗中傷する戦略は取らない。" },
    c3Label: { "zh-CN": "用户掌控股份", "zh-TW": "用戶掌控股份", en: "Users Hold Largest Stake", ja: "ユーザーが最大株主" },
    c3Val: { "zh-CN": "创始团队持股最大", "zh-TW": "創始團隊持股最大", en: "Founding team holds the largest stake", ja: "創業チームが最大株を保有" },
    c3Note: { "zh-CN": "十年发展为顶级百角兽，估值由商业基本面支撑。", "zh-TW": "十年發展為頂級百角獸，估值由商業基本面支撐。", en: "Ten-year path to a top-tier decacorn, valuation grounded in business fundamentals.", ja: "十年をかけてトップクラスのデカコーンへ。評価は事業の基本収益力に基づく。" },
  };
  return map[key][l] || key;
}

const WINDOWS = [
  { key: "w1", icon: TrendingUp, titleKey: "w1Title", descKey: "w1Desc", accent: "bg-zj-cobalt-soft border-zj-border-cobalt/30 text-zj-cobalt" },
  { key: "w2", icon: Shield, titleKey: "w2Title", descKey: "w2Desc", accent: "bg-zj-clinical-green-soft border-zj-border-green/30 text-zj-clinical-green" },
  { key: "w3", icon: FileText, titleKey: "w3Title", descKey: "w3Desc", accent: "bg-zj-clinical-teal-soft border-zj-border-cobalt/30 text-zj-clinical-teal" },
  { key: "w4", icon: Clock, titleKey: "w4Title", descKey: "w4Desc", accent: "bg-zj-clinical-amber-soft border-zj-border-cobalt/30 text-zj-clinical-amber" },
  { key: "w5", icon: Building2, titleKey: "w5Title", descKey: "w5Desc", accent: "bg-zj-clinical-rose-soft border-zj-border-cobalt/30 text-zj-clinical-rose" },
];

export function MacroNarrativeSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="macro" className="bg-zj-bg border-b border-zj-border py-20 lg:py-32 reveal">
      <div className="relative section-container">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-zj-cobalt-soft rounded-full blur-[160px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        {/* Five windows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20">
          {WINDOWS.map((w, i) => {
            const Icon = w.icon;
            return (
              <Card
                key={w.key}
                className={`card-base group hover:border-zj-border-cobalt/50 ${w.accent.split(" ")[0]} ${w.accent.split(" ")[1]}`}
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border border-zj-border/40 group-hover:border-zj-cobalt/50 transition-colors duration-300 ${w.accent.split(" ")[0]}`}>
                    <Icon className={`w-6 h-6 ${w.accent.split(" ")[2]} group-hover:text-zj-cobalt transition-colors duration-300`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${w.accent.split(" ")[2]}`}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-zj-ink mb-3.5 leading-snug reveal" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  {T(w.titleKey, l)}
                </h3>
                <p className="text-[14px] leading-[1.8] text-zj-slate reveal" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  {T(w.descKey, l)}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Commercial narrative strip */}
        <div className="border border-zj-border rounded-[20px] bg-zj-card shadow-md p-10 lg:p-16 reveal" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3 mb-10">
            <Coins className="w-5 h-5 text-zj-cobalt shrink-0" />
            <h3 className="text-[16px] font-semibold text-zj-ink">{get("cTitle")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: get("c1Label"), val: get("c1Val"), note: get("c1Note") },
              { label: get("c2Label"), val: get("c2Val"), note: get("c2Note") },
              { label: get("c3Label"), val: get("c3Val"), note: get("c3Note") },
            ].map((item) => (
              <div key={item.label} className="reveal">
                <div className="text-[30px] font-serif-editorial font-bold text-zj-ink mb-2 leading-none">{item.val}</div>
                <div className="text-[13px] font-medium text-zj-ink-soft mb-2">{item.label}</div>
                <div className="text-[12px] text-zj-slate leading-[1.6]">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
