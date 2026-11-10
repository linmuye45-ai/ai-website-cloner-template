"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Lock,
  Play,
  Square,
} from "lucide-react";
import { withBasePath } from "@/lib/asset-path";
import type {
  CoursePack,
  LocaleCode,
  WhiteLabelConfig,
} from "@/types/platform";

interface ExamDiagnosticDeskViewProps {
  brand: WhiteLabelConfig;
  courses: CoursePack[];
  activeCourse: CoursePack;
  onSelectCourse: (courseId: string) => void;
  onEnterStudio: (courseId?: string) => void;
  onEnterAudioSeminar: () => void;
  onEnterSchoolSuite: () => void;
  onEnterClearinghouse: () => void;
  onOpenCashier: (mode?: "c_end" | "b_end" | "redeem") => void;
  isProUnlocked: boolean;
}

type InstrumentKind = "taylor" | "rubric" | "hemodynamic";

interface ExamScriptFinding {
  id: string;
  badge: string;
  lineNo: string;
  originalLine: string;
  deductionTag: string;
  reason: string;
  rewrite: string;
  locked?: boolean;
}

interface TrackDeskData {
  trackKey: string;
  courseId: string;
  shortTab: Record<LocaleCode, string>;
  paperCode: string;
  scoreBefore: string;
  scoreAfter: string;
  photoSrc: string;
  photoCaption: Record<LocaleCode, string>;
  instrument: InstrumentKind;
  audioComment: Record<LocaleCode, string>;
  promptQuestion: Record<LocaleCode, string>;
  findings: Record<LocaleCode, ExamScriptFinding[]>;
}

