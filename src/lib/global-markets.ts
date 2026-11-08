import type {
  ChannelPartnerRecord,
  CoursePack,
  LocaleCode,
  WhiteLabelConfig,
} from "@/types/platform";

export interface MarketMeta {
  code: LocaleCode;
  flag: string;
  countryLabel: string;
  currencyNotice: string;
  paymentRails: string;
  monthlyHumanTutorBenchmark: number;
  b2bOemYearlyPrice: number;
  nav: {
    pitch: string;
    tutor: string;
    classroom: string;
    teacher: string;
    admin: string;
    eternal: string;
    quickRebrand: string;
    cashierCta: string;
  };
  hero: {
    compliancePill: string;
    instantMonetizePill: string;
    headlineTop: string;
    headlineHighlight: string;
    subheadline: string;
    ctaTutor: string;
    ctaClassroom: string;
    ctaTeacher: string;
    statMarginLabel: string;
    statBreakEvenUnit: string;
    statBreakEvenLabel: string;
    statTokenLabel: string;
    courseBoxBadge: string;
    courseBoxTitle: string;
    enterDemoBtn: string;
  };
  roi: {
    badge: string;
    titlePrefix: string;
    subtitle: string;
    studentsLabel: string;
    taCountLabel: string;
    taSalaryLabel: string;
    upsellLabel: string;
    line1Saved: string;
    line2Upsell: string;
    line3Cost: string;
    netProfitTitle: string;
    breakEvenSummaryPrefix: string;
    breakEvenSummarySuffix: string;
    lockB2bBtn: string;
    redeemBtn: string;
  };
  pricing: {
    badge: string;
    title: string;
    teacherTitle: string;
    studentTitle: string;
    orgTitle: string;
    partnerTitle: string;
    perYear: string;
    buyNow: string;
    lockQuote: string;
    viewPartnerConsole: string;
  };
}

