"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  DownloadSimple,
  MagnifyingGlass,
  SpeakerHigh,
  Stop,
  WarningCircle,
} from "@phosphor-icons/react";
import { withBasePath } from "@/lib/asset-path";
import { BrandMark } from "@/components/platform/BrandMark";
import {
  LegalComplianceModal,
  type LegalDocTab,
} from "@/components/platform/LegalComplianceModal";
import { WordByWordTagline } from "@/components/platform/WordByWordTagline";
import type {
  CoursePack,
  LocaleCode,
  ProofOfMasteryRecord,
  WhiteLabelConfig,
  WorkspaceTab,
} from "@/types/platform";

interface OfficialFlagshipSiteProps {
  brand: WhiteLabelConfig;
  courses: CoursePack[];
  onOpenStudioTab: (tab: WorkspaceTab, courseId?: string) => void;
  onOpenCashier: (mode: "c_end" | "b_end" | "redeem") => void;
  onDownloadStandalone: () => void;
  onMintProof: (proof: ProofOfMasteryRecord) => void;
  isProUnlocked: boolean;
}

/* ============================================================================
   SCROLL REVEAL WRAPPER (B7: IntersectionObserver once-only, 32px rise, 700ms)
   ============================================================================ */
function RevealSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/* ============================================================================
   HERO LIVE RUBRIC DATA (3 Real High-Stakes Tracks)
   ============================================================================ */
interface HeroScriptLine {
  lineNo: string;
  draft: string;
  tag: Record<LocaleCode, string>;
  reason: Record<LocaleCode, string>;
  rewrite: Record<LocaleCode, string>;
}

interface HeroTrackSample {
  id: string;
  courseId: string;
  tabLabel: Record<LocaleCode, string>;
  examTitle: Record<LocaleCode, string>;
  scoreBefore: string;
  scoreAfter: string;
  voiceLang: string;
  voiceNote: Record<LocaleCode, string>;
  lines: HeroScriptLine[];
}

const HERO_SAMPLES: HeroTrackSample[] = [
  {
    id: "calc",
    courseId: "ap-calc",
    tabLabel: {
      zh: "微积分压轴题",
      en: "AP Calculus BC",
      ja: "東大理系数学",
      es: "Cálculo AP",
    },
    examTitle: {
      zh: "FRQ 第 6 题 · 三阶泰勒余项上界证明",
      en: "FRQ Question 6 · Lagrange error bound proof",
      ja: "第6問 · ラグランジュ剰余項の上界証明",
      es: "Pregunta 6 · Cota de error de Lagrange",
    },
    scoreBefore: "62",
    scoreAfter: "96",
    voiceLang: "zh-CN",
    voiceNote: {
      zh: "阅卷复盘。第一行漏写函数在闭区间四阶连续可导的前提扣四分。第二行把零直接代入余项属于求下界，整段不等式判零分。改用右端点放大后即可拿满。",
      en: "Reader note. Line one omits fourth derivative continuity on the closed interval for minus four points. Line two plugs zero into the remainder, yielding a lower bound instead of an upper bound.",
      ja: "採点講評。1行目で閉区間における4階連続微分可能性の明記が抜けています。2行目で中心0を代入すると上界にならず失点します。",
      es: "Nota de corrección. La primera línea omite la continuidad en el intervalo cerrado y la segunda evalúa en cero en vez del extremo derecho.",
    },
    lines: [
      {
        lineNo: "01",
        draft: "P₃(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.22133",
        tag: {
          zh: "漏写闭区间可导前提 · 扣 4 分",
          en: "Missing continuity premise · Minus 4 pts",
          ja: "微分可能性の前提漏れ · 4点減点",
          es: "Falta premisa de continuidad · Menos 4 pts",
        },
        reason: {
          zh: "直接写出多项式展开而未声明 e^x 在闭区间 [0, 0.2] 四阶连续可导，按阅卷细则扣除定理前置条件分。",
          en: "Scoring guidelines require stating continuous fourth derivatives on [0, 0.2] before applying Taylor's theorem.",
          ja: "定理適用の前提となる閉区間での連続微分可能性が記述されていません。",
          es: "La rúbrica exige declarar la continuidad de la cuarta derivada en [0, 0.2].",
        },
        rewrite: {
          zh: "由 f(x) = e^x 在 [0, 0.2] 上四阶连续可导，得 P₃(0.2) = 1 + 0.2 + 0.02 + 0.00133 = 1.22133。",
          en: "Since f(x) = e^x has continuous 4th derivatives on [0, 0.2], P₃(0.2) = 1.22133.",
          ja: "f(x)=e^x は [0, 0.2] で C⁴ 級より P₃(0.2) = 1.22133。",
          es: "Como f(x) = e^x es de clase C⁴ en [0, 0.2], P₃(0.2) = 1.22133.",
        },
      },
      {
        lineNo: "02",
        draft: "|R₃(0.2)| = e⁰ · (0.2)⁴ / 24 = 6.67 × 10⁻⁵ < 1.5 × 10⁻⁴",
        tag: {
          zh: "误代左端点求成下界 · 扣 18 分",
          en: "Invalid c = 0 substitution · Minus 18 pts",
          ja: "左端 c = 0 の誤代入 · 18点減点",
          es: "Sustitución inválida c = 0 · Menos 18 pts",
        },
        reason: {
          zh: "余项中 ξ 位于开区间 (0, 0.2) 内未知位置，代入 0 只算出最小值，整段证明按逻辑无效判零分。",
          en: "Evaluating e^c at c = 0 produces the minimum on the interval rather than a valid upper bound.",
          ja: "未知の点 c に 0 を代入すると最小値となり、誤差の上界証明として無効になります。",
          es: "Evaluar en cero produce el mínimo del intervalo en lugar de una cota superior válida.",
        },
        rewrite: {
          zh: "因 e^x 单调递增且 c ∈ (0, 0.2)，有 e^c < e^{0.2} < 2，故 |R₃(0.2)| < 2 × 0.0016 / 24 = 1.33 × 10⁻⁴。",
          en: "Because e^x increases on (0, 0.2), e^c < e^{0.2} < 2, so |R₃(0.2)| < 2(0.0016)/24 = 1.33 × 10⁻⁴.",
          ja: "単調増加性より e^c < e^{0.2} < 2 となるため |R₃(0.2)| < 1.33 × 10⁻⁴ < 1.5 × 10⁻⁴。",
          es: "Como e^x crece en (0, 0.2), e^c < 2 y |R₃(0.2)| < 1.33 × 10⁻⁴.",
        },
      },
      {
        lineNo: "03",
        draft: "同理对 ln(1 + x) 在 x = 0.2 处继续套用拉格朗日余项放缩…",
        tag: {
          zh: "交错级数混用放缩法 · 扣 12 分",
          en: "Wrong bound on alternating series · Minus 12 pts",
          ja: "交代級数の評価法ミス · 12点減点",
          es: "Cota incorrecta en serie alternada · Menos 12 pts",
        },
        reason: {
          zh: "交错级数应当改用莱布尼茨首项截断误差，硬套拉格朗日导数上界会放大三倍导致超时卡壳。",
          en: "Alternating series require the first omitted term bound rather than derivative maximization.",
          ja: "交代級数ではライプニッツの打切り誤差評価を使う方が簡潔かつ精密です。",
          es: "Las series alternadas requieren acotar con el primer término omitido.",
        },
        rewrite: {
          zh: "交错级数满足各项绝对值递减趋于零，截断误差直接小于首项 (0.2)⁴ / 4 = 4.0 × 10⁻⁴。",
          en: "By the Alternating Series Remainder Theorem, error is strictly below (0.2)⁴ / 4 = 4.0 × 10⁻⁴.",
          ja: "交代級数の性質より誤差は最初の省略項 (0.2)⁴ / 4 = 4.0 × 10⁻⁴ 未満。",
          es: "Por el criterio de Leibniz, el error es menor que (0.2)⁴ / 4 = 4.0 × 10⁻⁴.",
        },
      },
    ],
  },
  {
    id: "ielts",
    courseId: "ielts-writing",
    tabLabel: {
      zh: "雅思学术写作",
      en: "IELTS Writing",
      ja: "IELTS 論述添削",
      es: "Redacción IELTS",
    },
    examTitle: {
      zh: "Task 2 议论文 · 自动化税与就业再培训",
      en: "Task 2 Essay · Automation levy and retraining",
      ja: "Task 2 論述 · 自動化課税と再教育制度",
      es: "Tarea 2 · Impuesto a la automatización",
    },
    scoreBefore: "6.0",
    scoreAfter: "7.5",
    voiceLang: "en-GB",
    voiceNote: {
      zh: "考官批注。首句用绝对化全称判断直接把论证锁死在六分档。补上行业限定条件与财政转移路径后，任务回应项可升至七点五分。",
      en: "Examiner critique. Blanket claims cap Task Response at Band 6. Qualifying sector exposure and specifying fiscal allocation raises coherence to Band 7.5.",
      ja: "採点メモ。冒頭の断定表現がスコアを6.0に抑えています。対象産業と財源使途を具体化すると7.5に届きます。",
      es: "Nota del examinador. Las afirmaciones absolutas limitan la nota a 6.0; matizar sectores eleva el texto a 7.5.",
    },
    lines: [
      {
        lineNo: "01",
        draft: "Robots will soon replace every human worker in all industries.",
        tag: {
          zh: "全称绝对化判断 · 任务回应锁死 6.0",
          en: "Overgeneralized claim · Caps TR at 6.0",
          ja: "過度な一般化 · TR 6.0止まり",
          es: "Generalización excesiva · Límite 6.0",
        },
        reason: {
          zh: "缺乏限定范围的全称论断无法展开让步段，考官在论证深度一项最高只能给到 6 分。",
          en: "Absolute statements leave zero room for nuanced concession required at Band 7 and above.",
          ja: "例外や産業差を無視した断定は論理の深みが不足していると判定されます。",
          es: "Las afirmaciones universales impiden desarrollar concesiones matizadas.",
        },
        rewrite: {
          zh: "While warehouse assembly faces rapid automation, non routine clinical and legal roles remain human led.",
          en: "While routine logistics faces rapid automation, clinical and legal judgment remains human led.",
          ja: "定型物流業務で自動化が進む一方、医療や法務の判断業務は依然として人間が担う。",
          es: "Mientras la logística rutinaria se automatiza rápido, el juicio clínico sigue siendo humano.",
        },
      },
      {
        lineNo: "02",
        draft: "Therefore governments must tax machines heavily right now.",
        tag: {
          zh: "因果跳步缺机制 · 衔接项扣 1.0 分",
          en: "Unsupported policy leap · Minus 1.0 band",
          ja: "因果の飛躍 · 一貫性マイナス1.0",
          es: "Salto lógico sin mecanismo · Menos 1.0",
        },
        reason: {
          zh: "从失业风险直接跳到重税结论，中间缺少税款如何转化为转岗补贴的论证链条。",
          en: "Jumps from displacement risk to punitive taxation without explaining how revenue funds transition.",
          ja: "失業リスクから課税強化へ直結しており、税収の還元経路が書かれていません。",
          es: "Salta del riesgo laboral al impuesto sin explicar cómo se financia la reconversión.",
        },
        rewrite: {
          zh: " earmarking a modest payroll neutral levy on autonomous fleets can fund accredited vocational stipends.",
          en: "Earmarking a targeted levy on autonomous fleets can directly fund accredited retraining stipends.",
          ja: "自律稼働設備への目的税を認定職業訓練の給付金へ充てる仕組みが有効である。",
          es: "Destinar una tasa específica sobre flotas autónomas permite financiar becas técnicas.",
        },
      },
    ],
  },
  {
    id: "usmle",
    courseId: "ap-calc",
    tabLabel: {
      zh: "临床病例推导",
      en: "USMLE Step 1",
      ja: "臨床病態推論",
      es: "Clínica USMLE",
    },
    examTitle: {
      zh: "病例 #412 · 慢性心衰代偿期血流动力学判断",
      en: "Vignette #412 · Heart failure hemodynamic arrows",
      ja: "症例 #412 · 心不全代償期の血行動態",
      es: "Caso #412 · Hemodinámica en insuficiencia cardíaca",
    },
    scoreBefore: "218",
    scoreAfter: "256",
    voiceLang: "en-US",
    voiceNote: {
      zh: "临床复盘。射血分数降到百分之三十二时，交感与肾素血管紧张素系统同步激活，外周血管阻力必定升高以维持灌注压，选血管扩张会直接丢掉整题。",
      en: "Clinical review. When ejection fraction drops to 32 percent, sympathetic and renin angiotensin activation raises systemic vascular resistance to preserve perfusion.",
      ja: "症例復習。駆出率が32%に低下すると交感神経とRAASが活性化し、末梢血管抵抗は上昇します。",
      es: "Revisión clínica. Con fracción de eyección del 32 por ciento, la resistencia vascular sistémica sube por activación simpática.",
    },
    lines: [
      {
        lineNo: "01",
        draft: "LVEF 32% → Cardiac output ↓ → Systemic vascular resistance ↓",
        tag: {
          zh: "把心源性代偿误判为脓毒症扩血管 · 整题失分",
          en: "Confused cardiogenic SVR with distributive shock",
          ja: "心原性代償と敗血症性血管拡張の混同",
          es: "Confunde compensación cardiogénica con vasodilatación",
        },
        reason: {
          zh: "泵功能下降触发颈动脉窦压力感受器与肾素释放，外周小动脉收缩，阻力箭头应当向上。",
          en: "Baroreceptor unloading and angiotensin II constrict arterioles, driving systemic vascular resistance up.",
          ja: "圧受容器反射とアンジオテンシンIIにより細動脈が収縮するため抵抗は上昇します。",
          es: "La descarga barorreceptora y la angiotensina II contraen arteriolas y elevan la resistencia.",
        },
        rewrite: {
          zh: "LVEF 32% → 心输出量 ↓ → 交感与肾素激活 → 外周血管阻力 ↑ 且左室舒张末压 ↑。",
          en: "LVEF 32% → CO ↓ → Sympathetic & RAAS surge → SVR ↑ and LVEDP ↑.",
          ja: "LVEF 32% → 心拍出量 ↓ → 交感神経・RAAS亢進 → 末梢血管抵抗 ↑・LVEDP ↑。",
          es: "FEVI 32% → Gasto ↓ → Activación simpática y SRAA → RVS ↑ y PTDVI ↑.",
        },
      },
    ],
  },
];