const DESK_TRACKS: TrackDeskData[] = [
  {
    trackKey: "calc",
    courseId: "ap-calc",
    shortTab: {
      zh: "AP 微积分 / 理科数学",
      en: "AP Calculus BC",
      ja: "東大理系・AP微積分",
      es: "Cálculo AP",
    },
    paperCode: "FRQ-2026-Q6 · Taylor Remainder",
    scoreBefore: "62 / 100",
    scoreAfter: "96 / 100",
    photoSrc: "/images/track-stem-prism.jpg",
    photoCaption: {
      zh: "高阶多项式逼近与拉格朗日余项放缩示意",
      en: "Polynomial approximation & Lagrange remainder bound",
      ja: "高次多項式近似とラグランジュ剰余項の評価",
      es: "Aproximación polinómica y cota de Lagrange",
    },
    instrument: "taylor",
    audioComment: {
      zh: "阅卷组长点评。这道压轴题有两处连续丢分，第一行漏写闭区间可导性前提扣四分，第二行把中心点零直接代入余项导致不等式失效再扣十四分。先声明指数函数单调递增，再用右端点放大上界就能拿满。",
      en: "Chief Reader note. Omitting interval differentiability loses four points, and plugging c equals zero into the remainder forfeits fourteen more. Bound the fourth derivative at the right endpoint.",
      ja: "採点講評。閉区間での微分可能性の記述漏れと、剰余項への中心c=0の誤代入で大きく失点しています。単調増加性を述べて右端で評価しましょう。",
      es: "Nota de corrección. Omitir la diferenciabilidad y sustituir c igual a cero anula los puntos de cota. Evalúa siempre en el extremo derecho.",
    },
    promptQuestion: {
      zh: "题目：用三阶麦克劳林多项式 P₃(x) 近似 e^x 在 x = 0.2 处的值，并证明误差不超过 1.5×10⁻⁴。",
      en: "Prompt: Approximate e^{0.2} using the 3rd-degree Maclaurin polynomial P₃(x) and prove |R₃(0.2)| < 1.5×10⁻⁴.",
      ja: "問題：3次マクローリン多項式 P₃(x) で e^{0.2} を近似し、誤差が 1.5×10⁻⁴ 未満であることを示せ。",
      es: "Enunciado: Aproxima e^{0.2} mediante el polinomio de Maclaurin P₃(x) y demuestra |R₃(0.2)| < 1.5×10⁻⁴.",
    },
    findings: {
      zh: [
        {
          id: "f1",
          badge: "①",
          lineNo: "01",
          originalLine: "P_3(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.22133.",
          deductionTag: "漏写定理前提（-4 分）",
          reason:
            "直接写出展开式，未声明 f(x)=e^x 在闭区间 [0, 0.2] 上四阶连续可导，按官方评分细则扣去前置条件分。",
          rewrite:
            "Since f(x)=e^x ∈ C^4([0, 0.2]), P_3(0.2) = 1 + 0.2 + 0.2^2/2! + 0.2^3/3! = 1.22133.",
        },
        {
          id: "f2",
          badge: "②",
          lineNo: "02",
          originalLine:
            "|R_3(0.2)| = e^c · (0.2)^4 / 24 = e^0 · 0.0016 / 24 = 6.67×10^-5 < 1.5×10^-4.",
          deductionTag: "误代中心点 c=0（-18 分）",
          reason:
            "余项中的 ξ∈(0, 0.2) 是未知内点，代入 c=0 属于求出下界而非上界，整段不等式推导判零分。",
          rewrite:
            "For c ∈ (0, 0.2), e^c < e^{0.2} < 2. Thus |R_3(0.2)| < 2 · (0.0016)/24 = 1.33×10^-4 < 1.5×10^-4.",
        },
        {
          id: "f3",
          badge: "③",
          lineNo: "03",
          originalLine:
            "同理对交错级数 ln(1+x) 在 x=0.2 处同样套用拉格朗日余项放缩……",
          deductionTag: "第 3 处扣分点与 3 道同源压轴变式（待解锁 +12 分）",
          reason:
            "交错级数直接用莱布尼茨首项截断误差比拉格朗日放缩紧三倍，混用方法会在第 (d) 小问超时卡死。",
          rewrite:
            "开通任意学习卡后查看交错级数截断误差模板与 3 道历年 FRQ 第六题配套训练。",
          locked: true,
        },
      ],
      en: [
        {
          id: "f1",
          badge: "①",
          lineNo: "01",
          originalLine: "P_3(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.22133.",
          deductionTag: "Missing Smoothness Premise (-4 pts)",
          reason:
            "Scoring guidelines require stating that f(x)=e^x has continuous fourth derivatives on [0, 0.2] before applying Taylor's theorem.",
          rewrite:
            "Since f(x)=e^x is C^4 on [0, 0.2], P_3(0.2) = 1 + 0.2 + 0.02 + 0.00133 = 1.22133.",
        },
        {
          id: "f2",
          badge: "②",
          lineNo: "02",
          originalLine: "|R_3(0.2)| = e^0 · (0.2)^4 / 24 = 6.67×10^-5.",
          deductionTag: "Invalid c=0 Substitution (-18 pts)",
          reason:
            "Evaluating e^c at c=0 produces the minimum rather than an upper bound across (0, 0.2), forfeiting both proof points.",
          rewrite:
            "Since e^x increases on [0, 0.2], e^c < e^{0.2} < 2 ⇒ |R_3(0.2)| < 2(0.0016)/24 = 1.33×10^-4.",
        },
        {
          id: "f3",
          badge: "③",
          lineNo: "03",
          originalLine: "Apply the same Lagrange bound to alternating ln(1+x)...",
          deductionTag: "Deduction #3 & 3 Past-Paper Variants (+12 pts)",
          reason:
            "Alternating series require the Alternating Series Error Bound rather than Lagrange remainder on part (d).",
          rewrite:
            "Unlock full step template and 3 graded FRQ #6 drills with any Study Pass.",
          locked: true,
        },
      ],
      ja: [
        {
          id: "f1",
          badge: "①",
          lineNo: "01",
          originalLine: "P_3(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.22133.",
          deductionTag: "微分可能性の前提漏れ（-4点）",
          reason: "閉区間 [0, 0.2] における4階連続微分可能性の明記が抜けています。",
          rewrite: "f(x)=e^x は [0, 0.2] で C^4 級より P_3(0.2) = 1.22133。",
        },
        {
          id: "f2",
          badge: "②",
          lineNo: "02",
          originalLine: "|R_3(0.2)| = e^0 · (0.2)^4 / 24 = 6.67×10^-5.",
          deductionTag: "中心 c=0 の誤代入（-18点）",
          reason: "未知数 c に 0 を代入すると下界になってしまい、上からの評価として成立しません。",
          rewrite: "[0, 0.2] で e^x は単調増加より e^c < e^{0.2} < 2 ⇒ |R_3(0.2)| < 1.33×10^-4。",
        },
        {
          id: "f3",
          badge: "③",
          lineNo: "03",
          originalLine: "交代級数 ln(1+x) にも同様にラグランジュ評価を適用……",
          deductionTag: "減点箇所 #3 と直前類題3選（+12点）",
          reason: "交代級数の誤差評価テンプレートと頻出融合問題を解放します。",
          rewrite: "受講パス登録で全記述テンプレートと演習問題を閲覧できます。",
          locked: true,
        },
      ],
      es: [
        {
          id: "f1",
          badge: "①",
          lineNo: "01",
          originalLine: "P_3(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.22133.",
          deductionTag: "Falta hipótesis de regularidad (-4 pts)",
          reason: "Debe indicarse que f(x)=e^x es derivable con continuidad en [0, 0.2].",
          rewrite: "Como f(x)=e^x es C^4 en [0, 0.2], P_3(0.2) = 1.22133.",
        },
        {
          id: "f2",
          badge: "②",
          lineNo: "02",
          originalLine: "|R_3(0.2)| = e^0 · (0.2)^4 / 24 = 6.67×10^-5.",
          deductionTag: "Sustitución inválida c=0 (-18 pts)",
          reason: "Evaluar en c=0 obtiene el mínimo en vez de una cota superior.",
          rewrite: "Como e^x crece en [0, 0.2], e^c < 2 ⇒ |R_3(0.2)| < 1.33×10^-4.",
        },
        {
          id: "f3",
          badge: "③",
          lineNo: "03",
          originalLine: "Aplicar la misma cota a la serie alternada ln(1+x)...",
          deductionTag: "Deducción #3 y 3 ejercicios equivalentes (+12 pts)",
          reason: "Desbloquea la plantilla completa con cualquier Pase de Estudio.",
          rewrite: "Activa un pase para ver las soluciones completas.",
          locked: true,
        },
      ],
    },
  },
  {
    trackKey: "ielts",
    courseId: "ielts-writing",
    shortTab: {
      zh: "雅思写作 / 法考主观",
      en: "IELTS & Legal Writing",
      ja: "IELTS・司法試験論述",
      es: "IELTS y Argumentación",
    },
    paperCode: "IELTS Task 2 · Academic Essay",
    scoreBefore: "Band 6.0",
    scoreAfter: "Band 8.0",
    photoSrc: "/images/track-humanities-balance.jpg",
    photoCaption: {
      zh: "论点边界限定与反方让步平衡结构",
      en: "Scoped concession & counter-argument balance",
      ja: "譲歩構文と反論処理の論理バランス",
      es: "Equilibrio argumentativo y concesión",
    },
    instrument: "rubric",
    audioComment: {
      zh: "雅思考官点评。原段最大的问题是连用 Everyone 和 definitely 做出全称武断结论，导致任务回应项锁死在六分。先用 While 承认屏幕社交对邻里寒暄的削弱，再指出跨地域兴趣社群的维系作用，论证层次马上拉开。",
      en: "Senior Examiner note. Universal claims like Everyone and definitely cap Task Response at Band six. Scoping your claim with a concession unlocks Band eight.",
      ja: "採点官コメント。Everyone や definitely の断定表現がスコアを6.0に抑えています。Whileを用いた譲歩節で適用範囲を限定すると8.0水準に届きます。",
      es: "Nota del examinador. Afirmaciones absolutas limitan la nota a 6.0. Abre con una concesión matizada para alcanzar 8.0.",
    },
    promptQuestion: {
      zh: "题目：数字设备普及正在瓦解现实社区关系，你在多大程度上同意或反对？",
      en: "Prompt: Digital devices are eroding real-world community bonds. To what extent do you agree or disagree?",
      ja: "設問：デジタル機器の普及は地域の絆を損なっているか。賛否を論じよ。",
      es: "Tema: Los dispositivos digitales están debilitando los lazos comunitarios. ¿En qué medida estás de acuerdo?",
    },
    findings: {
      zh: [
        {
          id: "w1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "Nowadays everyone stares at screens all day, so local community bonds will definitely disappear.",
          deductionTag: "全称武断表述（Task Response -1.0 分）",
          reason:
            "连用 everyone 与 definitely 缺乏限定条件，在官方评分表中属于未区分群体差异的泛化结论。",
          rewrite:
            "While ubiquitous screen use can weaken casual neighborhood contact, digital platforms simultaneously sustain interest-based communities across cities.",
        },
        {
          id: "w2",
          badge: "②",
          lineNo: "02",
          originalLine:
            "Smartphones make people isolated and nobody talks to neighbors anymore.",
          deductionTag: "口语动词重复（Lexical Resource -1.0 分）",
          reason:
            "make people isolated 与 nobody talks 属于口语化重复，缺少对城市高密度通勤原因的因果解释。",
          rewrite:
            "Long urban commutes already compress leisure hours, and mobile messaging partially compensates by keeping dispersed peers connected.",
        },
        {
          id: "w3",
          badge: "③",
          lineNo: "03",
          originalLine:
            "In conclusion, governments must force citizens to use phones less...",
          deductionTag: "结尾段突兀建议与 5 类高频母题框架（待解锁）",
          reason:
            "议论文结尾突然抛出强制行政命令，偏离前文讨论重点，容易拉低连贯与衔接分。",
          rewrite:
            "开通学习卡解锁完整结尾重塑与科技、教育、城市化五大母题高分段落库。",
          locked: true,
        },
      ],
      en: [
        {
          id: "w1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "Everyone stares at screens all day, so community bonds will definitely disappear.",
          deductionTag: "Over-Generalization (TR -1.0 Band)",
          reason:
            "Unqualified universal claims trigger Band 6 Task Response ceilings under official descriptors.",
          rewrite:
            "While ubiquitous screen use can erode incidental neighborhood ties, digital networks simultaneously sustain specialized communities.",
        },
        {
          id: "w2",
          badge: "②",
          lineNo: "02",
          originalLine:
            "Smartphones make people isolated and nobody talks to neighbors anymore.",
          deductionTag: "Conversational Phrasing (LR -1.0 Band)",
          reason:
            "Repetitive informal verbs miss the underlying urban-commute mechanism.",
          rewrite:
            "Extended metropolitan commutes compress face-to-face leisure, and mobile messaging offsets this friction.",
        },
        {
          id: "w3",
          badge: "③",
          lineNo: "03",
          originalLine: "Governments must force citizens to use phones less...",
          deductionTag: "Abrupt Policy Conclusion & 5 Topic Frames (Locked)",
          reason:
            "Introducing coercive mandates in the final sentence breaks argument cohesion.",
          rewrite:
            "Unlock the calibrated conclusion rewrite and 5 core Task 2 templates.",
          locked: true,
        },
      ],
      ja: [
        {
          id: "w1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "Everyone stares at screens all day, so community bonds will definitely disappear.",
          deductionTag: "過度な一般化（TR -1.0）",
          reason: "everyone と definitely の断定表現が論理評価を6.0に制限しています。",
          rewrite:
            "While ubiquitous screen use can erode neighborhood ties, digital networks sustain specialized communities.",
        },
        {
          id: "w2",
          badge: "②",
          lineNo: "02",
          originalLine: "Smartphones make people isolated and nobody talks...",
          deductionTag: "口語的表現の反復（LR -1.0）",
          reason: "口語動詞の繰り返しを避け、都市通勤の背景要因を補います。",
          rewrite:
            "Extended commutes compress face-to-face leisure, which mobile messaging partially offsets.",
        },
        {
          id: "w3",
          badge: "③",
          lineNo: "03",
          originalLine: "Governments must force citizens...",
          deductionTag: "結論部の論理飛躍と頻出5テーマ構成案（未解放）",
          reason: "受講パスで結論書き換えと頻出エッセイ構成集を表示します。",
          rewrite: "受講パスを有効化して全文を確認。",
          locked: true,
        },
      ],
      es: [
        {
          id: "w1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "Everyone stares at screens all day, so community bonds will definitely disappear.",
          deductionTag: "Generalización excesiva (-1.0 Band)",
          reason: "Las afirmaciones universales limitan la puntuación de respuesta a 6.0.",
          rewrite:
            "While ubiquitous screen use can erode neighborhood ties, digital platforms sustain specialized communities.",
        },
        {
          id: "w2",
          badge: "②",
          lineNo: "02",
          originalLine: "Smartphones make people isolated...",
          deductionTag: "Registro coloquial (-1.0 Band)",
          reason: "Sustituye verbos informales por mecanismos causales precisos.",
          rewrite:
            "Extended metropolitan commutes compress leisure hours, which digital messaging partially offsets.",
        },
        {
          id: "w3",
          badge: "③",
          lineNo: "03",
          originalLine: "Governments must force citizens...",
          deductionTag: "Cierre abrupto y 5 plantillas temáticas (Bloqueado)",
          reason: "Activa un pase para desbloquear el cierre completo.",
          rewrite: "Disponible con cualquier Pase de Estudio.",
          locked: true,
        },
      ],
    },
  },
  {
    trackKey: "med",
    courseId: "usmle-cardio",
    shortTab: {
      zh: "USMLE / 临床病理",
      en: "USMLE Step 1 Clinical",
      ja: "USMLE・臨床病態生理",
      es: "MIR / USMLE Clínica",
    },
    paperCode: "Vignette #412 · Cardiogenic Compensation",
    scoreBefore: "224",
    scoreAfter: "258",
    photoSrc: "/images/editorial-clinical-notes.jpg",
    photoCaption: {
      zh: "心输出量、前负荷与外周血管阻力代偿关系",
      en: "Cardiac output, preload & systemic vascular resistance",
      ja: "心拍出量・前負荷・末梢血管抵抗の代償応答",
      es: "Gasto cardíaco, precarga y resistencia vascular",
    },
    instrument: "hemodynamic",
    audioComment: {
      zh: "临床病例复盘。急性左心衰射血分数下降时，交感与肾素系统激活会使外周血管收缩维持血压，而不是扩张。治疗上先用血管紧张素转换酶抑制剂降低后负荷，心输出量曲线才能往上移。",
      en: "Clinical review. Reduced ejection fraction triggers sympathetic and RAAS activation, raising systemic vascular resistance rather than lowering it. Afterload reduction shifts the Frank-Starling curve upward.",
      ja: "症例解説。左室駆出率の低下時は交感神経とRAASが活性化し、末梢血管抵抗は上昇します。後負荷軽減により心拍出量曲線が上方へ移動します。",
      es: "Revisión clínica. La caída de fracción de eyección activa el sistema simpático y eleva la resistencia vascular periférica.",
    },
    promptQuestion: {
      zh: "病例：64 岁男性陈旧性心梗患者出现夜间阵发性呼吸困难（LVEF 32%），判断其代偿期血流动力学指标变化。",
      en: "Vignette: 64yo man with prior MI presents with paroxysmal nocturnal dyspnea (LVEF 32%). Predict compensatory hemodynamic arrows.",
      ja: "症例：陳旧性心筋梗塞のある64歳男性（LVEF 32%）。代償期の血行動態パラメータの変化を選べ。",
      es: "Caso: Varón de 64 años con IAM previo y disnea paroxística nocturna (FEVI 32%). Determina los cambios hemodinámicos.",
    },
    findings: {
      zh: [
        {
          id: "m1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "心排血量下降后，机体为改善外周灌注会自动降低全身血管阻力（SVR ↓）。",
          deductionTag: "代偿方向选反（高频易错项）",
          reason:
            "颈动脉窦压力感受器感知搏出量下降后立即增强交感缩血管张力，全身外周阻力（SVR）必然升高而非降低。",
          rewrite:
            "CO ↓ → 颈动脉窦压力感受器放电减少 → 交感与 RAAS 激活 → SVR ↑（维持平均动脉压，但加重左室后负荷）。",
        },
        {
          id: "m2",
          badge: "②",
          lineNo: "02",
          originalLine:
            "急性肺水肿发作期立即加用足量美托洛尔（β 受体阻滞剂）增强心肌收缩。",
          deductionTag: "急性失代偿用药禁忌",
          reason:
            "β 阻滞剂可改善慢性心衰远期重构，但在急性湿冷失代偿期上调剂量会直接诱发心源性休克。",
          rewrite:
            "急性肺水肿期先予袢利尿剂减轻前负荷并控制后负荷，待血流动力学稳定、体液恢复干重后再小剂量起始 β 阻滞剂。",
        },
        {
          id: "m3",
          badge: "③",
          lineNo: "03",
          originalLine:
            "合并双侧肾动脉狭窄时继续联用沙库巴曲缬沙坦滴定……",
          deductionTag: "肾灌注压骤降机制与 12 组心血管必考箭头表（待解锁）",
          reason:
            "双侧肾动脉狭窄依赖血管紧张素 II 收缩出球小动脉维持滤过压，阻断后会导致肌酐急剧升高。",
          rewrite:
            "开通学习卡查看完整休克四分型血流动力学箭头速查表与配套病例库。",
          locked: true,
        },
      ],
      en: [
        {
          id: "m1",
          badge: "①",
          lineNo: "01",
          originalLine:
            "Reduced cardiac output triggers systemic vasodilation (SVR ↓) to preserve tissue perfusion.",
          deductionTag: "Reversed Baroreceptor Arrow",
          reason:
            "Decreased stretch on carotid sinus baroreceptors increases sympathetic outflow and RAAS tone, raising SVR.",
          rewrite:
            "CO ↓ → decreased baroreceptor firing → sympathetic & RAAS activation → SVR ↑ and LVEDP ↑.",
        },
        {
          id: "m2",
          badge: "②",
          lineNo: "02",
          originalLine:
            "Initiate full-dose metoprolol immediately during acute pulmonary edema.",
          deductionTag: "Acute Decompensation Contraindication",
          reason:
            "Negative inotropy during acute wet-cold decompensation precipitates cardiogenic shock.",
          rewrite:
            "Stabilize acute pulmonary congestion with loop diuretics first, then initiate low-dose beta-blockade once euvolemic.",
        },
        {
          id: "m3",
          badge: "③",
          lineNo: "03",
          originalLine:
            "Titrate ARNI/ACEI aggressively despite bilateral renal artery stenosis...",
          deductionTag: "Efferent Arteriole GFR Crash & 12 Shock Tables (Locked)",
          reason:
            "Blocking efferent constriction collapses glomerular filtration pressure in bilateral RAS.",
          rewrite:
            "Unlock all 12 USMLE hemodynamic arrow tables with any Study Pass.",
          locked: true,
        },
      ],
      ja: [
        {
          id: "m1",
          badge: "①",
          lineNo: "01",
          originalLine: "心拍出量の低下に伴い、末梢血管抵抗（SVR）は低下する。",
          deductionTag: "代償矢印の逆転ミス",
          reason: "圧受容器反射とRAAS活性化により、SVRは血圧維持のため上昇します。",
          rewrite: "CO ↓ → 交感神経・RAAS活性化 → SVR ↑・左室拡張末期圧 ↑。",
        },
        {
          id: "m2",
          badge: "②",
          lineNo: "02",
          originalLine: "急性肺水腫の発作中に高用量β遮断薬を即時開始する。",
          deductionTag: "急性非代償期の禁忌",
          reason: "うっ血が取れる前にβ遮断薬を導入すると心原性ショックを招きます。",
          rewrite: "ループ利尿薬でうっ血を解除し、血行動態安定後に少量から導入。",
        },
        {
          id: "m3",
          badge: "③",
          lineNo: "03",
          originalLine: "両側腎動脈狭窄合併例へのACE阻害薬増量……",
          deductionTag: "輸出細動脈拡張によるGFR急落と循環器12表（未解放）",
          reason: "受講パスで循環器パラメータ早見表をすべて確認できます。",
          rewrite: "受講パス登録で解放。",
          locked: true,
        },
      ],
      es: [
        {
          id: "m1",
          badge: "①",
          lineNo: "01",
          originalLine: "La caída del gasto cardíaco reduce la resistencia vascular sistémica.",
          deductionTag: "Dirección compensatoria invertida",
          reason: "La activación simpática y del SRAA eleva la RVS para sostener la presión arterial.",
          rewrite: "GC ↓ → activación simpática y SRAA → RVS ↑ y PTDVI ↑.",
        },
        {
          id: "m2",
          badge: "②",
          lineNo: "02",
          originalLine: "Iniciar metoprolol a dosis plenas en pleno edema agudo de pulmón.",
          deductionTag: "Contraindicación en descompensación aguda",
          reason: "El efecto inotrópico negativo en fase húmeda precipita shock cardiogénico.",
          rewrite: "Resolver primero la congestión con diuréticos de asa antes de introducir betabloqueantes.",
        },
        {
          id: "m3",
          badge: "③",
          lineNo: "03",
          originalLine: "Añadir IECA en estenosis bilateral de arteria renal...",
          deductionTag: "Caída de filtrado glomerular y 12 tablas MIR (Bloqueado)",
          reason: "Activa un pase para ver todas las tablas hemodinámicas.",
          rewrite: "Disponible con Pase de Estudio.",
          locked: true,
        },
      ],
    },
  },
];