export const GLOBAL_MARKETS: Record<LocaleCode, MarketMeta> = {
  zh: {
    code: "zh",
    flag: "CN",
    countryLabel: "大中华及新马市场 (CNY)",
    currencyNotice: "人民币与港币结算，支持微信、支付宝、离线卡密及对公预付",
    paymentRails: "微信与支付宝收款码 + 离线自校验卡密秒开 + 对公预付锁位",
    monthlyHumanTutorBenchmark: 1200,
    b2bOemYearlyPrice: 39800,
    nav: {
      pitch: "商业概览",
      tutor: "沉浸伴读",
      classroom: "互动讲堂",
      teacher: "教研与周报",
      admin: "白标管理台",
      eternal: "永久部署",
      quickRebrand: "品牌定制",
      cashierCta: "授权与结算",
    },
    hero: {
      compliancePill: "Apache-2.0 与 MIT 商业合规内核，无状态静态边缘架构",
      instantMonetizePill: "全球四大高客单市场本地化结算",
      headlineTop: "将机构私有讲义升级为全天候运行的",
      headlineHighlight: "可溯源伴学导师与专属白标教研系统",
      subheadline:
        "融合港大 DeepTutor 三层可审计学情记忆、清华 OpenMAIC 多角色互动讲堂与 FSRS 间隔重复算法。零后端宕机隐患，支持大中华、北美、日本与西语市场本地化交付。",
      ctaTutor: "进入沉浸式伴读工作台",
      ctaClassroom: "多角色讲堂与音频工坊",
      ctaTeacher: "十秒组卷与学情周报",
      statMarginLabel: "软件授权与督学综合毛利率",
      statBreakEvenUnit: "名学员",
      statBreakEvenLabel: "合作机构存量加购回本线",
      statTokenLabel: "单学员月均模型推理成本",
      courseBoxBadge: "本地化高客单课程样板",
      courseBoxTitle: "在右侧直接检验逐页溯源伴读与批改精度",
      enterDemoBtn: "进入工作台",
    },
    roi: {
      badge: "机构引入白标系统首年财务测算",
      titlePrefix: "机构首年净增营业利润测算表",
      subtitle: "按机构真实在读规模与助教成本实时核算投资回报周期",
      studentsLabel: "机构当前在读学员规模",
      taCountLabel: "全职或兼职答疑批改助教人数",
      taSalaryLabel: "助教人均月度人力成本",
      upsellLabel: "老生加购全年伴学督学包客单价",
      line1Saved: "释放 70% 重复批改与答疑工时节省薪资",
      line2Upsell: "存量学员 30% 转化伴学督学包新增营收",
      line3Cost: "扣减白标系统年费与全年模型推理成本",
      netProfitTitle: "合作机构首年预计净增利润",
      breakEvenSummaryPrefix: "机构仅需在存量学员中转化 ",
      breakEvenSummarySuffix: " 名学员加购督学服务即可覆盖全年系统授权费。",
      lockB2bBtn: "生成机构白标商业报价单",
      redeemBtn: "离线授权码核销",
    },
    pricing: {
      badge: "多币种商业授权体系",
      title: "机构白标年费与个人席位双轨定价表",
      teacherTitle: "教师智能命题与周报版",
      studentTitle: "学员终身记忆伴学席位",
      orgTitle: "机构旗舰白标专享版",
      partnerTitle: "区域渠道发行合伙人",
      perYear: "/ 年",
      buyNow: "开通席位或核销授权码",
      lockQuote: "生成正式商业报价单",
      viewPartnerConsole: "查看渠道分润台账",
    },
  },
  en: {
    code: "en",
    flag: "US",
    countryLabel: "North America & UK (USD)",
    currencyNotice: "USD settlement via Stripe and LemonSqueezy Merchant of Record",
    paymentRails: "Stripe Checkout + LemonSqueezy Global Tax MoR + Offline Signed Key",
    monthlyHumanTutorBenchmark: 320,
    b2bOemYearlyPrice: 4900,
    nav: {
      pitch: "Overview & ROI",
      tutor: "Grounded Tutor",
      classroom: "Seminar Studio",
      teacher: "Exams & Reports",
      admin: "White-Label Console",
      eternal: "Edge Deployment",
      quickRebrand: "Brand Preset",
      cashierCta: "Licensing",
    },
    hero: {
      compliancePill: "Apache-2.0 and MIT commercial core on a zero-downtime static edge",
      instantMonetizePill: "Engineered for SAT, AP, IB, and USMLE academies",
      headlineTop: "Turn proprietary academy curricula into an auditable",
      headlineHighlight: "Socratic tutoring and white-label examination system",
      subheadline:
        "Built on HKU DeepTutor L1-L3 learner memory, OpenMAIC multi-agent seminar rooms, and FSRS spaced repetition. Replace manual grading overhead and deploy under your academy domain in minutes.",
      ctaTutor: "Open Grounded Tutor",
      ctaClassroom: "Seminar & Audio Studio",
      ctaTeacher: "Variant Exam & Parent Digest",
      statMarginLabel: "Gross software margin",
      statBreakEvenUnit: "students",
      statBreakEvenLabel: "Academy upsell payback threshold",
      statTokenLabel: "Monthly inference cost per seat",
      courseBoxBadge: "Live curriculum workbench",
      courseBoxTitle: "Inspect page-cited tutoring across flagship exam tracks",
      enterDemoBtn: "Open track",
    },
    roi: {
      badge: "Institutional unit economics ledger",
      titlePrefix: "First-year net operating impact",
      subtitle: "Model payroll savings and AI coaching add-on revenue for your cohort size",
      studentsLabel: "Active enrolled students",
      taCountLabel: "Grading and Q&A teaching assistants",
      taSalaryLabel: "Monthly compensation per assistant",
      upsellLabel: "Annual AI coaching add-on fee (30% attach rate)",
      line1Saved: "70% grading and Q&A payroll saved",
      line2Upsell: "30% student attach rate on AI coaching add-on",
      line3Cost: "Less annual OEM license and model inference cost",
      netProfitTitle: "Projected first-year net operating gain",
      breakEvenSummaryPrefix: "Payback threshold: enrolling ",
      breakEvenSummarySuffix: " existing students in the coaching add-on covers the full annual license.",
      lockB2bBtn: "Generate institutional proposal",
      redeemBtn: "Verify license key",
    },
    pricing: {
      badge: "Global USD commercial licensing",
      title: "Institutional OEM and individual seat schedules",
      teacherTitle: "Educator Assessment Pro",
      studentTitle: "Learner Retention Seat",
      orgTitle: "Academy White-Label Edition (200 seats)",
      partnerTitle: "Regional Distribution Partner",
      perYear: "/ year",
      buyNow: "Activate seat",
      lockQuote: "Generate formal quote",
      viewPartnerConsole: "Open partner ledger",
    },
  },
  ja: {
    code: "ja",
    flag: "JP",
    countryLabel: "日本市場・学習塾 (JPY)",
    currencyNotice: "日本円決済（Stripe Japan / コンビニ決済 / 銀行振込）",
    paymentRails: "Stripe Japan（クレカ・コンビニ） / PayPay / 銀行振込前払い＋即時キー発行",
    monthlyHumanTutorBenchmark: 24000,
    b2bOemYearlyPrice: 498000,
    nav: {
      pitch: "事業概要・試算",
      tutor: "対話型AI指導",
      classroom: "マルチ演習室",
      teacher: "作問・保護者週報",
      admin: "OEM管理本部",
      eternal: "恒久エッジ配信",
      quickRebrand: "ブランド切替",
      cashierCta: "料金・認証",
    },
    hero: {
      compliancePill: "Apache-2.0 × MIT 商用準拠・サーバー停止ゼロの静的エッジ基盤",
      instantMonetizePill: "全国の学習塾・医学部予備校・EJU進学塾向け",
      headlineTop: "貴塾の独自テキストを24時間稼働する",
      headlineHighlight: "ページ根拠付きAI個別指導＆自社OEM基盤へ",
      subheadline:
        "香港大学DeepTutorの3層学習記憶、OpenMAIC対話型講義、FSRS忘却曲線モデルを統合。理系講師の採用難と添削負荷を解消し、LINE保護者週報で退塾を防止します。",
      ctaTutor: "AI個別指導・記述添削を開く",
      ctaClassroom: "対話型講義と音声スタジオ",
      ctaTeacher: "10秒類題作成とLINE保護者週報",
      statMarginLabel: "ソフトウェア粗利率",
      statBreakEvenUnit: "名の塾生",
      statBreakEvenLabel: "オプション追加での投資回収ライン",
      statTokenLabel: "生徒1人あたり月間推論原価",
      courseBoxBadge: "実装済み受験カリキュラム",
      courseBoxTitle: "コースを選択してページ引用指導を検証",
      enterDemoBtn: "検証する",
    },
    roi: {
      badge: "学習塾オーナー向け 初年度損益試算表",
      titlePrefix: "OEM導入による初年度営業利益試算",
      subtitle: "在籍生徒数と講師人件費から初年度の純増利益を算出します",
      studentsLabel: "現在の在籍生徒数",
      taCountLabel: "質問対応・添削スタッフ数",
      taSalaryLabel: "講師1人あたり月間人件費",
      upsellLabel: "年間AI演習・添削オプション単価",
      line1Saved: "添削・質問対応工数70%削減による人件費圧縮",
      line2Upsell: "在籍生の30%オプション申込による増収",
      line3Cost: "年間OEMライセンス料および推論通信費控除",
      netProfitTitle: "初年度 営業利益純増見込額",
      breakEvenSummaryPrefix: "投資回収ライン：既存塾生のうち ",
      breakEvenSummarySuffix: " 名がオプションを追加するだけで年間ライセンス費を全額回収できます。",
      lockB2bBtn: "導入見積書を作成する",
      redeemBtn: "ライセンスキー認証",
    },
    pricing: {
      badge: "日本市場標準ライセンス体系",
      title: "学習塾OEM契約および個人パス料金表",
      teacherTitle: "講師向け類題作問Pro",
      studentTitle: "受験生記憶定着パス",
      orgTitle: "学習塾OEMホワイトラベル（200席）",
      partnerTitle: "地域販売パートナー（55%配分）",
      perYear: "/ 年",
      buyNow: "申し込む・キー認証",
      lockQuote: "正式見積書をコピー",
      viewPartnerConsole: "パートナー台帳を開く",
    },
  },
  es: {
    code: "es",
    flag: "ES",
    countryLabel: "España y LatAm (EUR)",
    currencyNotice: "Liquidación en EUR y USD vía Stripe y MercadoPago",
    paymentRails: "Stripe Europa + MercadoPago LatAm + Clave Criptográfica Offline",
    monthlyHumanTutorBenchmark: 180,
    b2bOemYearlyPrice: 2990,
    nav: {
      pitch: "Resumen y ROI",
      tutor: "Tutor Socrático",
      classroom: "Aula Interactiva",
      teacher: "Exámenes e Informes",
      admin: "Consola OEM",
      eternal: "Despliegue Edge",
      quickRebrand: "Marca Propia",
      cashierCta: "Licencias",
    },
    hero: {
      compliancePill: "Núcleo comercial Apache-2.0 y MIT sobre arquitectura estática sin caídas",
      instantMonetizePill: "Diseñado para academias MIR, IB, EBAU y oposiciones",
      headlineTop: "Transforma el temario de tu academia en un sistema",
      headlineHighlight: "de tutoría socrática verificable con marca blanca propia",
      subheadline:
        "Integra memoria auditable L1-L3 de DeepTutor, seminarios multi-agente OpenMAIC y repetición espaciada FSRS. Reduce el 70% de corrección manual y fideliza familias por WhatsApp.",
      ctaTutor: "Abrir tutor con citas de página",
      ctaClassroom: "Aula interactiva y estudio de audio",
      ctaTeacher: "Generador de simulacros e informes",
      statMarginLabel: "Margen bruto de software",
      statBreakEvenUnit: "alumnos",
      statBreakEvenLabel: "Umbral de amortización anual",
      statTokenLabel: "Coste mensual IA por alumno",
      courseBoxBadge: "Programas académicos activos",
      courseBoxTitle: "Selecciona una especialidad para auditar el tutor",
      enterDemoBtn: "Abrir",
    },
    roi: {
      badge: "Proyección financiera para directores de academia",
      titlePrefix: "Impacto neto operativo en el primer año",
      subtitle: "Calcula el ahorro en tutorías y los ingresos por suplemento IA",
      studentsLabel: "Alumnos matriculados actuales",
      taCountLabel: "Tutores de corrección y guardia",
      taSalaryLabel: "Coste mensual por tutor",
      upsellLabel: "Suplemento anual Tutor IA 24h (30% conversión)",
      line1Saved: "Ahorro del 70% en horas de tutoría y corrección",
      line2Upsell: "Ingresos adicionales por suplemento IA",
      line3Cost: "Menos licencia anual OEM y consumo de inferencia",
      netProfitTitle: "Beneficio neto adicional estimado (Año 1)",
      breakEvenSummaryPrefix: "Punto de equilibrio: con ",
      breakEvenSummarySuffix: " alumnos suscritos al suplemento se cubre el 100% de la licencia anual.",
      lockB2bBtn: "Generar propuesta comercial",
      redeemBtn: "Verificar clave",
    },
    pricing: {
      badge: "Licenciamiento comercial en EUR y USD",
      title: "Tarifas de marca blanca para academias y pases anuales",
      teacherTitle: "Copiloto Docente Pro",
      studentTitle: "Pase Anual de Retención",
      orgTitle: "Academia Marca Blanca (200 plazas)",
      partnerTitle: "Socio Distribuidor Regional",
      perYear: "/ año",
      buyNow: "Activar pase",
      lockQuote: "Copiar propuesta formal",
      viewPartnerConsole: "Ver libro de socios",
    },
  },
};

