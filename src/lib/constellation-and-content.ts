import type {
  ComplianceBadgeItem,
  ConstellationSupervisorNode,
  ExecutiveTestimonial,
  Locale,
  ResearchPaperItem,
  SafetyBenchmarkItem,
  ZiWeiModelTier,
} from "@/types/zhongjing";

export const CONSTELLATION_SUPERVISORS: ConstellationSupervisorNode[] = [
  {
    id: "pharm-guard",
    code: "SUP-PHARM-01",
    angleDeg: 0,
    orbitRadius: 145,
    paramsLabel: "210B",
    latencyMs: 48,
    passRate: "99.98%",
    name: {
      "zh-CN": "临床药理与配伍禁忌监督簇",
      "zh-TW": "臨床藥理與配伍禁忌監督簇",
      en: "Pharmacology & DDI Supervisor",
      ja: "臨床薬理・併用禁忌スーパーバイザー",
    },
    role: {
      "zh-CN": "实时核验《中国药典》与国家医保目录药品剂量、肝肾功能折算及相互作用，严禁AI越界开具或修改处方。",
      "zh-TW": "實時核驗《中國藥典》與國家醫保目錄藥品劑量、肝腎功能折算及相互作用，嚴禁AI越界開具或修改處方。",
      en: "Deterministically checks pharmacopeia dosing, renal/hepatic adjustments, and drug interactions while enforcing zero unauthorized prescribing.",
      ja: "薬局方用量・腎肝機能に応じた減量基準・薬物相互作用を確定的に照合し、AIによる無断処方変更を完全遮断します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：凡涉及剂量增减请求 → 100%锁定非处方护栏并转交主治团队",
      "zh-TW": "攔截規則：凡涉及劑量增減請求 → 100%鎖定非處方護欄並轉交主治團隊",
      en: "Rule: Any dosage change query → Hard prescription lock + clinician ticket",
      ja: "制御則：用量変更の相談検知時 → 処方ロック発動＋主治医チームへ連携",
    },
  },
  {
    id: "lab-redline",
    code: "SUP-LABS-02",
    angleDeg: 45,
    orbitRadius: 145,
    paramsLabel: "180B",
    latencyMs: 39,
    passRate: "99.99%",
    name: {
      "zh-CN": "检验危急值与生命体征判读簇",
      "zh-TW": "檢驗危急值與生命體徵判讀簇",
      en: "Critical Labs & Vitals Sentinel",
      ja: "検査パニック値・バイタル監視モデル",
    },
    role: {
      "zh-CN": "毫秒级比对血氧、血压、INR、血钾、肌酐及血糖危急值阈值，结合患者基础病史动态调整预警红线。",
      "zh-TW": "毫秒級比對血氧、血壓、INR、血鉀、肌酐及血糖危急值閾值，結合患者基礎病史動態調整預警紅線。",
      en: "Evaluates SpO2, BP, INR, serum potassium, eGFR, and glucose against patient-specific clinical redlines in under 40ms.",
      ja: "SpO2・血圧・INR・カリウム値・血糖値を患者個別の基礎疾患閾値と40ms未満で照合し緊急度を判定します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：SpO2 < 90% 或 血糖 < 3.9 mmol/L → 立即保持通话并转接值班护师",
      "zh-TW": "攔截規則：SpO2 < 90% 或 血糖 < 3.9 mmol/L → 立即保持通話並轉接值班護師",
      en: "Rule: SpO2 < 90% or Glucose < 3.9 mmol/L → Instant live RN bridge",
      ja: "制御則：SpO2 < 90% または低血糖検知 → 1.6秒で看護師ホットライン接続",
    },
  },
  {
    id: "downplay-probe",
    code: "SUP-PROBE-03",
    angleDeg: 90,
    orbitRadius: 145,
    paramsLabel: "165B",
    latencyMs: 55,
    passRate: "99.92%",
    name: {
      "zh-CN": "高龄患者症状隐瞒深挖探针",
      "zh-TW": "高齡患者症狀隱瞞深挖探針",
      en: "Symptom-Downplay Clinical Probe",
      ja: "高齢者症状過小評価プローブ",
    },
    role: {
      "zh-CN": "针对中国老年患者常说“没事、老毛病、不想麻烦儿女”的语言习惯，通过声学喘息与追问逻辑还原真实病情。",
      "zh-TW": "針對中國老年患者常說「沒事、老毛病、不想麻煩兒女」的語言習慣，通過聲學喘息與追問邏輯還原真實病情。",
      en: "Trained on elder communication nuances where patients minimize pain or dyspnea to avoid burdening family—triggers gentle clinical follow-up questions.",
      ja: "「大丈夫、いつものこと、家族に迷惑をかけたくない」と症状を控えめに話す高齢者の発話特性と呼吸音から潜在悪化を深掘りします。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：检测到模糊敷衍词 + 呼吸音异常 → 强制执行至少2轮结构化追问",
      "zh-TW": "攔截規則：檢測到模糊敷衍詞 + 呼吸音異常 → 強制執行至少2輪結構化追問",
      en: "Rule: Minimizing phrase + acoustic strain → Mandatory 2-step clinical probe",
      ja: "制御則：曖昧な否定＋音響異常検知 → 構造化追加質問2ステップを必須実行",
    },
  },
  {
    id: "psych-crisis",
    code: "SUP-PSYCH-04",
    angleDeg: 135,
    orbitRadius: 145,
    paramsLabel: "150B",
    latencyMs: 41,
    passRate: "100.0%",
    name: {
      "zh-CN": "心理危机与脆弱人群保护中枢",
      "zh-TW": "心理危機與脆弱人群保護中樞",
      en: "Crisis, Self-Harm & Abuse Safeguard",
      ja: "心理危機・脆弱患者保護セーフガード",
    },
    role: {
      "zh-CN": "全天候识别重度抑郁、轻生念头、老年受虐或认知障碍迷失信号，提供零评判温暖守护并直连危机干预专线。",
      "zh-TW": "全天候識別重度抑鬱、輕生念頭、老年受虐或認知障礙迷失信號，提供零評判溫暖守護並直連危機干預專線。",
      en: "Detects suicidal ideation, severe distress, or elder neglect cues with immediate empathetic stabilization and warm human specialist transfer.",
      ja: "希死念慮・重度抑うつ・高齢者虐待や認知機能低下の兆候を即座に検知し、専門危機介入スタッフへ安全に接続します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：危机语义置信度 > 0.15 → 零延迟保持通话陪伴并同步接入心理护师",
      "zh-TW": "攔截規則：危機語義置信度 > 0.15 → 零延遲保持通話陪伴並同步接入心理護師",
      en: "Rule: Crisis signal > 0.15 → Hold warm line open + immediate specialist join",
      ja: "制御則：危機シグナル検知時 → 通話維持のまま専門心理スタッフを即時参画",
    },
  },
  {
    id: "nmpa-pv",
    code: "SUP-GVP-05",
    angleDeg: 180,
    orbitRadius: 145,
    paramsLabel: "195B",
    latencyMs: 62,
    passRate: "99.95%",
    name: {
      "zh-CN": "NMPA药物警戒与不良事件捕获簇",
      "zh-TW": "NMPA藥物警戒與不良事件捕獲簇",
      en: "NMPA GVP Adverse Event Detector",
      ja: "GVP有害事象・副作用自動検知モデル",
    },
    role: {
      "zh-CN": "在日常慢病与临床研究通话中精准捕捉任何新发皮疹、肝酶异常、跌倒或非预期急诊，自动生成MedDRA编码草案。",
      "zh-TW": "在日常慢病與臨床研究通話中精準捕捉任何新發皮疹、肝酶異常、跌倒或非預期急診，自動生成MedDRA編碼草案。",
      en: "Captures spontaneous adverse events during routine conversations, auto-maps MedDRA terms, and triggers 24h pharmacovigilance reporting.",
      ja: "日常会話から副作用・有害事象を自動抽出し、MedDRAコーディング下書きと24時間以内の安全性報告フローを起動します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：用药后新发症状 → 自动采集AE四要素并推送PV安全官审阅",
      "zh-TW": "攔截規則：用藥後新發症狀 → 自動採集AE四要素並推送PV安全官審閱",
      en: "Rule: Post-dose symptom → Capture 4 ICSR fields + PV safety alert",
      ja: "制御則：投薬後新規症状 → ICSR必須4要素を聴取しPV責任者へ即時通知",
    },
  },
  {
    id: "dialect-acoustic",
    code: "SUP-VOICE-06",
    angleDeg: 225,
    orbitRadius: 145,
    paramsLabel: "140B",
    latencyMs: 34,
    passRate: "99.89%",
    name: {
      "zh-CN": "十大方言与老年声学超清前端",
      "zh-TW": "十大方言與老年聲學超清前端",
      en: "Chinese Dialect & Geriatric Speech Engine",
      ja: "多言語・中国主要方言＆高齢者音響エンジン",
    },
    role: {
      "zh-CN": "深度适配粤语、川渝、吴语、闽南、东北等方言口音及假牙含糊发音，支持自然打断与零机械感温润呼吸韵律。",
      "zh-TW": "深度適配粵語、川渝、吳語、閩南、東北等方言口音及假牙含糊發音，支持自然打斷與零機械感溫潤呼吸韻律。",
      en: "Handles Cantonese, Sichuanese, Wu, Hokkien accents and indistinct elder speech with sub-180ms turn-taking and natural barge-in.",
      ja: "広東語・四川語・上海語などの訛りや高齢者の不明瞭な発話を高精度に認識し、自然な相槌と割り込み応答を実現します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：关键药品名识别置信度 < 0.98 → 自动触发温和复述确认",
      "zh-TW": "攔截規則：關鍵藥品名識別置信度 < 0.98 → 自動觸發溫和複述確認",
      en: "Rule: Drug name ASR confidence < 0.98 → Polite read-back verification",
      ja: "制御則：薬剤名音声認識信頼度 < 0.98 → 丁寧な復唱確認を自動実行",
    },
  },
  {
    id: "nhsa-policy",
    code: "SUP-NHSA-07",
    angleDeg: 270,
    orbitRadius: 145,
    paramsLabel: "130B",
    latencyMs: 59,
    passRate: "99.93%",
    name: {
      "zh-CN": "国家医保、集采与门慢政策对齐簇",
      "zh-TW": "國家醫保、集採與門慢政策對齊簇",
      en: "NHSA Reimbursement & SDOH Navigator",
      ja: "医療保険・高額療養・地域福祉ナビゲータ",
    },
    role: {
      "zh-CN": "内置全国31省市门诊慢特病、双通道特药、异地就医备案及城市惠民保规则，化解患者因费用信息差导致的断药。",
      "zh-TW": "內置全國31省市門診慢特病、雙通道特藥、異地就醫備案及城市惠民保規則，化解患者因費用信息差導致的斷藥。",
      en: "Maps provincial outpatient chronic coverage, dual-channel specialty pharmacy access, and cross-province filing to eliminate financial non-adherence.",
      ja: "地域ごとの外来慢性疾患給付・高額薬剤デュアルチャネル・広域受診手続きを照合し、経済的理由による治療中断を防ぎます。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：识别经济顾虑停药 → 自动检索参保地门慢与社区延伸处方补贴",
      "zh-TW": "攔截規則：識別經濟顧慮停藥 → 自動檢索參保地門慢與社區延伸處方補貼",
      en: "Rule: Cost-related gap → Surface local chronic reimbursement pathway",
      ja: "制御則：費用不安の検知時 → 加入保険の給付制度・地域薬局補助を案内",
    },
  },
  {
    id: "pipl-audit",
    code: "SUP-PIPL-08",
    angleDeg: 315,
    orbitRadius: 145,
    paramsLabel: "120B",
    latencyMs: 28,
    passRate: "100.0%",
    name: {
      "zh-CN": "PIPL隐私脱敏与身份核验卫士",
      "zh-TW": "PIPL隱私脫敏與身份核驗衛士",
      en: "PIPL Privacy & Identity Verification Guard",
      ja: "個人情報保護(PIPL)・本人確認ガード",
    },
    role: {
      "zh-CN": "在透露任何个性化检验指标前严格完成双因子温和核身；若为家属代接，自动遵循患者预先授权边界披露信息。",
      "zh-TW": "在透露任何個性化檢驗指標前嚴格完成雙因子溫和核身；若為家屬代接，自動遵循患者預先授權邊界披露信息。",
      en: "Enforces gentle two-factor identity confirmation before disclosing PHI and respects granular family-caregiver consent scopes.",
      ja: "医療情報の開示前に自然な2要素本人確認を徹底し、家族応答時は事前同意スコープ内の情報のみを開示します。",
    },
    deterministicRule: {
      "zh-CN": "拦截规则：未完成核身或非授权代接人 → 100%屏蔽敏感病历字段",
      "zh-TW": "攔截規則：未完成核身或非授權代接人 → 100%屏蔽敏感病歷字段",
      en: "Rule: Unverified recipient → Zero PHI disclosure until authenticated",
      ja: "制御則：本人未確認または未承認代理人 → センシティブ医療情報を完全秘匿",
    },
  },
];

