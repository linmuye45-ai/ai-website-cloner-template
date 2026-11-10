"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { withBasePath } from "@/lib/asset-path";
import type { LocaleCode, ProofOfMasteryRecord } from "@/types/platform";

interface ClearinghouseLedgerViewProps {
  locale: LocaleCode;
  proofs: ProofOfMasteryRecord[];
  onGoToStudio: () => void;
  onGoToSchoolSuite: () => void;
}

interface MilestoneStage {
  id: string;
  tabLabel: Record<LocaleCode, string>;
  scaleMeta: Record<LocaleCode, string>;
  totalArr: string;
  valuation: string;
  grossMargin: string;
  ndr: string;
  revLearner: { amount: string; share: number };
  revSchool: { amount: string; share: number };
  revAiClear: { amount: string; share: number };
  revHireClear: { amount: string; share: number };
  operatingSummary: Record<LocaleCode, string>;
}

const MILESTONES: MilestoneStage[] = [
  {
    id: "m1",
    tabLabel: {
      zh: "第 1–2 年 · 冷启动回本",
      en: "Years 1–2 · Seed Arbitrage",
      ja: "1〜2年目 · 初期黒字化",
      es: "Años 1–2 · Arranque",
    },
    scaleMeta: {
      zh: "启动预算 ≤ ¥10,000 · 每日运营约 2 小时 · 2.4 万付费考生 + 120 家工作室",
      en: "≤$1,400 capex · ~2h/day ops · 24k learners + 120 academies",
      ja: "初期投資15万円以下 · 2.4万人の受験生＋120塾",
      es: "Capex ≤€1.300 · 24k alumnos + 120 academias",
    },
    totalArr: "$3.6M",
    valuation: "$45M",
    grossMargin: "86%",
    ndr: "112%",
    revLearner: { amount: "$2.34M", share: 65 },
    revSchool: { amount: "$1.26M", share: 35 },
    revAiClear: { amount: "$0", share: 0 },
    revHireClear: { amount: "$0", share: 0 },
    operatingSummary: {
      zh: "先做确定性最高的现金流。个人端售卖 68 元考前冲刺卡与 699 元全年卡覆盖获客成本，机构端按年预收 3.98 万元白标系统授权费，首月即可盈利。所有考生在推导室里改错的每一步都自动入库，两年积累 5,000 万条真实纠错数据。",
      en: "Sell $19–$249 individual passes and pre-sell $4,900/yr white-label suites to boutique tutoring studios—profitable in Month 1 while collecting 50M+ step-level error corrections.",
      ja: "個人向け直前パスと学習塾向け年間49.8万円のOEMライセンスを先行販売し初月から黒字化。5,000万件の途中式修正データを蓄積します。",
      es: "Pases individuales y licencias OEM (€2.990/año) logran rentabilidad desde el primer mes acumulando 50M+ correcciones reales.",
    },
  },
  {
    id: "m2",
    tabLabel: {
      zh: "第 3–4 年 · 院校结果分成",
      en: "Years 3–4 · Outcome Billing",
      ja: "3〜4年目 · 成果連動課金",
      es: "Años 3–4 · Cobro por Éxito",
    },
    scaleMeta: {
      zh: "自研 7B 批改小模型上线 · 85 万考生 + 4,200 所合作学校与机构",
      en: "7B diagnostic model live · 850k learners + 4,200 schools",
      ja: "独自7Bモデル稼働 · 85万受講者＋4,200校",
      es: "Modelo propio 7B · 850k alumnos + 4.200 centros",
    },
    totalArr: "$210M",
    valuation: "$2.8B",
    grossMargin: "88%",
    ndr: "134%",
    revLearner: { amount: "$88M", share: 42 },
    revSchool: { amount: "$90M", share: 43 },
    revAiClear: { amount: "$22M", share: 10 },
    revHireClear: { amount: "$10M", share: 5 },
    operatingSummary: {
      zh: "用前两年积累的真实错题数据训练专用 7B 批改模型，单题验算成本下降 87%。向国际学校与大型教培推出按实测提分幅度分成的收费模式，学校每年扩科续签，机构净留存率提升至 134%，突破独角兽规模。",
      en: "Fine-tune a 7B diagnostic model (-87% inference cost) and bill schools per verified score jump, driving 134% net dollar retention.",
      ja: "独自7Bモデルで推論原価を87%削減。学校法人向けにスコア上昇連動課金を導入し、NDR 134%を達成します。",
      es: "El modelo 7B reduce costes un 87% y permite cobrar a los centros según la subida verificada de nota (NDR 134%).",
    },
  },
  {
    id: "m3",
    tabLabel: {
      zh: "第 5–6 年 · 执业资格网络",
      en: "Years 5–6 · Credential Grid",
      ja: "5〜6年目 · 専門職資格網",
      es: "Años 5–6 · Red Profesional",
    },
    scaleMeta: {
      zh: "切入医师 / 法考 / 量化工程考核 · 460 万用户 + 1.8 万家机构",
      en: "USMLE, Bar & Quant exams · 4.6M users + 18k institutions",
      ja: "医師・司法・クオンツ評価 · 460万人＋1.8万機関",
      es: "USMLE/MIR, Abogacía y Finanzas · 4,6M usuarios",
    },
    totalArr: "$1.55B",
    valuation: "$22B",
    grossMargin: "90%",
    ndr: "142%",
    revLearner: { amount: "$388M", share: 25 },
    revSchool: { amount: "$620M", share: 40 },
    revAiClear: { amount: "$341M", share: 22 },
    revHireClear: { amount: "$201M", share: 13 },
    operatingSummary: {
      zh: "从升学考试扩展到执业医师（USMLE/MIR）、法考与芯片及量化工程考核。考生在 90 秒闭卷条件下完成的推导记录带有加密校验，无法代写造假，逐步替代传统纸质简历成为行业招人的硬指标。",
      en: "Expand into medical, legal, and quantitative engineering credentials where tamper-proof closed-book records replace static resumes.",
      ja: "医師・司法試験・エンジニア実務評価へ拡張。時間制限付き白紙テストの暗号記録が採用選考の実力証明になります。",
      es: "Expansión hacia medicina, derecho e ingeniería con registros a libro cerrado imposibles de falsificar.",
    },
  },
  {
    id: "m4",
    tabLabel: {
      zh: "第 7–8 年 · 千亿美元结算所",
      en: "Years 7–8 · $108B Clearinghouse",
      ja: "7〜8年目 · 1,080億ドル精算網",
      es: "Años 7–8 · Cámara de $108B",
    },
    scaleMeta: {
      zh: "1,800 万活跃用户 · 18 万名实测前 1% 专家在线接单与直聘结算",
      en: "18M active users · 180k verified top-1% specialists clearing work",
      ja: "1,800万ユーザー · 上位1%の認定専門家18万人が稼働",
      es: "18M usuarios · 180k especialistas top 1% verificados",
    },
    totalArr: "$6.80B",
    valuation: "$108B",
    grossMargin: "91%",
    ndr: "148%",
    revLearner: { amount: "$1.09B", share: 16 },
    revSchool: { amount: "$2.31B", share: 34 },
    revAiClear: { amount: "$1.90B", share: 28 },
    revHireClear: { amount: "$1.50B", share: 22 },
    operatingSummary: {
      zh: "第 8 年平台一半收入来自高毛利双边结算：大模型公司通过平台按小时采购博士与高分考生的推理审校工时（平台抽成 30%，贡献 19 亿美元 ARR），世界 500 强与顶级机构按实测排名免笔试招人（每单支付 $25,000，每年成交 6 万单贡献 15 亿美元 ARR）。总 ARR 达 68 亿美元，按 16 倍网络平台估值突破千亿美元。",
      en: "Half of Year-8 ARR ($3.4B of $6.8B) comes from clearing verified human intelligence: a 30% take-rate on frontier AI lab reasoning audits ($1.9B ARR) plus 60,000 automated enterprise hires at $25,000 each ($1.5B ARR)—supporting a $108B market cap at 16× ARR.",
      ja: "8年目にはARR 68億ドルの半分を双方向精算が創出：最先端AIラボ向け推論検証仲介（手数料30%で19億ドル）と年間6万件の企業直採用精算（1件2.5万ドルで15億ドル）。16倍マルチプルで時価総額1,080億ドルに到達します。",
      es: "En el año 8, $3.4B de los $6.8B ARR provienen de comisiones del 30% en auditoría experta para IA ($1.9B) y 60.000 contrataciones directas a $25.000 ($1.5B), superando los $108B de valoración.",
    },
  },
];