export function formatMoney(amount: number, locale: LocaleCode): string {
  const sym =
    locale === "zh"
      ? "¥"
      : locale === "ja"
      ? "¥"
      : locale === "es"
      ? "€"
      : "$";
  return `${sym}${Math.round(amount).toLocaleString()}`;
}

export const GLOBAL_BRAND_PRESETS: Record<LocaleCode, WhiteLabelConfig[]> = {
  zh: [
    {
      id: "zh-deepscholar",
      locale: "zh",
      brandName: "知微精熟研究院",
      brandSubtitle: "高风险考试闭卷核验与学术诊断工作台",
      badgeTag: "旗舰机构工作台",
      theme: "emerald",
      tutorName: "林首席教研官",
      tutorRole: "苏格拉底步进验算与评分核查导师",
      soulPrompt:
        "坚持先诊断错因再启发推导，每次解答强制引用讲义页码，自动写入学情记忆库。",
      imChannelLabel: "微信 · 企微 · 飞书督学联动",
      customDomain: "vip.deepscholar.global",
      currencySymbol: "¥",
      currencyCode: "CNY",
      studentAnnualPrice: 699,
      teacherProPrice: 399,
      orgWhitelabelPrice: 39800,
      orgSeedPrice: 19800,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 7500,
      defaultUpsellTicket: 1980,
      monthlyTokenCostPerStudent: 3,
    },
    {
      id: "zh-ivyprep",
      locale: "zh",
      brandName: "藤校领航国际备考",
      brandSubtitle: "AP · IB · 国际学科精熟考核中心",
      badgeTag: "国际课程样板",
      theme: "royal",
      tutorName: "周学术主任",
      tutorRole: "AP 与国际课程评分判据导师",
      soulPrompt:
        "严格按官方评分判据逐条扣分诊断，生成简明周度精熟报告。",
      imChannelLabel: "家长微信与邮件简报",
      customDomain: "study.ivyprep-academy.com",
      currencySymbol: "¥",
      currencyCode: "CNY",
      studentAnnualPrice: 2980,
      teacherProPrice: 699,
      orgWhitelabelPrice: 49800,
      orgSeedPrice: 24800,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 9000,
      defaultUpsellTicket: 2980,
      monthlyTokenCostPerStudent: 4,
    },
  ],
  en: [
    {
      id: "en-apexmed",
      locale: "en",
      brandName: "ApexScholar",
      brandSubtitle: "Grounded Socratic Diagnostics & Proof-of-Mastery OS",
      badgeTag: "North America & UK Edition",
      theme: "royal",
      tutorName: "Dr. Carter",
      tutorRole: "Chief Socratic & Clinical Examiner",
      soulPrompt:
        "Coach students Socratically using official AP/NBME scoring rubrics, cite exact syllabus page numbers, and schedule FSRS spaced reviews.",
      imChannelLabel: "Discord · WhatsApp · Slack · Web Portal",
      customDomain: "app.apexscholar.io",
      currencySymbol: "$",
      currencyCode: "USD",
      studentAnnualPrice: 249,
      teacherProPrice: 149,
      orgWhitelabelPrice: 4900,
      orgSeedPrice: 2490,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 3200,
      defaultUpsellTicket: 390,
      monthlyTokenCostPerStudent: 1,
    },
    {
      id: "en-oxbridge",
      locale: "en",
      brandName: "Oxbridge Prep Studio",
      brandSubtitle: "Step-Verified Examination & Cohort Accountability",
      badgeTag: "Boutique Academy OEM",
      theme: "emerald",
      tutorName: "Advisor Sterling",
      tutorRole: "Senior AP / IB / SAT Rubric Examiner",
      soulPrompt:
        "Strict rubric-based step-by-step evaluation with parent weekly progress digests.",
      imChannelLabel: "iMessage · WhatsApp · Parent Email Digest",
      customDomain: "portal.oxbridgeprep.co.uk",
      currencySymbol: "$",
      currencyCode: "USD",
      studentAnnualPrice: 299,
      teacherProPrice: 179,
      orgWhitelabelPrice: 5900,
      orgSeedPrice: 2990,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 3600,
      defaultUpsellTicket: 490,
      monthlyTokenCostPerStudent: 1,
    },
  ],
  ja: [
    {
      id: "ja-toshin-oem",
      locale: "ja",
      brandName: "叡智学舎",
      brandSubtitle: "難関大・医学部 記述検証および閉本到達証明基盤",
      badgeTag: "日本学習塾・予備校モデル",
      theme: "crimson",
      tutorName: "佐藤主任講師",
      tutorRole: "記述採点・ソクラテス式対話主任",
      soulPrompt:
        "いきなり答えを教えず、塾専用テキストの該当ページを引用しながら記述答案の減点箇所を指摘し、FSRS忘却曲線に基づき復習を自動予約します。",
      imChannelLabel: "LINE公式アカウント・保護者週報連携",
      customDomain: "juku.deepscholar.jp",
      currencySymbol: "¥",
      currencyCode: "JPY",
      studentAnnualPrice: 29800,
      teacherProPrice: 19800,
      orgWhitelabelPrice: 498000,
      orgSeedPrice: 248000,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 180000,
      defaultUpsellTicket: 29800,
      monthlyTokenCostPerStudent: 120,
    },
  ],
  es: [
    {
      id: "es-aulamed",
      locale: "es",
      brandName: "AulaMagna Iberia",
      brandSubtitle: "Diagnóstico Socrático y Certificación de Dominio",
      badgeTag: "Academias MIR · IB · EBAU",
      theme: "amber",
      tutorName: "Prof. Mateo",
      tutorRole: "Director de Razonamiento y Simulacros",
      soulPrompt:
        "Guía paso a paso mediante preguntas socráticas citando siempre la página exacta del manual oficial de la academia y registrando memoria FSRS.",
      imChannelLabel: "WhatsApp Business · Telegram · Web",
      customDomain: "campus.deepscholar.es",
      currencySymbol: "€",
      currencyCode: "EUR",
      studentAnnualPrice: 179,
      teacherProPrice: 99,
      orgWhitelabelPrice: 2990,
      orgSeedPrice: 1490,
      partnerSplitPercent: 55,
      defaultTaMonthlyCost: 1600,
      defaultUpsellTicket: 240,
      monthlyTokenCostPerStudent: 1,
    },
  ],
};