export const ZIWEI_MODEL_TIERS: ZiWeiModelTier[] = [
  {
    id: "ultra",
    badge: "ZIWEI-6.0 ULTRA",
    name: {
      "zh-CN": "紫微 6.0 · 旗舰星群版",
      "zh-TW": "紫微 6.0 · 旗艦星群版",
      en: "ZiWei 6.0 · Ultra",
      ja: "紫微 6.0・Ultra",
    },
    tagline: {
      "zh-CN": "面向多病共存重症随访、肿瘤化疗管理与复杂药物警戒",
      "zh-TW": "面向多病共存重症隨訪、腫瘤化療管理與複雜藥物警戒",
      en: "Our most capable constellation for complex multi-morbid & oncology care",
      ja: "多疾患併存・腫瘍化学療法・高度な安全性監視向け最上位モデル",
    },
    creditsPerHr: "1.5",
    priceDisplay: {
      "zh-CN": "¥98",
      "zh-TW": "NT$440",
      en: "$14.00",
      ja: "¥2,100",
    },
    priceUnit: {
      "zh-CN": "/ 通话小时（医联体集采价低至）",
      "zh-TW": "/ 通話小時（醫聯體集採價低至）",
      en: "/ active call hr, consortium volume",
      ja: "/ 通話時間（病院グループ契約単価）",
    },
    latencySla: "165ms",
    supervisorsActive: "32 / 32 全量专科监督簇",
    highlighted: true,
    workloads: {
      "zh-CN": [
        "冠脉搭桥/支架、心衰与慢阻肺高危出院管理",
        "肿瘤日间化疗不良反应分级与心理共情疏导",
        "创新药III期临床试验与NMPA GVP不良事件捕获",
      ],
      "zh-TW": [
        "冠脈搭橋/支架、心衰與慢阻肺高危出院管理",
        "腫瘤日間化療不良反應分級與心理共情疏導",
        "創新藥III期臨床試驗與NMPA GVP不良事件捕獲",
      ],
      en: [
        "Post-PCI, Heart Failure & AECOPD high-acuity recovery",
        "Oncology chemotherapy toxicity & psycho-social support",
        "Phase III trials & NMPA GVP pharmacovigilance capture",
      ],
      ja: [
        "PCI術後・心不全・重症COPDの退院後ハイリスク管理",
        "外来化学療法の副作用トリアージと心理的サポート",
        "第III相治験およびGVP有害事象リアルタイム収集",
      ],
    },
  },
  {
    id: "pro",
    badge: "ZIWEI-6.0 PRO",
    name: {
      "zh-CN": "紫微 6.0 · 临床专科版",
      "zh-TW": "紫微 6.0 · 臨床專科版",
      en: "ZiWei 6.0 · Pro",
      ja: "紫微 6.0・Pro",
    },
    tagline: {
      "zh-CN": "面向三甲专科常规院后随访、术后康复与慢病精细化达标",
      "zh-TW": "面向三甲專科常規院後隨訪、術後康復與慢病精細化達標",
      en: "Purpose-built for specialty clinical pathways & surgical ERAS recovery",
      ja: "専門診療科の退院後パス・術後ERASリハビリ・慢性疾患管理向け",
    },
    creditsPerHr: "1.0",
    priceDisplay: {
      "zh-CN": "¥68",
      "zh-TW": "NT$305",
      en: "$9.50",
      ja: "¥1,450",
    },
    priceUnit: {
      "zh-CN": "/ 通话小时（医联体集采价低至）",
      "zh-TW": "/ 通話小時（醫聯體集採價低至）",
      en: "/ active call hr, consortium volume",
      ja: "/ 通話時間（病院グループ契約単価）",
    },
    latencySla: "150ms",
    supervisorsActive: "24 核心专科监督簇",
    workloads: {
      "zh-CN": [
        "骨科关节置换ERAS康复打卡与疼痛跟踪",
        "2型糖尿病、高血压、慢性肾病纵向营养与用药管理",
        "消化内镜/日间手术院前病史采集与清肠指导",
      ],
      "zh-TW": [
        "骨科關節置換ERAS康復打卡與疼痛跟蹤",
        "2型糖尿病、高血壓、慢性腎病縱向營養與用藥管理",
        "消化內鏡/日間手術院前病史採集與清腸指導",
      ],
      en: [
        "Orthopedic joint replacement ERAS mobility tracking",
        "Longitudinal diabetes, hypertension & CKD care management",
        "Pre-endoscopy & ambulatory surgery clinical intake",
      ],
      ja: [
        "人工関節置換術後のERASリハビリ進捗・疼痛モニタリング",
        "糖尿病・高血圧・CKDの長期栄養・服薬フォロー",
        "内視鏡・日帰り手術の事前問診および前処置指導",
      ],
    },
  },
  {
    id: "flash",
    badge: "ZIWEI-6.0 FLASH",
    name: {
      "zh-CN": "紫微 6.0 · 公卫敏捷版",
      "zh-TW": "紫微 6.0 · 公衛敏捷版",
      en: "ZiWei 6.0 · Flash",
      ja: "紫微 6.0・Flash",
    },
    tagline: {
      "zh-CN": "面向城市早癌筛查、基层公卫家医签约与健康险会员关怀",
      "zh-TW": "面向城市早癌篩查、基層公衛家醫簽約與健康險會員關懷",
      en: "High-efficiency clinical outreach for preventive screening & primary care",
      ja: "がん検診勧奨・地域かかりつけ医連携・健保加入者ケア向け高速版",
    },
    creditsPerHr: "0.5",
    priceDisplay: {
      "zh-CN": "¥35",
      "zh-TW": "NT$158",
      en: "$4.90",
      ja: "¥750",
    },
    priceUnit: {
      "zh-CN": "/ 通话小时（医联体集采价低至）",
      "zh-TW": "/ 通話小時（醫聯體集採價低至）",
      en: "/ active call hr, consortium volume",
      ja: "/ 通話時間（病院グループ契約単価）",
    },
    latencySla: "135ms",
    supervisorsActive: "16 公卫与安全监督簇",
    workloads: {
      "zh-CN": [
        "结直肠癌FIT、乳腺钼靶与宫颈癌两癌筛查动员",
        "65岁以上老年年度健康体检与慢病季度随访",
        "气象灾害高危慢病患者分钟级并发预警外呼",
      ],
      "zh-TW": [
        "結直腸癌FIT、乳腺鉬靶與宮頸癌兩癌篩查動員",
        "65歲以上老年年度健康體檢與慢病季度隨訪",
        "氣象災害高危慢病患者分鐘級並發預警外呼",
      ],
      en: [
        "Colorectal FIT, mammography & cervical screening campaigns",
        "65+ senior wellness outreach & quarterly chronic check-ins",
        "Severe weather rapid outreach for vulnerable populations",
      ],
      ja: [
        "大腸がん・乳がん検診の受診勧奨アウトリーチ",
        "65歳以上高齢者健診および四半期ごとの慢性疾患確認",
        "災害発生時の要配慮患者への一斉安否確認コール",
      ],
    },
  },
  {
    id: "nano",
    badge: "ZIWEI-6.0 NANO",
    name: {
      "zh-CN": "紫微 6.0 · 院务轻量版",
      "zh-TW": "紫微 6.0 · 院務輕量版",
      en: "ZiWei 6.0 · Nano",
      ja: "紫微 6.0・Nano",
    },
    tagline: {
      "zh-CN": "面向超高并发门诊预约确认、医保异地备案指引与满意度回访",
      "zh-TW": "面向超高並發門診預約確認、醫保異地備案指引與滿意度回訪",
      en: "Ultra-low cost administrative & scheduling workflows with full safety rails",
      ja: "外来予約調整・医療保険手続き案内・退院後満足度調査向け軽量版",
    },
    creditsPerHr: "0.25",
    priceDisplay: {
      "zh-CN": "¥18",
      "zh-TW": "NT$80",
      en: "$2.50",
      ja: "¥380",
    },
    priceUnit: {
      "zh-CN": "/ 通话小时（医联体集采价低至）",
      "zh-TW": "/ 通話小時（醫聯體集採價低至）",
      en: "/ active call hr, consortium volume",
      ja: "/ 通話時間（病院グループ契約単価）",
    },
    latencySla: "118ms",
    supervisorsActive: "10 边界与红线熔断簇",
    workloads: {
      "zh-CN": [
        "专家门诊/检查改约、爽约预防与候补递补通知",
        "跨省异地就医备案、门慢认定材料与商保直付答疑",
        "国家公立医院绩效考核（国考）患者满意度随访",
      ],
      "zh-TW": [
        "專家門診/檢查改約、爽約預防與候補遞補通知",
        "跨省異地就醫備案、門慢認定材料與商保直付答疑",
        "國家公立醫院績效考核（國考）患者滿意度隨訪",
      ],
      en: [
        "Outpatient appointment scheduling & no-show backfill",
        "Cross-province medical insurance filing & direct-billing Q&A",
        "National hospital performance patient experience surveys",
      ],
      ja: [
        "専門外来・検査予約のリマインドとキャンセル枠補充",
        "広域医療保険申請手続きおよび民間保険直接支払いの案内",
        "病院機能評価に基づく退院患者エクスペリエンス調査",
      ],
    },
  },
];

