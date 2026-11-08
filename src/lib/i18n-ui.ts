import type {
  LocaleCode,
  SupervisionQueueItem,
  VerifiedExpertRecord,
} from "@/types/platform";

export interface UiCopy {
  rail: {
    workbench: string;
    seminar: string;
    cohort: string;
    talent: string;
    enterprise: string;
    searchPlaceholder: string;
    proofCounter: string;
    themeLight: string;
    themeDark: string;
    exportHtml: string;
    licensing: string;
    rebrand: string;
  };
  workbench: {
    syllabusHeader: string;
    importBtn: string;
    importTitle: string;
    importSectionLabel: string;
    importRuleLabel: string;
    importBodyLabel: string;
    importSubmit: string;
    cancel: string;
    tabSource: string;
    tabScratchpad: string;
    tabBlindGate: string;
    criterionLabel: string;
    boundaryLabel: string;
    listenBtn: string;
    stopBtn: string;
    askSocraticBtn: string;
    stepModelBtn: string;
    scratchpadHint: string;
    penTool: string;
    clearCanvas: string;
    stepInputLabel: string;
    verifyStepsBtn: string;
    symbolicPass: string;
    symbolicFlag: string;
    blindGateTitle: string;
    blindGateNotice: string;
    startGateBtn: string;
    resetGateBtn: string;
    hintsLocked: string;
    gatePassedTitle: string;
    gateFailedTitle: string;
    tutorWelcome: (brandName: string, tutorName: string, courseTitle: string) => string;
    modeSocratic: string;
    modeProof: string;
    modeRubric: string;
    citationPrefix: string;
    inputPlaceholder: string;
    sendBtn: string;
    loadingStatus: string;
  };
  seminar: {
    boardTitle: string;
    exactIntegral: string;
    approxArea: string;
    boundDirection: string;
    underestimate: string;
    overestimate: string;
    leftSum: string;
    rightSum: string;
    trapezoid: string;
    dialogueTitle: string;
    resetBtn: string;
    nextTurnBtn: string;
    gateLabel: string;
    explanationPrefix: string;
    interruptPlaceholder: string;
    interruptBtn: string;
    audioTitle: string;
    audioSub: string;
    playAudio: string;
    stopAudio: string;
    copyTranscript: string;
    copied: string;
  };
  cohort: {
    supervisionTitle: string;
    supervisionSub: string;
    ratioMetric: string;
    colLearner: string;
    colTrack: string;
    colTrigger: string;
    colBlindRate: string;
    colStatus: string;
    colAction: string;
    statusIntervention: string;
    statusCheckin: string;
    statusVerified: string;
    dispatchAction: string;
    dispatchedToast: string;
    examPressTitle: string;
    examPressSub: string;
    printBtn: string;
    variantPlaceholder: string;
    generateBtn: string;
    weakConceptsLabel: string;
    correctRubric: string;
    boundaryHit: string;
    retentionTitle: string;
    fsrsLine: string;
    decayLine: string;
    dossierTitle: string;
    baselineLabel: string;
    projectedLabel: string;
    prescriptionLabel: string;
    copyDossierBtn: string;
  };
  talent: {
    title: string;
    subtitle: string;
    metricVerified: string;
    metricNdr: string;
    metricRate: string;
    metricTakeRate: string;
    filterAll: string;
    colCandidate: string;
    colDomain: string;
    colProofs: string;
    colAccuracy: string;
    colRate: string;
    colPlacement: string;
    colProofHash: string;
    requestIntroBtn: string;
    requestedBtn: string;
    architectureNoteTitle: string;
    architectureNoteBody: string;
  };
  enterprise: {
    title: string;
    subtitle: string;
    pricingModelLabel: string;
    outcomeMode: string;
    annualSeatMode: string;
    studentsSlider: string;
    taCountSlider: string;
    taCostSlider: string;
    upsellSlider: string;
    linePayroll: string;
    lineUpsell: string;
    linePlatformFee: string;
    netImpactLabel: string;
    paybackPrefix: string;
    paybackSuffix: string;
    generateProposalBtn: string;
    verifyKeyBtn: string;
    tabOem: string;
    tabKeys: string;
    tabDeployment: string;
    brandNameLabel: string;
    domainLabel: string;
    tutorNameLabel: string;
    annualFeeLabel: string;
    gatewayTitle: string;
    gatewaySub: string;
    saveConfigBtn: string;
    savedConfigBtn: string;
    issueKeyBtn: string;
    downloadHtmlBtn: string;
  };
  cmdk: {
    placeholder: string;
    groupNavigate: string;
    groupMarket: string;
    groupSystem: string;
    toggleTheme: string;
    exportOffline: string;
    verifyLicense: string;
  };
}

