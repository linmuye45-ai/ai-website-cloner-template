"use client";

import React from "react";
import { Layers, Shield, Network } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "按医院等级部署",
      "zh-TW": "按醫院等級部署",
      en: "Deployment by Hospital Tier",
      ja: "病院規模別導入",
    },
    title: {
      "zh-CN": "三种模式，不强迫",
      "zh-TW": "三種模式，不強迫",
      en: "Three Modes. No Forcing.",
      ja: "三つのモード。無理強いはしない。",
    },
    sub: {
      "zh-CN": "一套代码，三种部署。从社区诊所到三甲纯内网断网，按需选择，安全交付。",
      "zh-TW": "一套代碼，三種部署。從社區診所到三甲純內網斷網，按需選擇，安全交付。",
      en: "One codebase, three deployment modes. From community clinics to Tier-3 air-gapped intranets — choose by need, deliver securely.",
      ja: "一つのコードベース、三つの導入モード。地域診療所から三次救急病院の院内網断ネットワークまで。必要に応じて選び、安全に納品する。",
    },
    t1Title: { "zh-CN": "诊所 / 门诊部", "zh-TW": "診所 / 門診部", en: "Clinic / Outpatient", ja: "クリニック / 外来" },
    t1Desc: { "zh-CN": "轻量 SaaS，按席位付费，移动端优先，最小 IT 运维开销。", "zh-TW": "輕量 SaaS，按席位付費，移動端優先，最小 IT 運維開銷。", en: "Lightweight SaaS, per-seat billing, mobile-first, minimal IT overhead.", ja: "軽量SaaS、席数課金、モバイルファースト、最小のIT運用負荷。" },
    t1Badge: { "zh-CN": "SaaS · 按席位", "zh-TW": "SaaS · 按席位", en: "SaaS · Per-Seat", ja: "SaaS · 席数課金" },
    t2Title: { "zh-CN": "二级医院", "zh-TW": "二級醫院", en: "Secondary Hospital", ja: "二次救急病院" },
    t2Desc: { "zh-CN": "云混合部署，轻量临床工作台，核心数据留院内，支持 HIS 对接。", "zh-TW": "雲混合部署，輕量臨床工作台，核心數據留院內，支持 HIS 對接。", en: "Cloud-hybrid deployment, lightweight clinical workbench, core data stays on-premise, HIS integration.", ja: "クラウドハイブリッド導入、軽量臨床ワークステーション、コアデータは院内保持、HIS連携。" },
    t2Badge: { "zh-CN": "云混合部署", "zh-TW": "雲混合部署", en: "Cloud-Hybrid", ja: "クラウドハイブリッド" },
    t3Title: { "zh-CN": "三级医院", "zh-TW": "三級醫院", en: "Tertiary Hospital", ja: "三次救急病院" },
    t3Desc: { "zh-CN": "纯内网断网部署，SM4 加密，最高级别数据主权。院内 IT 拥有与运营，支持大规模临床工作流。", "zh-TW": "純內網斷網部署，SM4 加密，最高級別數據主權。院內 IT 擁有與運營，支持大規模臨床工作流。", en: "Air-gapped intranet deployment, SM4 encryption, highest data sovereignty. IT-owned and operated; supports large-scale clinical workflows.", ja: "院内網断ネットワーク導入、SM4暗号化、最高レベルのデータ主権。院内 IT が所有・運営し、大規模な臨床ワークフローをサポート。" },
    t3Badge: { "zh-CN": "纯内网 · SM4", "zh-TW": "純內網 · SM4", en: "Air-Gapped · SM4", ja: "院内網断 · SM4" },
    c1Label: { "zh-CN": "SM4", "zh-TW": "SM4", en: "SM4", ja: "SM4" },
    c1Desc: { "zh-CN": "国密加密", "zh-TW": "國密加密", en: "National-secret encryption", ja: "国産暗号" },
    c2Label: { "zh-CN": "Air-Gapped", "zh-TW": "Air-Gapped", en: "Air-Gapped", ja: "院内網断" },
    c2Desc: { "zh-CN": "断网就绪", "zh-TW": "斷網就緒", en: "Air-gap ready", ja: "断ネット対応" },
    c3Label: { "zh-CN": "5+ 年", "zh-TW": "5+ 年", en: "5+ Years", ja: "5年以上" },
    c3Desc: { "zh-CN": "审计留存", "zh-TW": "審計留存", en: "Audit retention", ja: "監査証跡保持" },
    c4Label: { "zh-CN": "Zero", "zh-TW": "Zero", en: "Zero", ja: "ゼロ" },
    c4Desc: { "zh-CN": "云上传", "zh-TW": "雲上傳", en: "Cloud uploads", ja: "クラウドアップロード" },
    featured: { "zh-CN": "推荐", "zh-TW": "推薦", en: "Recommended", ja: "推奨" },
  };
  return map[key][l] || key;
}

const TIERS = [
  { key: "t1", icon: Network, titleKey: "t1Title", descKey: "t1Desc", badgeKey: "t1Badge" },
  { key: "t2", icon: Layers, titleKey: "t2Title", descKey: "t2Desc", badgeKey: "t2Badge", featured: true },
  { key: "t3", icon: Shield, titleKey: "t3Title", descKey: "t3Desc", badgeKey: "t3Badge" },
];

export function DeploymentSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  return (
    <section id="deployment" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute left-0 top-0 w-64 h-64 bg-zj-safe-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {TIERS.map((tier, idx) => {
            const Icon = tier.icon;
            const featured = tier.featured || idx === 1;
            return (
              <Card
                key={tier.key}
                variant="default"
                padding="xl"
                hover="lift"
                className={`border-zj-border ${featured ? "border-zj-cobalt/60 bg-zj-cobalt-soft/10 ring-1 ring-zj-cobalt/20" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-5 h-5 text-zj-cobalt" />
                    {featured && (
                      <span className="ml-auto text-[10px] font-bold text-zj-cyan-bright uppercase tracking-wider">
                        {isZh ? T("featured", l) : T("featured", l)}
                      </span>
                    )}
                    <Badge variant="soft">{isZh ? T(tier.badgeKey, l) : T(tier.badgeKey, l)}</Badge>
                  </div>
                  <CardTitle className="text-[17px]">{isZh ? T(tier.titleKey, l) : T(tier.titleKey, l)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[14px] leading-[1.75] text-zj-slate mb-5">{isZh ? T(tier.descKey, l) : T(tier.descKey, l)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 pt-10 border-t border-zj-border bg-zj-mist/30 rounded-[9px] p-8 lg:p-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { label: get("c1Label"), desc: get("c1Desc") },
              { label: get("c2Label"), desc: get("c2Desc") },
              { label: get("c3Label"), desc: get("c3Desc") },
              { label: get("c4Label"), desc: get("c4Desc") },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="text-[26px] font-serif-editorial font-bold text-zj-cobalt mb-1 leading-none">{item.label}</span>
                <span className="text-[12.5px] text-zj-slate">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
