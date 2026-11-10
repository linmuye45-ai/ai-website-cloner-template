"use client";

import React, { useState } from "react";
import { Database, Layers, Monitor } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "产品架构",
      "zh-TW": "產品架構",
      en: "Product Architecture",
      ja: "プロダクトアーキテクチャ",
    },
    title: {
      "zh-CN": "三层，不多",
      "zh-TW": "三層，不多",
      en: "Three Layers. Not More.",
      ja: "三層。それ以上はない。",
    },
    sub: {
      "zh-CN": "不做孤立功能插件，而是构建可嵌入医院工作流的临床 AI 操作系统，支持分层交付与渐进式扩展。",
      "zh-TW": "不做孤立機能プラグイン，而是構建可嵌入醫院ワークフロー的臨床 AI 操作系統，支持分層交付與漸進式擴展。",
      en: "Not isolated feature plugins, but a clinical AI operating system embeddable into hospital workflows — layered delivery, progressive extension.",
      ja: "孤立した機能プラグインではなく、病院ワークフローに組み込める臨床AIオペレーティングシステム。段階的な納品、段階的な拡張。",
    },
    platform: { "zh-CN": "平台层", "zh-TW": "平台層", en: "Platform", ja: "プラットフォーム" },
    module: { "zh-CN": "模块层", "zh-TW": "模組層", en: "Module", ja: "モジュール" },
    application: { "zh-CN": "应用层", "zh-TW": "應用層", en: "Application", ja: "アプリケーション" },
    p1Title: { "zh-CN": "平台层 — 临床 AI 操作系统内核", "zh-TW": "平台層 — 臨床 AI 操作系統內核", en: "Platform — Clinical AI OS Core", ja: "プラットフォーム — 臨床AIオペレーティングシステム コア" },
    p1Desc: {
      "zh-CN": "确定性临床引擎、32 路发声前否决栅栏、FHIR R4 归档与 SQLite 本地持久化。这是系统不会变的底子。",
      "zh-TW": "確定性臨床引擎、32 路發聲前否決柵欄、FHIR R4 歸檔與 SQLite 本地持久化。這是系統不會變的底子。",
      en: "Deterministic clinical engine, 32 pre-speech veto gates, FHIR R4 archiving, SQLite local persistence. The foundation that doesn't change.",
      ja: "決定論的臨床エンジン、32の発話前否決ゲート、FHIR R4アーカイブ、SQLiteローカル永続化。システムが変わらない土台。",
    },
    p1Item1Label: { "zh-CN": "确定性引擎", "zh-TW": "確定性引擎", en: "Deterministic Engine", ja: "決定論的エンジン" },
    p1Item1Detail: { "zh-CN": "KDIGO 2024 · CTCAE v5.0 · ICD-10-CM", "zh-TW": "KDIGO 2024 · CTCAE v5.0 · ICD-10-CM", en: "KDIGO 2024 · CTCAE v5.0 · ICD-10-CM", ja: "KDIGO 2024 · CTCAE v5.0 · ICD-10-CM" },
    p1Item2Label: { "zh-CN": "安全栅栏", "zh-TW": "安全柵欄", en: "Safety Gates", ja: "安全ゲート" },
    p1Item2Detail: { "zh-CN": "32 路发声前否决 · 零诊断越界", "zh-TW": "32 路發聲前否決 · 零診斷越界", en: "32 Pre-Speech Veto · Zero Diagnostic Overreach", ja: "32の発話前否決 · 診断逸脱ゼロ" },
    p1Item3Label: { "zh-CN": "本地持久化", "zh-TW": "本地持久化", en: "Local Persistence", ja: "ローカル永続化" },
    p1Item3Detail: { "zh-CN": "SQLite · 院内部署 · 断网支持", "zh-TW": "SQLite · 院內部署 · 斷網支持", en: "SQLite · On-Premise · Air-Gap Support", ja: "SQLite · 院内導入 · 院内網断" },
    p2Title: { "zh-CN": "模块层 — 临床场景工作台", "zh-TW": "模組層 — 臨床場景工作台", en: "Module — Clinical Workstations", ja: "モジュール — 臨床シナリオワークステーション" },
    p2Desc: {
      "zh-CN": "药房、护理站、病案室、医保办。四个场景，按需组合，不捆绑。",
      "zh-TW": "藥房、護理站、病案室、醫療保險辦公室。四個場景，按需組合，不捆綁。",
      en: "Pharmacy, nursing station, medical records, insurance office. Four scenarios, combine on demand, no bundling.",
      ja: "調剤室、看護ステーション、医事課、保険事務。四つのシナリオ、必要に応じて組み合わせ、バンドルなし。",
    },
    p2Item1Label: { "zh-CN": "循证药典模块", "zh-TW": "循證藥典模組", en: "Evidence Formulary", ja: "エビデンス製剤集モジュール" },
    p2Item1Detail: { "zh-CN": "eGFR 阈值 · NRDL 定价 · 多药配伍", "zh-TW": "eGFR 閾值 · NRDL 定價 · 多藥配伍", en: "eGFR Cutoffs · NRDL Pricing · Multi-Drug DDI", ja: "eGFR カットオフ · NRDL 価格 · 多薬相互作用" },
    p2Item2Label: { "zh-CN": "语音随访模块", "zh-TW": "語音隨訪模組", en: "Voice Follow-up", ja: "音声フォローアップモジュール" },
    p2Item2Detail: { "zh-CN": "1.6s 护师桥接 · CTCAE 分级", "zh-TW": "1.6s 護師橋接 · CTCAE 分級", en: "1.6s RN Bridge · CTCAE Grading", ja: "1.6s 看護師ブリッジ · CTCAE グレード" },
    p2Item3Label: { "zh-CN": "SOAP 归档模块", "zh-TW": "SOAP 歸檔模組", en: "SOAP Archiving", ja: "SOAPアーカイブモジュール" },
    p2Item3Detail: { "zh-CN": "原声锚定 · ICD-10 编码 · DRG 权重", "zh-TW": "原聲錨定 · ICD-10 編碼 · DRG 權重", en: "Audio-Anchored · ICD-10 Coding · DRG Weights", ja: "音声アンカー · ICD-10 コーディング · DRG ウェイト" },
    p2Item4Label: { "zh-CN": "医保结算模块", "zh-TW": "醫療保險結算模組", en: "Insurance Settlement", ja: "保険請求モジュール" },
    p2Item4Detail: { "zh-CN": "DRG/DIP 模拟 · 自付估算 · 合规审计", "zh-TW": "DRG/DIP 模擬 · 自付估算 · 合規審計", en: "DRG/DIP Simulation · Co-pay Estimation · Compliance Audit", ja: "DRG/DIP シミュレーション · 自己負担見積もり · コンプライアンス監査" },
    p3Title: { "zh-CN": "应用层 — 院内部署与区域复制", "zh-TW": "應用層 — 院內部署與區域複製", en: "Application — Deployment & Regional Replication", ja: "アプリケーション — 導入と複製" },
    p3Desc: {
      "zh-CN": "从单科室试点到全院部署，再到医联体与区域医疗中心复制。支持分阶段实施与平滑升级。",
      "zh-TW": "從單個科室試點到全院部署，再到醫療集團與區域醫療中心複製。支持分階段實施與平滑升級。",
      en: "From single-department pilot to full-hospital deployment, then medical consortium and regional center replication. Phased implementation and smooth upgrade.",
      ja: "単科室パイロットから病院全体導入、さらに医療連携体と地域医療センターへの複製。段階的な実装とスムーズなアップグレード。",
    },
    p3Item1Label: { "zh-CN": "科室试点", "zh-TW": "科室試點", en: "Department Pilot", ja: "科室パイロット" },
    p3Item1Detail: { "zh-CN": "2 小时交付 · 去标识化测试专线", "zh-TW": "2 小時交付 · 去標識化測試專線", en: "2-Hour Delivery · De-Identified Test Line", ja: "2時間納品 · 非識別化テスト回線" },
    p3Item2Label: { "zh-CN": "院内部署", "zh-TW": "院內部署", en: "Full Hospital", ja: "病院全体導入" },
    p3Item2Detail: { "zh-CN": "SM4 加密 · 纯内网 · 院内 IT 运营", "zh-TW": "SM4 加密 · 純內網 · 院內 IT 運營", en: "SM4 Encryption · Air-Gapped · IT-Owned", ja: "SM4 暗号化 · 院内網断 · 院内 IT 運営" },
    p3Item3Label: { "zh-CN": "区域复制", "zh-TW": "區域複製", en: "Regional Replication", ja: "地域複製" },
    p3Item3Detail: { "zh-CN": "医联体部署 · 标准化交付", "zh-TW": "醫聯體部署 · 標準化交付", en: "Medical Consortium · Standard Delivery", ja: "医療連携体導入 · 標準化納品" },
  };
  return map[key][l] || key;
}

