"use client";

import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, Clock, Coins, ShieldCheck } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
type Lang = (typeof LOCALES)[number];

function T(key: string, l: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    eyebrow: {
      "zh-CN": "业务价值",
      "zh-TW": "業務價值",
      en: "Business Value",
      ja: "ビジネスバリュー",
    },
    title: {
      "zh-CN": "算一笔账",
      "zh-TW": "算一筆賬",
      en: "Run the Numbers",
      ja: "数字で見る",
    },
    sub: {
      "zh-CN": "通过真实医院场景估算，了解部署临床 AI 操作系统可带来的运营效率与财务改善。",
      "zh-TW": "通過真實醫院場景估算，了解部署臨床 AI 操作系統可帶來的運營效率與財務改善。",
      en: "Estimate operational efficiency and financial improvement from real hospital scenarios.",
      ja: "実際の病院シナリオから運用効率と財務改善を見積もる。",
    },
    s1: { "zh-CN": "药房 — 肾功折算与配伍核验", "zh-TW": "藥房 — 腎功折算與配伍核驗", en: "Pharmacy — Renal Dosing & DDI Verification", ja: "調剤室 — 腎機能減量 & 相互作用チェック" },
    s2: { "zh-CN": "护理站 — 危急值处理与随访", "zh-TW": "護理站 — 危急值處理與隨訪", en: "Nursing Station — Critical Value & Follow-up", ja: "看護ステーション — クリティカル値 & フォローアップ" },
    s3: { "zh-CN": "病案室 — ICD-10 编码与 DRG", "zh-TW": "病案室 — ICD-10 編碼與 DRG", en: "Medical Records — ICD-10 Coding & DRG", ja: "医事課 — ICD-10コーディング & DRG" },
    i1Label: { "zh-CN": "日处方笺量", "zh-TW": "日處方箋量", en: "Daily Prescriptions", ja: "1日あたりの処方箋数" },
    i1Placeholder: { "zh-CN": "200", "zh-TW": "200", en: "200", ja: "200" },
    i1Unit: { "zh-CN": "笔", "zh-TW": "筆", en: "", ja: "枚" },
    i2Label: { "zh-CN": "人工核验占比", "zh-TW": "人工核驗佔比", en: "Manual Verification Rate", ja: "人工検証比率" },
    i2Placeholder: { "zh-CN": "80", "zh-TW": "80", en: "80", ja: "80" },
    i2Unit: { "zh-CN": "%", "zh-TW": "%", en: "%", ja: "%" },
    i3Label: { "zh-CN": "人工核验单次耗时", "zh-TW": "人工核驗單次耗時", en: "Time per Manual Check", ja: "1回あたりの人工検証時間" },
    i3Placeholder: { "zh-CN": "3", "zh-TW": "3", en: "3", ja: "3" },
    i3Unit: { "zh-CN": "分钟", "zh-TW": "分鐘", en: "minutes", ja: "分" },
    i4Label: { "zh-CN": "月危急值上报量", "zh-TW": "月危急值上報量", en: "Monthly Critical Value Reports", ja: "1か月あたりのクリティカル値報告数" },
    i4Placeholder: { "zh-CN": "500", "zh-TW": "500", en: "500", ja: "500" },
    i4Unit: { "zh-CN": "例", "zh-TW": "例", en: "", ja: "件" },
    i5Label: { "zh-CN": "平均转接耗时", "zh-TW": "平均轉接耗時", en: "Avg Handoff Time", ja: "平均ハンドオフ時間" },
    i5Placeholder: { "zh-CN": "8", "zh-TW": "8", en: "8", ja: "8" },
    i5Unit: { "zh-CN": "分钟", "zh-TW": "分鐘", en: "minutes", ja: "分" },
    i6Label: { "zh-CN": "护师人力成本", "zh-TW": "護師人力成本", en: "Nurse Hourly Cost", ja: "看護師の時給" },
    i6Placeholder: { "zh-CN": "80", "zh-TW": "80", en: "80", ja: "80" },
    i6Unit: { "zh-CN": "元/小时", "zh-TW": "元/小時", en: "元/hour", ja: "円/時間" },
    i7Label: { "zh-CN": "年出院人次", "zh-TW": "年出院人次", en: "Annual Discharges", ja: "年間退院患者数" },
    i7Placeholder: { "zh-CN": "50000", "zh-TW": "50000", en: "50000", ja: "50000" },
    i7Unit: { "zh-CN": "人次", "zh-TW": "人次", en: "", ja: "人" },
    i8Label: { "zh-CN": "编码错误率", "zh-TW": "編碼錯誤率", en: "Coding Error Rate", ja: "コーディング誤差率" },
    i8Placeholder: { "zh-CN": "5", "zh-TW": "5", en: "5", ja: "5" },
    i8Unit: { "zh-CN": "%", "zh-TW": "%", en: "%", ja: "%" },
    i9Label: { "zh-CN": "单次错误赔付损失", "zh-TW": "單次錯誤賠付損失", en: "Loss per Error", ja: "1回あたりの賠償損失" },
    i9Placeholder: { "zh-CN": "2000", "zh-TW": "2000", en: "2000", ja: "2000" },
    i9Unit: { "zh-CN": "元", "zh-TW": "元", en: "元", ja: "元" },
    rLabel: { "zh-CN": "每年可节省人工工时", "zh-TW": "每年可節省人工工時", en: "Annual Manual Hours Saved", ja: "年間に節約できる人工工数" },
    rUnit: { "zh-CN": "小时", "zh-TW": "小時", en: "hours", ja: "時間" },
    r2Label: { "zh-CN": "每年可节省人力成本", "zh-TW": "每年可節省人力成本", en: "Annual Labor Cost Saved", ja: "年間に節約できる人件費" },
    r2Unit: { "zh-CN": "元", "zh-TW": "元", en: "元", ja: "円" },
    r3Label: { "zh-CN": "每年可降低医保拆分与赔付风险", "zh-TW": "每年可降低醫療保險拆分與賠付風險", en: "Annual Insurance Split & Payout Risk Reduced", ja: "年間に削減できる保険査定・賠償リスク" },
    r3Unit: { "zh-CN": "元", "zh-TW": "元", en: "元", ja: "円" },
    insight1: { "zh-CN": "自动化肾功剂量与多药配伍核验，释放药师专业时间用于临床药学服务。", "zh-TW": "自動化腎功劑量與多藥配伍核驗，釋放藥師專業時間用於臨床藥學服務。", en: "Automated renal dosing and multi-drug DDI verification free up pharmacist time for clinical pharmacy services.", ja: "自動化された腎機能減量と多薬相互作用チェックが、薬剤師の専門時間を臨床薬学サービスに解放する。" },
    insight2: { "zh-CN": "1.6 秒护师桥接与自动化随访，显著缩短危急值处理时效，降低医疗差错风险。", "zh-TW": "1.6 秒護師橋接與自動化隨訪，顯著縮短危急值處理時效，降低醫療差錯風險。", en: "1.6-second RN bridge and automated follow-up significantly shorten critical value turnaround time and reduce medical error risk.", ja: "1.6秒の看護師ブリッジと自動化フォローアップが、クリティカル値対応時間を大幅に短縮し、医療ミスのリスクを軽減する。" },
    insight3: { "zh-CN": "ICD-10 自动编码与 DRG 权重模拟，提升编码准确率，降低医保审计与赔付风险。", "zh-TW": "ICD-10 自動編碼與 DRG 權重模擬，提升編碼準確率，降低醫療保險審計與賠付風險。", en: "ICD-10 auto-coding and DRG weight simulation improve coding accuracy and reduce insurance audit and payout risk.", ja: "ICD-10自動コーディングとDRGウェイトシミュレーションが、コーディング精度を向上させ、保険監査と賠償リスクを軽減する。" },
    kpi1: { "zh-CN": "运营成本下降", "zh-TW": "運營成本下降", en: "Operating Cost Reduction", ja: "運用コスト削減" },
    kpi1Val: { "zh-CN": "15-30%", "zh-TW": "15-30%", en: "15-30%", ja: "15-30%" },
    kpi2: { "zh-CN": "危急值处理时效提升", "zh-TW": "危急值處理時效提升", en: "Critical Value Turnaround Improvement", ja: "クリティカル値対応時間の改善" },
    kpi2Val: { "zh-CN": "5x 以上", "zh-TW": "5x 以上", en: "5x+", ja: "5倍以上" },
    kpi3: { "zh-CN": "合规审计通过率", "zh-TW": "合規審計通過率", en: "Compliance Audit Pass Rate", ja: "コンプライアンス監査合格率" },
    kpi3Val: { "zh-CN": "100%", "zh-TW": "100%", en: "100%", ja: "100%" },
  };
  return map[key][l] || key;
}