export const SAFETY_BENCHMARKS: SafetyBenchmarkItem[] = [
  {
    id: "ziwei-6",
    modelName: {
      "zh-CN": "紫微 6.0 (7.4T 安全星群架构)",
      "zh-TW": "紫微 6.0 (7.4T 安全星群架構)",
      en: "ZiWei 6.0 (7.4T Safety Constellation)",
      ja: "紫微 6.0（7.4兆パラメータ安全星群構造）",
    },
    paramsTag: "671B Primary + 32 Supervisors",
    correctAdvicePct: 99.91,
    benignDeviationPct: 0.09,
    minorHarmPct: 0.0,
    severeHarmPct: 0.0,
    isFlagship: true,
  },
  {
    id: "ziwei-5",
    modelName: {
      "zh-CN": "紫微 5.0 (4.8T 星群架构)",
      "zh-TW": "紫微 5.0 (4.8T 星群架構)",
      en: "ZiWei 5.0 (4.8T Constellation)",
      ja: "紫微 5.0（4.8兆星群モデル）",
    },
    paramsTag: "4.8T Constellation",
    correctAdvicePct: 99.54,
    benignDeviationPct: 0.44,
    minorHarmPct: 0.02,
    severeHarmPct: 0.0,
  },
  {
    id: "ziwei-3",
    modelName: {
      "zh-CN": "紫微 3.0 (初代临床星群)",
      "zh-TW": "紫微 3.0 (初代臨床星群)",
      en: "ZiWei 3.0 (Early Clinical Constellation)",
      ja: "紫微 3.0（初期臨床コンステレーション）",
    },
    paramsTag: "1.8T Constellation",
    correctAdvicePct: 98.42,
    benignDeviationPct: 1.49,
    minorHarmPct: 0.09,
    severeHarmPct: 0.0,
  },
  {
    id: "human-rn",
    modelName: {
      "zh-CN": "人类临床常规电话随访对照基线",
      "zh-TW": "人類臨床常規電話隨訪對照基線",
      en: "Standard Human Routine Follow-Up Baseline",
      ja: "従来の人間による通常電話フォロー基準値",
    },
    paramsTag: "9,200+ Licensed Clinician Cohort",
    correctAdvicePct: 94.8,
    benignDeviationPct: 4.85,
    minorHarmPct: 0.35,
    severeHarmPct: 0.0,
    isHumanBaseline: true,
  },
  {
    id: "generic-llm",
    modelName: {
      "zh-CN": "未加专科监督簇的通用前沿大模型",
      "zh-TW": "未加專科監督簇的通用前沿大模型",
      en: "Single Unsupervised Frontier Base LLM",
      ja: "専門監督層なしの汎用フロンティアLLM",
    },
    paramsTag: "Single Monolithic Model",
    correctAdvicePct: 86.2,
    benignDeviationPct: 10.9,
    minorHarmPct: 2.4,
    severeHarmPct: 0.5,
  },
];