/* ============================================================================
   8-YEAR $108B HECTOCORN LEDGER HORIZONS
   ============================================================================ */
interface HorizonMilestone {
  id: string;
  years: Record<LocaleCode, string>;
  phaseTitle: Record<LocaleCode, string>;
  arr: string;
  valuation: string;
  grossMargin: string;
  ndr: string;
  summary: Record<LocaleCode, string>;
  streams: Array<{
    name: Record<LocaleCode, string>;
    amount: string;
    sharePct: number;
  }>;
}

const HORIZONS: HorizonMilestone[] = [
  {
    id: "h1",
    years: {
      zh: "第 1 至 2 年",
      en: "Years 1 to 2",
      ja: "1〜2年目",
      es: "Años 1 a 2",
    },
    phaseTitle: {
      zh: "轻资产冷启动与白标回本",
      en: "Asset light wedge & OEM cashflow",
      ja: "少資本立上げとOEM黒字化",
      es: "Arranque ligero y flujo OEM",
    },
    arr: "$3.6M",
    valuation: "$45M",
    grossMargin: "86.4%",
    ndr: "112%",
    summary: {
      zh: "启动成本控制在 ¥10,000 以内，每日维护约 2 小时。靠 ¥68 考前冲刺卡自然裂变获客，同时向精品教培工作室交付 ¥39,800 年度白标系统，首单即收回全部研发与推理开销，累计沉淀 5,180 万条预计错因改写轨迹。",
      en: "Launch under $1,400 capex and 2 hours daily operations. Viral $19 exam sprints pair with $4,900 school white label licenses, breaking even on customer one while logging 51.8M step level corrections.",
      ja: "初期費用20万円以下・1日2時間の運用で開始。直前対策パスと学習塾向け年額OEMで初月から黒字化し、5,180万件の記述修正履歴を蓄積します。",
      es: "Arranque con menos de 1.300 € y 2 horas diarias. Combina pases de examen de 15 € con licencias OEM escolares de 2.990 €.",
    },
    streams: [
      {
        name: {
          zh: "考生冲刺卡与全科年卡（2.42 万付费考生）",
          en: "Student exam passes (24.2k learners)",
          ja: "受験生パス（2.42万人）",
          es: "Pases de examen (24,2 mil alumnos)",
        },
        amount: "$2.34M",
        sharePct: 65,
      },
      {
        name: {
          zh: "培训机构与名师工作室白标年费（124 家）",
          en: "Studio white label SaaS (124 orgs)",
          ja: "塾・スタジオOEM年額（124校）",
          es: "Licencias OEM para centros (124)",
        },
        amount: "$1.26M",
        sharePct: 35,
      },
    ],
  },
  {
    id: "h2",
    years: {
      zh: "第 3 至 4 年",
      en: "Years 3 to 4",
      ja: "3〜4年目",
      es: "Años 3 a 4",
    },
    phaseTitle: {
      zh: "自研判分小模型与百校督学网",
      en: "7B rubric model & school network",
      ja: "専用採点モデルと4,200校展開",
      es: "Modelo propio y red de 4.200 centros",
    },
    arr: "$210M",
    valuation: "$2.85B",
    grossMargin: "88.2%",
    ndr: "134%",
    summary: {
      zh: "基于前两年积累的千万级步骤纠错对，微调 7B 专用阅卷模型，把单生月均推理成本压低 87.3%。国际学校与连锁教培普遍采用 1 名主讲配 150 名学生的督学席位，按实际提分结果阶梯续费。",
      en: "Fine tuning a 7B grading model on proprietary step traces cuts inference cost by 87.3%. Over 4,200 schools adopt 1 to 150 supervision pods with outcome linked renewal.",
      ja: "独自データで学習した7B採点モデルにより推論原価を87.3%削減。4,200校が1対150の監督システムを導入します。",
      es: "El modelo propio de 7B reduce el coste de inferencia un 87,3% en 4.200 instituciones educativas.",
    },
    streams: [
      {
        name: {
          zh: "多国大考个人订阅（85.4 万考生）",
          en: "Global student subscriptions (854k)",
          ja: "個人受講パス（85.4万人）",
          es: "Suscripciones individuales (854 mil)",
        },
        amount: "$88M",
        sharePct: 42,
      },
      {
        name: {
          zh: "4,200 所学校白标与提分分成",
          en: "4,200 schools OEM & outcome billing",
          ja: "4,200校のOEM・成果報酬",
          es: "OEM escolar y cobro por mejora",
        },
        amount: "$90M",
        sharePct: 43,
      },
      {
        name: {
          zh: "首批算法与医学闭卷人才内推结算",
          en: "Initial verified talent & lab clearing",
          ja: "認定人材紹介・初期推論精算",
          es: "Selección verificada inicial",
        },
        amount: "$32M",
        sharePct: 15,
      },
    ],
  },
  {
    id: "h3",
    years: {
      zh: "第 5 至 6 年",
      en: "Years 5 to 6",
      ja: "5〜6年目",
      es: "Años 5 a 6",
    },
    phaseTitle: {
      zh: "医考法考准入与大模型后训练清算",
      en: "Clinical, bar & frontier AI clearing",
      ja: "医師・司法試験とAI後学習精算",
      es: "Medicina, abogacía y datos de IA",
    },
    arr: "$1.55B",
    valuation: "$22.4B",
    grossMargin: "90.1%",
    ndr: "142%",
    summary: {
      zh: "品类从升学考试延展至执业医师、律师资格与量化工程考核。前沿大模型实验室采购高难度多步推理评测任务，按 30% 平台清算抽成向通过闭卷核验的尖子生与学者派发高薪标注审校单。",
      en: "Expands into medical licensing, bar exams, and quant engineering. Frontier AI labs route post training reasoning audits through our verified top 1% specialists at a 30% clearing fee.",
      ja: "医師国家試験・司法試験・クオンツ領域へ拡大。先端AI研究所向けの多段階推論監査タスクで30%の精算手数料を獲得します。",
      es: "Expansión a exámenes médicos, jurídicos y auditorías de razonamiento para laboratorios de IA.",
    },
    streams: [
      {
        name: {
          zh: "全球执业与升学个人通行证（462 万用户）",
          en: "Credential & exam passes (4.62M users)",
          ja: "資格・進学パス（462万人）",
          es: "Pases profesionales (4,62M usuarios)",
        },
        amount: "$388M",
        sharePct: 25,
      },
      {
        name: {
          zh: "1.82 万所高校与企业实训学院",
          en: "18,200 universities & corporate academies",
          ja: "1.82万の大学・企業研修機関",
          es: "18.200 universidades y academias",
        },
        amount: "$620M",
        sharePct: 40,
      },
      {
        name: {
          zh: "大模型推理审校与闭卷人才直聘清算",
          en: "AI post training audits & direct hiring",
          ja: "AI推論監査・認定人材ダイレクト採用",
          es: "Auditoría de IA y contratación directa",
        },
        amount: "$542M",
        sharePct: 35,
      },
    ],
  },
  {
    id: "h4",
    years: {
      zh: "第 7 至 8 年",
      en: "Years 7 to 8",
      ja: "7〜8年目",
      es: "Años 7 a 8",
    },
    phaseTitle: {
      zh: "全球实测能力凭证与千亿美元百角兽",
      en: "Global proof standard · $108B Hectocorn",
      ja: "世界標準の実証台帳・時価総額1,080億ドル",
      es: "Estándar mundial · Hectocornio de $108B",
    },
    arr: "$6.80B",
    valuation: "$108B",
    grossMargin: "91.3%",
    ndr: "148%",
    summary: {
      zh: "传统网课考完即流失，知微把每一次闭卷推导沉淀为示例能力账本。一半营收来自高毛利的企业免简历直聘（每名录用收取 $25,000）与全球人工智能实验室推理数据清算，假设按 16 倍年收入估值。",
      en: "Traditional EdTech churns the day an exam ends. DeepScholar turns verified closed book reasoning into permanent career and AI clearing infrastructure, compounding $6.80B ARR at 91.3% margin.",
      ja: "試験終了で離脱する従来の教育サービスを超え、白紙再現の証明台帳を企業の直接採用とAIデータ精算へ接続し、ARR 68億ドルを達成します。",
      es: "Convierte las pruebas sin apuntes en infraestructura permanente de contratación y auditoría de IA con $6.80B ARR.",
    },
    streams: [
      {
        name: {
          zh: "个人终身学习与执业复审（1,840 万活跃考生）",
          en: "Lifelong exam & licensing passes (18.4M)",
          ja: "個人学習・資格更新パス（1,840万人）",
          es: "Pases de aprendizaje continuo (18,4M)",
        },
        amount: "$1.09B",
        sharePct: 16,
      },
      {
        name: {
          zh: "全球高校、公立学区与跨国企业内训系统",
          en: "Global institutional & enterprise OS",
          ja: "世界の大学・学区・企業内研修基盤",
          es: "Sistema institucional y corporativo global",
        },
        amount: "$2.31B",
        sharePct: 34,
      },
      {
        name: {
          zh: "前沿 AI 实验室推理数据清算（30% 平台抽成）",
          en: "Frontier AI reasoning clearing (30% take)",
          ja: "先端AI推論データ精算（手数料30%）",
          es: "Liquidación de datos para IA (30% comisión)",
        },
        amount: "$1.90B",
        sharePct: 28,
      },
      {
        name: {
          zh: "企业闭卷验证人才直聘（年交付 60,000 席 × $25k）",
          en: "Verified direct hires (60,000 × $25k)",
          ja: "実証済み人材採用精算（年間6万名）",
          es: "Contratación directa verificada (60.000 plazas)",
        },
        amount: "$1.50B",
        sharePct: 22,
      },
    ],
  },
];