type Scenario = {
  id: string;
  title: { zh: string; en: string };
  inputs: { label: { zh: string; en: string }; key: string; placeholder: string; unit: string }[];
  resultLabel: { zh: string; en: string };
  resultUnit: string;
  calc: (vals: Record<string, number>) => number;
  insight: { zh: string; en: string };
};

const SCENARIOS: Scenario[] = [
  {
    id: "pharmacy",
    title: { zh: T("s1", "zh-CN") as string, en: T("s1", "en") as string },
    inputs: [
      { label: { zh: T("i1Label", "zh-CN") as string, en: T("i1Label", "en") as string }, key: "dailyRx", placeholder: T("i1Placeholder", "zh-CN") as string, unit: T("i1Unit", "zh-CN") as string },
      { label: { zh: T("i2Label", "zh-CN") as string, en: T("i2Label", "en") as string }, key: "manualRate", placeholder: T("i2Placeholder", "zh-CN") as string, unit: T("i2Unit", "zh-CN") as string },
      { label: { zh: T("i3Label", "zh-CN") as string, en: T("i3Label", "en") as string }, key: "timePerCheck", placeholder: T("i3Placeholder", "zh-CN") as string, unit: T("i3Unit", "zh-CN") as string },
    ],
    resultLabel: { zh: T("rLabel", "zh-CN") as string, en: T("rLabel", "en") as string },
    resultUnit: T("rUnit", "zh-CN") as string,
    calc: (v) => Math.round((v.dailyRx * (v.manualRate / 100) * v.timePerCheck * 300) / 60),
    insight: { zh: T("insight1", "zh-CN") as string, en: T("insight1", "en") as string },
  },
  {
    id: "nursing",
    title: { zh: T("s2", "zh-CN") as string, en: T("s2", "en") as string },
    inputs: [
      { label: { zh: T("i4Label", "zh-CN") as string, en: T("i4Label", "en") as string }, key: "monthlyCV", placeholder: T("i4Placeholder", "zh-CN") as string, unit: T("i4Unit", "zh-CN") as string },
      { label: { zh: T("i5Label", "zh-CN") as string, en: T("i5Label", "en") as string }, key: "handoffTime", placeholder: T("i5Placeholder", "zh-CN") as string, unit: T("i5Unit", "zh-CN") as string },
      { label: { zh: T("i6Label", "zh-CN") as string, en: T("i6Label", "en") as string }, key: "nurseCost", placeholder: T("i6Placeholder", "zh-CN") as string, unit: T("i6Unit", "zh-CN") as string },
    ],
    resultLabel: { zh: T("r2Label", "zh-CN") as string, en: T("r2Label", "en") as string },
    resultUnit: T("r2Unit", "zh-CN") as string,
    calc: (v) => Math.round((v.monthlyCV * v.handoffTime * 12) / 60 * v.nurseCost * 0.6),
    insight: { zh: T("insight2", "zh-CN") as string, en: T("insight2", "en") as string },
  },
  {
    id: "records",
    title: { zh: T("s3", "zh-CN") as string, en: T("s3", "en") as string },
    inputs: [
      { label: { zh: T("i7Label", "zh-CN") as string, en: T("i7Label", "en") as string }, key: "annualDischarges", placeholder: T("i7Placeholder", "zh-CN") as string, unit: T("i7Unit", "zh-CN") as string },
      { label: { zh: T("i8Label", "zh-CN") as string, en: T("i8Label", "en") as string }, key: "errorRate", placeholder: T("i8Placeholder", "zh-CN") as string, unit: T("i8Unit", "zh-CN") as string },
      { label: { zh: T("i9Label", "zh-CN") as string, en: T("i9Label", "en") as string }, key: "lossPerError", placeholder: T("i9Placeholder", "zh-CN") as string, unit: T("i9Unit", "zh-CN") as string },
    ],
    resultLabel: { zh: T("r3Label", "zh-CN") as string, en: T("r3Label", "en") as string },
    resultUnit: T("r3Unit", "zh-CN") as string,
    calc: (v) => Math.round(v.annualDischarges * (v.errorRate / 100) * v.lossPerError * 0.7),
    insight: { zh: T("insight3", "zh-CN") as string, en: T("insight3", "en") as string },
  },
];