interface OpenOrder {
  id: string;
  kind: "ai_audit" | "direct_hire";
  domain: string;
  payDisplay: Record<LocaleCode, string>;
  schedule: Record<LocaleCode, string>;
  minChecks: number;
  title: Record<LocaleCode, string>;
  detail: Record<LocaleCode, string>;
}

const OPEN_ORDERS: OpenOrder[] = [
  {
    id: "ord-calc",
    kind: "ai_audit",
    domain: "STEM · Calculus & Proofs",
    payDisplay: {
      zh: "¥745 / 小时",
      en: "$105 / hr",
      ja: "¥15,800 / 時間",
      es: "€96 / hora",
    },
    schedule: {
      zh: "每周 5–12 小时 · 远程周结",
      en: "5–12 hrs/wk · Weekly payout",
      ja: "週5〜12時間 · 週払い",
      es: "5–12 h/sem · Pago semanal",
    },
    minChecks: 15,
    title: {
      zh: "数学推理模型微积分步骤审校",
      en: "Frontier Reasoning Model · Calculus Step Auditor",
      ja: "推論AIモデル 微積分ステップ検証員",
      es: "Auditor de Derivaciones para Modelos IA",
    },
    detail: {
      zh: "核查大模型输出的级数余项与积分放缩过程，标出跳步行并给出正确不等式。",
      en: "Verify Taylor remainder bounds and improper integral steps for post-training datasets.",
      ja: "AIが出力した級数評価や積分の途中式を検証し、誤りを修正します。",
      es: "Revisa cotas de error y pasos de integración para entrenamiento de modelos.",
    },
  },
  {
    id: "ord-med",
    kind: "ai_audit",
    domain: "Clinical · USMLE / MIR",
    payDisplay: {
      zh: "¥990 / 小时",
      en: "$140 / hr",
      ja: "¥21,000 / 時間",
      es: "€128 / hora",
    },
    schedule: {
      zh: "每周 4–10 小时 · 远程周结",
      en: "4–10 hrs/wk · Weekly payout",
      ja: "週4〜10時間 · 週払い",
      es: "4–10 h/sem · Pago semanal",
    },
    minChecks: 15,
    title: {
      zh: "临床心血管与内分泌病例标注",
      en: "Clinical Pathophysiology Benchmark Specialist",
      ja: "臨床循環器・内分泌ケース作成専門員",
      es: "Especialista en Casos Clínicos MIR / USMLE",
    },
    detail: {
      zh: "面向高分医学生与住院医，编写高难度鉴别诊断排除链与用药禁忌解析。",
      en: "Author differential diagnosis rationales and hemodynamic explanations for medical AI.",
      ja: "鑑別診断の除外根拠と薬理メカニズム解説を作成する高単価リモート案件。",
      es: "Redacta cadenas de diagnóstico diferencial y criterios farmacológicos.",
    },
  },
  {
    id: "ord-quant",
    kind: "direct_hire",
    domain: "Direct Hire · Quantitative Research",
    payDisplay: {
      zh: "年薪 ¥85万–130万（免首轮笔试）",
      en: "$160k–$220k Base (Skip Tech Screen)",
      ja: "年収 1,800万〜2,600万円（筆記免除）",
      es: "€110k–€150k (Sin prueba previa)",
    },
    schedule: {
      zh: "上海 / 香港 / 纽约 · 企业支付平台 $25k 撮合费",
      en: "HK / NY / Remote · Employer pays $25k fee",
      ja: "東京・香港 · 企業側精算 $25k",
      es: "Madrid / Londres · Comisión empresa $25k",
    },
    minChecks: 15,
    title: {
      zh: "合作量化机构与科技研发岗免笔试直推",
      en: "Partner Quant & AI Engineering Direct Fast-Track",
      ja: "提携クオンツ・AI開発ポジション直結選考",
      es: "Selección Directa en Finanzas Cuantitativas e IA",
    },
    detail: {
      zh: "凭平台内 15 次以上限时闭卷微积分与概率推导记录，直接进入业务负责人终面。",
      en: "Verified timed closed-book proof records bypass take-home tests directly to final rounds.",
      ja: "時間制限付き白紙テストの暗号証明により、一次筆記選考を免除して最終面接へ進めます。",
      es: "Tus registros verificados a libro cerrado permiten pasar directamente a entrevista final.",
    },
  },
];