const TAYLOR_ORDERS: Record<number, { d: string; bound: string; steps: string }> = {
  1: { d: "M 18 84 L 222 44", bound: "2.14×10⁻²", steps: "2 / 5 步" },
  2: { d: "M 18 84 Q 118 62, 222 30", bound: "4.28×10⁻³", steps: "3 / 5 步" },
  3: { d: "M 18 84 C 78 78, 146 42, 222 21", bound: "8.53×10⁻⁴", steps: "4 / 5 步" },
  4: { d: "M 18 84 C 82 80, 152 32, 222 16", bound: "1.33×10⁻⁴", steps: "5 / 5 满分" },
};

const HEMODYNAMIC_STATES: Array<{
  id: string;
  label: Record<LocaleCode, string>;
  curve: string;
  co: string;
  svr: string;
}> = [
  {
    id: "normal",
    label: { zh: "正常生理", en: "Normal", ja: "正常", es: "Normal" },
    curve: "M 20 86 Q 90 18, 220 16",
    co: "5.2 L/min",
    svr: "1,100 dyn",
  },
  {
    id: "hf",
    label: { zh: "心衰失代偿", en: "HFrEF", ja: "心不全", es: "IC sistólica" },
    curve: "M 20 86 Q 110 64, 220 58",
    co: "2.8 L/min",
    svr: "1,850 dyn ↑",
  },
  {
    id: "acei",
    label: { zh: "降后负荷后", en: "+ACEI", ja: "後負荷軽減", es: "+IECA" },
    curve: "M 20 86 Q 98 38, 220 34",
    co: "4.1 L/min ↑",
    svr: "1,280 dyn ↓",
  },
];