export const UI_COPY: Record<LocaleCode, UiCopy> = {
  zh: {
    rail: {
      workbench: "演算诊断台",
      seminar: "交互推演室",
      cohort: "督学与组卷",
      talent: "认证专家网",
      enterprise: "机构与结算",
      searchPlaceholder: "搜索指令或切换视图…",
      proofCounter: "闭卷存证",
      themeLight: "浅色纸面",
      themeDark: "深色工作台",
      exportHtml: "导出离线包",
      licensing: "商业授权",
      rebrand: "品牌配置",
    },
    workbench: {
      syllabusHeader: "课程讲义索引",
      importBtn: "导入讲义",
      importTitle: "挂载机构自有讲义或评分细则",
      importSectionLabel: "章节名称",
      importRuleLabel: "核心采分判据 / 公式",
      importBodyLabel: "原文段落与推导要求",
      importSubmit: "索引并载入",
      cancel: "取消",
      tabSource: "原文与判据",
      tabScratchpad: "手写与步进验算",
      tabBlindGate: "闭卷通关核验",
      criterionLabel: "评分判据",
      boundaryLabel: "易错边界",
      listenBtn: "朗读",
      stopBtn: "停止",
      askSocraticBtn: "定位盲区追问",
      stepModelBtn: "标准步骤示范",
      scratchpadHint: "在下方画布手写草稿，或在右侧逐行输入推导式，由符号验算器逐行核查正负号与定义域前提。",
      penTool: "画笔",
      clearCanvas: "清空草稿",
      stepInputLabel: "逐行符号推导核验（零算术幻觉）",
      verifyStepsBtn: "执行符号步进验算",
      symbolicPass: "第 1–2 步等价变形核验通过；第 3 步已确认开区间可导前提。",
      symbolicFlag: "检测到第 2 行边界符号未随单调性反转，已拦截跳步并关联讲义判据。",
      blindGateTitle: "无提示闭卷迁移核验（防认知卸载锁）",
      blindGateNotice: "倒计时期间已锁定全部提示与讲义原文。独立完成同构变式题，方可生成不可篡改的掌握度哈希存证并排入 FSRS 周期。",
      startGateBtn: "开始 90 秒闭卷核验",
      resetGateBtn: "重新抽题",
      hintsLocked: "闭卷状态：导师提示已锁定",
      gatePassedTitle: "闭卷核验通过 · 已签发掌握度哈希存证",
      gateFailedTitle: "未通过闭卷核验 · 已退回苏格拉底纠偏队列",
      tutorWelcome: (brandName, tutorName, courseTitle) =>
        `${brandName} · ${tutorName}\n已载入《${courseTitle}》。所有提问与主观题批改均强制校验讲义页码判据；完成启发后请切换至「闭卷通关核验」完成无提示验证。`,
      modeSocratic: "苏格拉底反问",
      modeProof: "满分步骤",
      modeRubric: "阅卷批改",
      citationPrefix: "引证",
      inputPlaceholder: "输入推导卡点，或粘贴整段作答按采分点批改…",
      sendBtn: "提交",
      loadingStatus: "正在核对讲义判据并更新 L1 学情轨迹…",
    },
    seminar: {
      boardTitle: "同步几何与逻辑推演板",
      exactIntegral: "精确积分值",
      approxArea: "当前近似值",
      boundDirection: "误差判据",
      underestimate: "下界低估",
      overestimate: "上界高估",
      leftSum: "左黎曼和",
      rightSum: "右黎曼和",
      trapezoid: "梯形法则",
      dialogueTitle: "多角色课堂推演记录",
      resetBtn: "重置",
      nextTurnBtn: "推进一幕",
      gateLabel: "随堂掌握度校验",
      explanationPrefix: "评分解析：",
      interruptPlaceholder: "针对当前板书直接插话追问…",
      interruptBtn: "插话提问",
      audioTitle: "双声道复盘音频文稿",
      audioSub: "支持浏览器原生语音合成倍速试听与文稿导出",
      playAudio: "播放音频",
      stopAudio: "停止",
      copyTranscript: "复制文稿",
      copied: "已复制",
    },
    cohort: {
      supervisionTitle: "1:150 人机协同督学干预队列",
      supervisionSub: "系统自动监测缺勤、连续盲测未过与认知卸载倾向，仅将高风险个案推送给真人督学官介入，替家庭消除陪读冲突。",
      ratioMetric: "单名督学官可托管 150 名在读学员",
      colLearner: "学员",
      colTrack: "所属科目",
      colTrigger: "系统监测触发原因",
      colBlindRate: "闭卷通过率",
      colStatus: "当前状态",
      colAction: "协同操作",
      statusIntervention: "需真人介入",
      statusCheckin: "已自动语音催学",
      statusVerified: "闭卷达标",
      dispatchAction: "接管并推送家庭周报",
      dispatchedToast: "已生成督学记录并复制家长沟通摘要",
      examPressTitle: "三级同源变式考卷生成",
      examPressSub: "基于学员 L2 薄弱概念即时生成基础、逆向与综合三阶印刷级试题",
      printBtn: "打印考卷",
      variantPlaceholder: "输入错题题干或考纲概念名称…",
      generateBtn: "生成变式卷",
      weakConceptsLabel: "当前学员薄弱项：",
      correctRubric: "判分通过",
      boundaryHit: "触发命题边界",
      retentionTitle: "30 天 FSRS 记忆留存追踪",
      fsrsLine: "FSRS 闭卷排期留存 (92%)",
      decayLine: "单次听课自然遗忘 (23%)",
      dossierTitle: "家庭周度学情档案单",
      baselineLabel: "入学基线",
      projectedLabel: "闭卷实证预测",
      prescriptionLabel: "下周针对性训练处方",
      copyDossierBtn: "复制家庭周报全文",
    },
    talent: {
      title: "可验证专业能力与专家数据网络",
      subtitle: "打破传统考培「考完即流失」天花板：累计通过高阶闭卷存证的前 5% 医学、法律与理工学习者，可直接对接医疗规培、律所量化校招及前沿大模型实验室专家评测任务（RLHF）。",
      metricVerified: "全球闭卷认证候选人",
      metricNdr: "机构与专家网络净留存 (NDR)",
      metricRate: "专家评测平均时薪",
      metricTakeRate: "平台撮合与数据服务费率",
      filterAll: "全部领域",
      colCandidate: "认证编号与地区",
      colDomain: "专业领域与闭卷分位",
      colProofs: "闭卷存证数",
      colAccuracy: "符号推演准确率",
      colRate: "专家时薪",
      colPlacement: "对接状态",
      colProofHash: "最新存证哈希",
      requestIntroBtn: "发起专家任务邀约",
      requestedBtn: "已发送邀约",
      architectureNoteTitle: "第二增长曲线商业机制",
      architectureNoteBody: "前端以机构教研与督学获取零成本高粘性专业生源，中台沉淀数千万条「错因到闭卷掌握」真实认知轨迹微调自有低成本诊断模型，后端通过高信度人才背调与 AI 实验室领域专家评测合约实现持续复利。",
    },
    enterprise: {
      title: "机构商业结算与私有贴牌配置",
      subtitle: "支持按提分达标结果分成（Outcome-Based）与年度白标席位双模式结算，内置四国货币合规收款与离线签名许可证。",
      pricingModelLabel: "商业计费模式",
      outcomeMode: "按闭卷达标结果分成",
      annualSeatMode: "年度固定白标授权",
      studentsSlider: "在读学员规模",
      taCountSlider: "现有批改答疑助教人数",
      taCostSlider: "助教月均人力成本",
      upsellSlider: "全年托管督学包客单价",
      linePayroll: "缩减 70% 重复批改与答疑工时节省成本",
      lineUpsell: "30% 在读学员升级全托管督学包新增营收",
      linePlatformFee: "扣减平台系统费用与全年推理算力成本",
      netImpactLabel: "合作机构首年预计净增营业利润",
      paybackPrefix: "回本临界点：仅需 ",
      paybackSuffix: " 名存量学员升级督学服务即可覆盖全年平台成本。",
      generateProposalBtn: "生成商业合作协议书",
      verifyKeyBtn: "核销离线许可证",
      tabOem: "品牌域名与模型网关",
      tabKeys: "离线签名许可证签发",
      tabDeployment: "静态边缘与单文件交付",
      brandNameLabel: "机构显示名称",
      domainLabel: "独立绑定域名",
      tutorNameLabel: "导师实名标识",
      annualFeeLabel: "机构年度授权费",
      gatewayTitle: "OpenAI 兼容推理网关",
      gatewaySub: "未填密钥时运行本地确定性判据引擎；填入密钥后直连实时大模型。",
      saveConfigBtn: "应用配置",
      savedConfigBtn: "已生效",
      issueKeyBtn: "签发 FNV-1a 许可证",
      downloadHtmlBtn: "下载单文件离线版 (.html)",
    },
    cmdk: {
      placeholder: "输入指令跳转工作区、切换国家货币或深浅主题…",
      groupNavigate: "工作区切换",
      groupMarket: "市场与结算币种",
      groupSystem: "系统与交付操作",
      toggleTheme: "切换浅色 / 深色界面主题",
      exportOffline: "导出单文件离线运行包 (.html)",
      verifyLicense: "打开许可证结算与核销窗口",
    },
  },
  en: {
    rail: {
      workbench: "Workbench",
      seminar: "Seminar",
      cohort: "Cohort Ops",
      talent: "Talent Graph",
      enterprise: "Enterprise",
      searchPlaceholder: "Jump or run command…",
      proofCounter: "Blind Proofs",
      themeLight: "Light surface",
      themeDark: "Dark surface",
      exportHtml: "Export .html",
      licensing: "Licensing",
      rebrand: "OEM Identity",
    },
    workbench: {
      syllabusHeader: "Syllabus Index",
      importBtn: "Add Source",
      importTitle: "Index proprietary syllabus excerpt or grading rubric",
      importSectionLabel: "Section title",
      importRuleLabel: "Governing theorem or rubric rule",
      importBodyLabel: "Source text",
      importSubmit: "Index excerpt",
      cancel: "Cancel",
      tabSource: "Source & Rubric",
      tabScratchpad: "Step Scratchpad",
      tabBlindGate: "Blind Mastery Gate",
      criterionLabel: "Scoring criterion",
      boundaryLabel: "Deduction trap",
      listenBtn: "Read aloud",
      stopBtn: "Stop",
      askSocraticBtn: "Probe boundary",
      stepModelBtn: "Model derivation",
      scratchpadHint: "Sketch freehand work on the canvas or enter symbolic lines on the right for deterministic step-level verification.",
      penTool: "Ink pen",
      clearCanvas: "Clear pad",
      stepInputLabel: "Symbolic line-by-line audit (0.00% arithmetic hallucination)",
      verifyStepsBtn: "Verify derivation steps",
      symbolicPass: "Lines 1–2 verified algebraically; open-interval differentiability premise confirmed.",
      symbolicFlag: "Sign inversion missed on Line 2 boundary check; halted premature substitution.",
      blindGateTitle: "Closed-Book Proof of Mastery",
      blindGateNotice: "All hints and source pages are locked during the 90s timer. Solve an isomorphic transfer problem unassisted to mint a cryptographic mastery proof.",
      startGateBtn: "Start 90s blind check",
      resetGateBtn: "New transfer item",
      hintsLocked: "Closed-book active — hints locked",
      gatePassedTitle: "Mastery verified · Cryptographic proof minted",
      gateFailedTitle: "Verification incomplete · Queued for targeted remediation",
      tutorWelcome: (brandName, tutorName, courseTitle) =>
        `${brandName} · ${tutorName}\nLoaded "${courseTitle}". Every diagnostic prompt and rubric critique cites exact syllabus pages. Complete a Blind Mastery Gate to mint verified competence credit.`,
      modeSocratic: "Socratic",
      modeProof: "Step Proof",
      modeRubric: "Rubric Audit",
      citationPrefix: "Source",
      inputPlaceholder: "Ask a derivation question or paste a response for rubric grading…",
      sendBtn: "Submit",
      loadingStatus: "Cross-checking syllabus index and logging L1 trace…",
    },
    seminar: {
      boardTitle: "Interactive Mathematical & Logic Plate",
      exactIntegral: "Exact integral",
      approxArea: "Current approximation",
      boundDirection: "Bound check",
      underestimate: "Underestimate",
      overestimate: "Overestimate",
      leftSum: "Left sum",
      rightSum: "Right sum",
      trapezoid: "Trapezoidal",
      dialogueTitle: "Multi-Agent Seminar Transcript",
      resetBtn: "Reset",
      nextTurnBtn: "Advance turn",
      gateLabel: "Inline Mastery Gate",
      explanationPrefix: "Analysis: ",
      interruptPlaceholder: "Interrupt the seminar with a question…",
      interruptBtn: "Interrupt",
      audioTitle: "Dual-Host Revision Audio",
      audioSub: "Native browser speech synthesis with variable playback speed",
      playAudio: "Play audio",
      stopAudio: "Stop",
      copyTranscript: "Copy script",
      copied: "Copied",
    },
    cohort: {
      supervisionTitle: "1:150 Hybrid Accountability Queue",
      supervisionSub: "Automated detection of idle streaks, repeated blind-gate failures, and cognitive offloading escalates high-risk learners to human coaches—removing parent nagging.",
      ratioMetric: "1 human coach supervises 150 active learners",
      colLearner: "Learner",
      colTrack: "Curriculum",
      colTrigger: "Escalation trigger",
      colBlindRate: "Blind pass rate",
      colStatus: "State",
      colAction: "Action",
      statusIntervention: "Coach intervention",
      statusCheckin: "Voice check-in sent",
      statusVerified: "On track",
      dispatchAction: "Intervene & send digest",
      dispatchedToast: "Intervention logged & parent summary copied",
      examPressTitle: "Three-Tier Variant Examination Press",
      examPressSub: "Synthesize printable L1 foundational, L2 inverse, and L3 synthesis items from weak concepts",
      printBtn: "Print exam",
      variantPlaceholder: "Enter missed problem stem or syllabus topic…",
      generateBtn: "Synthesize exam",
      weakConceptsLabel: "Active L2 weak spots:",
      correctRubric: "Rubric verified",
      boundaryHit: "Boundary trap triggered",
      retentionTitle: "30-Day FSRS Retention Trajectory",
      fsrsLine: "FSRS scheduled recall (92%)",
      decayLine: "Unassisted lecture decay (23%)",
      dossierTitle: "Weekly Family Progress Dossier",
      baselineLabel: "Entry baseline",
      projectedLabel: "Verified projection",
      prescriptionLabel: "Next 7-day study prescription",
      copyDossierBtn: "Copy family progress digest",
    },
    talent: {
      title: "Verified Competence & Expert RLHF Network",
      subtitle: "Eliminating graduation churn: top 5% candidates verified via closed-book proofs across medicine, law, and STEM match directly with clinical/firm placements and frontier AI lab expert evaluation contracts.",
      metricVerified: "Verified top-5% candidates",
      metricNdr: "Net dollar retention (NDR)",
      metricRate: "Avg expert evaluation rate",
      metricTakeRate: "Marketplace take rate",
      filterAll: "All domains",
      colCandidate: "Candidate ID",
      colDomain: "Domain & percentile",
      colProofs: "Blind proofs",
      colAccuracy: "Symbolic accuracy",
      colRate: "Hourly rate",
      colPlacement: "Availability",
      colProofHash: "Latest proof hash",
      requestIntroBtn: "Contract expert",
      requestedBtn: "Request sent",
      architectureNoteTitle: "Compounding Data & Marketplace Flywheel",
      architectureNoteBody: "Institutional cohorts supply zero-CAC domain learners; closed-book error-to-mastery trajectories train low-cost diagnostic models (85%+ gross margin); verified top performers monetize downstream via enterprise hiring and AI lab RLHF evaluations.",
    },
    enterprise: {
      title: "Enterprise Outcomes & White-Label Console",
      subtitle: "Configure outcome-based per-mastery pricing or annual white-label seats, multi-currency tax-compliant settlement, and stateless cryptographic keys.",
      pricingModelLabel: "Commercial contract structure",
      outcomeMode: "Outcome-based (per verified gain)",
      annualSeatMode: "Annual white-label license",
      studentsSlider: "Active enrolled learners",
      taCountSlider: "Grading & Q&A assistants",
      taCostSlider: "Monthly cost per assistant",
      upsellSlider: "Managed AI coaching add-on fee",
      linePayroll: "70% grading and Q&A payroll saved",
      lineUpsell: "30% cohort attach on managed coaching",
      linePlatformFee: "Less platform contract & inference compute",
      netImpactLabel: "Projected Year-1 net operating gain",
      paybackPrefix: "Break-even threshold: ",
      paybackSuffix: " enrolled students cover the entire annual contract.",
      generateProposalBtn: "Generate commercial contract",
      verifyKeyBtn: "Verify license key",
      tabOem: "Identity & LLM Gateway",
      tabKeys: "Stateless License Keys",
      tabDeployment: "Edge & Offline Build",
      brandNameLabel: "Institution name",
      domainLabel: "Custom domain",
      tutorNameLabel: "Faculty tutor title",
      annualFeeLabel: "Annual OEM contract",
      gatewayTitle: "OpenAI-Compatible Inference Endpoint",
      gatewaySub: "Runs deterministic syllabus engine by default; attach an API key for live LLM generation.",
      saveConfigBtn: "Apply configuration",
      savedConfigBtn: "Applied",
      issueKeyBtn: "Sign FNV-1a keys",
      downloadHtmlBtn: "Download portable .html",
    },
    cmdk: {
      placeholder: "Type a command, switch workspace, or change currency…",
      groupNavigate: "Workspaces",
      groupMarket: "Markets & Currencies",
      groupSystem: "System & Delivery",
      toggleTheme: "Toggle light / dark surface",
      exportOffline: "Download standalone offline .html",
      verifyLicense: "Open licensing & key verification",
    },
  },
  ja: {
    rail: {
      workbench: "演習診断台",
      seminar: "対話講義室",
      cohort: "督学・作問管理",
      talent: "認証専門人材網",
      enterprise: "OEM・収益契約",
      searchPlaceholder: "コマンド検索・画面切替…",
      proofCounter: "閉巻証明数",
      themeLight: "ライト表示",
      themeDark: "ダーク表示",
      exportHtml: "オフライン出力",
      licensing: "ライセンス",
      rebrand: "塾ブランド設定",
    },
    workbench: {
      syllabusHeader: "教材インデックス",
      importBtn: "教材追加",
      importTitle: "自塾テキスト・採点基準の即時インデックス登録",
      importSectionLabel: "単元タイトル",
      importRuleLabel: "採点基準・核心公式",
      importBodyLabel: "テキスト本文",
      importSubmit: "インデックス登録",
      cancel: "キャンセル",
      tabSource: "原文と採点基準",
      tabScratchpad: "手書き・途中式検証",
      tabBlindGate: "ヒント無し閉巻テスト",
      criterionLabel: "採点基準",
      boundaryLabel: "頻出減点ポイント",
      listenBtn: "音声再生",
      stopBtn: "停止",
      askSocraticBtn: "前提条件を問う",
      stepModelBtn: "満点記述モデル",
      scratchpadHint: "下のキャンバスに手書きで途中式を書くか、右欄に式を入力して記号論理ステップ検証を実行します。",
      penTool: "ペン入力",
      clearCanvas: "消去",
      stepInputLabel: "途中式の厳密ステップ検証（計算ハルシネーションゼロ）",
      verifyStepsBtn: "途中式を検証する",
      symbolicPass: "1〜2行目の同値変形を確認。開区間での微分可能性の前提条件も充足しています。",
      symbolicFlag: "2行目の境界符号の反転漏れを検出しました。テキスト基準を参照してください。",
      blindGateTitle: "ヒント完全ロック・閉巻定着テスト",
      blindGateNotice: "90秒間すべてのヒントとテキスト参照をロックします。自力で類題を正解すると暗号化定着証明が発行され、FSRS復習周期が更新されます。",
      startGateBtn: "90秒閉巻テストを開始",
      resetGateBtn: "別問題に切替",
      hintsLocked: "閉巻モード中：ヒント非表示",
      gatePassedTitle: "閉巻テスト合格・定着証明ハッシュ発行済",
      gateFailedTitle: "不合格・ソクラテス式弱点補強へ戻ります",
      tutorWelcome: (brandName, tutorName, courseTitle) =>
        `${brandName}・${tutorName}\n『${courseTitle}』を読み込みました。すべての指導と記述添削はテキストのページ番号を厳密に引用します。理解後は「閉巻テスト」で自力解答を証明してください。`,
      modeSocratic: "ソクラテス問答",
      modeProof: "記述満点手順",
      modeRubric: "厳密採点",
      citationPrefix: "出典",
      inputPlaceholder: "疑問点の質問、または記述答案を貼り付けて採点…",
      sendBtn: "送信",
      loadingStatus: "テキスト根拠を照合し L1 学習履歴を更新中…",
    },
    seminar: {
      boardTitle: "インタラクティブ数理・論理ボード",
      exactIntegral: "厳密積分値",
      approxArea: "近似面積",
      boundDirection: "誤差判定",
      underestimate: "過小評価",
      overestimate: "過大評価",
      leftSum: "左リーマン和",
      rightSum: "右リーマン和",
      trapezoid: "台形公式",
      dialogueTitle: "マルチAIゼミ対話ログ",
      resetBtn: "最初から",
      nextTurnBtn: "次へ進める",
      gateLabel: "理解度チェック",
      explanationPrefix: "解説：",
      interruptPlaceholder: "講義の途中で質問を割り込ませる…",
      interruptBtn: "質問する",
      audioTitle: "復習用ツイン音声スクリプト",
      audioSub: "ブラウザ標準音声合成による倍速再生と原稿コピー",
      playAudio: "音声再生",
      stopAudio: "停止",
      copyTranscript: "原稿コピー",
      copied: "コピー済",
    },
    cohort: {
      supervisionTitle: "1:150 ハイブリッド学習監督キュー",
      supervisionSub: "未ログイン継続や閉巻テスト連続不合格を自動検知し、人間の教務コーチへ優先通知。家庭での保護者の声かけ負担と親子摩擦を解消します。",
      ratioMetric: "教務コーチ1名で生徒150名を精密管理",
      colLearner: "生徒名",
      colTrack: "受講コース",
      colTrigger: "アラート理由",
      colBlindRate: "閉巻合格率",
      colStatus: "状態",
      colAction: "対応",
      statusIntervention: "要教務フォロー",
      statusCheckin: "自動音声連絡済",
      statusVerified: "順調",
      dispatchAction: "フォロー＆LINE週報作成",
      dispatchedToast: "対応履歴を記録しLINE保護者週報をコピーしました",
      examPressTitle: "3段階同論点・類題テスト即時作成",
      examPressSub: "L2弱点データから基礎・逆転・融合の印刷用類題を10秒で生成",
      printBtn: "問題印刷",
      variantPlaceholder: "誤答した問題文または単元名を入力…",
      generateBtn: "類題シート生成",
      weakConceptsLabel: "抽出された弱点単元：",
      correctRubric: "正解・基準充足",
      boundaryHit: "減点トラップ該当",
      retentionTitle: "30日間 FSRS 記憶定着カーブ",
      fsrsLine: "FSRS最適復習スケジュール (92%)",
      decayLine: "単発授業のみの自然忘却 (23%)",
      dossierTitle: "保護者向け週次学習カルテ（LINE連携）",
      baselineLabel: "入塾時基準",
      projectedLabel: "閉巻実績予測",
      prescriptionLabel: "来週の重点指導方針",
      copyDossierBtn: "LINE送信用の週報テキストをコピー",
    },
    talent: {
      title: "実力証明・専門人材＆AI評価ネットワーク",
      subtitle: "受験終了後の退会（卒業チャーン）を打破：閉巻テストで上位5%を証明した医学部・難関理系・法曹人材を、研究機関や先端AIラボの専門RLHF評価案件へ直接接続します。",
      metricVerified: "閉巻認証済トップ人材",
      metricNdr: "純売上継続率 (NDR)",
      metricRate: "専門評価平均時給",
      metricTakeRate: "プラットフォーム手数料率",
      filterAll: "全分野",
      colCandidate: "認証ID・地域",
      colDomain: "専門領域・順位",
      colProofs: "閉巻証明数",
      colAccuracy: "論理検証精度",
      colRate: "時間単価",
      colPlacement: "稼働状況",
      colProofHash: "証明ハッシュ",
      requestIntroBtn: "専門案件を依頼",
      requestedBtn: "依頼送信済",
      architectureNoteTitle: "二段階マネタイズ構造",
      architectureNoteBody: "第1段階で学習塾OEMにより獲得コストゼロで優秀層を集積し、第2段階で蓄積した誤答修正データによる専用軽量モデルと、上位人材の専門評価マーケットプレイスで高収益を継続します。",
    },
    enterprise: {
      title: "法人OEM契約・成果報酬シミュレーター",
      subtitle: "成果連動型（定着証明ベース）および年間OEMライセンスの両モデルに対応。日本円決済とオフライン署名キーを標準搭載。",
      pricingModelLabel: "契約形態",
      outcomeMode: "成果連動プラン",
      annualSeatMode: "年間OEM定額ライセンス",
      studentsSlider: "在籍生徒数",
      taCountSlider: "添削・質問対応スタッフ数",
      taCostSlider: "スタッフ月間人件費",
      upsellSlider: "AI演習管理コース年間単価",
      linePayroll: "添削・質問対応工数70%削減による人件費圧縮",
      lineUpsell: "在籍生30%のAI管理オプション受講増収",
      linePlatformFee: "システム契約料および推論原価控除",
      netImpactLabel: "初年度 営業利益純増見込額",
      paybackPrefix: "損益分岐点：既存生徒 ",
      paybackSuffix: " 名のオプション申込で年間システム費用を全額回収。",
      generateProposalBtn: "導入見積書を作成",
      verifyKeyBtn: "キー認証",
      tabOem: "ブランド・推論API設定",
      tabKeys: "オフライン署名キー発行",
      tabDeployment: "静的エッジ・単一HTML出力",
      brandNameLabel: "塾・機関ブランド名",
      domainLabel: "独自ドメイン",
      tutorNameLabel: "AI講師呼称",
      annualFeeLabel: "年間OEM契約額",
      gatewayTitle: "OpenAI互換 推論ゲートウェイ",
      gatewaySub: "APIキー未設定時は内蔵の確定型採点エンジンで動作します。",
      saveConfigBtn: "設定を保存",
      savedConfigBtn: "保存済",
      issueKeyBtn: "FNV-1a署名キー発行",
      downloadHtmlBtn: "単一ファイル版 (.html) を保存",
    },
    cmdk: {
      placeholder: "画面切替、通貨変更、テーマ切替を検索…",
      groupNavigate: "ワークスペース",
      groupMarket: "市場・決済通貨",
      groupSystem: "システム操作",
      toggleTheme: "ライト / ダーク表示切替",
      exportOffline: "単一HTMLオフライン版を保存",
      verifyLicense: "ライセンス認証・見積ウィンドウ",
    },
  },
  es: {
    rail: {
      workbench: "Diagnóstico",
      seminar: "Seminario",
      cohort: "Supervisión",
      talent: "Red Experta",
      enterprise: "Marca Blanca",
      searchPlaceholder: "Buscar comando o vista…",
      proofCounter: "Pruebas Ciegas",
      themeLight: "Modo claro",
      themeDark: "Modo oscuro",
      exportHtml: "Exportar .html",
      licensing: "Licencias",
      rebrand: "Identidad OEM",
    },
    workbench: {
      syllabusHeader: "Índice del Temario",
      importBtn: "Añadir Fuente",
      importTitle: "Indexar manual propio o criterio de corrección",
      importSectionLabel: "Título de la sección",
      importRuleLabel: "Criterio oficial o fórmula clave",
      importBodyLabel: "Contenido del manual",
      importSubmit: "Indexar fragmento",
      cancel: "Cancelar",
      tabSource: "Manual y Criterio",
      tabScratchpad: "Pizarra de Pasos",
      tabBlindGate: "Prueba Ciega",
      criterionLabel: "Criterio de evaluación",
      boundaryLabel: "Trampa frecuente",
      listenBtn: "Escuchar",
      stopBtn: "Detener",
      askSocraticBtn: "Cuestionar límite",
      stepModelBtn: "Demostración completa",
      scratchpadHint: "Escriba el desarrollo en el lienzo o valide cada paso simbólico a la derecha sin alucinaciones aritméticas.",
      penTool: "Trazo",
      clearCanvas: "Limpiar",
      stepInputLabel: "Auditoría simbólica línea por línea",
      verifyStepsBtn: "Auditar pasos",
      symbolicPass: "Pasos 1–2 verificados algebraicamente; condición de dominio confirmada.",
      symbolicFlag: "Inversión de signo detectada en la línea 2; revise la condición límite del manual.",
      blindGateTitle: "Verificación a Libro Cerrado (90s)",
      blindGateNotice: "Pistas y apuntes bloqueados durante 90 segundos. Resuelva un caso isomorfo sin ayuda para emitir un hash criptográfico de dominio.",
      startGateBtn: "Iniciar prueba ciega (90s)",
      resetGateBtn: "Nuevo caso",
      hintsLocked: "Libro cerrado activo — pistas bloqueadas",
      gatePassedTitle: "Dominio verificado · Hash criptográfico emitido",
      gateFailedTitle: "Verificación incompleta · En cola de refuerzo",
      tutorWelcome: (brandName, tutorName, courseTitle) =>
        `${brandName} · ${tutorName}\nTemario cargado: «${courseTitle}». Toda guía y corrección cita la página exacta del manual. Complete la Prueba Ciega para certificar el dominio.`,
      modeSocratic: "Socrático",
      modeProof: "Paso a Paso",
      modeRubric: "Evaluador",
      citationPrefix: "Cita",
      inputPlaceholder: "Plantee una duda o pegue su respuesta para corrección…",
      sendBtn: "Enviar",
      loadingStatus: "Verificando citas del manual y registrando traza L1…",
    },
    seminar: {
      boardTitle: "Lámina Interactiva de Geometría y Lógica",
      exactIntegral: "Valor exacto",
      approxArea: "Aproximación",
      boundDirection: "Sesgo",
      underestimate: "Subestimación",
      overestimate: "Sobreestimación",
      leftSum: "Suma izquierda",
      rightSum: "Suma derecha",
      trapezoid: "Trapecios",
      dialogueTitle: "Seminario Multi-Agente",
      resetBtn: "Reiniciar",
      nextTurnBtn: "Siguiente intervención",
      gateLabel: "Control de Dominio",
      explanationPrefix: "Explicación: ",
      interruptPlaceholder: "Interrumpir la sesión con una pregunta…",
      interruptBtn: "Preguntar",
      audioTitle: "Estudio de Audio de Repaso",
      audioSub: "Síntesis de voz nativa con control de velocidad",
      playAudio: "Reproducir",
      stopAudio: "Detener",
      copyTranscript: "Copiar guion",
      copied: "Copiado",
    },
    cohort: {
      supervisionTitle: "Cola de Supervisión Híbrida 1:150",
      supervisionSub: "Detecta inactividad y fallos en pruebas ciegas, escalando solo casos críticos al tutor humano y eliminando la fricción familiar.",
      ratioMetric: "1 coordinador supervisa 150 alumnos activos",
      colLearner: "Alumno",
      colTrack: "Programa",
      colTrigger: "Motivo de alerta",
      colBlindRate: "Éxito a libro cerrado",
      colStatus: "Estado",
      colAction: "Acción",
      statusIntervention: "Intervención humana",
      statusCheckin: "Aviso enviado",
      statusVerified: "Verificado",
      dispatchAction: "Intervenir y copiar informe",
      dispatchedToast: "Informe semanal copiado para WhatsApp",
      examPressTitle: "Generador de Simulacros en Tres Niveles",
      examPressSub: "Cree exámenes imprimibles L1, L2 y L3 a partir de conceptos débiles",
      printBtn: "Imprimir",
      variantPlaceholder: "Introduzca un tema o pregunta fallada…",
      generateBtn: "Generar simulacro",
      weakConceptsLabel: "Conceptos débiles L2:",
      correctRubric: "Criterio superado",
      boundaryHit: "Trampa de examen detectada",
      retentionTitle: "Curva de Retención FSRS a 30 Días",
      fsrsLine: "Repaso programado FSRS (92%)",
      decayLine: "Olvido sin intervención (23%)",
      dossierTitle: "Informe Semanal para Familias (WhatsApp)",
      baselineLabel: "Línea base",
      projectedLabel: "Proyección verificada",
      prescriptionLabel: "Plan para la próxima semana",
      copyDossierBtn: "Copiar informe familiar",
    },
    talent: {
      title: "Red de Competencia Verificada y Expertos RLHF",
      subtitle: "Superando la rotación post-examen: el 5% superior verificado a libro cerrado en medicina, derecho y STEM accede a contratos de evaluación experta para laboratorios de IA y firmas.",
      metricVerified: "Expertos top 5% verificados",
      metricNdr: "Retención neta de ingresos",
      metricRate: "Tarifa media por hora",
      metricTakeRate: "Comisión de red",
      filterAll: "Todos",
      colCandidate: "ID y región",
      colDomain: "Especialidad y percentil",
      colProofs: "Pruebas ciegas",
      colAccuracy: "Precisión simbólica",
      colRate: "Tarifa / hora",
      colPlacement: "Disponibilidad",
      colProofHash: "Hash de prueba",
      requestIntroBtn: "Contratar experto",
      requestedBtn: "Solicitud enviada",
      architectureNoteTitle: "Motor Compuesto de Datos y Talento",
      architectureNoteBody: "Las academias aportan alumnos especializados sin coste de adquisición; las trazas de corrección entrenan modelos propios de alto margen y los mejores perfiles monetizan en evaluación RLHF.",
    },
    enterprise: {
      title: "Consola Empresarial y Marca Blanca OEM",
      subtitle: "Contratos por resultados verificados o licencia anual de marca blanca, cobros globales con impuestos incluidos y claves firmadas offline.",
      pricingModelLabel: "Modelo comercial",
      outcomeMode: "Pago por resultado verificado",
      annualSeatMode: "Licencia anual Marca Blanca",
      studentsSlider: "Alumnos activos",
      taCountSlider: "Tutores de corrección",
      taCostSlider: "Coste mensual por tutor",
      upsellSlider: "Suplemento anual seguimiento IA",
      linePayroll: "70% ahorro en horas de corrección manual",
      lineUpsell: "30% conversión a seguimiento supervisado",
      linePlatformFee: "Menos licencia anual y coste de inferencia",
      netImpactLabel: "Beneficio operativo neto estimado (Año 1)",
      paybackPrefix: "Umbral de retorno: ",
      paybackSuffix: " alumnos cubren la totalidad del contrato anual.",
      generateProposalBtn: "Copiar propuesta comercial",
      verifyKeyBtn: "Verificar clave",
      tabOem: "Marca y Pasarela LLM",
      tabKeys: "Claves Firmadas Offline",
      tabDeployment: "Despliegue Edge y .html",
      brandNameLabel: "Nombre de la academia",
      domainLabel: "Dominio propio",
      tutorNameLabel: "Nombre del tutor jefe",
      annualFeeLabel: "Cuota anual OEM",
      gatewayTitle: "Pasarela compatible con OpenAI",
      gatewaySub: "Funciona sin clave mediante motor determinista o conectado a su propio modelo.",
      saveConfigBtn: "Guardar cambios",
      savedConfigBtn: "Guardado",
      issueKeyBtn: "Emitir claves FNV-1a",
      downloadHtmlBtn: "Descargar archivo .html autónomo",
    },
    cmdk: {
      placeholder: "Buscar comando, cambiar vista o moneda…",
      groupNavigate: "Vistas",
      groupMarket: "Mercados y Monedas",
      groupSystem: "Sistema",
      toggleTheme: "Alternar modo claro / oscuro",
      exportOffline: "Descargar versión offline .html",
      verifyLicense: "Abrir licencias y verificación",
    },
  },
};