export function ROICalculatorSection() {
  const { locale } = useI18n();
  const l: Lang = LOCALES.includes(locale as Lang) ? (locale as Lang) : "en";
  const isZh = l === "zh-CN" || l === "zh-TW";

  const get = (key: string) => T(key, l);

  const [activeTab, setActiveTab] = useState<string>("pharmacy");
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number>(0);

  const scenario = SCENARIOS.find((s) => s.id === activeTab)!;

  useEffect(() => {
    setResult(scenario.calc(inputs));
  }, [inputs, scenario]);

  const handleInput = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setInputs({ ...inputs, [key]: num });
  };

  return (
    <section id="roi" className="bg-zj-mist border-b border-zj-border py-20 lg:py-28 reveal">
      <div className="relative section-container">
        <div className="absolute right-0 top-0 w-64 h-64 bg-zj-safe-bright/10 rounded-full blur-[120px] pointer-events-none" />

        <SectionHeader
          eyebrow={get("eyebrow")}
          title={get("title")}
          subtitle={get("sub")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-1">
            <Card variant="default" padding="lg" className="border-zj-border/60 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-5 h-5 text-zj-cobalt" />
                <span className="text-[12px] font-medium tracking-wide text-zj-cobalt uppercase">{get("title")}</span>
              </div>
              <div className="space-y-3 mb-8">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveTab(s.id); setInputs({}); setResult(0); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[6px] text-left transition-all ${
                      activeTab === s.id ? "bg-zj-cobalt-soft/20 border border-zj-cobalt/40 text-zj-cobalt font-medium" : "border border-zj-border/50 text-zj-slate hover:bg-zj-mist/40"
                    }`}
                  >
                    <span>{isZh ? s.title.zh : s.title.en}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card variant="default" padding="xl" className="border-zj-border/60 h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {scenario.inputs.map((input) => {
                  const val = inputs[input.key] || 0;
                  return (
                    <div key={input.key} className="flex flex-col gap-2">
                      <label className="text-[11.5px] font-medium text-zj-slate">{isZh ? input.label.zh : input.label.en}</label>
                      <input
                        type="number"
                        value={val || ""}
                        onChange={(e) => handleInput(input.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-[4px] border border-zj-border bg-zj-white text-zj-ink text-[13px] focus:ring-2 focus:ring-zj-cobalt/50 outline-none"
                        placeholder={input.placeholder}
                      />
                      <span className="text-[10px] text-zj-muted">{input.unit}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pt-6 border-t border-zj-border/40">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-[13px] text-zj-slate">{isZh ? scenario.resultLabel.zh : scenario.resultLabel.en}</span>
                  <span className="text-[32px] font-serif-editorial font-bold text-zj-ink">{result.toLocaleString()}</span>
                  <span className="text-[13px] font-medium text-zj-cobalt">{scenario.resultUnit}</span>
                </div>
                <div className="bg-zj-mist/30 rounded-[6px] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-4 h-4 text-zj-safe" />
                    <span className="text-[11.5px] font-medium text-zj-safe">{isZh ? "预期改善" : "Expected Improvement"}</span>
                  </div>
                  <p className="text-[13.5px] leading-[1.65] text-zj-slate">{isZh ? scenario.insight.zh : scenario.insight.en}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="pt-12 border-t border-zj-border bg-zj-mist/20 rounded-[9px] p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Coins, label: get("kpi1"), val: get("kpi1Val") },
              { icon: Clock, label: get("kpi2"), val: get("kpi2Val") },
              { icon: ShieldCheck, label: get("kpi3"), val: get("kpi3Val") },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <div>
                    <div className="text-[20px] font-serif-editorial font-bold text-zj-ink">{item.val}</div>
                    <div className="text-[12.5px] text-zj-slate">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