export const RESEARCH_PAPERS: ResearchPaperItem[] = [
  {
    id: "ziwei-trade-speech",
    date: "2026.09",
    category: "speech",
    code: "ZJ-RES-2026-09",
    title: {
      "zh-CN": "TRADE-CN：面向中国十大方言与高龄患者的低延迟临床语音解码架构",
      "zh-TW": "TRADE-CN：面向中國十大方言與高齡患者的低延遲臨床語音解碼架構",
      en: "TRADE-CN: Transducer-Augmented Acoustic Decoding for Chinese Dialects & Elder Patients",
      ja: "TRADE-CN：中国主要10方言および高齢患者に向けた超低遅延臨床音声デコーダ",
    },
    abstract: {
      "zh-CN":
        "联合三甲老年医学科在12万通真实随访中验证，将含糊发音与方言药品名识别字错率降低63%，端到端响应中位延迟压缩至162ms。",
      "zh-TW":
        "聯合三甲老年醫學科在12萬通真實隨訪中驗證，將含糊發音與方言藥品名識別字錯率降低63%，端到端響應中位延遲壓縮至162ms。",
      en: "Validated across 120K geriatric calls, reducing dialect medication-name WER by 63% while achieving 162ms median conversational turn latency.",
      ja: "高齢者外来12万件の通話で検証し、方言・薬剤名の誤認識率を63%削減しつつ応答遅延中央値162msを達成。",
    },
    clinicalPartner: {
      "zh-CN": "联合发表：中净声学实验室 × 岭南老年医学中心",
      "zh-TW": "聯合發表：中淨聲學實驗室 × 嶺南老年醫學中心",
      en: "ZhongJing Acoustic Lab × Lingnan Geriatric Center",
      ja: "中浄音響研究所 × 嶺南老年医学センター共同研究",
    },
    metricBadge: {
      "zh-CN": "WER -63% · 162ms",
      "zh-TW": "WER -63% · 162ms",
      en: "WER -63% · 162ms",
      ja: "誤認識 -63% · 162ms",
    },
  },
  {
    id: "deterministic-constellation",
    date: "2026.07",
    category: "safety",
    code: "ZJ-RES-2026-07",
    title: {
      "zh-CN": "紫微6.0确定性多智能体互审：3.68亿次真实医患交互中的零严重伤害证明",
      "zh-TW": "紫微6.0確定性多智能體互審：3.68億次真實醫患交互中的零嚴重傷害證明",
      en: "Deterministic Multi-Supervisor Verification Across 368M Clinical Voice Interactions",
      ja: "紫微6.0確定的マルチ監督検証：3.68億件の実臨床対話における重篤有害事象ゼロの実証",
    },
    abstract: {
      "zh-CN":
        "系统阐述671B主对话模型与32个药理、危急值、心理保护专科小模型实时并行投票与一票否决熔断机制。",
      "zh-TW":
        "系統闡述671B主對話模型與32個藥理、危急值、心理保護專科小模型實時並行投票與一票否決熔斷機制。",
      en: "Details how 32 parallel specialist models deterministically audit every clinical claim with hard veto power before audio synthesis.",
      ja: "671B主モデルに対し32の薬理・バイタル・心理保護専門モデルが音声合成前に拒否権付き並列監査を行うアーキテクチャを公開。",
    },
    clinicalPartner: {
      "zh-CN": "联合发表：中净安全对齐院 × 京津冀协和循证中心",
      "zh-TW": "聯合發表：中淨安全對齊院 × 京津冀協和循證中心",
      en: "ZhongJing Safety Alignment × Union EBM Institute",
      ja: "中浄安全性アライメント部門 × 協和EBMセンター",
    },
    metricBadge: {
      "zh-CN": "99.91% 临床准确率",
      "zh-TW": "99.91% 臨床準確率",
      en: "99.91% Clinical Accuracy",
      ja: "臨床正確率 99.91%",
    },
  },
  {
    id: "manifold-kv-chronic",
    date: "2026.05",
    category: "inference",
    code: "ZJ-RES-2026-05",
    title: {
      "zh-CN": "ManifoldKV-Med：支持跨年度慢病病程无损记忆的流形键值压缩算法",
      "zh-TW": "ManifoldKV-Med：支持跨年度慢病病程無損記憶的流形鍵值壓縮算法",
      en: "ManifoldKV-Med: Training-Free KV Compression for Multi-Year Patient Longitudinal Memory",
      ja: "ManifoldKV-Med：複数年にわたる慢性疾患カルテ記憶を無損失保持するKVキャッシュ圧縮",
    },
    abstract: {
      "zh-CN":
        "在不损失历史化验异常值与药物过敏红线的前提下，将超长纵向病历上下文显存占用降低78%，支持院内信创服务器集群高并发运行。",
      "zh-TW":
        "在不損失歷史化驗異常值與藥物過敏紅線的前提下，將超長縱向病歷上下文顯存佔用降低78%，支援院內信創伺服器集群高並發運行。",
      en: "Cuts KV-cache memory by 78% over 50+ historical follow-up calls while preserving 100% recall on drug allergies and critical lab history.",
      ja: "過去50回以上の通話履歴におけるアレルギー・異常検査値の再現率100%を維持したままVRAM使用量を78%削減。",
    },
    clinicalPartner: {
      "zh-CN": "中净系统工程部 · 国家信创算力联合实验室",
      "zh-TW": "中淨系統工程部 · 國家信創算力聯合實驗室",
      en: "ZhongJing Systems × Sovereign Compute Lab",
      ja: "中浄システム工学部門・国産計算基盤共同ラボ",
    },
    metricBadge: {
      "zh-CN": "显存占用 -78%",
      "zh-TW": "顯存佔用 -78%",
      en: "-78% KV Memory",
      ja: "メモリ消費 -78%",
    },
  },
  {
    id: "heart-cn-empathy",
    date: "2026.02",
    category: "benchmarks",
    code: "ZJ-RES-2026-02",
    title: {
      "zh-CN": "HEART-CN：面向肿瘤与姑息护理场景的护患情绪支持双盲评测基准",
      "zh-TW": "HEART-CN：面向腫瘤與姑息護理場景的護患情緒支持雙盲評測基準",
      en: "HEART-CN: Unified Clinician-Rated Benchmark for Emotional Support in Oncology Dialogues",
      ja: "HEART-CN：腫瘍・緩和ケア対話における感情的サポート能力の二重盲検評価ベンチマーク",
    },
    abstract: {
      "zh-CN":
        "由640名肿瘤专科护师与临床心理师构建的中文医疗共情评测集，衡量倾听温度、非评判性回应与恰当转介边界。",
      "zh-TW":
        "由640名腫瘤專科護師與臨床心理師構建的中文醫療共情評測集，衡量傾聽溫度、非評判性回應與恰當轉介邊界。",
      en: "Co-authored with 640 oncology nurses and psycho-oncologists to benchmark warmth, non-judgmental listening, and safe human referral.",
      ja: "腫瘍専門看護師・臨床心理士640名と共同構築した医療共感評価指標。傾聴の温かさと適切な専門家紹介を定量化。",
    },
    clinicalPartner: {
      "zh-CN": "中净人文医学组 × 华东肿瘤护理学会",
      "zh-TW": "中淨人文醫學組 × 華東腫瘤護理學會",
      en: "ZhongJing Humanities × East China Oncology Nursing",
      ja: "中浄医療人文学グループ × 華東腫瘍看護学会",
    },
    metricBadge: {
      "zh-CN": "共情盲评 99.4分",
      "zh-TW": "共情盲評 99.4分",
      en: "99.4 Empathy Blind Score",
      ja: "盲検共感スコア 99.4",
    },
  },
];