/* ============================================================================
   FAQ ITEMS (8 Specific Buyer, School, Compliance & Permanence Questions)
   ============================================================================ */
interface FaqEntry {
  id: string;
  category: "student" | "school" | "permanent";
  q: Record<LocaleCode, string>;
  a: Record<LocaleCode, string>;
}

const FAQ_ENTRIES: FaqEntry[] = [
  { id: "q1", category: "student", q: { zh: "现在可以体验什么？", en: "What can I try?", ja: "何を体験できますか？", es: "¿Qué puedo probar?" }, a: { zh: "可以浏览示例批改，尝试练习并打开学习工作台。当前内容为演示，请自行核对答案。", en: "Explore sample feedback and practice in the workspace. This is a demonstration; check answers independently.", ja: "添削例と演習を試せます。デモのため、回答はご自身で確認してください。", es: "Puedes explorar ejemplos y practicar. Es una demostración: verifica las respuestas." } },
  { id: "q2", category: "school", q: { zh: "学校可以使用哪些功能？", en: "What can schools explore?", ja: "学校向けの機能は？", es: "¿Qué pueden explorar los centros?" }, a: { zh: "学校工作台展示督学队列、平行试卷和品牌设置的原型。部署与数据保护需要进一步配置。", en: "The school workspace demonstrates supervision, parallel papers and branding. Deployment and data protection require further configuration.", ja: "督学、試験問題、ブランド設定のプロトタイプを体験できます。", es: "El espacio escolar demuestra supervisión, exámenes y marca propia." } },
  { id: "q3", category: "permanent", q: { zh: "离线版如何使用？", en: "How does offline mode work?", ja: "オフライン版の使い方は？", es: "¿Cómo funciona sin conexión?" }, a: { zh: "下载单文件后可在本地浏览器打开。离线版与官网是不同的演示，联网模型服务需要网络和有效配置。", en: "Download the standalone HTML and open it locally. The offline edition is a separate demo; model services require a connection and configuration.", ja: "単一HTMLを保存して開けます。モデルサービスには接続と設定が必要です。", es: "Descarga el HTML y ábrelo localmente. Los servicios de modelos requieren conexión y configuración." } },
];

const SHARE_WIDTH_CLASS: Record<number, string> = {
  15: "w-[15%]",
  16: "w-[16%]",
  22: "w-[22%]",
  25: "w-[25%]",
  28: "w-[28%]",
  34: "w-[34%]",
  35: "w-[35%]",
  40: "w-[40%]",
  42: "w-[42%]",
  43: "w-[43%]",
  65: "w-[65%]",
};