export function ClearinghouseLedgerView({
  locale,
  proofs,
  onGoToStudio,
  onGoToSchoolSuite,
}: ClearinghouseLedgerViewProps) {
  const [stageIdx, setStageIdx] = useState<number>(3);
  const [registeredMap, setRegisteredMap] = useState<Record<string, boolean>>({});

  const st = MILESTONES[stageIdx] ?? MILESTONES[3];
  const passedCount = proofs.length;

  return (
    <div className="mx-auto max-w-[1180px] space-y-12 px-4 py-7 sm:px-8 sm:py-9 pb-24">
      {/* =====================================================================
          HEADER
         ===================================================================== */}
      <header className="space-y-2 border-b border-border pb-6">
        <div className="font-mono text-xs text-muted-foreground">
          05 / VERIFIED TALENT POOL & 8-YEAR $108B REVENUE LEDGER
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
          {locale === "zh"
            ? "实测人才库与八年千亿美元商业账本"
            : "Verified Talent Clearinghouse & 8-Year $108B Operating Model"}
        </h1>
        <p className="max-w-3xl text-[15px] text-muted-foreground">
          {locale === "zh"
            ? "切换下方四个阶段，查看公司如何从 ≤1 万元启动预算的备考工具，逐步长成 68 亿美元年收入的人才与 AI 数据结算平台。"
            : "Step across four operating stages to inspect how unit economics compound from ≤$1.4k seed capex to $6.80B ARR."}
        </p>
      </header>

      {/* =====================================================================
          BAND 1: INTERACTIVE 8-YEAR $108B FINANCIAL SIMULATOR
         ===================================================================== */}
      <section className="obsidian-stage overflow-hidden rounded-2xl p-6 sm:p-9 space-y-7">
        {/* Stage Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap gap-1.5">
            {MILESTONES.map((m, idx) => {
              const active = idx === stageIdx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setStageIdx(idx)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-white text-[#161615]"
                      : "bg-white/8 text-white/70 hover:text-white"
                  }`}
                >
                  {m.tabLabel[locale]}
                </button>
              );
            })}
          </div>
          <span className="font-mono text-xs text-white/60">
            {st.scaleMeta[locale]}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 6 Cols: Core Valuation KPIs + Plain Explanation */}
          <div className="space-y-6 lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="obsidian-metal-card rounded-xl p-4">
                <div className="text-[11px] text-white/55">
                  {locale === "zh" ? "年化总收入 ARR" : "Total ARR"}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                  {st.totalArr}
                </div>
              </div>
              <div className="obsidian-metal-card rounded-xl p-4">
                <div className="text-[11px] text-white/55">
                  {locale === "zh" ? "目标市值规模" : "Valuation"}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#93c5fd]">
                  {st.valuation}
                </div>
              </div>
              <div className="obsidian-metal-card rounded-xl p-4">
                <div className="text-[11px] text-white/55">
                  {locale === "zh" ? "综合毛利率" : "Gross Margin"}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                  {st.grossMargin}
                </div>
              </div>
              <div className="obsidian-metal-card rounded-xl p-4">
                <div className="text-[11px] text-white/55">
                  {locale === "zh" ? "机构净留存率" : "School NDR"}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                  {st.ndr}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/80">
              {st.operatingSummary[locale]}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onGoToSchoolSuite}
                className="rounded-lg border border-white/18 bg-white/8 px-4 py-2 text-xs font-semibold text-white hover:bg-white/14"
              >
                {locale === "zh"
                  ? "查看学校白标与出题后台 →"
                  : "Inspect School OEM Console →"}
              </button>
              <button
                type="button"
                onClick={onGoToStudio}
                className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#161615] hover:bg-white/90"
              >
                {locale === "zh"
                  ? "去推导室体验闭卷能力认证 →"
                  : "Try 90s Closed-Book Check →"}
              </button>
            </div>
          </div>

          {/* Right 6 Cols: 4-Engine Revenue Waterfall Breakdown */}
          <div className="overflow-hidden rounded-xl border border-[#313131] bg-[#1f1f1f] lg:col-span-6">
            <div className="relative h-28 w-full overflow-hidden border-b border-[#313131]">
              <Image
                src={withBasePath("/images/editorial-global-clearing.jpg")}
                alt="全球实测人才与推理验证研究院"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/45" />
              <div className="absolute bottom-2.5 left-4 right-4 flex justify-between font-mono text-xs text-white/95 tnum">
                <span>
                  {locale === "zh" ? "四项收入贡献拆解" : "4-Stream ARR Breakdown"}
                </span>
                <span>100% = {st.totalArr}</span>
              </div>
            </div>

            <div className="space-y-3.5 p-5">
              {[
                {
                  name:
                    locale === "zh"
                      ? "① 个人备考冲刺卡与年卡"
                      : "1. Individual Exam Passes",
                  amount: st.revLearner.amount,
                  share: st.revLearner.share,
                  color: "#94a3b8",
                },
                {
                  name:
                    locale === "zh"
                      ? "② 学校白标授权与提分结果分成"
                      : "2. School White-Label & Score-Lift Billing",
                  amount: st.revSchool.amount,
                  share: st.revSchool.share,
                  color: "#60a5fa",
                },
                {
                  name:
                    locale === "zh"
                      ? "③ 大模型实验室推导审校抽成（30%）"
                      : "3. Frontier AI Lab Review Clearing (30% Fee)",
                  amount: st.revAiClear.amount,
                  share: st.revAiClear.share,
                  color: "#34d399",
                },
                {
                  name:
                    locale === "zh"
                      ? "④ 跨国企业免笔试直聘撮合（$25,000/单）"
                      : "4. Automated Enterprise Placement ($25k/hire)",
                  amount: st.revHireClear.amount,
                  share: st.revHireClear.share,
                  color: "#fbbf24",
                },
              ].map((row) => (
                <div key={row.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/85">{row.name}</span>
                    <span className="font-mono font-semibold tabular-nums text-white">
                      {row.amount} ({row.share}%)
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 100 5"
                    preserveAspectRatio="none"
                    className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                  >
                    {row.share > 0 && (
                      <rect
                        x={0}
                        y={0}
                        width={row.share}
                        height={5}
                        fill={row.color}
                      />
                    )}
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BAND 2: MY VERIFIED CLOSED-BOOK RECORDS
         ===================================================================== */}
      <section className="surface-elevated rounded-xl border border-border p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {locale === "zh"
                ? `我的闭卷达标档案（已完成 ${passedCount} / 15 次）`
                : `My Verified Closed-Book Records (${passedCount} / 15 Completed)`}
            </h2>
            <p className="text-xs text-muted-foreground">
              {locale === "zh"
                ? "每次在推导室关掉讲义限时通过测试，都会自动生成带时间戳的实测凭证。"
                : "Passing timed closed-book checks inside 1-on-1 Practice mints verifiable records."}
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToStudio}
            className="btn-tactile-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
          >
            <span>
              {locale === "zh" ? "去完成下一次闭卷测试" : "Take Next Closed-Book Check"}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {proofs.map((p) => (
            <div
              key={p.hash}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[11px] font-semibold text-brand">
                  {p.courseCode} · {p.hash}
                </div>
                <div className="truncate text-sm font-medium text-foreground">
                  {p.conceptTitle}
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{p.elapsedSeconds}s</span>
                  <span>·</span>
                  <span>+{p.stabilityDays}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          BAND 3: OPEN AI AUDIT & DIRECT HIRING ORDERS
         ===================================================================== */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {locale === "zh"
              ? "当前开放的大模型审校与企业免笔试直聘单"
              : "Open AI Lab Audit & Direct Hiring Orders"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "zh"
              ? "满 15 次闭卷达标即可报名，审校报酬按周直接结算到个人账户。"
              : "Complete 15 closed-book checks to apply. Audit payouts settle weekly."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {OPEN_ORDERS.map((ord) => {
            const done = Boolean(registeredMap[ord.id]);
            return (
              <div
                key={ord.id}
                className="surface-elevated flex flex-col justify-between rounded-xl border border-border p-5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {ord.domain}
                    </span>
                    <span className="rounded-sm bg-signal-soft px-2 py-0.5 font-mono text-xs font-bold text-signal">
                      {ord.payDisplay[locale]}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {ord.title[locale]}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {ord.detail[locale]}
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-border pt-3.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {ord.schedule[locale]}
                    </span>
                    <span className="font-mono text-foreground">
                      ≥{ord.minChecks}次闭卷
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRegisteredMap((prev) => ({ ...prev, [ord.id]: true }))
                    }
                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold ${
                      done ? "bg-signal-soft text-signal" : "btn-lovable-dark"
                    }`}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{locale === "zh" ? "已登记候选席位" : "Registered"}</span>
                      </>
                    ) : (
                      <span>{locale === "zh" ? "登记候选席位" : "Apply for Slot"}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
