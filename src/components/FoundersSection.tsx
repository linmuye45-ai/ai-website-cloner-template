"use client";

import React from "react";
import { User, Shield, Layers } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: { "zh-CN": "创始团队", "zh-TW": "創始團隊", en: "Founding Team", ja: "創業チーム" },
    title: {
      "zh-CN": "三位创始人，来自医院信息与信息安全",
      "zh-TW": "三位創始人，來自醫院信息與資訊安全",
      en: "Three Founders. From Hospital Informatics and Information Security.",
      ja: "三人の創業者。病院情報学と情報セキュリティ出身。",
    },
    sub: {
      "zh-CN": "他们在三甲医院建过 HIS，参与过等保三级评估，训练过语音模型。产品来自真实临床场景，不是实验室构想。",
      "zh-TW": "他們在三級醫院建過 HIS，參與過等保三級評估，訓練過語音模型。產品來自真實臨床場景，不是實驗室構想。",
      en: "They built HIS at Tier-3 hospitals, joined Level 3 protection assessments, and trained voice models. The product comes from real clinical scenes — not lab concepts.",
      ja: "彼らは三次救急病院でHISを構築し、レベル3保護評価に参加し、音声モデルを訓練した。製品は実際の臨床現場から生まれた。研究室のアイデアではない。",
    },
    f1Name: { "zh-CN": "陈景洲", "zh-TW": "陳景洲", en: "Chen Jingzhou", ja: "チェン・ジンズホウ" },
    f1Role: { "zh-CN": "CEO — 医院信息系统", "zh-TW": "CEO — 醫院信息系統", en: "CEO — Hospital Information Systems", ja: "CEO — 病院情報システム" },
    f1Desc: {
      "zh-CN": "主导过两家三甲医院 HIS 切换，深谙临床工作流与医保对接细节。",
      "zh-TW": "主導過兩家三級醫院 HIS 切換，深諳臨床工作流與醫療保險對接細節。",
      en: "Led HIS cutovers at two Tier-3 hospitals. Deep command of clinical workflows and insurance integration details.",
      ja: "二つの三次救急病院でHIS切替を主導。臨床ワークフローと保険連携の詳細に精通。",
    },
    f2Name: { "zh-CN": "林菀青", "zh-TW": "林菀靑", en: "Lin Wanqing", ja: "リン・ワンクィン" },
    f2Role: { "zh-CN": "CTO — 信息安全", "zh-TW": "CTO — 資訊安全", en: "CTO — Information Security", ja: "CTO — 情報セキュリティ" },
    f2Desc: {
      "zh-CN": "参与等保三级与数据安全法审计，设计院内 SM4 加密与断网架构。",
      "zh-TW": "參與等保三級與數據安全法審計，設計院內 SM4 加密與斷網架構。",
      en: "Joined Level 3 protection and Data Security Law audits. Designed on-premise SM4 encryption and air-gapped architecture.",
      ja: "レベル3保護とデータセキュリティ法監査に参加。院内SM4暗号化と断ネットワークアーキテクチャを設計。",
    },
    f3Name: { "zh-CN": "周明萱", "zh-TW": "周明萱", en: "Zhou Mingxuan", ja: "ジョウ・ミングシュアン" },
    f3Role: { "zh-CN": "CSO — 临床语音模型", "zh-TW": "CSO — 臨床語音模型", en: "CSO — Clinical Voice Models", ja: "CSO — 臨床音声モデル" },
    f3Desc: {
      "zh-CN": "训练过中文医疗语音模型，了解危急值处理与护师转接的真实时效压力。",
      "zh-TW": "訓練過中文醫療語音模型，了解危急值處理與護師轉接的真實時效壓力。",
      en: "Trained Chinese medical voice models. Knows the real-time pressure of critical value handling and nurse handoffs.",
      ja: "中国語医療音声モデルを訓練。クリティカル値対応と看護師ハンドオフの実際の時間的圧力を知っている。",
    },
    c1Label: { "zh-CN": "用户掌控股份", "zh-TW": "用戶掌控股份", en: "Users Hold Largest Stake", ja: "ユーザーが最大株を保有" },
    c1Val: { "zh-CN": "创始团队持股最大", "zh-TW": "創始團隊持股最大", en: "Founding team holds the largest stake", ja: "創業チームが最大株主" },
    c1Note: { "zh-CN": "不稀释创始人控制权，十年百角兽愿景由团队掌舵。", "zh-TW": "不稀釋創始人控制權，十年百角獸願景由團隊掌舵。", en: "Founder control not diluted. The ten-year decacorn vision is steered by the team.", ja: "創業者の支配権は希釈されない。十年のデカコーンビジョンはチームが舵取りする。" },
  };
  return map[key][l] || key;
}

const FOUNDERS = [
  { key: "f1", icon: User, nameKey: "f1Name", roleKey: "f1Role", descKey: "f1Desc", accent: "text-zj-cobalt" },
  { key: "f2", icon: Shield, nameKey: "f2Name", roleKey: "f2Role", descKey: "f2Desc", accent: "text-zj-clinical-green" },
  { key: "f3", icon: Layers, nameKey: "f3Name", roleKey: "f3Role", descKey: "f3Desc", accent: "text-zj-clinical-teal" },
];

export function FoundersSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="founders" className="bg-zj-bg-soft border-b border-zj-border py-20 lg:py-32 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-zj-clinical-green-soft/40 rounded-full blur-[160px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20">
          {FOUNDERS.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.key}
                className={`card-base hover:border-zj-border-cobalt/50 group ${i === 0 ? "border-zj-cobalt/40" : ""}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border border-zj-border/40 group-hover:border-zj-cobalt/50 transition-colors duration-300 ${f.accent === "text-zj-cobalt" ? "bg-zj-cobalt-soft" : f.accent === "text-zj-clinical-green" ? "bg-zj-clinical-green-soft" : "bg-zj-clinical-teal-soft"}`}>
                    <Icon className={`w-6 h-6 ${f.accent} group-hover:text-zj-cobalt transition-colors duration-300`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${f.accent === "text-zj-cobalt" ? "text-zj-cobalt" : f.accent === "text-zj-clinical-green" ? "text-zj-clinical-green" : "text-zj-clinical-teal"}`}>
                    {i + 1}
                  </span>
                </div>
                <div className="relative reveal" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <div className="w-32 h-32 rounded-full bg-zj-border mb-4 overflow-hidden border-2 border-zj-border">
                    <div className="w-full h-full bg-zj-bg-soft flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-zj-border/30" />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-semibold text-zj-ink mb-1 leading-snug">{T(f.nameKey, l)}</h3>
                  <p className="text-[12px] font-medium text-zj-slate mb-3">{T(f.roleKey, l)}</p>
                  <p className="text-[13px] leading-[1.7] text-zj-slate">{T(f.descKey, l)}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Ownership strip */}
        <div className="border-t border-zj-border pt-12 flex items-center justify-between gap-6 reveal" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-zj-clinical-green-soft flex items-center justify-center shrink-0 border border-zj-border-green/30">
              <CoinsIcon className="w-4 h-4 text-zj-clinical-green" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-zj-ink">{get("c1Label")}</div>
              <div className="text-[11px] text-zj-slate">{get("c1Val")}</div>
            </div>
          </div>
          <div className="text-[12px] text-zj-slate max-w-[40ch]">{get("c1Note")}</div>
        </div>
      </div>
    </section>
  );
}

// Small inline icon to avoid extra import
function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