export const LOCALIZED_EXTRA_COURSES: CoursePack[] = [
  {
    id: "ja-todai-math",
    locales: ["ja", "zh"],
    code: "JP-TODAI-MATH",
    title: "難関国公立・医学部二次数学 · 微積分と極限の記述満点講義",
    category: "日本学習塾・医学部予備校（単価 ¥29,800〜¥98,000/期）",
    marketPositioning:
      "日本の個人塾約5万校が抱える「記述添削できる理系講師不足」を一撃で解決する高単価パック",
    avgTicketNote: "塾生オプション ¥29,800/期 · 9名導入で年間OEM費を即回収",
    speechLang: "ja-JP",
    visualizerType: "calculus-riemann",
    starterPrompts: [
      "置換積分で積分範囲（上下限）を書き換え忘れるとなぜ大幅減点されるのですか？",
      "区分求積法と面積評価（上からの評価・下からの評価）の記述採点基準をソクラテス式で教えて",
      "答案添削をお願いします：∫₀¹ 2x cos(x²)dx = sin(1) - sin(0) = sin(1)",
    ],
    sections: [
      {
        id: "jp-s1",
        pageNumber: 14,
        sectionCode: "§2.1",
        title: "単調性・凹凸を用いた定積分の不等式評価（区分求積・台形近似）",
        summary: "東大・医学部頻出：単調増加と下に凸（f''(x) > 0）を混同しない厳密論証。",
        content:
          "閉区間 [a, b] で連続な関数 f(x) が単調増加（f'(x) > 0）のとき、左リーマン和は定積分 ∫ₐᵇ f(x)dx を下から評価し、右リーマン和は上から評価する。一方、台形近似の大小評価は2階微分 f''(x)（グラフの凹凸）のみで決まる。f''(x) > 0（下に凸）ならば弦は弧の上側にあるため、台形和は真の積分値を過大評価する。二次試験の記述採点では『単調性・凹凸の根拠明記』が配点の半分を占める。",
        keyFormulaOrRule:
          "f'(x) > 0 ⇒ Lₙ < ∫ₐᵇ f(x)dx < Rₙ ／ f''(x) > 0（下に凸）⇒ Tₙ > ∫ₐᵇ f(x)dx",
        examFrequency: "最頻出・記述必出",
        commonTrap: "台形近似の大小理由に f'(x) > 0（単調増加）を書いてしまい論証点0点になるミス！",
      },
      {
        id: "jp-s2",
        pageNumber: 28,
        sectionCode: "§3.4",
        title: "定積分の置換積分における積分区間対応の鉄則",
        summary: "u = g(x) と置いた瞬間に積分区間対応表を明記する減点ゼロ記述法。",
        content:
          "定積分 ∫ₐᵇ f(g(x))g'(x)dx において u = g(x) と置換する場合、du = g'(x)dx と同時に『x : a → b のとき u : g(a) → g(b)』の対応表を必ず答案に明記しなければならない。変数 u の式に元の x の積分区間を残した等式を書くと同値性が崩れ、最終数値が合っていても記述試験では厳しく減点される。",
        keyFormulaOrRule:
          "x: a → b ⇔ u: g(a) → g(b) を宣言してから ∫_{g(a)}^{g(b)} f(u)du へ変形",
        examFrequency: "記述減点ワースト1",
        commonTrap: "置換後に積分区間の上下限を変更し忘れる同値変形エラー。",
      },
    ],
    classroomTitle: "マルチAI対話授業：なぜ計算が合っているのに二次試験で減点されるのか？",
    classroomTurns: [
      {
        id: "jp-c1",
        speaker: "lecturer",
        speakerName: "佐藤主任講師 AI",
        roleBadge: "メイン講師",
        content:
          "左の黒板で分割数 n を動かしてみてください。f(x) = 0.25x² + 1 は下に凸のグラフですね。台形近似に切り替えると、直線が常に曲線の上側を通ることが視覚的に一発で分かります。",
        boardHighlight: "下に凸（f''(x) > 0）における台形近似の上からの評価",
      },
      {
        id: "jp-c2",
        speaker: "assistant",
        speakerName: "AIチューター美咲",
        roleBadge: "理解度チェック",
        content:
          "テキスト [P.14 §2.1] の最重要ポイントです！次の15秒チェックに正解して記述満点ロジックを定着させましょう。",
        checkpointQuestion: {
          prompt:
            "区間 [1, 5] で g'(x) > 0 かつ g''(x) < 0（単調増加かつ上に凸）を満たす関数 g(x) に対し、台形近似 T₄ と真の値 I = ∫₁⁵ g(x)dx の大小関係として正しい記述はどれか？",
          options: [
            "g'(x) > 0 より単調増加なので T₄ > I",
            "g''(x) < 0 よりグラフが上に凸であり、弦が弧の下側にあるため T₄ < I",
            "g''(x) < 0 なので T₄ > I",
            "3階微分の符号が不明なため判定不能",
          ],
          correctIndex: 1,
          explanation:
            "正解！台形近似は2階微分の符号（凹凸）で決まります。g''(x) < 0（上に凸）のとき、2点を結ぶ線分は曲線の下側を通るため T₄ < I となります。",
        },
      },
    ],
    podcastTitle: "通学3分音声ラジオ：東大・医学部数学の採点官が見ている「減点ポイント3選」",
    podcastLines: [
      {
        id: "jpp1",
        host: "A",
        hostName: "佐藤先生",
        timestamp: "00:00",
        text: "おはようございます！今日は国公立二次・医学部数学で、答えは合っているのに半分引かれてしまう危険な記述ミスを3分で解説します。",
      },
      {
        id: "jpp2",
        host: "B",
        hostName: "合格先輩ハルカ",
        timestamp: "00:26",
        text: "一番多いのは置換積分の対応表忘れですよね！t イコール x 二乗と置いたのに積分区間が元のままになっている答案、模試でも本当によく見ます！",
      },
    ],
    defaultVariants: [
      {
        id: "qv-jp-1",
        tier: "L1 基礎定石の確認",
        stem: "定積分 ∫₀² 3x² e^(x³) dx において u = x³ と置換した際、減点されない正しい変形はどれか？",
        options: [
          "∫₀² e^u du = e² - 1",
          "∫₀⁸ e^u du = e⁸ - 1",
          "3 ∫₀⁸ e^u du = 3(e⁸ - 1)",
          "∫₀² 3e^u du = 3(e² - 1)",
        ],
        correctIndex: 1,
        knowledgeTag: "置換積分の区間変更",
        sourcePage: 28,
        rubricAndAnalysis:
          "du = 3x²dx となり、x: 0 → 2 に対応して u: 0 → 8 へ変化するため ∫₀⁸ e^u du = e⁸ - 1 が完全解です。",
        trapWarning: "選択肢Aは上限の8への書き換え忘れによる典型的な失点パターンです。",
      },
    ],
    studentProfile: {
      studentName: "高橋 健太（高校3年・国公立医学部志望）",
      targetGoal: "共通テスト90%＋二次数学記述8割確保",
      currentPredictedScore: "偏差値 71.5（A判定圏内）",
      baselineScore: "入塾時 偏差値 61.0（記述論証での減点多数）",
      studyStreakDays: 29,
      weeklyHoursSaved: 7.5,
      l3SynthesisStrategy:
        "計算力は非常に高い一方、微積分の不等式評価で凹凸条件の明記漏れが見られました。直近2週間のソクラテス式添削により記述減点はゼロに改善。来週はFSRSスケジュールに沿って複素数平面の軌跡条件を強化します。",
      l1Traces: [
        {
          id: "jpl1-1",
          timestamp: "本日 20:15",
          action: "§3.4 置換積分記述演習クリア",
          evidence: "区間対応表を全問で漏れなく明記、所要時間3分40秒",
          sourceRef: "講義録 P.28 §3.4",
          masteryDelta: "+18% 記述完成度",
        },
      ],
      l2Surfaces: [
        {
          id: "jpl2-1",
          concept: "定積分の置換と区間対応明記",
          accuracyRate: 95,
          errorPattern: "記述フォーマット完全定着",
          linkedL1Ids: ["jpl1-1"],
          fsrsStabilityDays: 19.0,
          nextReviewLabel: "7日後に確認テスト",
        },
      ],
    },
  },
  {
    id: "es-mir-med",
    locales: ["es"],
    code: "ES-MIR-CARDIO",
    title: "Examen MIR & IB · Fisiopatología Cardiorrenal y Razonamiento Clínico",
    category: "Academias MIR / Medicina & Bachillerato IB (€179–€2,990)",
    marketPositioning:
      "España y Latinoamérica cuentan con miles de academias de oposiciones, MIR y preparación universitaria con altísima demanda de tutoría 24/7.",
    avgTicketNote: "Suplemento IA €240/curso · Punto de equilibrio en 12 alumnos",
    speechLang: "es-ES",
    visualizerType: "usmle-pathway",
    starterPrompts: [
      "Explícame con método socrático por qué los IECA están contraindicados en la estenosis bilateral de arteria renal.",
      "¿Cómo diferencio el efecto de los AINE frente a los ARA-II sobre la presión glomerular?",
    ],
    sections: [
      {
        id: "es-s1",
        pageNumber: 52,
        sectionCode: "§6.3",
        title: "Autorregulación Glomerular: Arteriola Aferente vs Eferente",
        summary: "Regla de oro MIR: Prostaglandinas dilatan la entrada; Angiotensina II cierra la salida.",
        content:
          "En la estenosis bilateral de la arteria renal, la perfusión renal cae y activa intensamente el sistema renina-angiotensina-aldosterona (SRAA). La Angiotensina II contrae preferentemente la arteriola eferente para mantener la presión hidrostática glomerular y preservar el filtrado glomerular (FG). Si se administra un IECA o ARA-II, se dilata bruscamente la arteriola eferente, desplomando el FG y elevando la creatinina sérica de forma aguda.",
        keyFormulaOrRule:
          "Estenosis Renal Bilateral + IECA ⇒ Dilatación Eferente ⇒ Caída brusca del FG (↑ Creatinina)",
        examFrequency: "Pregunta Estrella MIR",
        commonTrap: "Confundir la vasoconstricción aferente por AINE con la vasodilatación eferente por IECA.",
      },
    ],
    classroomTitle: "Aula Multi-Agente MIR: Domina la Hemodinámica Glomerular en 3 Minutos",
    classroomTurns: [
      {
        id: "es-c1",
        speaker: "lecturer",
        speakerName: "Prof. Mateo IA",
        roleBadge: "Catedrático MIR",
        content:
          "Observad la pizarra interactiva: los AINE cierran la puerta de entrada (aferente), mientras que los IECA abren de par en par la puerta de salida (eferente). En ambos casos, la presión de filtrado cae.",
        boardHighlight: "Control dual de presión intraglomerular",
      },
      {
        id: "es-c2",
        speaker: "assistant",
        speakerName: "Tutora Sofía IA",
        roleBadge: "Control de Dominio",
        content: "Comprobemos el concepto clave de [P.52 §6.3] con un caso clínico tipo MIR:",
        checkpointQuestion: {
          prompt:
            "Varón de 67 años con HTA refractaria y soplo abdominal bilateral inicia enalapril. A los 5 días la creatinina sube de 1.1 a 2.8 mg/dL. ¿Cuál es el mecanismo directo?",
          options: [
            "Vasoconstricción de la arteriola aferente mediada por bradicinina",
            "Dilatación de la arteriola eferente por caída de Angiotensina II",
            "Aumento de la presión hidrostática capilar glomerular",
            "Necrosis tubular aguda inmunomediada",
          ],
          correctIndex: 1,
          explanation:
            "¡Exacto! Al bloquear la síntesis de Angiotensina II con enalapril (IECA), desaparece el tono constrictor eferente imprescindible en la estenosis bilateral, provocando caída aguda del filtrado.",
        },
      },
    ],
    podcastTitle: "Podcast Repaso MIR: Reglas Mnemotécnicas de Nefrología y Cardiología",
    podcastLines: [
      {
        id: "esp1",
        host: "A",
        hostName: "Dr. Mateo",
        timestamp: "00:00",
        text: "¡Bienvenidos a Repaso MIR Express! Hoy blindamos una pregunta fija de todos los simulacros: el doble golpe hemodinámico sobre el glomérulo.",
      },
      {
        id: "esp2",
        host: "B",
        hostName: "Dra. Lucía",
        timestamp: "00:24",
        text: "Recuerda siempre: los AINE bloquean prostaglandinas en la entrada aferente y los IECA relajan la salida eferente. ¡Juntos desploman el filtrado!",
      },
    ],
    defaultVariants: [
      {
        id: "qv-es-1",
        tier: "L2 Trampa Frecuente de Examen",
        stem: "¿Qué combinación farmacológica produce un colapso sinérgico de la presión de filtración glomerular en un paciente deshidratado?",
        options: [
          "Amlodipino + Atorvastatina",
          "Ibuprofeno (AINE) + Enalapril (IECA)",
          "Metoprolol + Omeprazol",
          "Levotiroxina + Paracetamol",
        ],
        correctIndex: 1,
        knowledgeTag: "Fisiopatología Glomerular MIR",
        sourcePage: 52,
        rubricAndAnalysis:
          "El ibuprofeno contrae la arteriola aferente (↓ entrada) y el enalapril dilata la arteriola eferente (↓ resistencia de salida), desplomando la presión glomerular.",
        trapWarning: "Clásica nefrotoxicidad funcional hemodinámica en pacientes hipovolémicos.",
      },
    ],
    studentProfile: {
      studentName: "Carlos M. (Opositor MIR · Medicina)",
      targetGoal: "Percentil 90+ en Simulacros Oficiales MIR",
      currentPredictedScore: "148 Netas Estimadas",
      baselineScore: "112 Netas al Inicio",
      studyStreakDays: 31,
      weeklyHoursSaved: 8.5,
      l3SynthesisStrategy:
        "Dominio del 93% en hemodinámica cardiorrenal. Durante los próximos 7 días el algoritmo FSRS priorizará arritmias y farmacología autonómica.",
      l1Traces: [
        {
          id: "esl1-1",
          timestamp: "Hoy 19:10",
          action: "Caso clínico SRAA resuelto sin pistas",
          evidence: "Identificó mecanismo eferente en 32 segundos citando P.52",
          sourceRef: "Manual P.52 §6.3",
          masteryDelta: "+17% Precisión",
        },
      ],
      l2Surfaces: [
        {
          id: "esl2-1",
          concept: "Autorregulación Glomerular y SRAA",
          accuracyRate: 93,
          errorPattern: "Razonamiento fisiopatológico sólido",
          linkedL1Ids: ["esl1-1"],
          fsrsStabilityDays: 20.5,
          nextReviewLabel: "Repaso en 8 días",
        },
      ],
    },
  },
];

