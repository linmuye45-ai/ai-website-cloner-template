"use client";

import React from "react";
import { User, ShieldCheck, Mic } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "创始团队",
      "zh-TW": "創始團隊",
      en: "Founding Team",
      ja: "創設チーム",
    },
    title: {
      "zh-CN": "临床、技术、合规。三个人，三种底色。",
      "zh-TW": "臨床、技術、合規。三個人，三種底色。",
      en: "Clinical, Technical, Compliance. Three People, Three Backgrounds.",
      ja: "臨床、技術、コンプライアンス。三人の人間、三つの背景。",
    },
    sub: {
      "zh-CN": "张明主导过三甲医院信息化。李强负责过大型医疗机构信安部门。王敏训练过数百万级临床语音模型。",
      "zh-TW": "張明主導過三甲醫院資訊化。李強負責過大型醫療機構資安部門。王敏訓練過數百萬級臨床語音模型。",
      en: "Zhang Ming led hospital informatics at Tier-3 hospitals. Li Qiang ran information security at a major medical institution. Wang Min trained million-record clinical voice models.",
      ja: "張明は三次救急病院の院内情報化を主導。李強は大型医療機関の情報セキュリティ部門を担当。王敏は数百万レベルの臨床音声モデルを訓練。",
    },
    f1Name: { "zh-CN": "张明", "zh-TW": "張明", en: "Zhang Ming", ja: "張 明" },
    f1Role: { "zh-CN": "创始人兼首席执行官", "zh-TW": "創始人兼首席執行官", en: "Founder & CEO", ja: "創設者兼CEO" },
    f1Bio: {
      "zh-CN": "顶尖医学院与计算机科学交叉项目毕业。曾主导三甲医院院内信息化与AI临床落地项目，深谙医院工作流与监管合规。",
      "zh-TW": "頂尖醫學院與電腦科學交叉專業畢業。曾主導三甲醫院院內資訊化與AI臨床落地項目，深諳醫院工作流與監管合規。",
      en: "Graduate of a top medical school and computer science interdisciplinary program. Formerly led hospital informatics and AI clinical deployment at Tier-3 hospitals.",
      ja: "トップ医学部とコンピュータサイエンスの共修プログラムを卒業。三次救急病院での院内情報化とAI臨床導入プロジェクトを主導。",
    },
    f2Name: { "zh-CN": "李强", "zh-TW": "李強", en: "Li Qiang", ja: "李 強" },
    f2Role: { "zh-CN": "联合创始人兼首席技术官", "zh-TW": "聯合創始人兼首席技術官", en: "Co-Founder & CTO", ja: "共同創設者兼CTO" },
    f2Bio: {
      "zh-CN": "原大型医疗机构信息安全部门负责人。精通 SM4 国密加密、等保三级合规与纯内网断网架构。负责系统底层安全设计。",
      "zh-TW": "原大型醫療機構資訊安全部門負責人。精通 SM4 國密加密、等保三級合規與純內網斷網架構。負責系統底層安全設計。",
      en: "Former head of information security at a major medical institution. Expert in SM4 national-secret encryption, Level 3 protection compliance, and air-gapped intranet architecture.",
      ja: "大型医療機関の情報セキュリティ部門の元責任者。SM4国産暗号、レベル3保護準拠、院内網断ネットワークアーキテクチャに精通。",
    },
    f3Name: { "zh-CN": "王敏", "zh-TW": "王敏", en: "Wang Min", ja: "王 敏" },
    f3Role: { "zh-CN": "联合创始人兼首席科学官", "zh-TW": "聯合創始人兼首席科學官", en: "Co-Founder & CSO", ja: "共同創設者兼CSO" },
    f3Bio: {
      "zh-CN": "专注于医疗语音交互与自然语言处理。主导过数百万级临床语音数据的去标识化处理与模型训练，推动32路否决栅栏算法落地。",
      "zh-TW": "專注於醫療語音交互與自然語言處理。主導過數百萬級臨床語音數據的去標識化處理與模型訓練，推動32路否決柵欄演算法落地。",
      en: "Focused on medical voice interaction and NLP. Led de-identification and model training on millions of clinical voice records. Drove the 32-gate veto algorithm into production.",
      ja: "医療音声インタラクションと自然言語処理に注力。数百万レベルの臨床音声データの非識別化処理とモデル訓練を主導。32ゲート否決アルゴリズムを本番導入。",
    },
  };
  return map[key][l] || key;
}

const FOUNDERS = [
  { key: "f1", icon: User, nameKey: "f1Name", roleKey: "f1Role", bioKey: "f1Bio", accent: "bg-zj-cobalt-soft", text: "text-zj-cobalt" },
  { key: "f2", icon: ShieldCheck, nameKey: "f2Name", roleKey: "f2Role", bioKey: "f2Bio", accent: "bg-zj-safe-soft", text: "text-zj-safe" },
  { key: "f3", icon: Mic, nameKey: "f3Name", roleKey: "f3Role", bioKey: "f3Bio", accent: "bg-zj-aqua-soft", text: "text-zj-cyan" },
];

export function FoundersSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";

  const get = (key: string) => T(key, l);

  return (
    <section id="founders" className="bg-zj-white border-b border-zj-border py-20 lg:py-32 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-zj-safe-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {FOUNDERS.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.key}
                variant="default"
                padding="xl"
                hover="lift"
                className={`border-zj-border/60 bg-zj-white ${f.accent && "border-zj-cobalt/40"}`}
              >
                <div className={`w-14 h-14 rounded-[10px] ${f.accent} flex items-center justify-center shrink-0 mb-7`}>
                  <Icon className={`w-7 h-7 ${f.text}`} />
                </div>
                <h3 className="text-[17px] font-semibold text-zj-ink mb-2 leading-snug">
                  {T(f.nameKey, l)}
                </h3>
                <p className={`text-[12px] font-medium mb-4 ${f.text}`}>
                  {T(f.roleKey, l)}
                </p>
                <p className="text-[14px] leading-[1.8] text-zj-slate">
                  {T(f.bioKey, l)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