const LAYERS = [
  { id: "platform", titleKey: "p1Title", descKey: "p1Desc", icon: Database, items: [["p1Item1Label", "p1Item1Detail"], ["p1Item2Label", "p1Item2Detail"], ["p1Item3Label", "p1Item3Detail"]] },
  { id: "module", titleKey: "p2Title", descKey: "p2Desc", icon: Layers, items: [["p2Item1Label", "p2Item1Detail"], ["p2Item2Label", "p2Item2Detail"], ["p2Item3Label", "p2Item3Detail"], ["p2Item4Label", "p2Item4Detail"]] },
  { id: "application", titleKey: "p3Title", descKey: "p3Desc", icon: Monitor, items: [["p3Item1Label", "p3Item1Detail"], ["p3Item2Label", "p3Item2Detail"], ["p3Item3Label", "p3Item3Detail"]] },
];

export function ArchitectureSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);
  const [tabValue, setTabValue] = useState<string>("platform");

  const tabIds = ["platform", "module", "application"];
  const tabLabels = [T("platform", l), T("module", l), T("application", l)];

  return (
    <section id="architecture" className="bg-zj-white border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-zj-cyan-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="max-w-3xl mb-12">
            {tabIds.map((id, i) => (
              <TabsTrigger key={id} value={id} className="px-6 py-3">
                {tabLabels[i]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {LAYERS.map((layer, i) => (
                <Card
                  key={layer.id}
                  variant="default"
                  padding="lg"
                  hover="lift"
                  className={`border-zj-border/60 ${i === 0 ? "border-zj-cobalt/60 bg-zj-cobalt-soft/10" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-[4px] bg-zj-cobalt flex items-center justify-center shrink-0">
                      <layer.icon className="w-4 h-4 text-zj-cobalt" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-zj-ink">{isZh ? T(layer.titleKey, l) : T(layer.titleKey, l)}</h3>
                  </div>
                  <CardContent className="pt-0">
                    <p className="text-[13.5px] leading-[1.7] text-zj-slate mb-5">{isZh ? T(layer.descKey, l) : T(layer.descKey, l)}</p>
                    <div className="space-y-3">
                      {layer.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-3 text-[13px] text-zj-slate">
                          <div className="w-1 h-3 bg-zj-cobalt shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-zj-ink">{isZh ? T(item[0], l) : T(item[0], l)}</div>
                            <div className="text-[11.5px] text-zj-muted mt-0.5">{isZh ? T(item[1], l) : T(item[1], l)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              {LAYERS.map((layer, i) => (
                <TabsContent key={layer.id} value={tabIds[i]} className="mt-6 space-y-4">
                  <div className="rounded-[8px] border border-zj-border bg-zj-mist/30 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-[6px] bg-zj-cobalt-soft flex items-center justify-center shrink-0">
                        <layer.icon className="w-6 h-6 text-zj-cobalt" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-zj-ink">{isZh ? T(layer.titleKey, l) : T(layer.titleKey, l)}</h4>
                        <p className="text-[12.5px] text-zj-slate mt-1">{isZh ? T(layer.descKey, l) : T(layer.descKey, l)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {layer.items.map((item, j) => (
                        <div key={j} className="p-3 rounded-[4px] bg-zj-white border border-zj-border/40">
                          <div className="text-[11px] font-medium tracking-wide text-zj-cobalt uppercase mb-1">{isZh ? T(item[0], l) : T(item[0], l)}</div>
                          <div className="text-[12.5px] text-zj-ink">{isZh ? T(item[1], l) : T(item[1], l)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