export const EXECUTIVE_TESTIMONIALS: ExecutiveTestimonial[] = [
  {
    id: "lin-wanqing",
    image: "/images/portrait-lin-wanqing.jpg",
    quote: {
      "zh-CN":
        "“对三甲医院而言，医疗AI的安全绝不是一句公关口号，而是每一秒钟都在运行的临床纪律。中净‘紫微星群’把我们心内科与呼吸科的出院随访触达率从31%提升到了97%，并且实现了零越界处方、零漏报危急值。”",
      "zh-TW":
        "「對三甲醫院而言，醫療AI的安全絕不是一句公關口號，而是每一秒鐘都在運行的臨床紀律。中淨『紫微星群』把我們心內科與呼吸科的出院隨訪觸達率從31%提升到了97%，並且實現了零越界處方、零漏報危急值。」",
      en: "“In tertiary medicine, AI safety is never a press release—it is a clinical discipline practiced on every single call. ZhongJing lifted our post-discharge reach from 31% to 97% with zero unauthorized prescriptions and zero missed critical escalations.”",
      ja: "「高度急性期病院において、医療AIの安全性はスローガンではなく毎秒実践される臨床規律そのものです。『中浄』は退院後フォロー到達率を31%から97%へ引き上げ、無断処方ゼロ・重症兆候見逃しゼロを達成しました。」",
    },
    name: {
      "zh-CN": "林婉清 教授 · 医学博士",
      "zh-TW": "林婉清 教授 · 醫學博士",
      en: "Prof. Lin Wanqing, MD, PhD",
      ja: "林 婉清 教授・医学博士",
    },
    role: {
      "zh-CN": "首席医疗信息官 (CMIO) 兼心血管内科主任医师",
      "zh-TW": "首席醫療信息官 (CMIO) 兼心血管內科主任醫師",
      en: "Chief Medical Information Officer & Director of Cardiology",
      ja: "最高医療情報責任者 (CMIO)・循環器内科主任教授",
    },
    institution: {
      "zh-CN": "华东协和临床医学中心",
      "zh-TW": "華東協和臨床醫學中心",
      en: "East China Union Clinical Medical Center",
      ja: "華東協和臨床医学センター",
    },
    impactStat: {
      "zh-CN": "30天再入院率下降 32.8%",
      "zh-TW": "30天再入院率下降 32.8%",
      en: "-32.8% 30-Day Readmissions",
      ja: "30日再入院率 -32.8%",
    },
  },
  {
    id: "chen-jingzhou",
    image: "/images/portrait-chen-jingzhou.jpg",
    quote: {
      "zh-CN":
        "“我们的专科护士长已经把‘小净’当作护理团队不可或缺的一员。它接管了海量重复的术前清肠指导、慢病用药核对和公卫建档，把宝贵的床旁时间真正还给了需要双手与眼神温度的重症患者。”",
      "zh-TW":
        "「我們的專科護士長已經把『小淨』當作護理團隊不可或缺的一員。它接管了海量重複的術前清腸指導、慢病用藥核對和公衛建檔，把寶貴的床旁時間真正還給了需要雙手與眼神溫度的重症患者。」",
      en: "“Our head nurses already treat XiaoJing as a trusted member of the care team. By taking over pre-visit prep and medication reconciliation at massive scale, she gives our clinicians back thousands of hours for high-acuity bedside care.”",
      ja: "「病棟の看護師長たちはすでに『小浄』をケアチームの頼れる一員と呼んでいます。内視鏡前処置や服薬確認を大規模に担うことで、看護師がベッドサイドの重症ケアに集中できる時間を取り戻しました。」",
    },
    name: {
      "zh-CN": "陈景舟 博士",
      "zh-TW": "陳景舟 博士",
      en: "Dr. Chen Jingzhou",
      ja: "陳 景舟 博士",
    },
    role: {
      "zh-CN": "医疗集团常务副院长 · 护理与患者运营负责人",
      "zh-TW": "醫療集團常務副院長 · 護理與患者運營負責人",
      en: "Executive Vice President, Clinical Operations & Nursing",
      ja: "医療グループ常務副院長・看護および患者オペレーション統括",
    },
    institution: {
      "zh-CN": "长三角申康瑞华医联体（辖18家院区）",
      "zh-TW": "長三角申康瑞華醫聯體（轄18家院區）",
      en: "Yangtze Delta Shenkang Ruihua Health System (18 Campuses)",
      ja: "長江デルタ申康瑞華医療コンソーシアム（18病院）",
    },
    impactStat: {
      "zh-CN": "每月释放 41,000+ 护师工时",
      "zh-TW": "每月釋放 41,000+ 護師工時",
      en: "41,000+ Nursing Hrs Saved / Mo",
      ja: "月間41,000時間以上の看護工数創出",
    },
  },
  {
    id: "zhou-mingxuan",
    image: "/images/portrait-zhou-mingxuan.jpg",
    quote: {
      "zh-CN":
        "“在肿瘤创新药全国多中心RWE研究与药物警戒中，中净天枢指挥舱让我们第一次实现了99.94%的不良事件主动捕获完整度，同时全链路符合NMPA GVP与《个人信息保护法》本地化审计要求。”",
      "zh-TW":
        "「在腫瘤創新藥全國多中心RWE研究與藥物警戒中，中淨天樞指揮艙讓我們第一次實現了99.94%的不良事件主動捕獲完整度，同時全鏈路符合NMPA GVP與《個人信息保護法》本地化審計要求。」",
      en: "“Across nationwide oncology RWE studies and pharmacovigilance, ZhongJing's Command HUD delivered 99.94% adverse-event capture completeness while meeting every NMPA GVP and PIPL sovereign data audit standard.”",
      ja: "「オンコロジー新薬の多施設RWE研究とファーマコビジランスにおいて、中浄のコマンドHUDは有害事象捕捉率99.94%を達成し、NMPA GVPおよび個人情報保護法の厳格な監査要件を完全に満たしています。」",
    },
    name: {
      "zh-CN": "周明萱 医学博士",
      "zh-TW": "周明萱 醫學博士",
      en: "Dr. Zhou Mingxuan, MD",
      ja: "周 明萱 医学博士",
    },
    role: {
      "zh-CN": "全球临床开发与药物警戒高级副总裁",
      "zh-TW": "全球臨床開發與藥物警戒高級副總裁",
      en: "SVP, Clinical Development & Global Pharmacovigilance",
      ja: "臨床開発・グローバル安全性管理担当上級副社長",
    },
    institution: {
      "zh-CN": "百济恒创生物医药研究院（上海张江）",
      "zh-TW": "百濟恆創生物醫藥研究院（上海張江）",
      en: "Baiji Hengchuang Biopharma Institute · Zhangjiang",
      ja: "百済恒創バイオ医薬研究院（上海張江）",
    },
    impactStat: {
      "zh-CN": "SAE 24h 上报率 100%",
      "zh-TW": "SAE 24h 上報率 100%",
      en: "100% On-Time 24h SAE Reporting",
      ja: "24時間以内SAE報告率 100%",
    },
  },
];