export function ExamDiagnosticDeskView({
  brand,
  activeCourse,
  onSelectCourse,
  onEnterStudio,
  onEnterAudioSeminar,
  onEnterSchoolSuite,
  onEnterClearinghouse,
  onOpenCashier,
  isProUnlocked,
}: ExamDiagnosticDeskViewProps) {
  const locale = brand.locale;

  const [trackIdx, setTrackIdx] = useState<number>(0);
  const [findingIdx, setFindingIdx] = useState<number>(1);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customDraft, setCustomDraft] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Instrument states
  const [taylorN, setTaylorN] = useState<number>(4);
  const [rubricAfter, setRubricAfter] = useState<boolean>(true);
  const [hemoIdx, setHemoIdx] = useState<number>(1);

  const desk = DESK_TRACKS[trackIdx] ?? DESK_TRACKS[0];
  const findings = desk.findings[locale];
  const activeFinding = findings[findingIdx] ?? findings[0];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelectDeskTrack = (idx: number) => {
    const next = DESK_TRACKS[idx];
    setTrackIdx(idx);
    setFindingIdx(1);
    if (next) {
      onSelectCourse(next.courseId);
    }
  };

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(desk.audioComment[locale]);
    utter.lang = activeCourse.speechLang;
    utter.rate = 1.03;
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utter);
  };

  const taylorCurve = TAYLOR_ORDERS[taylorN] ?? TAYLOR_ORDERS[4];
  const hemoState = HEMODYNAMIC_STATES[hemoIdx] ?? HEMODYNAMIC_STATES[1];

  return (
    <div className="mx-auto max-w-[1180px] space-y-12 px-4 py-7 sm:px-8 sm:py-9 pb-24">
      {/* =====================================================================
          TOP EDITORIAL MASTHEAD + SUBJECT DESK SWITCHER
         ===================================================================== */}
      <header className="flex flex-col gap-5 border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-mono">01 / LIVE EXAM DIAGNOSTIC DESK</span>
          <button
            type="button"
            onClick={onEnterClearinghouse}
            className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
          >
            <span>
              {locale === "zh"
                ? "商业模式：查看从 ¥68 备考卡到 $108B 人才结算网的完整账本"
                : "Business Model: View the 8-Year $108B Clearinghouse Ledger"}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
              {locale === "zh"
                ? "把丢分的那一行找出来，当场改到满分标准。"
                : locale === "ja"
                ? "減点された一行を特定し、その場で満点答案へ書き換える。"
                : "Pinpoint the exact line losing marks, and rewrite it to full credit."}
            </h1>
            <p className="max-w-2xl text-[15px] text-muted-foreground">
              {locale === "zh"
                ? "点击下方原卷里的红色题号查看扣分原因与满分改法，右侧同步演示该科目的数学曲线、血流变化或评分标尺。"
                : "Select any red-marked line on the exam script below to inspect official rubric deductions alongside live visual verification."}
            </p>
          </div>

          {/* 3 Distinct Subject Desks */}
          <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
            {DESK_TRACKS.map((item, idx) => {
              const active = idx === trackIdx;
              return (
                <button
                  key={item.trackKey}
                  type="button"
                  onClick={() => handleSelectDeskTrack(idx)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.shortTab[locale]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN SPLIT DESK: LEFT NUMBERED EXAM PAPER (7) + RIGHT STUDIO PLATE (5)
         ===================================================================== */}
      <section className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-start">
        {/* LEFT 7 COLUMNS: Tactile Ruled Exam Answer Sheet */}
        <div className="surface-elevated overflow-hidden rounded-xl border border-border lg:col-span-7">
          {/* Exam Paper Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/55 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-foreground">
                {desk.paperCode}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-mono text-xs font-semibold tabular-nums">
                <span className="text-deduct">{desk.scoreBefore}</span>
                <span className="mx-1.5 text-muted-foreground">→</span>
                <span className="text-signal">{desk.scoreAfter}</span>
              </div>

              <button
                type="button"
                onClick={() => setCustomMode((p) => !p)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-secondary"
              >
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>
                  {customMode
                    ? locale === "zh"
                      ? "返回示例卷"
                      : "Sample Script"
                    : locale === "zh"
                    ? "粘贴我的作答"
                    : "Paste My Answer"}
                </span>
              </button>
            </div>
          </div>

          {/* Prompt Line */}
          <div className="border-b border-border bg-card px-5 py-3 text-xs leading-relaxed text-muted-foreground">
            {desk.promptQuestion[locale]}
          </div>

          {/* Numbered Ruled Sheet */}
          {customMode ? (
            <div className="p-5 space-y-3 bg-card">
              <textarea
                rows={4}
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                placeholder={
                  locale === "zh"
                    ? "在此粘贴你的微积分步骤、英文议论文段落或病例分析，对照下方阅卷标准逐步核查…"
                    : "Paste your derivation steps or essay paragraph here…"
                }
                className="w-full rounded-lg border border-input bg-background p-3.5 text-sm text-foreground focus:border-brand focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onEnterStudio(desk.courseId)}
                  className="btn-tactile-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  <span>
                    {locale === "zh"
                      ? "送入一对一推导室逐行验算"
                      : "Verify Line by Line in 1-on-1 Practice"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="exam-paper-sheet divide-y divide-border/60">
              {findings.map((f, idx) => {
                const selected = idx === findingIdx;
                const isLockedItem = Boolean(f.locked) && !isProUnlocked;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFindingIdx(idx)}
                    className={`flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition-colors ${
                      selected
                        ? "bg-deduct-soft/55"
                        : "hover:bg-secondary/40"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground">
                      {f.lineNo}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-mono text-[13.5px] leading-relaxed text-foreground underline decoration-deduct/75 decoration-wavy underline-offset-4">
                        {f.originalLine}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-semibold ${
                            selected
                              ? "bg-deduct text-white"
                              : "bg-deduct-soft text-deduct"
                          }`}
                        >
                          {isLockedItem && <Lock className="h-2.5 w-2.5" />}
                          {f.badge} {f.deductionTag}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Finding Margin Annotation Slip */}
          <div className="border-t border-border bg-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-deduct px-2 py-0.5 font-mono text-xs font-bold text-white">
                  {activeFinding.badge}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {activeFinding.deductionTag}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleSpeech}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                {isPlaying ? (
                  <>
                    <Square className="h-3 w-3 fill-deduct text-deduct" />
                    <span>{locale === "zh" ? "停止播放" : "Stop"}</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-foreground text-foreground" />
                    <span>
                      {locale === "zh" ? "听 30 秒阅卷点评" : "30s Examiner Audio"}
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeFinding.reason}
            </p>

            {activeFinding.locked && !isProUnlocked ? (
              <div className="rounded-xl border border-border bg-secondary/45 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {locale === "zh"
                      ? "开通学习卡即可查看本卷全部扣分点与同源真题（7 天无理由全退）"
                      : "Unlock all hidden deductions and past-paper variants (7-day full refund)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCashier("redeem")}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    {locale === "zh"
                      ? "用体验码 DSG-VIP-GLOBAL-2026 免费试开 →"
                      : "Try Demo Key →"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => onOpenCashier("c_end")}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-left hover:border-brand"
                  >
                    <span className="text-xs font-medium">
                      {locale === "zh" ? "30天冲刺" : "30d Sprint"}
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {locale === "zh" ? "¥68" : "$19"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCashier("c_end")}
                    className="flex items-center justify-between rounded-lg border border-brand bg-brand-soft/50 px-3 py-2.5 text-left"
                  >
                    <span className="text-xs font-semibold text-brand">
                      {locale === "zh" ? "全年通卡" : "Annual Pass"}
                    </span>
                    <span className="font-mono text-sm font-bold text-brand">
                      {brand.currencySymbol}
                      {brand.studentAnnualPrice}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCashier("c_end")}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-left hover:border-brand"
                  >
                    <span className="text-xs font-medium">
                      {locale === "zh" ? "含审校接单" : "+AI Review"}
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {locale === "zh" ? "¥899" : "$349"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="diff-row-add rounded-lg p-3.5 text-sm">
                <div className="mb-1 flex items-center gap-1 font-mono text-[11px] font-semibold">
                  <Check className="h-3.5 w-3.5" />
                  <span>
                    {locale === "zh" ? "满分标准写法" : "Full-Credit Rewrite"}
                  </span>
                </div>
                <div className="font-mono text-[13px] leading-relaxed">
                  {activeFinding.rewrite}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                {locale === "zh"
                  ? "重考一次雅思或 AP 报名费超过 2,000 元，考前把步骤漏洞补齐最省钱。"
                  : "One exam retake fee exceeds $280. Catching rubric leaks early pays for itself."}
              </span>
              <button
                type="button"
                onClick={() => onEnterStudio(desk.courseId)}
                className="btn-lovable-dark inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
              >
                <span>
                  {locale === "zh"
                    ? "进入一对一推导室练同类题"
                    : "Practice Similar Problems"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: Dynamic Studio Photograph + Subject-Matched SVG Instrument */}
        <div className="space-y-5 lg:col-span-5">
          {/* Editorial Optical Photograph Plate */}
          <div className="surface-elevated overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-16/10 w-full overflow-hidden bg-secondary">
              <Image
                src={withBasePath(desk.photoSrc)}
                alt={desk.photoCaption[locale]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
              <span>{desk.photoCaption[locale]}</span>
              <span className="font-mono text-[11px] text-foreground">
                FIG. 0{trackIdx + 1}
              </span>
            </div>
          </div>

          {/* Subject-Matched Live Interactive SVG Instrument */}
          <div className="surface-elevated rounded-xl border border-border p-5 space-y-4">
            {desk.instrument === "taylor" && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {locale === "zh"
                        ? "泰勒展开阶数与误差上界验算"
                        : "Taylor Order & Remainder Bound"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {locale === "zh"
                        ? "点击阶数查看多项式逼近精度"
                        : "Switch degree n to inspect convergence"}
                    </div>
                  </div>
                  <div className="inline-flex gap-1 rounded-md bg-secondary p-0.5 font-mono text-xs">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setTaylorN(n)}
                        className={`rounded-sm px-2 py-0.5 font-semibold ${
                          taylorN === n
                            ? "bg-card text-foreground shadow-2xs"
                            : "text-muted-foreground"
                        }`}
                      >
                        n={n}
                      </button>
                    ))}
                  </div>
                </div>

                <svg
                  viewBox="0 0 240 96"
                  className="h-24 w-full"
                  aria-label="Taylor convergence graph"
                >
                  <line
                    x1="18"
                    y1="84"
                    x2="222"
                    y2="84"
                    stroke="currentColor"
                    className="text-border"
                  />
                  <path
                    d="M 18 84 C 82 80, 152 32, 222 16"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted-foreground/40"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                  />
                  <path
                    d={taylorCurve.d}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="222" cy="16" r="3.5" fill="var(--brand)" />
                </svg>

                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      |Rₙ(0.2)| 上界
                    </span>
                    <span className="font-bold text-foreground">
                      {taylorCurve.bound}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      步骤得分
                    </span>
                    <span className="font-bold text-signal">
                      {taylorCurve.steps}
                    </span>
                  </div>
                </div>
              </>
            )}

            {desk.instrument === "rubric" && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-foreground">
                    {locale === "zh"
                      ? "雅思考官四项评分对比"
                      : "Four-Criterion Examiner Rubric"}
                  </div>
                  <div className="inline-flex gap-1 rounded-md bg-secondary p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setRubricAfter(false)}
                      className={`rounded-sm px-2.5 py-0.5 font-medium ${
                        !rubricAfter
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      {locale === "zh" ? "原稿 6.0" : "Draft 6.0"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRubricAfter(true)}
                      className={`rounded-sm px-2.5 py-0.5 font-medium ${
                        rubricAfter
                          ? "bg-card text-signal font-semibold shadow-2xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      {locale === "zh" ? "改后 8.0" : "Rewrite 8.0"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      name: "Task Response（论证边界）",
                      before: 58,
                      after: 88,
                      scoreB: "5.5",
                      scoreA: "8.0",
                    },
                    {
                      name: "Coherence（让步与衔接）",
                      before: 62,
                      after: 90,
                      scoreB: "6.0",
                      scoreA: "8.5",
                    },
                    {
                      name: "Lexical Resource（学术词准度）",
                      before: 60,
                      after: 86,
                      scoreB: "6.0",
                      scoreA: "8.0",
                    },
                    {
                      name: "Grammar（复杂从句控制）",
                      before: 66,
                      after: 86,
                      scoreB: "6.5",
                      scoreA: "8.0",
                    },
                  ].map((row) => {
                    const widthVal = rubricAfter ? row.after : row.before;
                    return (
                      <div key={row.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {row.name}
                          </span>
                          <span className="font-mono font-bold">
                            {rubricAfter ? row.scoreA : row.scoreB}
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 100 5"
                          preserveAspectRatio="none"
                          className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={widthVal}
                            height={5}
                            fill={rubricAfter ? "var(--signal)" : "var(--deduct)"}
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {desk.instrument === "hemodynamic" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-foreground">
                    {locale === "zh"
                      ? "Frank-Starling 心输出量代偿曲线"
                      : "Frank-Starling Ventricular Curve"}
                  </div>
                  <div className="inline-flex gap-1 rounded-md bg-secondary p-0.5 text-[11px]">
                    {HEMODYNAMIC_STATES.map((st, idx) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setHemoIdx(idx)}
                        className={`rounded-sm px-2 py-0.5 font-medium ${
                          hemoIdx === idx
                            ? "bg-card text-foreground font-semibold shadow-2xs"
                            : "text-muted-foreground"
                        }`}
                      >
                        {st.label[locale]}
                      </button>
                    ))}
                  </div>
                </div>

                <svg
                  viewBox="0 0 240 96"
                  className="h-24 w-full"
                  aria-label="Frank-Starling curve"
                >
                  <line
                    x1="20"
                    y1="86"
                    x2="224"
                    y2="86"
                    stroke="currentColor"
                    className="text-border"
                  />
                  <line
                    x1="20"
                    y1="12"
                    x2="20"
                    y2="86"
                    stroke="currentColor"
                    className="text-border"
                  />
                  <path
                    d="M 20 86 Q 90 18, 220 16"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted-foreground/35"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <path
                    d={hemoState.curve}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      心排血量 CO
                    </span>
                    <span className="font-bold text-foreground">
                      {hemoState.co}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      外周阻力 SVR
                    </span>
                    <span className="font-bold text-brand">{hemoState.svr}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          RULED THREE-STEP WORKFLOW STRIP (No Rounded Bento Clutter)
         ===================================================================== */}
      <section className="grid grid-cols-1 border-y border-border divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        <button
          type="button"
          onClick={() => onEnterStudio(desk.courseId)}
          className="group py-6 text-left md:pr-7"
        >
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>STEP 01</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h2 className="mt-2 text-base font-semibold text-foreground">
            {locale === "zh" ? "上传讲义，逐行定位丢分步" : "Line-by-Line Step Check"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "zh"
              ? "所有解答严格绑定你上传的教材页码与评分表，代数与微积分过程实时验算。"
              : "Answers cite your uploaded syllabus page numbers and verify algebra steps."}
          </p>
        </button>

        <button
          type="button"
          onClick={onEnterAudioSeminar}
          className="group py-6 text-left md:px-7"
        >
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>STEP 02</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h2 className="mt-2 text-base font-semibold text-foreground">
            {locale === "zh" ? "双人圆桌听懂难点，90秒闭卷默写" : "Audio Seminar & 90s Recall"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "zh"
              ? "先听主讲老师和助教拆解易错点，再关掉提示限时默写，按遗忘规律考前抽查。"
              : "Listen to a two-instructor breakdown, then pass timed closed-book checks."}
          </p>
        </button>

        <button
          type="button"
          onClick={onEnterClearinghouse}
          className="group py-6 text-left md:pl-7"
        >
          <div className="flex items-center justify-between font-mono text-xs text-brand">
            <span>STEP 03</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h2 className="mt-2 text-base font-semibold text-foreground">
            {locale === "zh"
              ? "攒满 15 次闭卷记录，接审校单变现"
              : "Monetize Verified Exam Records"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "zh"
              ? "高分学员可申请时薪 $85–$140 的大模型步骤审校项目，或进入合作企业免笔试名单。"
              : "Qualify for $85–$140/hr AI reasoning review projects and direct hiring."}
          </p>
        </button>
      </section>

      {/* =====================================================================
          COMPACT $100B CLEARINGHOUSE SUMMARY & LIVE SETTLEMENT PREVIEW
         ===================================================================== */}
      <section className="obsidian-stage overflow-hidden rounded-2xl p-6 sm:p-9">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="font-mono text-xs text-white/55">
              {locale === "zh"
                ? "商业模式透明账本 · 8 年冲刺千亿美元市值路径"
                : "OPERATING ARCHITECTURE · 8-YEAR $108B PATH"}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {locale === "zh"
                ? "前两年靠备考卡和机构白标回本，后五年靠人才与 AI 数据撮合做大。"
                : "Cashflow-positive from exam passes in Year 1. Scaled to $108B by clearing verified talent and AI training data."}
            </h2>
            <p className="text-sm leading-relaxed text-white/75">
              {locale === "zh"
                ? "纯网课公司做不大，根源在于学生考完就流失。我们在 ≤1 万元启动预算下先卖个人冲刺卡（¥68）与培训机构白标系统（¥39,800/年），把几千万条真实改错步骤训成低成本批改小模型。随后向学校按提分结果收费，并抽取大模型审校工时费（30%）与名企直聘撮合费（$25,000/单），第 8 年目标年化收入 68 亿美元。"
                : "Pure course apps stall when students graduate. Starting under $1,400 capex, we fund proprietary error-trace models via learner passes and school OEM licenses, then clear 30% fees on AI lab post-training reviews and $25,000 direct enterprise hires."}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onEnterClearinghouse}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#161615] hover:bg-white/90"
              >
                <span>
                  {locale === "zh"
                    ? "打开八年收入测算器与人才库"
                    : "Open 8-Year Revenue Simulator"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onEnterSchoolSuite}
                className="rounded-lg border border-white/20 bg-white/8 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/14"
              >
                {locale === "zh"
                  ? "查看学校 1:150 督学与白标后台"
                  : "Inspect School White-Label Suite"}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#313131] bg-[#1f1f1f] lg:col-span-5">
            <div className="relative h-32 w-full overflow-hidden border-b border-[#313131]">
              <Image
                src={withBasePath("/images/editorial-global-clearing.jpg")}
                alt="四流向多币种结算网"
                fill
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/45" />
              <div className="absolute bottom-2.5 left-4 right-4 flex justify-between font-mono text-xs text-white/95 tnum">
                <span>4 REVENUE STREAMS</span>
                <span>YEAR 8 ARR: $6.80B</span>
              </div>
            </div>

            <div className="divide-y divide-white/8 p-4 text-xs">
              {[
                { k: "01 个人备考订阅", v: "¥68 – ¥899", m: "CAC 自回本" },
                { k: "02 学校白标 + 提分分成", v: "¥39,800 / 校", m: "NDR 138%" },
                { k: "03 大模型推导审校结算", v: "抽成 30%", m: "时薪 $85–140" },
                { k: "04 企业免笔试直聘撮合", v: "$25,000 / 单", m: "毛利 94%" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="text-white/85">{r.k}</span>
                  <div className="text-right font-mono">
                    <span className="font-semibold text-white">{r.v}</span>
                    <span className="ml-2 text-[11px] text-[#93c5fd]">
                      {r.m}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