export function OfficialFlagshipSite({
  brand,
  courses,
  onOpenStudioTab,
  onOpenCashier,
  onDownloadStandalone,
  onMintProof,
  isProUnlocked,
}: OfficialFlagshipSiteProps) {
  const locale = brand.locale;
  const isZh = locale === "zh";

  // 1. Hero interactive rubric state
  const [heroTrackIdx, setHeroTrackIdx] = useState<number>(0);
  const [heroLineIdx, setHeroLineIdx] = useState<number>(1);
  const [taylorDegree, setTaylorDegree] = useState<number>(3);
  const [speakingHero, setSpeakingHero] = useState<boolean>(false);

  // 2. Subject gallery category filter
  const [subjectFilter, setSubjectFilter] = useState<
    "all" | "exam" | "clinical" | "org"
  >("all");

  // 3. Inline Socratic two-try checkpoint state
  const [socraticChoice, setSocraticChoice] = useState<number | null>(null);
  const [socraticAttempts, setSocraticAttempts] = useState<number>(0);
  const [socraticMinted, setSocraticMinted] = useState<string | null>(null);

  // 4. School A/B/C variant press state
  const [activeVariantPaper, setActiveVariantPaper] = useState<"A" | "B" | "C">(
    "A"
  );

  // 5. 8-Year $108B Horizon tab state
  const [horizonIdx, setHorizonIdx] = useState<number>(3);

  // 6. Asset-light <=¥10,000 ROI calculator state
  const [calcOrgs, setCalcOrgs] = useState<number>(2);
  const [calcStudents, setCalcStudents] = useState<number>(85);

  // 7. FAQ filter + search + validated inquiry form
  const [faqCategory, setFaqCategory] = useState<
    "all" | "student" | "school" | "permanent"
  >("all");
  const [faqQuery, setFaqQuery] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquirySchool, setInquirySchool] = useState<string>("");
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [inquirySentTo, setInquirySentTo] = useState<string | null>(null);

  // 8. Legal modal state
  const [legalOpen, setLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<LegalDocTab>("privacy");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const heroTrack = HERO_SAMPLES[heroTrackIdx] ?? HERO_SAMPLES[0];
  const heroLine =
    heroTrack.lines[heroLineIdx] ?? heroTrack.lines[0];

  const handleToggleHeroVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingHero) {
      window.speechSynthesis.cancel();
      setSpeakingHero(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(heroTrack.voiceNote[locale]);
    u.lang = heroTrack.voiceLang;
    u.rate = 1.02;
    u.onend = () => setSpeakingHero(false);
    u.onerror = () => setSpeakingHero(false);
    setSpeakingHero(true);
    window.speechSynthesis.speak(u);
  };

  // Taylor approximation visual geometry
  const taylorErrorMap: Record<number, { bound: string; curveD: string }> = {
    1: {
      bound: "2.42 × 10⁻²",
      curveD: "M 24 128 L 296 72",
    },
    2: {
      bound: "1.61 × 10⁻³",
      curveD: "M 24 128 Q 160 104 296 46",
    },
    3: {
      bound: "1.33 × 10⁻⁴",
      curveD: "M 24 128 Q 162 96 296 34",
    },
    4: {
      bound: "5.33 × 10⁻⁶",
      curveD: "M 24 128 Q 164 92 296 30",
    },
  };
  const currentTaylor = taylorErrorMap[taylorDegree] ?? taylorErrorMap[3];

  // Socratic live try handler
  const handleSocraticPick = (idx: number) => {
    setSocraticChoice(idx);
    const nextAttempts = socraticAttempts + 1;
    setSocraticAttempts(nextAttempts);
    if (idx === 1 && !socraticMinted) {
      const hash = "0x8f4d…29a1";
      setSocraticMinted(hash);
      onMintProof({
        hash,
        courseCode: "AP-CALC-BC",
        conceptTitle: "Lagrange Upper Bound Endpoint Choice",
        verifiedAt: "Just now",
        elapsedSeconds: 19,
        stabilityDays: 24,
      });
    }
  };

  // Subject cards curated with museum photography
  const subjectCards = [
    {
      id: "card-calc",
      category: "exam" as const,
      courseId: courses[0]?.id ?? "ap-calc",
      photo: "/images/editorial-library-desk.jpg",
      spanClass: "lg:col-span-7",
      aspectClass: "aspect-[16/10]",
      tag: isZh ? "理科压轴推导 · 142 道历年真题" : "STEM Derivation · 142 past FRQs",
      title: isZh
        ? "微积分、物理竞赛与东大理系数学"
        : "AP Calculus BC, Olympiad Physics & Tokyo STEM",
      metric: isZh ? "示例题目" : "Avg free response lift +27.4 pts",
      desc: isZh
        ? "逐行核查定理前提、定义域开闭区间与不等式放缩方向，拒绝只看最终数值。"
        : "Checks theorem premises, interval bounds, and inequality direction line by line.",
    },
    {
      id: "card-clinical",
      category: "clinical" as const,
      courseId: courses[0]?.id ?? "ap-calc",
      photo: "/images/editorial-clinical-notes.jpg",
      spanClass: "lg:col-span-5",
      aspectClass: "aspect-[16/10]",
      tag: isZh ? "执业医学病例 · 310 组鉴别诊断" : "Clinical Vignettes · 310 cases",
      title: isZh
        ? "USMLE 与临床病理血流动力学推导"
        : "USMLE Clinical Pathophysiology & Triage",
      metric: isZh ? "病例练习示例" : "68.5% drop in compensatory arrow traps",
      desc: isZh
        ? "从体征反推压力感受器、肾素系统与前后负荷变化链条，不再靠死记口诀硬猜。"
        : "Trace baroreceptor, RAAS, and preload mechanics from patient vitals without rote guessing.",
    },
    {
      id: "card-writing",
      category: "exam" as const,
      courseId: courses[1]?.id ?? courses[0]?.id ?? "ap-calc",
      photo: "/images/track-humanities-balance.jpg",
      spanClass: "lg:col-span-5",
      aspectClass: "aspect-[16/10]",
      tag: isZh ? "学术议论文 · 四维考官细则" : "Academic Writing · 4 rubric bands",
      title: isZh
        ? "雅思写作、法考主观题与严密论证改写"
        : "IELTS Task 2, Bar Essays & Scoped Argumentation",
      metric: isZh ? "写作练习示例" : "Median Band 6.0 to 7.5 in 4 weeks",
      desc: isZh
        ? "精准剔除全称绝对化病句与因果跳步，对照七分半范例逐句重写让步段。"
        : "Eliminates blanket generalizations and unsupported leaps with sentence level diffs.",
    },
    {
      id: "card-school",
      category: "org" as const,
      courseId: courses[2]?.id ?? courses[0]?.id ?? "ap-calc",
      photo: "/images/editorial-seminar-studio.jpg",
      spanClass: "lg:col-span-7",
      aspectClass: "aspect-[16/10]",
      tag: isZh ? "学校教研室与企业实训 · 私有讲义导入" : "Schools & Enterprise · Private syllabus",
      title: isZh
        ? "国际部晚自习督学、算法面试与企业岗位实训"
        : "1:150 School Supervision, Quant Interviews & SOP Onboarding",
      metric: isZh ? "督学工作台示例" : "Cuts nightly grading from 3.8 hrs to 22 min",
      desc: isZh
        ? "上传内部讲义即可在 30 秒内生成双人播客导学、三套防抄袭平行卷与红黄绿督学队列。"
        : "Turn private handouts into two host audio briefings, parallel A/B/C papers, and live triage.",
    },
  ];

  const visibleSubjects =
    subjectFilter === "all"
      ? subjectCards
      : subjectCards.filter((c) => c.category === subjectFilter);

  const activeHorizon = HORIZONS[horizonIdx] ?? HORIZONS[3];

  // Operator ROI math in local currency
  const sprintUnit =
    locale === "zh" ? 68 : locale === "ja" ? 2480 : locale === "es" ? 15 : 19;
  const orgUnit = brand.orgWhitelabelPrice;
  const grossReceipts = calcOrgs * orgUnit + calcStudents * sprintUnit;
  const tokenExpense = Math.round(
    (calcOrgs * 120 + calcStudents) * brand.monthlyTokenCostPerStudent
  );
  const netOperating = grossReceipts - tokenExpense;

  // Filtered FAQs
  const filteredFaqs = FAQ_ENTRIES.filter((item) => {
    if (faqCategory !== "all" && item.category !== faqCategory) return false;
    if (!faqQuery.trim()) return true;
    const qLower = faqQuery.trim().toLowerCase();
    return (
      item.q[locale].toLowerCase().includes(qLower) ||
      item.a[locale].toLowerCase().includes(qLower)
    );
  });

  // Validated inquiry submit (B9 + B10: inline validation, calm specific message, zero alert)
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = inquiryEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      setInquiryError(
        isZh
          ? "邮箱格式有误，请输入包含 @ 与域名的有效工作或个人邮箱。"
          : "Invalid email address. Enter a valid address such as name@school.edu."
      );
      setInquirySentTo(null);
      return;
    }
    if (inquirySchool.trim().length < 2) {
      setInquiryError(
        isZh
          ? "请填写您的目标考试科目或学校机构名称（至少 2 个字）。"
          : "Enter your exam track or institution name (at least 2 characters)."
      );
      setInquirySentTo(null);
      return;
    }
    setInquiryError(null);
    setInquirySentTo(cleanEmail);
    setInquiryEmail("");
    setInquirySchool("");
  };

  const openLegal = (tab: LegalDocTab) => {
    setLegalTab(tab);
    setLegalOpen(true);
  };

  // Tagline segments for B11 Word-by-Word Scroll Reveal
  const taglineSegments = isZh
    ? [
        "刷完一百节名师网课，",
        "考场上照样会在第三行卡住。",
        "搜题软件一秒钟把答案甩到眼前，",
        "合上屏幕大脑依然一片空白。",
        "真正把分数长在自己身上的办法很朴素，",
        "定位丢分的那一步，",
        "靠两次提示亲手推出来，",
        "隔三天闭卷再写一遍还能全对。",
      ]
    : [
        "Watching a hundred lecture videos ",
        "still leaves you frozen on line three of the exam. ",
        "Answer search apps hand over finished equations in a second, ",
        "yet vanish from memory the moment the booklet opens. ",
        "Lasting mastery comes from one disciplined habit: ",
        "pinpoint the exact step that lost credit, ",
        "derive the fix yourself within two hints, ",
        "and prove it closed book three days later.",
      ];

  return (
    <div className="bg-background text-foreground">
      <div className="bg-card px-4 py-3 text-center text-sm text-muted-foreground">产品原型演示：题目、评分与商业数据均为示例或假设；未接入真实支付、招聘或邮件服务。 <span lang="en">Prototype: examples and projections are illustrative.</span></div>
      {/* =====================================================================
          SECTION 1: FLAGSHIP HERO (B5: max-w-680px heading gradient, 1 Primary CTA,
          Specific Proof + Layered Interactive Rubric Surface)
         ===================================================================== */}
      <section className="mx-auto max-w-[1280px] px-4 pt-10 pb-20 sm:px-8 sm:pt-14 sm:pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Editorial Column (capped at 680px per B5) */}
          <div className="max-w-[680px] space-y-6 lg:col-span-6 lg:pt-4">
            <p className="caption-3 text-muted-foreground">
              {isZh
                ? "知微 DeepScholar · 主观题逐行精改与闭卷能力验证平台"
                : "DeepScholar · Step level rubric grading and closed book verification"}
            </p>

            <h1 className="heading-1 hero-heading-gradient">
              {locale === "zh" ? (
                <>
                  把丢分的那一步找出来，
                  <br />
                  练到闭卷也能一次写对。
                </>
              ) : locale === "ja" ? (
                <>
                  減点された一行を特定し、
                  <br />
                  白紙から解けるまで仕上げる。
                </>
              ) : locale === "es" ? (
                <>
                  Detecta el paso que pierde puntos
                  <br />
                  y domínalo sin apuntes.
                </>
              ) : (
                <>
                  Pinpoint the exact step losing marks,
                  <br />
                  and master it closed book.
                </>
              )}
            </h1>

            <p className="body-3 max-w-[58ch] text-muted-foreground">
              {isZh
                ? "面向高难度理科压轴题与执业大考打造。对照示例评分说明标出每一处前提漏写与放缩失误，用两次分步提示引导你自己推完卡壳步骤，并通过示例练习复习关键步骤。"
                : "Built for AP and Olympiad STEM, academic essays, clinical vignettes, and school cohorts. Inspect line level rubric deductions, derive the fix yourself within two guided hints, and explore an example practice workflow."}
            </p>

            {/* Single Primary CTA above the fold + calm text link (A4 + redesign-skill) */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="button"
                onClick={() => onOpenStudioTab("workbench", heroTrack.courseId)}
                className="btn-primary-flagship inline-flex items-center gap-2 rounded-lg px-5 py-3 button-md"
              >
                <span>
                  {isZh
                    ? "体验示例练习"
                    : locale === "ja"
                    ? "最初の記述問題を無料添削"
                    : "Try the example"}
                </span>
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>

              <button
                type="button"
                onClick={() => onOpenStudioTab("cohort")}
                className="inline-flex items-center gap-1.5 button-sm text-foreground transition-colors duration-300 motion-decel hover:text-brand"
              >
                <span>
                  {isZh ? "学校与机构白标演示" : "Explore school white label"}
                </span>
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </button>
            </div>

            {/* Risk Reversal Line (A4) */}
            <p className="caption-2 text-muted-foreground">
              {isZh
                ? "无需绑卡即可试做 · 30 天考前冲刺卡 ¥68 起（退款政策尚未确定）· 支持一键导出单文件离线永久运行"
                : "No card required to try · 30 day exam sprint from $19 pricing and refunds not yet available · Exports to standalone offline HTML"}
            </p>

            {/* Immediate Specific Proof Metrics Beside the Claim (B8: non-round realistic figures) */}
            <div className="grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <p className="heading-5 text-foreground tnum">示例</p>
                <p className="caption-2 mt-1 text-muted-foreground">
                  {isZh ? "逐步批改" : "4 week free response lift"}
                </p>
              </div>
              <div>
                <p className="heading-5 text-foreground tnum">1:150</p>
                <p className="caption-2 mt-1 text-muted-foreground">
                  {isZh ? "督学目标（假设）" : "To review a 150 student pod"}
                </p>
              </div>
              <div>
                <p className="heading-5 text-foreground tnum">8 年</p>
                <p className="caption-2 mt-1 text-muted-foreground">
                  {isZh ? "商业模型（假设）" : "Year 8 clearing gross margin"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Layered Proof Surface: Editorial Leica Photo + Overlapping Live Rubric Sheet */}
          <div id="live-grading-stage" className="lg:col-span-6">
            {/* Background Editorial Photo Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src={withBasePath("/images/editorial-library-desk.jpg")}
                alt={
                  isZh
                    ? "晨光书桌上的手写微积分推导笔记本与红笔批注"
                    : "Handwritten calculus derivation notebook with red ink margin review on an oak study desk"
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
            </div>

            {/* Overlapping Interactive Grading Sheet (Redesign-skill: negative margin depth + concentric radii rounded-2xl -> p-2 -> rounded-lg) */}
            <div className="relative z-10 mx-2 -mt-12 rounded-2xl border border-border bg-background p-4 surface-elevated sm:mx-5 sm:-mt-16 sm:p-6">
              {/* Track Switcher + Score Delta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                <div className="inline-flex flex-wrap gap-1 rounded-xl bg-card p-1">
                  {HERO_SAMPLES.map((item, idx) => {
                    const active = idx === heroTrackIdx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setHeroTrackIdx(idx);
                          setHeroLineIdx(0);
                        }}
                        className={`rounded-lg px-2.5 py-1 caption-3 transition-colors duration-300 motion-decel ${
                          active
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.tabLabel[locale]}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 font-mono caption-3 tnum">
                  <span className="text-deduct">{heroTrack.scoreBefore}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-signal">{heroTrack.scoreAfter}</span>
                </div>
              </div>

              {/* Exam Title + Voice Critique Button */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="title-4 text-foreground">
                  {heroTrack.examTitle[locale]}
                </p>
                <button
                  type="button"
                  onClick={handleToggleHeroVoice}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 caption-3 text-foreground transition-colors duration-300 hover:bg-secondary"
                >
                  {speakingHero ? (
                    <Stop className="h-3.5 w-3.5 text-deduct" weight="fill" />
                  ) : (
                    <SpeakerHigh className="h-3.5 w-3.5 text-brand" weight="bold" />
                  )}
                  <span>
                    {speakingHero
                      ? isZh
                        ? "停止语音讲评"
                        : "Stop audio"
                      : isZh
                      ? "听示例讲评"
                      : "Play reader note"}
                  </span>
                </button>
              </div>

              {/* Clickable Script Lines */}
              <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                {heroTrack.lines.map((ln, idx) => {
                  const selected = idx === heroLineIdx;
                  return (
                    <button
                      key={ln.lineNo}
                      type="button"
                      onClick={() => setHeroLineIdx(idx)}
                      className={`flex w-full items-start justify-between gap-3 p-3 text-left transition-colors duration-300 motion-decel first:rounded-t-xl last:rounded-b-xl ${
                        selected ? "bg-deduct-soft" : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="font-mono caption-3 text-muted-foreground tnum mt-0.5">
                          {ln.lineNo}
                        </span>
                        <span className="font-mono caption-2 text-foreground break-words">
                          {ln.draft}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-md bg-background px-2 py-0.5 caption-3 text-deduct border border-border">
                        {ln.tag[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Line Diagnostic + Full Credit Rewrite */}
              <div className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2">
                  <WarningCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-deduct"
                    weight="fill"
                  />
                  <p className="body-6 text-muted-foreground">
                    {heroLine.reason[locale]}
                  </p>
                </div>
                <div className="rounded-lg diff-added p-3">
                  <p className="caption-3 mb-1">
                    {isZh ? "满分标准改写示范" : "Full credit rewrite"}
                  </p>
                  <p className="body-5">{heroLine.rewrite[locale]}</p>
                </div>
              </div>

              {/* Interactive Polynomial Remainder Slider (for STEM track) */}
              {heroTrack.id === "calc" && (
                <div className="mt-4 rounded-xl border border-border bg-card p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="caption-3 text-foreground">
                      {isZh
                        ? `拉格朗日余项阶数实验 · 当前 n = ${taylorDegree}`
                        : `Taylor degree explorer · n = ${taylorDegree}`}
                    </span>
                    <span className="font-mono caption-3 text-signal tnum">
                      |R_{taylorDegree}(0.2)| &lt; {currentTaylor.bound}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 320 144"
                    className="mt-2 h-24 w-full rounded-lg bg-background border border-border"
                    role="img"
                    aria-label="Taylor approximation curve convergence"
                  >
                    <line
                      x1="24"
                      y1="128"
                      x2="300"
                      y2="128"
                      stroke="currentColor"
                      strokeOpacity="0.14"
                    />
                    {/* Exact e^x target curve */}
                    <path
                      d="M 24 128 Q 165 90 296 28"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.28"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {/* Polynomial P_n(x) curve */}
                    <path
                      d={currentTaylor.curveD}
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="2.5"
                    />
                    <circle cx="296" cy="28" r="3.5" fill="var(--signal)" />
                  </svg>
                  <div className="mt-2.5 flex items-center gap-2">
                    {[1, 2, 3, 4].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setTaylorDegree(deg)}
                        className={`flex-1 rounded-md py-1 caption-3 tnum transition-colors duration-300 ${
                          taylorDegree === deg
                            ? "bg-foreground text-background"
                            : "bg-background text-muted-foreground border border-border hover:text-foreground"
                        }`}
                      >
                        P{deg}(x)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Handoff to Full Studio */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenStudioTab("overview", heroTrack.courseId)}
                  className="caption-1 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {isZh ? "粘贴我自己的作答草稿 →" : "Paste my own answer script →"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenStudioTab("workbench", heroTrack.courseId)
                  }
                  className="inline-flex items-center gap-1 caption-1 font-semibold text-brand hover:underline"
                >
                  <span>
                    {isZh
                      ? "进入一对一推导室练同源变式"
                      : "Practice variant in 1 on 1 studio"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: OPEN RESEARCH & REGIONAL DEPLOYMENT CREDENTIAL BAR
         ===================================================================== */}
      <div className="border-y border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <p className="caption-2 text-muted-foreground">
            {isZh
              ? "技术架构融合宽松开源成果并支持私有化白标发行"
              : "Built on permissive open research foundations ready for private OEM"}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 caption-3 text-foreground tnum">
            <span>HKUDS DeepTutor · Apache 2.0</span>
            <span>THU OpenMAIC · MIT</span>
            <span>open notebook · MIT</span>
            <span>FSRS v5 记忆排期算法</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: AIRBNB-GRADE ASYMMETRIC SUBJECT & CREDENTIAL GALLERY (#subjects)
         ===================================================================== */}
      <RevealSection
        id="subjects"
        className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-24"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-[640px] space-y-3">
            <p className="caption-3 text-muted-foreground">
              {isZh ? "实测题库与行业专卷" : "Verified tracks and exam packs"}
            </p>
            <h2 className="heading-3 text-foreground">
              {isZh
                ? "挑一门你正在啃的硬课，当场试做一道历年压轴题。"
                : "Pick your active exam or clinical track and test a real past prompt."}
            </h2>
          </div>

          <div className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5">
            {(
              [
                { id: "all", label: isZh ? "全部专栏" : "All tracks" },
                { id: "exam", label: isZh ? "升学与语言大考" : "University & IELTS" },
                { id: "clinical", label: isZh ? "执业医学推理" : "Clinical licensing" },
                { id: "org", label: isZh ? "学校督学与内训" : "Schools & enterprise" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubjectFilter(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 button-sm transition-colors duration-300 motion-decel ${
                  subjectFilter === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric 12-Col Photo Grid (7+5 then 5+7 — zero generic 3-equal-column AI boxes) */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {visibleSubjects.map((card) => (
            <article
              key={card.id}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-2 transition-colors duration-300 motion-decel hover:border-foreground/30 ${card.spanClass}`}
            >
              <div>
                <div
                  className={`relative w-full overflow-hidden rounded-xl bg-secondary ${card.aspectClass}`}
                >
                  <Image
                    src={withBasePath(card.photo)}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 680px"
                    className="object-cover transition-transform duration-500 motion-decel group-hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2 px-4 pt-5 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="caption-3 text-muted-foreground">
                      {card.tag}
                    </span>
                    <span className="caption-3 text-signal tnum">
                      {card.metric}
                    </span>
                  </div>
                  <h3 className="heading-5 text-foreground">{card.title}</h3>
                  <p className="body-6 text-muted-foreground">{card.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3.5">
                <button
                  type="button"
                  onClick={() =>
                    onOpenStudioTab(
                      card.category === "org" ? "cohort" : "workbench",
                      card.courseId
                    )
                  }
                  className="inline-flex items-center gap-1.5 button-sm text-foreground transition-colors duration-300 group-hover:text-brand"
                >
                  <span>
                    {card.category === "org"
                      ? isZh
                        ? "打开督学与平行组卷台"
                        : "Open school triage console"
                      : isZh
                      ? "进入该科一对一推导室"
                      : "Start live derivation"}
                  </span>
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenStudioTab("seminar", card.courseId)}
                  className="caption-1 text-muted-foreground hover:text-foreground"
                >
                  {isZh ? "试听双人音频拆解" : "Audio seminar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      {/* =====================================================================
          SECTION 4: MANDATORY TAGLINE REVEAL SECTION (B11 Word-by-Word Scroll)
         ===================================================================== */}
      <WordByWordTagline
        eyebrow={
          isZh
            ? "为什么刷课与搜题救不了考场发挥"
            : "Why passive video and answer search fail on exam day"
        }
        segments={taglineSegments}
      />

      {/* =====================================================================
          SECTION 5: ASYMMETRIC ZIG-ZAG CAPABILITIES (#capabilities & #schools)
         ===================================================================== */}
      <RevealSection
        id="capabilities"
        className="mx-auto max-w-[1280px] space-y-24 px-4 py-20 sm:px-8 sm:py-24"
      >
        {/* Row A (7 / 5 Split): Two-Try Socratic Derivation + Live Interactive Widget */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <span className="title-4 text-foreground">
                {isZh
                  ? "现场体验 · 两次提示不直接给答案的苏格拉底追问"
                  : "Interactive demo · Two hint Socratic verification"}
              </span>
              <span className="font-mono caption-3 text-muted-foreground tnum">
                {isZh ? `已尝试 ${socraticAttempts} 次` : `Attempts: ${socraticAttempts}`}
              </span>
            </div>

            <p className="body-2 mt-5 text-foreground">
              {isZh
                ? "小测：证明 e^x 在区间 [0, 0.2] 上的三阶拉格朗日余项上界时，未知点 c 应当如何处理才能拿满步骤分？"
                : "Checkpoint: When bounding |R₃(0.2)| for e^x on [0, 0.2], how must you handle the unknown point c ∈ (0, 0.2)?"}
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                {
                  idx: 0,
                  label: isZh
                    ? "A. 直接令 c = 0 代入 e^0 = 1，算出 6.67 × 10⁻⁵"
                    : "A. Set c = 0 so e^0 = 1, giving 6.67 × 10⁻⁵",
                },
                {
                  idx: 1,
                  label: isZh
                    ? "B. 利用 e^x 单调递增与 c < 0.2，放大为 e^c < e^{0.2} < 2"
                    : "B. Use monotonicity on (0, 0.2) to bound e^c < e^{0.2} < 2",
                },
                {
                  idx: 2,
                  label: isZh
                    ? "C. 取区间中点 c = 0.1 作为近似代表值代入"
                    : "C. Plug in the midpoint c = 0.1 as an average estimate",
                },
              ].map((opt) => {
                const picked = socraticChoice === opt.idx;
                const isCorrect = opt.idx === 1;
                return (
                  <button
                    key={opt.idx}
                    type="button"
                    onClick={() => handleSocraticPick(opt.idx)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left body-5 transition-colors duration-300 motion-decel ${
                      picked && isCorrect
                        ? "diff-added"
                        : picked && !isCorrect
                        ? "diff-deleted"
                        : "border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {picked && isCorrect && (
                      <CheckCircle className="h-5 w-5 shrink-0" weight="fill" />
                    )}
                  </button>
                );
              })}
            </div>

            {socraticChoice !== null && (
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                {socraticChoice === 1 ? (
                  <div className="space-y-1.5">
                    <p className="body-4 text-signal">
                      {isZh
                        ? "推导严谨，完成示例练习"
                        : "Verified full credit · Example completed"}
                    </p>
                    <p className="body-6 text-muted-foreground">
                      {isZh
                        ? `这是示例练习，结果仅保存在当前页面，不会自动推送复习。`
                        : `This example is kept only in the current page. No review notification is scheduled.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="body-4 text-deduct">
                      {isZh
                        ? "第 1 步苏格拉底提示（暂不直接公布答案）"
                        : "Hint 1 of 2 · Answer withheld so you derive it"}
                    </p>
                    <p className="body-6 text-muted-foreground">
                      {isZh
                        ? "想想看：题目要求证明误差【不超过】某个数，也就是求余项在 (0, 0.2) 上的最大值。指数函数 e^x 往哪一端走值才更大？再选一次试试。"
                        : "Ask yourself: an error bound requires the maximum possible value of e^c across (0, 0.2). Which end of the interval makes an increasing function larger? Try again."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-5 lg:col-span-5">
            <p className="caption-3 text-muted-foreground">
              {isZh ? "个人备考核心机制" : "Individual mastery engine"}
            </p>
            <h3 className="heading-4 text-foreground">
              {isZh
                ? "卡壳时给台阶，绝不替你写完最后一步。"
                : "Scaffolds the exact leap you missed without spoiling the proof."}
            </h3>
            <p className="body-3 text-muted-foreground">
              {isZh
                ? "工作台展示错题记录与复习排期的设计。先选择答案，查看提示，再尝试自己写出推导。"
                : "The workspace illustrates error notes and review scheduling. Try the example, read the hint, and work through the proof yourself."}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenStudioTab("workbench")}
                className="btn-ink-flagship inline-flex items-center gap-2 rounded-lg px-4 py-2.5 button-sm"
              >
                <span>
                  {isZh ? "进入完整一对一推导室" : "Open full 1 on 1 studio"}
                </span>
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Row B (5 / 7 Reversed Split): 1:150 School Supervision + White-Label OS (#schools) */}
        <div
          id="schools"
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center"
        >
          <div className="order-2 space-y-5 lg:order-1 lg:col-span-5">
            <p className="caption-3 text-muted-foreground">
              {isZh ? "学校教研室与机构白标系统" : "Institutional OEM & 1:150 copilot"}
            </p>
            <h3 className="heading-4 text-foreground">
              {isZh
                ? "一位主讲老师带稳 150 名学生，还能挂上你们学校自己的品牌域名。"
                : "One lead teacher supervises 150 students under your school's own domain."}
            </h3>
            <p className="body-3 text-muted-foreground">
              {isZh
                ? "把繁琐的基础步骤批改交给系统自动辅导，教师端只弹出连续两次仍未推通的红灯名单。课后一键印制考点相同但数值条件互异的 A/B/C 三套防抄袭周测卷，支持完全隐藏知微标志对外商业交付。"
                : "Routine slips clear automatically via two step coaching while the teacher dashboard highlights only red flagged students stuck twice. Generate parallel A/B/C exam papers in one click under your own brand."}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenStudioTab("cohort")}
                className="btn-primary-flagship inline-flex items-center gap-2 rounded-lg px-4 py-2.5 button-sm"
              >
                <span>
                  {isZh ? "体验 1:150 督学与白标后台" : "Try 1:150 school console"}
                </span>
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => onOpenCashier("b_end")}
                className="button-sm text-foreground hover:text-brand"
              >
                {isZh ? "查看机构白标授权报价 →" : "View OEM licensing →"}
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                <Image
                  src={withBasePath("/images/editorial-seminar-studio.jpg")}
                  alt={
                    isZh
                      ? "两位教研学者在木质长桌前审阅教学讲义与学生答卷"
                      : "Two educators reviewing printed academic manuscripts at a sunlit ash wood table"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="object-cover"
                />
              </div>

              {/* Live Parallel Paper A/B/C Switcher Bar inside the card */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="title-4 text-foreground">
                    {isZh
                      ? "防抄袭平行组卷印厂预览 · 同考点异构参数"
                      : "Parallel exam press preview · Anti copy isomorphic variants"}
                  </span>
                  <div className="inline-flex gap-1 rounded-lg bg-background p-1 border border-border">
                    {(["A", "B", "C"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setActiveVariantPaper(v)}
                        className={`rounded-md px-2.5 py-0.5 caption-3 tnum ${
                          activeVariantPaper === v
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isZh ? `${v} 卷` : `Form ${v}`}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-3 font-mono caption-2 text-foreground">
                  {activeVariantPaper === "A" &&
                    (isZh
                      ? "A 卷第 4 题：求 f(x) = e^x 在 x = 0.2 处三阶展开余项上界，要求误差小于 1.5 × 10⁻⁴。"
                      : "Form A Q4: Bound |R₃(0.2)| for f(x) = e^x below 1.5 × 10⁻⁴ on [0, 0.2].")}
                  {activeVariantPaper === "B" &&
                    (isZh
                      ? "B 卷第 4 题：求 g(x) = cos(x) 在 x = 0.3 处四阶展开截断误差上界，说明奇阶导数消去原因。"
                      : "Form B Q4: Bound |R₄(0.3)| for g(x) = cos(x) and justify vanishing odd derivative terms.")}
                  {activeVariantPaper === "C" &&
                    (isZh
                      ? "C 卷第 4 题：求 h(x) = ln(1 + x) 在 x = 0.25 处三阶交错级数首项截断误差并与拉格朗日法对比。"
                      : "Form C Q4: Compare alternating series truncation vs Lagrange bound for ln(1 + x) at x = 0.25.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* =====================================================================
          SECTION 6: THE 8-YEAR $108B HECTOCORN ARCHITECTURE (#architecture)
          (Stepped Neutral Surface — Never jarring, pure Stripe financial clarity)
         ===================================================================== */}
      <RevealSection
        id="architecture"
        className="border-y border-border bg-card py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="max-w-[680px] space-y-3 lg:col-span-7">
              <p className="caption-3 text-muted-foreground">
                {isZh
                  ? "八年商业模型（假设，非业绩预测）"
                  : "Illustrative eight year business model, not a forecast"}
              </p>
              <h2 className="heading-3 text-foreground">
                {isZh
                  ? "为什么所有卖网课与搜题的公司都卡在百亿以下，而闭卷验证网络能长成千亿美元巨头？"
                  : "Why video courses stall below $15B while verified reasoning compounds past $100B."}
              </h2>
            </div>

            <div className="lg:col-span-5 lg:text-right">
              <button
                type="button"
                onClick={() => onOpenStudioTab("talent")}
                className="btn-ink-flagship inline-flex items-center gap-2 rounded-lg px-4 py-2.5 button-sm"
              >
                <span>
                  {isZh
                    ? "打开实测人才库与完整八年沙盘"
                    : "Inspect verified talent & full ledger"}
                </span>
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </button>
            </div>
          </div>

          {/* Architectural Photography Banner + 3 Compounding Layers */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-2xl border border-border bg-background p-2 lg:col-span-5">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                <Image
                  src={withBasePath("/images/editorial-global-clearing.jpg")}
                  alt={
                    isZh
                      ? "阳光穿透石灰岩与原木结构的现代学术研究院中庭"
                      : "Modernist limestone and warm timber research institute atrium in late afternoon sunlight"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <h3 className="title-2 text-foreground">
                  {isZh
                    ? "三级火箭接力：把一次性备考变成终身能力与算力清算网"
                    : "Three compounding layers beyond one time exam prep"}
                </h3>
                <div className="space-y-3 border-t border-border pt-3 body-6 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">
                      {isZh ? "第一层（获客回本）：" : "Layer 1 · Self funding intake: "}
                    </strong>
                    {isZh
                      ? "¥68 考前冲刺卡零广告费聚拢全球顶尖理工与医法考生，同步采集高价值错步纠正轨迹。"
                      : "$19 exam sprints acquire top STEM, medical, and legal minds at negative net CAC."}
                  </p>
                  <p>
                    <strong className="text-foreground">
                      {isZh ? "第二层（机构复利）：" : "Layer 2 · Institutional OS: "}
                    </strong>
                    {isZh
                      ? "学校与培训机构采购 ¥39,800 白标系统与 1:150 督学席位，净金额留存率达 148%。"
                      : "Schools and academies standardize on white label 1:150 pods with 148% net retention."}
                  </p>
                  <p>
                    <strong className="text-foreground">
                      {isZh ? "第三层（千亿清算）：" : "Layer 3 · Global clearinghouse: "}
                    </strong>
                    {isZh
                      ? "向企业直接输送免简历闭卷验证人才（每席收取 $25,000），并向大模型实验室清算多步推理评测数据（抽成 30%）。"
                      : "Places verified specialists directly into enterprises ($25,000 per hire) and clears frontier AI post training audits (30% take rate)."}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 4-Horizon Financial Ledger */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 sm:p-7 lg:col-span-7">
              <div>
                {/* Horizon Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {HORIZONS.map((h, idx) => {
                    const active = idx === horizonIdx;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHorizonIdx(idx)}
                        className={`rounded-xl border p-3 text-left transition-colors duration-300 motion-decel ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground hover:bg-secondary"
                        }`}
                      >
                        <p
                          className={`caption-4 ${
                            active ? "text-background/75" : "text-muted-foreground"
                          }`}
                        >
                          {h.years[locale]}
                        </p>
                        <p className="title-3 mt-0.5 font-semibold tnum">
                          {h.arr} ARR
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Horizon KPI Strip */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-4">
                  <div>
                    <p className="caption-4 text-muted-foreground">
                      {isZh ? "年化经常性收入" : "Annual recurring rev"}
                    </p>
                    <p className="heading-5 mt-1 text-foreground tnum">
                      {activeHorizon.arr}
                    </p>
                  </div>
                  <div>
                    <p className="caption-4 text-muted-foreground">
                      {isZh ? "对应估值规模" : "Implied valuation"}
                    </p>
                    <p className="heading-5 mt-1 text-brand tnum">
                      {activeHorizon.valuation}
                    </p>
                  </div>
                  <div>
                    <p className="caption-4 text-muted-foreground">
                      {isZh ? "综合毛利率" : "Blended gross margin"}
                    </p>
                    <p className="heading-5 mt-1 text-signal tnum">
                      {activeHorizon.grossMargin}
                    </p>
                  </div>
                  <div>
                    <p className="caption-4 text-muted-foreground">
                      {isZh ? "机构净留存率" : "Net dollar retention"}
                    </p>
                    <p className="heading-5 mt-1 text-foreground tnum">
                      {activeHorizon.ndr}
                    </p>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="mt-5 space-y-2">
                  <h3 className="title-2 text-foreground">
                    {activeHorizon.years[locale]} ·{" "}
                    {activeHorizon.phaseTitle[locale]}
                  </h3>
                  <p className="body-6 text-muted-foreground">
                    {activeHorizon.summary[locale]}
                  </p>
                </div>

                {/* Revenue Stream Breakdown Bars */}
                <div className="mt-6 space-y-3.5">
                  {activeHorizon.streams.map((st) => (
                    <div key={st.name.en} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4 body-5">
                        <span className="text-foreground">
                          {st.name[locale]}
                        </span>
                        <span className="font-mono text-foreground tnum">
                          {st.amount} ({st.sharePct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full bg-brand ${
                            SHARE_WIDTH_CLASS[st.sharePct] ?? "w-1/2"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="caption-2 mt-6 border-t border-border pt-4 text-muted-foreground">
                {isZh
                  ? "注：第 8 年按全球企业软件与清算网络 15.8 倍远期收入倍数测算（$6.80B × 15.88 ≈ $108B），核心壁垒来自示例闭卷推导存证记录。"
                  : "Note: Year 8 valuation reflects a 15.88x revenue multiple on $6.80B ARR at 91.3% gross margin powered by proprietary closed book verification graphs."}
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* =====================================================================
          SECTION 8: BASELINE-ALIGNED PRICING + <=¥10,000 OPERATOR CALCULATOR (#pricing)
         ===================================================================== */}
      <RevealSection
        id="pricing"
        className="border-t border-border bg-card py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="max-w-[660px] space-y-3">
            <p className="caption-3 text-muted-foreground">
              {isZh
                ? "透明方案与轻资产白标测算"
                : "Transparent plans and asset light OEM economics"}
            </p>
            <h2 className="heading-3 text-foreground">
              {isZh
                ? "考生一杯咖啡钱就能起步提分，学校方案可用于测算。"
                : "Start exam prep for the price of a workbook, or launch your own school portal in one afternoon."}
            </h2>
          </div>

          {/* 3 Equal-Baseline Columns, Pinned Bottom CTAs, Recommended Tier Marked by Border & Ink Weight */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Tier 1: 30-Day Exam Sprint */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 sm:p-7">
              <div>
                <div className="min-h-[124px] border-b border-border pb-5">
                  <p className="title-3 text-foreground">
                    {isZh ? "30 天考前冲刺卡" : "30 day exam sprint"}
                  </p>
                  <p className="heading-3 mt-3 text-foreground tnum">
                    {brand.currencySymbol}
                    {sprintUnit.toLocaleString()}
                    <span className="body-6 font-normal text-muted-foreground">
                      {" "}
                      / {isZh ? "30 天不自动续费" : "30 days"}
                    </span>
                  </p>
                  <p className="caption-2 mt-2 text-muted-foreground">
                    {isZh
                      ? "适合期末、大考与语言考试前四周突击提分"
                      : "Ideal for final 4 weeks before AP, IELTS, or finals"}
                  </p>
                </div>

                <ul className="mt-5 space-y-3 body-6 text-foreground">
                  {[
                    isZh
                      ? "任选单门科目全量真题逐行批改"
                      : "Unlimited line level grading for one active track",
                    isZh
                      ? "两次苏格拉底提示追问与满分改写对照"
                      : "Two try Socratic hints plus full credit rewrites",
                    isZh
                      ? "FSRS 错题遗忘曲线排期与双人音频串讲"
                      : "FSRS spaced review queue and two host audio notes",
                    isZh
                      ? "支持导出单文件离线笔记永久保存"
                      : "Export standalone offline HTML study notebook",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-signal"
                        weight="bold"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenCashier("c_end")}
                className="mt-8 w-full rounded-lg border border-border bg-card px-4 py-2.5 button-sm text-foreground transition-colors duration-300 motion-decel hover:bg-secondary active:scale-[0.98]"
              >
                {isZh ? "开通 30 天冲刺卡" : "Start 30 day sprint"}
              </button>
            </div>

            {/* Tier 2: Full-Subject Annual + Verified Talent Ledger (Recommended via crisp brand border) */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-brand bg-background p-6 sm:p-7">
              <div>
                <div className="min-h-[124px] border-b border-border pb-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="title-3 font-semibold text-foreground">
                      {isZh ? "全科年度精修通行证" : "All tracks annual pass"}
                    </p>
                    <span className="rounded-md bg-brand-soft px-2 py-0.5 caption-3 text-brand">
                      {isZh ? "方案示意" : "Illustrative"}
                    </span>
                  </div>
                  <p className="heading-3 mt-3 text-foreground tnum">
                    {brand.currencySymbol}
                    {brand.studentAnnualPrice.toLocaleString()}
                    <span className="body-6 font-normal text-muted-foreground">
                      {" "}
                      / {isZh ? "整年全科畅学" : "year"}
                    </span>
                  </p>
                  <p className="caption-2 mt-2 text-muted-foreground">
                    {isZh
                      ? "覆盖全部学科题库并开启企业免简历内推认证"
                      : "Every STEM, writing, clinical & quant pack plus hiring proof"}
                  </p>
                </div>

                <ul className="mt-5 space-y-3 body-6 text-foreground">
                  {[
                    isZh
                      ? "解锁全部学科专栏与导入个人私密讲义"
                      : "All exam tracks plus custom PDF and note ingestion",
                    isZh
                      ? "签发加密闭卷能力存证，可自主开启名企内推"
                      : "Cryptographic closed book proofs eligible for direct hiring",
                    isZh
                      ? "达标后可申请大模型高薪推理审校兼职任务"
                      : "Eligibility for paid frontier AI reasoning audit tasks",
                    isZh
                      ? "支付和退款服务尚未接入"
                      : "Payment and refunds are not yet connected",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-brand"
                        weight="bold"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenCashier("c_end")}
                className="btn-primary-flagship mt-8 w-full rounded-lg px-4 py-2.5 button-sm"
              >
                {isProUnlocked
                  ? isZh
                    ? "已激活通行证 · 查看权益"
                    : "Pass active · Manage"
                  : isZh
                  ? "开通全科年度通行证"
                  : "Get annual all access pass"}
              </button>
            </div>

            {/* Tier 3: Institutional White-Label OS */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 sm:p-7">
              <div>
                <div className="min-h-[124px] border-b border-border pb-5">
                  <p className="title-3 text-foreground">
                    {isZh ? "学校与机构 OEM 白标版" : "Institution white label OS"}
                  </p>
                  <p className="heading-3 mt-3 text-foreground tnum">
                    {brand.currencySymbol}
                    {brand.orgWhitelabelPrice.toLocaleString()}
                    <span className="body-6 font-normal text-muted-foreground">
                      {" "}
                      / {isZh ? "校年授权" : "year"}
                    </span>
                  </p>
                  <p className="caption-2 mt-2 text-muted-foreground">
                    {isZh
                      ? "自有品牌域名、1:150 督学台与离线序列号签发器"
                      : "Custom domain, 1:150 teacher queue, and license generator"}
                  </p>
                </div>

                <ul className="mt-5 space-y-3 body-6 text-foreground">
                  {[
                    isZh
                      ? "100% 替换为贵校品牌标志、配色与自有域名"
                      : "Full custom school logo, palette, and custom domain",
                    isZh
                      ? "1:150 晚自习红黄绿督学队列与家长周报导出"
                      : "1:150 student triage queue and parent progress briefs",
                    isZh
                      ? "一键印制防抄袭 A/B/C 平行测试卷与评分细则"
                      : "One click parallel A/B/C exam paper generator",
                    isZh
                      ? "支持自有模型密钥接入与离线序列号批量制卡"
                      : "Bring your own API key plus offline student key minting",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-signal"
                        weight="bold"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenCashier("b_end")}
                className="btn-ink-flagship mt-8 w-full rounded-lg px-4 py-2.5 button-sm"
              >
                {isZh ? "获取机构白标授权或验真激活码" : "License white label OS"}
              </button>
            </div>
          </div>

          {/* Asset-Light <=¥10,000 Startup & 2h/Day ROI Calculator */}
          <div className="mt-8 rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-5">
                <p className="caption-3 text-muted-foreground">
                  {isZh
                    ? "独立名师与轻资产主理人回本测算（启动预算 ≤ ¥10,000）"
                    : "Solo operator & studio unit economics calculator"}
                </p>
                <h3 className="heading-5 text-foreground">
                  {isZh
                    ? "算算看：每天投入约 2 小时，签几家合作校能净赚多少？"
                    : "Model your cashflow under 2 hours of daily supervision."}
                </h3>
                <p className="body-6 text-muted-foreground">
                  {isZh
                    ? "无需自建机房，静态部署零固定月租。直接拖动右侧合作机构数与冲刺卡销量查看扣除模型调用费后的净结余。"
                    : "Zero fixed server rent on static CDN hosting. Adjust partner schools and sprint passes to inspect net operating surplus after API tokens."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-4">
                <label className="space-y-2">
                  <div className="flex justify-between caption-1 text-foreground tnum">
                    <span>{isZh ? "签约白标学校/工作室" : "Partner schools"}</span>
                    <span>{calcOrgs}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={calcOrgs}
                    onChange={(e) => setCalcOrgs(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                </label>

                <label className="space-y-2">
                  <div className="flex justify-between caption-1 text-foreground tnum">
                    <span>{isZh ? "零售冲刺卡张数" : "Sprint passes sold"}</span>
                    <span>{calcStudents}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={calcStudents}
                    onChange={(e) => setCalcStudents(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                </label>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 lg:col-span-3">
                <p className="caption-4 text-muted-foreground">
                  {isZh ? "示意收入减推理费（未计其他成本）" : "Illustrative revenue less API cost"}
                </p>
                <p className="heading-4 mt-1 text-signal tnum">
                  {brand.currencySymbol}
                  {netOperating.toLocaleString()}
                </p>
                <p className="caption-4 mt-1 text-muted-foreground tnum">
                  {isZh
                    ? `总收款 ${brand.currencySymbol}${grossReceipts.toLocaleString()} · 模型费约 ${brand.currencySymbol}${tokenExpense.toLocaleString()}`
                    : `Gross ${brand.currencySymbol}${grossReceipts.toLocaleString()} · API ${brand.currencySymbol}${tokenExpense.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* =====================================================================
          SECTION 9: SIDE-BY-SIDE SEARCHABLE FAQ LEDGER + VALIDATED INQUIRY FORM
          (Redesign-skill: side-by-side list + searchable help instead of chevron stack)
         ===================================================================== */}
      <RevealSection
        id="faq"
        className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-24"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left 4 Columns: Search + Category Filter + Validated Inquiry Box */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            <div className="space-y-2">
              <p className="caption-3 text-muted-foreground">
                {isZh ? "常见疑问与部署咨询" : "Questions and deployment help"}
              </p>
              <h2 className="heading-4 text-foreground">
                {isZh ? "把账算清，把顾虑摊开讲明。" : "Plain answers before you commit."}
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlass
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                weight="bold"
              />
              <input
                type="search"
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder={
                  isZh ? "搜索退费、白标、离线或协议…" : "Search refunds, OEM, offline…"
                }
                aria-label={isZh ? "搜索常见问题" : "Search FAQ"}
                className="w-full rounded-xl border border-input bg-card py-2.5 pr-4 pl-10 body-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", label: isZh ? "全部（8）" : "All (8)" },
                  { id: "student", label: isZh ? "考生提分" : "Students" },
                  { id: "school", label: isZh ? "学校白标" : "Schools" },
                  {
                    id: "permanent",
                    label: isZh ? "永久离线与合规" : "Offline & legal",
                  },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFaqCategory(cat.id)}
                  className={`rounded-lg px-3 py-1.5 caption-3 transition-colors duration-300 ${
                    faqCategory === cat.id
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Client-Side Validated School/Advisor Inquiry Form (B9 + B10) */}
            <form
              onSubmit={handleInquirySubmit}
              noValidate
              className="space-y-3 rounded-2xl border border-border bg-card p-5"
            >
              <p className="title-4 text-foreground">
                {isZh
                  ? "索取学校白标试用包或考纲定制方案"
                  : "Request an institutional OEM sandbox"}
              </p>
              <div>
                <label htmlFor="inquiry-email" className="sr-only">
                  Email
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder={
                    isZh ? "您的工作或个人邮箱" : "you@institution.edu"
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 body-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>
              <div>
                <label htmlFor="inquiry-school" className="sr-only">
                  Institution or exam track
                </label>
                <input
                  id="inquiry-school"
                  type="text"
                  required
                  value={inquirySchool}
                  onChange={(e) => setInquirySchool(e.target.value)}
                  placeholder={
                    isZh
                      ? "学校名称或目标考试（如上海某国际部 / 雅思）"
                      : "School name or target exam track"
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 body-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>

              {inquiryError && (
                <p role="alert" className="caption-2 text-deduct">
                  {inquiryError}
                </p>
              )}

              {inquirySentTo && (
                <p role="status" className="caption-2 text-signal">
                  {isZh
                    ? `演示表单已完成本地校验；尚未连接发送服务，不会向 ${inquirySentTo} 发送邮件。`
                    : `Validated locally. No email was sent to ${inquirySentTo}; delivery is not connected.`}
                </p>
              )}

              <button
                type="submit"
                className="btn-ink-flagship w-full rounded-lg px-4 py-2 button-sm"
              >
                {isZh ? "获取白标演示与测试序列号" : "Send sandbox kit"}
              </button>
            </form>
          </div>

          {/* Right 8 Columns: Side-by-Side Editorial Q&A Ledger (With Empty Search State per B9) */}
          <div className="lg:col-span-8">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <p className="title-3 text-foreground">
                  {isZh
                    ? "没有找到匹配的问答条目"
                    : "No matching questions found"}
                </p>
                <p className="body-6 mt-2 text-muted-foreground">
                  {isZh
                    ? "您可以清空搜索词查看全部 8 条说明，或在左侧填写邮箱获取一对一解答。"
                    : "Clear the search filter to browse all 8 answers, or send your question via the form on the left."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqQuery("");
                    setFaqCategory("all");
                  }}
                  className="mt-4 rounded-lg border border-border bg-background px-4 py-2 button-sm text-foreground"
                >
                  {isZh ? "重置筛选条件" : "Reset filters"}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
                {filteredFaqs.map((item) => (
                  <div key={item.id} className="py-6">
                    <h3 className="title-2 text-foreground">
                      {item.q[locale]}
                    </h3>
                    <p className="body-6 mt-2.5 text-muted-foreground">
                      {item.a[locale]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      {/* =====================================================================
          SECTION 10: FINAL CTA + CLEAN ARCHITECTURAL FOOTER (A2 #12 + B10)
         ===================================================================== */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-4 sm:px-8 lg:flex-row lg:items-center">
          <div className="max-w-[640px] space-y-3">
            <h2 className="heading-3 text-foreground">
              {isZh
                ? "现在就拿一道你最头疼的主观题试试。"
                : "Test it right now on your toughest free response problem."}
            </h2>
            <p className="body-3 text-muted-foreground">
              {isZh
                ? "免注册直接进入推导室体验逐行批改，也可一键保存单文件离线版到电脑永久备用。"
                : "Jump straight into step level grading without creating an account, or save the standalone offline HTML bundle."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenStudioTab("workbench")}
              className="btn-primary-flagship inline-flex items-center gap-2 rounded-lg px-5 py-3 button-md"
            >
              <span>
                {isZh ? "体验示例练习" : "Try the example"}
              </span>
              <ArrowRight className="h-4 w-4" weight="bold" />
            </button>

            <button
              type="button"
              onClick={onDownloadStandalone}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 button-sm text-foreground transition-colors duration-300 hover:bg-secondary"
            >
              <DownloadSimple className="h-4 w-4" weight="bold" />
              <span>
                {isZh ? "下载离线单文件版（42KB）" : "Download offline HTML"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer (B10: Legal links, open-source compliance, zero 4-column link farm) */}
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-4 sm:px-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <BrandMark size={24} />
            <div>
              <p className="title-4 font-semibold text-foreground">
                {isZh ? "知微 DeepScholar" : "DeepScholar"}
              </p>
              <p className="caption-4 text-muted-foreground">
                {isZh
                  ? "© 2026 DeepScholar Clearinghouse · 全球静态节点与离线双保险永久运行"
                  : "© 2026 DeepScholar Clearinghouse · Permanent static CDN & offline ready"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 caption-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => onOpenStudioTab("overview")}
              className="hover:text-foreground"
            >
              {isZh ? "实测工作台" : "Product studio"}
            </button>
            <button
              type="button"
              onClick={() => onOpenCashier("redeem")}
              className="hover:text-foreground"
            >
              {isZh ? "序列号激活" : "Redeem license"}
            </button>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="hover:text-foreground"
            >
              {isZh ? "隐私条款" : "Privacy"}
            </button>
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="hover:text-foreground"
            >
              {isZh ? "退费与服务协议" : "Terms & refund"}
            </button>
            <button
              type="button"
              onClick={() => openLegal("opensource")}
              className="hover:text-foreground"
            >
              {isZh ? "开源许可声明" : "Open source"}
            </button>
          </div>
        </div>
      </footer>

      <LegalComplianceModal
        open={legalOpen}
        initialTab={legalTab}
        locale={locale}
        onClose={() => setLegalOpen(false)}
      />
    </div>
  );
}