export const COMPLIANCE_BADGES: ComplianceBadgeItem[] = [
  {
    id: "mlps-3",
    code: "GB/T 22239-2019",
    title: {
      "zh-CN": "网络安全等级保护三级",
      "zh-TW": "網絡安全等級保護三級",
      en: "China MLPS Level 3 Certified",
      ja: "中国サイバーセキュリティ等級保護第3級",
    },
    authority: {
      "zh-CN": "公安部信息安全等级保护测评认证（最高非涉密医疗级）",
      "zh-TW": "公安部信息安全等級保護測評認證（最高非涉密醫療級）",
      en: "Highest hospital-grade sovereign network security certification",
      ja: "医療機関向け最高水準ネットワークセキュリティ認証",
    },
    scope: {
      "zh-CN": "院内私有化一体机 / 信创专有云",
      "zh-TW": "院內私有化一體機 / 信創專有雲",
      en: "On-Prem Appliance & Sovereign Cloud",
      ja: "院内オンプレミス・ソブリンクラウド",
    },
  },
  {
    id: "nhc-filing",
    code: "NHC-MED-AI-2026",
    title: {
      "zh-CN": "国家卫健委临床AI应用备案",
      "zh-TW": "國家衛健委臨床AI應用備案",
      en: "NHC Clinical AI Governance Filing",
      ja: "国家衛生健康委員会・医療AI臨床応用届出済",
    },
    authority: {
      "zh-CN": "严格遵循《卫生健康行业人工智能应用场景参考指引》非诊断规范",
      "zh-TW": "嚴格遵循《衛生健康行業人工智能應用場景參考指引》非診斷規範",
      en: "Aligned with National Health Commission non-diagnostic AI guardrails",
      ja: "非診断・非処方の医療AI運用ガイドライン完全準拠",
    },
    scope: {
      "zh-CN": "零独立诊断 · 零违规处方",
      "zh-TW": "零獨立診斷 · 零違規處方",
      en: "Zero Autonomous Dx or Rx",
      ja: "自律診断ゼロ・無断処方ゼロ",
    },
  },
  {
    id: "pipl-dsl",
    code: "PIPL & DSL",
    title: {
      "zh-CN": "个保法与数据安全法脱敏认证",
      "zh-TW": "個保法與數據安全法脫敏認證",
      en: "PIPL & Data Security Law De-ID",
      ja: "個人情報保護法(PIPL)・データ安全法準拠",
    },
    authority: {
      "zh-CN": "医疗敏感个人信息全链路国密SM4加密、声纹实时脱敏与境内存储",
      "zh-TW": "醫療敏感個人信息全鏈路國密SM4加密、聲紋實時脫敏與境內存儲",
      en: "SM4 encryption, voiceprint de-identification & strict in-region residency",
      ja: "SM4暗号化・声紋リアルタイム匿名化・域内データ保管",
    },
    scope: {
      "zh-CN": "100% 境内合规驻留",
      "zh-TW": "100% 境內合規駐留",
      en: "100% Sovereign Data Residency",
      ja: "100% 域内データレジデンシー",
    },
  },
  {
    id: "nmpa-gvp",
    code: "NMPA GVP / E2B",
    title: {
      "zh-CN": "NMPA 药物警戒 GVP 合规",
      "zh-TW": "NMPA 藥物警戒 GVP 合規",
      en: "NMPA GVP & ICH E2B(R3) Ready",
      ja: "NMPA GVP・ICH E2B(R3) 薬事適合",
    },
    authority: {
      "zh-CN": "满足国家药监局上市许可持有人(MAH)不良事件收集与审计追踪核查",
      "zh-TW": "滿足國家藥監局上市許可持有人(MAH)不良事件收集與審計追蹤核查",
      en: "Full auditability for biopharma MAH adverse event intake & inspection",
      ja: "製造販売後安全性調査の有害事象収集および監査証跡に対応",
    },
    scope: {
      "zh-CN": "不可篡改双轨审计链",
      "zh-TW": "不可篡改雙軌審計鏈",
      en: "Immutable Dual-Track Audit Log",
      ja: "改ざん不能デュアル監査ログ",
    },
  },
  {
    id: "emr-lv7",
    code: "EMR LEVEL 7",
    title: {
      "zh-CN": "电子病历分级评价七级互联",
      "zh-TW": "電子病歷分級評價七級互聯",
      en: "Hospital EMR Level-7 Interop",
      ja: "電子カルテ成熟度レベル7相互運用対応",
    },
    authority: {
      "zh-CN": "国家医院信息互联互通标准化成熟度五级乙等/电子病历七级无缝对接",
      "zh-TW": "國家醫院信息互聯互通標準化成熟度五級乙等/電子病歷七級無縫對接",
      en: "Native HL7 FHIR & hospital information bus integration",
      ja: "HL7 FHIRおよび主要HIS統合バスとのネイティブ連携",
    },
    scope: {
      "zh-CN": "HIS / LIS / 护理站双向闭环",
      "zh-TW": "HIS / LIS / 護理站雙向閉環",
      en: "Bi-directional HIS/LIS Sync",
      ja: "HIS・LIS・看護システム双方向同期",
    },
  },
  {
    id: "iso-27799",
    code: "ISO 27799 / 27001",
    title: {
      "zh-CN": "ISO 27799 医疗健康信息安全",
      "zh-TW": "ISO 27799 醫療健康信息安全",
      en: "ISO 27799 Health InfoSec",
      ja: "ISO 27799 医療情報セキュリティ認証",
    },
    authority: {
      "zh-CN": "国际健康信息学安全管理体系与 ISO/IEC 27701 隐私信息体系双认证",
      "zh-TW": "國際健康信息學安全管理體系與 ISO/IEC 27701 隱私信息體系雙認證",
      en: "Certified healthcare informatics security & privacy controls",
      ja: "医療情報セキュリティおよびISO 27701プライバシー管理認証",
    },
    scope: {
      "zh-CN": "SAML SSO · 细粒度伦理隔离墙",
      "zh-TW": "SAML SSO · 細粒度倫理隔離牆",
      en: "SAML SSO & Ethical Data Walls",
      ja: "SAML SSO・倫理データ隔壁制御",
    },
  },
  {
    id: "iso-42001",
    code: "ISO/IEC 42001",
    title: {
      "zh-CN": "ISO 42001 人工智能治理体系",
      "zh-TW": "ISO 42001 人工智能治理體系",
      en: "ISO/IEC 42001 AI Governance",
      ja: "ISO/IEC 42001 AIマネジメント認証",
    },
    authority: {
      "zh-CN": "模型全生命周期可追溯、可逆微调开关与算法偏见季度临床审计",
      "zh-TW": "模型全生命週期可追溯、可逆微調開關與算法偏見季度臨床審計",
      en: "Full model lifecycle governance, reversible behaviors & bias audits",
      ja: "モデルライフサイクル統治・可逆的制御・四半期バイアス監査",
    },
    scope: {
      "zh-CN": "148 生产环境实时探针",
      "zh-TW": "148 生產環境實時探針",
      en: "148 Live Production Monitors",
      ja: "148個の本番環境リアルタイム監視プローブ",
    },
  },
  {
    id: "xinchuang",
    code: "XINCHUANG READY",
    title: {
      "zh-CN": "国家信创软硬件环境认证",
      "zh-TW": "國家信創軟硬體環境認證",
      en: "Domestic Sovereign Hardware Certified",
      ja: "国産サーバ・OS動作適合認証",
    },
    authority: {
      "zh-CN": "完成昇腾AI集群、海光、麒麟/统信OS与国产分布式数据库院内压测认证",
      "zh-TW": "完成昇騰AI集群、海光、麒麟/統信OS與國產分佈式數據庫院內壓測認證",
      en: "Validated on domestic AI accelerators, sovereign OS & hospital private clouds",
      ja: "病院内プライベートAIアプライアンスでの高負荷動作認証済",
    },
    scope: {
      "zh-CN": "支持断网院内独立运行",
      "zh-TW": "支持斷網院內獨立運行",
      en: "Air-Gapped Hospital Intranet Mode",
      ja: "院内閉域網エアギャップ稼働対応",
    },
  },
];

