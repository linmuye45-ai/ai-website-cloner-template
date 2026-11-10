"use client";

import React from "react";
import { ArrowRight, TrendingUp, ShieldCheck, Network } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "升级路径",
      "zh-TW": "升級路徑",
      en: "Upgrade Path",
      ja: "導入の道筋",
    },
    title: {
      "zh-CN": "从一间科室开始，再到全院",
      "zh-TW": "從一間科室開始，再到全院",
      en: "Start with One Department. End with the Whole Hospital.",
      ja: "一つの診療科から始め、病院全体へ。",
    },
    sub: {
      "zh-CN": "不绑定全院大合同。先试点，再复制，最后全院标准化。",
      "zh-TW": "不綁定全院大合同。先試點，再複製，最後全院標準化。",
      en: "No enterprise-wide contract upfront. Pilot first, replicate next, standardize last.",
      ja: "院全体への大きな契約は最初から結ばない。まずパイロット、次に複製、最後に標準化。",
    },
    s1Title: { "zh-CN": "第一阶段：科室试点", "zh-TW": "第一階段：科室試點", en: "Phase 1 — Department Pilot", ja: "フェーズ1 — 科室パイロット" },
    s1Desc: {
      "zh-CN": "2 小时交付，去标识化测试专线，仅限一个临床场景（药房、护理站或病案室）。验证工作流与安全边界后再扩容。",
      "zh-TW": "2 小時交付，去標識化測試專線，僅限一個臨床場景（藥房、護理站或病案室）。驗證工作流與安全邊界後再擴容。",
      en: "2-hour delivery, de-identified test line, single clinical scenario (pharmacy, nursing station, or medical records). Verify workflow and safety boundary before scaling.",
      ja: "2時間納品、非識別化テスト回線、単一臨床シナリオ（調剤室、看護ステーション、医事課）。ワークフローと安全境界を検証してから拡張する。",
    },
    s1Tag: { "zh-CN": "验证期", "zh-TW": "驗證期", en: "Validation", ja: "検証期" },
    s2Title: { "zh-CN": "第二阶段：院内部署", "zh-TW": "第二階段：院內部署", en: "Phase 2 — In-Hospital Deployment", ja: "フェーズ2 — 院内導入" },
    s2Desc: {
      "zh-CN": "SM4 加密，纯内网断网支持，全院 IT 运营，HIS 对接完成。支持分批次推进，控制实施风险。",
      "zh-TW": "SM4 加密，純內網斷網支持，全院 IT 運營，HIS 對接完成。支持分批次推進，控制實施風險。",
      en: "SM4 encryption, air-gapped intranet support, hospital-wide IT operations, HIS integration complete. Phased rollout to control implementation risk.",
      ja: "SM4暗号化、院内網断ネットワーク対応、病院全体のIT運営、HIS連携完了。段階的な展開で導入リスクを制御。",
    },
    s2Tag: { "zh-CN": "部署期", "zh-TW": "部署期", en: "Deployment", ja: "導入期" },
    s3Title: { "zh-CN": "第三阶段：区域复制", "zh-TW": "第三階段：區域複製", en: "Phase 3 — Regional Replication", ja: "フェーズ3 — 地域複製" },
    s3Desc: {
      "zh-CN": "医联体与区域医疗中心复制，标准化交付与区域安全策略。支持大规模临床工作流与多院区审计。",
      "zh-TW": "醫療集團與區域醫療中心複製，標準化交付與區域安全策略。支持大規模臨床工作流與多院區審計。",
      en: "Medical consortium and regional center replication, standardized delivery and regional security policy. Supports large-scale clinical workflows and multi-site audit.",
      ja: "医療連携体と地域医療センターへの複製、標準化納品と地域セキュリティポリシー。大規模な臨床ワークフローと複数拠点の監査をサポート。",
    },
    s3Tag: { "zh-CN": "复制期", "zh-TW": "複製期", en: "Replication", ja: "複製期" },
    tagLabel: { "zh-CN": "实施周期", "zh-TW": "實施週期", en: "Timeline", ja: "スケジュール" },
    t1Label: { "zh-CN": "2-4 周", "zh-TW": "2-4 週", en: "2-4 Weeks", ja: "2-4 週間" },
    t2Label: { "zh-CN": "1-3 个月", "zh-TW": "1-3 個月", en: "1-3 Months", ja: "1-3 ヶ月" },
    t3Label: { "zh-CN": "3-6 个月", "zh-TW": "3-6 ヶ月", en: "3-6 Months", ja: "3-6 ヶ月" },
    ctaText: { "zh-CN": "申请科室试点", "zh-TW": "申請科室試點", en: "Request Department Pilot", ja: "科室パイロットを申請" },
  };
  return map[key][l] || key;
}

const PHASES = [
  { key: "s1", icon: ShieldCheck, titleKey: "s1Title", descKey: "s1Desc", tagKey: "s1Tag", timeKey: "t1Label" },
  { key: "s2", icon: Network, titleKey: "s2Title", descKey: "s2Desc", tagKey: "s2Tag", timeKey: "t2Label" },
  { key: "s3", icon: TrendingUp, titleKey: "s3Title", descKey: "s3Desc", tagKey: "s3Tag", timeKey: "t3Label" },
];

export function UpgradePathSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="upgrade" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 top-0 w-64 h-64 bg-zj-safe-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <Card
                key={phase.key}
                variant="default"
                padding="xl"
                hover="lift"
                className={`border-zj-border/60 ${i === 1 ? "border-zj-cobalt/60 bg-zj-cobalt-soft/10" : ""}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-[4px] bg-zj-cobalt flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-zj-cobalt" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide uppercase ${
                    i === 1 ? "text-zj-cobalt" : "text-zj-muted"
                  }`}>
                    {isZh ? T(phase.tagKey, l) : T(phase.tagKey, l)}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-zj-ink mb-3 leading-snug">
                  {isZh ? T(phase.titleKey, l) : T(phase.titleKey, l)}
                </h3>
                <p className="text-[13.5px] leading-[1.7] text-zj-slate mb-7">
                  {isZh ? T(phase.descKey, l) : T(phase.descKey, l)}
                </p>
                <div className="pt-4 border-t border-zj-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium text-zj-muted">{get("tagLabel")}</span>
                    <ArrowRight className="w-3 h-3.5 text-zj-muted" />
                  </div>
                  <div className="text-[14px] font-serif-editorial font-bold text-zj-ink">
                    {isZh ? T(phase.timeKey, l) : T(phase.timeKey, l)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 pt-12 border-t border-zj-border text-center">
          <button
            type="button"
            className="btn-base btn-primary inline-flex items-center gap-2"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("zj-open-demo"));
            }}
          >
            {get("ctaText")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