export const SUPERVISION_QUEUE_SEED: Record<LocaleCode, SupervisionQueueItem[]> = {
  zh: [
    {
      id: "sq-1",
      learnerName: "林知远",
      track: "AP 微积分 BC",
      status: "intervention",
      triggerReason: "分部积分闭卷核验连续 2 次超时，疑似依赖提示跳步",
      lastActive: "26 小时未上线",
      blindGatePassRate: 62,
      parentChannel: "企业微信家长群",
    },
    {
      id: "sq-2",
      learnerName: "周予安",
      track: "雅思写作 8.0",
      status: "checkin_sent",
      triggerReason: "晚 20:00 约定复盘未到，已自动触发语音督学提醒",
      lastActive: "19 分钟前响应",
      blindGatePassRate: 84,
      parentChannel: "微信周报直推",
    },
    {
      id: "sq-3",
      learnerName: "陈默然",
      track: "法考刑法主观题",
      status: "verified",
      triggerReason: "连续 9 次无提示闭卷盲测一次通过，FSRS 稳态达 24 天",
      lastActive: "当前在线",
      blindGatePassRate: 96,
      parentChannel: "本人督学日报",
    },
  ],
  en: [
    {
      id: "sq-en-1",
      learnerName: "Ethan Vance",
      track: "USMLE Step 1",
      status: "intervention",
      triggerReason: "2x failed blind gate on RAAS hemodynamics; high hint reliance",
      lastActive: "27h idle",
      blindGatePassRate: 64,
      parentChannel: "Advisor Slack / Email",
    },
    {
      id: "sq-en-2",
      learnerName: "Maya Lin",
      track: "AP Calculus BC",
      status: "checkin_sent",
      triggerReason: "Missed 8:00 PM FSRS window; automated voice check-in delivered",
      lastActive: "Active 12m ago",
      blindGatePassRate: 88,
      parentChannel: "Parent SMS Digest",
    },
    {
      id: "sq-en-3",
      learnerName: "Liam Patel",
      track: "AP Calculus BC",
      status: "verified",
      triggerReason: "11 consecutive unassisted blind proofs verified",
      lastActive: "Online now",
      blindGatePassRate: 97,
      parentChannel: "Weekly Email Dossier",
    },
  ],
  ja: [
    {
      id: "sq-ja-1",
      learnerName: "佐藤 健太",
      track: "東大・難関国立二次数学",
      status: "intervention",
      triggerReason: "実数解の配置・閉巻テスト2回連続時間切れ（途中式省略傾向）",
      lastActive: "28時間未ログイン",
      blindGatePassRate: 61,
      parentChannel: "LINE公式・保護者連携",
    },
    {
      id: "sq-ja-2",
      learnerName: "高橋 美咲",
      track: "東大・難関国立二次数学",
      status: "checkin_sent",
      triggerReason: "20:00定刻演習未開始のため自動音声リマインド送信済",
      lastActive: "15分前に再開",
      blindGatePassRate: 86,
      parentChannel: "LINE週次カルテ",
    },
    {
      id: "sq-ja-3",
      learnerName: "陳 浩然",
      track: "EJU物理・医学部対策",
      status: "verified",
      triggerReason: "ヒント無し閉巻テスト10回連続一発合格（定着安定度22日）",
      lastActive: "演習中",
      blindGatePassRate: 95,
      parentChannel: "LINE週次カルテ",
    },
  ],
  es: [
    {
      id: "sq-es-1",
      learnerName: "Lucía Navarro",
      track: "Examen MIR Fisiopatología",
      status: "intervention",
      triggerReason: "2 fallos en prueba ciega de hemodinámica renal; exceso de pistas",
      lastActive: "25h inactiva",
      blindGatePassRate: 65,
      parentChannel: "WhatsApp Familiar",
    },
    {
      id: "sq-es-2",
      learnerName: "Mateo Ortega",
      track: "Matemáticas IB HL",
      status: "checkin_sent",
      triggerReason: "Recordatorio automático enviado tras retraso en sesión FSRS",
      lastActive: "Activo hace 10m",
      blindGatePassRate: 87,
      parentChannel: "WhatsApp Semanal",
    },
    {
      id: "sq-es-3",
      learnerName: "Sofía Delgado",
      track: "Examen MIR Fisiopatología",
      status: "verified",
      triggerReason: "12 pruebas a libro cerrado superadas sin asistencia",
      lastActive: "En línea",
      blindGatePassRate: 96,
      parentChannel: "Informe Directo",
    },
  ],
};