export const PARTNER_INSTITUTIONS: {
  code: string;
  sector: Record<Locale, string>;
  name: Record<Locale, string>;
}[] = [
  {
    code: "CN-MED-01",
    sector: { "zh-CN": "国家医学中心", "zh-TW": "國家醫學中心", en: "National Med Center", ja: "国家医学センター" },
    name: {
      "zh-CN": "京津冀协和临床医学中心",
      "zh-TW": "京津冀協和臨床醫學中心",
      en: "Beijing-Tianjin Union Clinical Center",
      ja: "京津冀協和臨床医学センター",
    },
  },
  {
    code: "CN-MED-02",
    sector: { "zh-CN": "省级医联体", "zh-TW": "省級醫聯體", en: "Health System", ja: "広域医療グループ" },
    name: {
      "zh-CN": "上海申康瑞华医疗集团",
      "zh-TW": "上海申康瑞華醫療集團",
      en: "Shanghai Shenkang Ruihua Health",
      ja: "上海申康瑞華医療グループ",
    },
  },
  {
    code: "CN-MED-03",
    sector: { "zh-CN": "智慧医联体", "zh-TW": "智慧醫聯體", en: "Regional Consortium", ja: "スマート医療連携網" },
    name: {
      "zh-CN": "华西天府智慧慢病医联体",
      "zh-TW": "華西天府智慧慢病醫聯體",
      en: "West China Tianfu Care Network",
      ja: "華西天府スマート医療コンソーシアム",
    },
  },
  {
    code: "CN-MED-04",
    sector: { "zh-CN": "呼吸专科中心", "zh-TW": "呼吸專科中心", en: "Pulmonary Institute", ja: "呼吸器専門拠点" },
    name: {
      "zh-CN": "岭南中山呼吸疾病研究院",
      "zh-TW": "嶺南中山呼吸疾病研究院",
      en: "Lingnan Respiratory Institute",
      ja: "嶺南呼吸器疾患研究院",
    },
  },
  {
    code: "CN-MED-05",
    sector: { "zh-CN": "数字三甲医院", "zh-TW": "數字三甲醫院", en: "Digital Tertiary", ja: "デジタル高度病院" },
    name: {
      "zh-CN": "钱塘浙医数字临床医院",
      "zh-TW": "錢塘浙醫數字臨床醫院",
      en: "Qiantang Digital Medical Center",
      ja: "銭塘デジタル臨床病院",
    },
  },
  {
    code: "CN-MED-06",
    sector: { "zh-CN": "心血管中心", "zh-TW": "心血管中心", en: "Heart Institute", ja: "循環器専門病院" },
    name: {
      "zh-CN": "同济江城心血管病医院",
      "zh-TW": "同濟江城心血管病醫院",
      en: "Tongji Jiangcheng Heart Hospital",
      ja: "同済江城循環器病病院",
    },
  },
  {
    code: "CN-BIO-07",
    sector: { "zh-CN": "创新生物药企", "zh-TW": "創新生物藥企", en: "Global Biopharma", ja: "革新バイオ創薬" },
    name: {
      "zh-CN": "百济恒创生物医药（张江）",
      "zh-TW": "百濟恆創生物醫藥（張江）",
      en: "Baiji Hengchuang Biopharma",
      ja: "百済恒創バイオファーマ",
    },
  },
  {
    code: "CN-BIO-08",
    sector: { "zh-CN": "生命科学器械", "zh-TW": "生命科學器械", en: "MedTech Leader", ja: "医療機器研究開発" },
    name: {
      "zh-CN": "联影迈瑞智联临床研究院",
      "zh-TW": "聯影邁瑞智聯臨床研究院",
      en: "United-Mindray Clinical AI Lab",
      ja: "聯影マイレイ臨床AI研究院",
    },
  },
  {
    code: "CN-PAY-09",
    sector: { "zh-CN": "医养与健康险", "zh-TW": "醫養與健康險", en: "Payor & Senior Care", ja: "医療保険・介護連携" },
    name: {
      "zh-CN": "太保源申健康医养网络",
      "zh-TW": "太保源申健康醫養網絡",
      en: "CPIC Yuanshen Health Network",
      ja: "太保ヘルスケア医養ネットワーク",
    },
  },
  {
    code: "CN-PAY-10",
    sector: { "zh-CN": "康复医疗连锁", "zh-TW": "康復醫療連鎖", en: "Rehab Hospital Group", ja: "リハビリ病院群" },
    name: {
      "zh-CN": "泰康燕园老年康复医院",
      "zh-TW": "泰康燕園老年康復醫院",
      en: "Taikang Yanyuan Geriatric Rehab",
      ja: "泰康燕園老年リハビリ病院",
    },
  },
  {
    code: "CN-PHM-11",
    sector: { "zh-CN": "双通道特药网", "zh-TW": "雙通道特藥網", en: "Specialty Pharmacy", ja: "専門薬局ネットワーク" },
    name: {
      "zh-CN": "国控华润慢病DTP药房网",
      "zh-TW": "國控華潤慢病DTP藥房網",
      en: "Sinopharm DTP Specialty Care",
      ja: "国薬DTP専門薬局ネットワーク",
    },
  },
  {
    code: "CN-MED-12",
    sector: { "zh-CN": "区域慢病中心", "zh-TW": "區域慢病中心", en: "Chronic Care Hub", ja: "地域慢性疾患拠点" },
    name: {
      "zh-CN": "湘雅芙蓉慢病管理研究院",
      "zh-TW": "湘雅芙蓉慢病管理研究院",
      en: "Xiangya Furong Chronic Care",
      ja: "湘雅芙蓉慢性疾患研究院",
    },
  },
];