export const GLOBAL_PARTNERS_SEED: ChannelPartnerRecord[] = [
  {
    id: "gp-1",
    name: "IvyLeague Prep Network / Marcus (NYC & Boston)",
    regionFlag: "US",
    channelType: "US Boutique SAT & AP Consultant Syndicate",
    inviteCode: "US-NYC55",
    closedOrgs: 11,
    currencySymbol: "$",
    grossGmv: 53900,
    partnerCommission: 29645,
    platformNetProfit: 23800,
    status: "Top Global Partner",
  },
  {
    id: "gp-2",
    name: "関東個人学習塾経営者会 / 田中代表 (東京・横浜)",
    regionFlag: "JP",
    channelType: "日本の個人塾・予備校コンサル（加盟120校）",
    inviteCode: "JP-TKY88",
    closedOrgs: 8,
    currencySymbol: "¥",
    grossGmv: 3984000,
    partnerCommission: 2191200,
    platformNetProfit: 1750000,
    status: "Gold Partner",
  },
  {
    id: "gp-3",
    name: "华东留学语培校长联盟 / 赵理事",
    regionFlag: "CN",
    channelType: "雅思与 AP 工作室主理人网络（600 余家校区）",
    inviteCode: "CN-SH88",
    closedOrgs: 14,
    currencySymbol: "¥",
    grossGmv: 557200,
    partnerCommission: 306460,
    platformNetProfit: 238800,
    status: "核心区域合伙人",
  },
  {
    id: "gp-4",
    name: "Red Academias MIR & IB / Javier (Madrid & CDMX)",
    regionFlag: "ES",
    channelType: "Consultor EdTech España y México",
    inviteCode: "ES-MAD55",
    closedOrgs: 6,
    currencySymbol: "€",
    grossGmv: 17940,
    partnerCommission: 9867,
    platformNetProfit: 7900,
    status: "Active Partner",
  },
];