export const VERIFIED_EXPERTS_SEED: VerifiedExpertRecord[] = [
  {
    id: "vx-01",
    candidateHandle: "VRF-MD-9402",
    region: "Boston, US",
    domain: "USMLE Step 1/2 Pathophysiology · Top 0.8%",
    blindProofCount: 142,
    percentile: "99.2%",
    symbolicAccuracy: "99.4%",
    hourlyRateUsd: 145,
    placementStatus: "Frontier Clinical RLHF Active",
    proofHash: "0x8f3a…c91e",
  },
  {
    id: "vx-02",
    candidateHandle: "VRF-TKY-3180",
    region: "Tokyo, JP",
    domain: "University of Tokyo Math & Physics · Top 1.2%",
    blindProofCount: 118,
    percentile: "98.8%",
    symbolicAccuracy: "99.8%",
    hourlyRateUsd: 125,
    placementStatus: "Reasoning Verifier Available",
    proofHash: "0x4d2b…77a0",
  },
  {
    id: "vx-03",
    candidateHandle: "VRF-SH-6619",
    region: "Shanghai / SG",
    domain: "Quantitative Calculus & Formal Proofs · Top 0.5%",
    blindProofCount: 164,
    percentile: "99.5%",
    symbolicAccuracy: "99.9%",
    hourlyRateUsd: 135,
    placementStatus: "Quant & Formal Math Pool",
    proofHash: "0x91e4…30f2",
  },
  {
    id: "vx-04",
    candidateHandle: "VRF-LAW-5074",
    region: "Beijing / HK",
    domain: "Criminal & Commercial Jurisprudence · Top 1.5%",
    blindProofCount: 96,
    percentile: "98.5%",
    symbolicAccuracy: "98.9%",
    hourlyRateUsd: 115,
    placementStatus: "Legal Rubric Bench Available",
    proofHash: "0x2c88…b14d",
  },
  {
    id: "vx-05",
    candidateHandle: "VRF-MIR-7721",
    region: "Madrid, ES",
    domain: "Cardiorenal Pharmacology (MIR) · Top 1.0%",
    blindProofCount: 109,
    percentile: "99.0%",
    symbolicAccuracy: "99.2%",
    hourlyRateUsd: 110,
    placementStatus: "Bilingual Medical Eval Active",
    proofHash: "0x6a10…e49c",
  },
];