export const GLOBAL_OUTREACH_TEMPLATES: Record<
  LocaleCode,
  Array<{ id: string; title: string; tag: string; text: string }>
> = {
  zh: [
    {
      id: "zh-1",
      title: "大中华市场：触达高客单语培、AP 及法考工作室主理人（年费 ¥19,800–¥39,800）",
      tag: "私域直联与行业引荐模板",
      text: "王校长您好，我们已将贵机构公开样章挂载至专属贴牌的 24 小时可溯源伴学督学与家长周报系统。每一次启发与批改均严格标注贵机构讲义页码，可直接分担约 70% 的助教重复答疑工时；存量学员仅需转化 10 单即可覆盖全年系统成本。这是为您生成的专属预览环境，方便发您审阅吗？",
    },
    {
      id: "zh-2",
      title: "跨国汇率与定价套利：面向北美 Prep 中心与日本学习塾同步交付",
      tag: "多市场结算策略（北美单校 $4,900，日本单塾 ¥498,000）",
      text: "通过顶部语种与币种开关一键切换英语或日语环境，按当地人力成本向北美 SAT/AP 辅导中心（$4,900/年，当地私教时薪 $120+，转化 2–8 名学生即回本）与日本个人学习塾（49.8 万日元/年，精准切入理系讲师短缺与 LINE 家长续费报告痛点）提供专属白标方案，通过 LemonSqueezy 或 Stripe 自动完成跨国税务合规与收款。",
    },
  ],
  en: [
    {
      id: "en-1",
      title: "Direct Outreach to Boutique SAT, AP, and USMLE Prep Founders ($4,900/yr)",
      tag: "Executive Briefing / 8-Student Payback",
      text: "Hi [Name], I admire your academy's AP and SAT curriculum. I configured a private [Academy Name] sandbox of our 24/7 Socratic Tutor and Weekly Parent Progress Digest OS. Every explanation cites exact page numbers from your proprietary handouts, reduces manual grading hours by roughly 70%, and covers its entire annual license with 8 student coaching add-ons ($390/student). May I share the live branded workspace link?",
    },
    {
      id: "en-2",
      title: "Regional Distribution Partner Invitation (55% Revenue Share)",
      tag: "Zero-Inventory Institutional Channel",
      text: "We partner with independent EdTech advisors and school networks to equip boutique test-prep academies with their own white-labeled 24/7 Socratic Tutor and Exam Variant Engine ($4,900/yr). Partners receive a 55% instant commission ($2,695 per closed academy via Stripe Connect) plus 20% on annual seat renewals.",
    },
  ],
  ja: [
    {
      id: "ja-1",
      title: "全国の個人学習塾・予備校オーナー様向けご案内文面（年額49.8万円 OEM）",
      tag: "講師採用難の解消と LINE 保護者週報",
      text: "〇〇塾 塾長先生、突然のご連絡失礼いたします。貴塾の指導方針を拝見し、【〇〇塾様 専用ブランド】で稼働する『24時間AI記述添削＆LINE保護者週次レポート基盤』の検証環境をご用意いたしました。貴塾テキストのページ番号を正確に引用してソクラテス式で指導するため、理系講師の採用負担と添削工数を大幅に削減できます。既存塾生9名への演習オプション追加のみで年間導入費を回収可能です。専用プレビューURLをお送りしてもよろしいでしょうか。",
    },
    {
      id: "ja-2",
      title: "在日進学塾（EJU・難関国立・医学部予備校）向け先行導入プラン",
      tag: "高単価専門塾向け即時導入枠",
      text: "東京・大阪のEJU進学塾や医学部予備校では個別記述添削の人件費が最大の経営課題となっています。先行5校限定の導入枠（年額24.8万円）を提示することで、銀行振込またはStripe決済での迅速な導入決定を支援します。",
    },
  ],
  es: [
    {
      id: "es-1",
      title: "Contacto Directo para Directores de Academias MIR, IB y Oposiciones (€2.990/año)",
      tag: "WhatsApp Ejecutivo y LinkedIn",
      text: "Hola [Nombre], he configurado un entorno con la marca de [Nombre de su Academia] de nuestro sistema de Tutoría Socrática 24/7 con citas exactas de página e informes semanales para familias por WhatsApp. Reduce en un 70% las horas de corrección manual y se amortiza íntegramente con solo 12 alumnos suscritos al suplemento anual. ¿Te envío el enlace directo para revisarlo en dos minutos?",
    },
  ],
};
