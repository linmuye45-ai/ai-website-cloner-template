import type { Locale } from "@/types/zhongjing";

export const LOCALE_META: {
  code: Locale;
  shortLabel: string;
  fullLabel: string;
  speechLang: string;
}[] = [
  { code: "zh-CN", shortLabel: "简", fullLabel: "简体中文", speechLang: "zh-CN" },
  { code: "zh-TW", shortLabel: "繁", fullLabel: "繁體中文", speechLang: "zh-TW" },
  { code: "en", shortLabel: "EN", fullLabel: "English", speechLang: "en-US" },
  { code: "ja", shortLabel: "日", fullLabel: "日本語", speechLang: "ja-JP" },
];

export interface UiDictionary {
  brandName: string;
  brandSub: string;
  nav: {
    platform: string;
    standards: string;
    agents: string;
    constellation: string;
    safety: string;
    roi: string;
    research: string;
    login: string;
    requestDemo: string;
    megaPlatformDesc: string;
    megaItems: { title: string; desc: string; href: string; tag?: string }[];
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    nonDiagBadge: string;
    nonDiagLink: string;
    studioHeader: string;
    studioSub: string;
    playBtn: string;
    pauseBtn: string;
    voiceSynthOn: string;
    voiceSynthOff: string;
    liveHudTitle: string;
    outcomeLabel: string;
  };
  ledger: {
    sectionTitle: string;
    stats: { value: string; label: string; sub: string }[];
    partnerHeading: string;
  };
  explorer: {
    eyebrow: string;
    title: string;
    subtitle: string;
    sectorAll: string;
    sectorProvider: string;
    sectorPayor: string;
    sectorPharma: string;
    searchPlaceholder: string;
    resetFilters: string;
    activeCountSuffix: string;
    showAllBtn: string;
    collapseBtn: string;
    inspectSop: string;
    drawerSopTitle: string;
    drawerOpeningTitle: string;
    drawerDeployCta: string;
  };
  constellation: {
    eyebrow: string;
    title: string;
    subtitle: string;
    centerNodeTitle: string;
    centerNodeSub: string;
    clickHint: string;
    tierTitle: string;
    tierSubtitle: string;
    creditsLabel: string;
    latencyLabel: string;
    selectTierBtn: string;
  };
  platform: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cardHospitalTitle: string;
    cardHospitalDesc: string;
    cardHospitalCta: string;
    cardPharmaTitle: string;
    cardPharmaDesc: string;
    cardPharmaCta: string;
    workspaceTitle: string;
    tabs: {
      id: "command" | "orchestration" | "vault" | "spaces";
      label: string;
      code: string;
      headline: string;
      desc: string;
      metrics: { k: string; v: string }[];
      bullets: string[];
    }[];
  };
  safety: {
    eyebrow: string;
    title: string;
    subtitle: string;
    phases: { step: string; title: string; desc: string }[];
    chartTitle: string;
    chartSub: string;
    legendCorrect: string;
    legendBenign: string;
    legendMinor: string;
    legendSevere: string;
  };
  roi: {
    eyebrow: string;
    title: string;
    subtitle: string;
    presets: { label: string; discharges: number; nurses: number; readm: number }[];
    sliderDischarges: string;
    sliderNurses: string;
    sliderReadm: string;
    outHours: string;
    outReach: string;
    outPrevented: string;
    outValue: string;
    unitCases: string;
    unitPersons: string;
    bookReportCta: string;
  };
  researchVoices: {
    researchEyebrow: string;
    researchTitle: string;
    filterAll: string;
    filterSafety: string;
    filterSpeech: string;
    filterInference: string;
    filterBenchmarks: string;
    readPaper: string;
    voicesEyebrow: string;
    voicesTitle: string;
  };
  complianceFooter: {
    eyebrow: string;
    title: string;
    subtitle: string;
    detailsLink: string;
    ctaBannerTitle: string;
    ctaBannerSub: string;
    footerTagline: string;
    copyright: string;
  };
  roleWorkbench: {
    eyebrow: string;
    title: string;
    subtitle: string;
    rolePhysician: string;
    roleNurseDirector: string;
    roleHospitalBuyer: string;
    rolePatientCaregiver: string;
    descPhysician: string;
    descNurseDirector: string;
    descHospitalBuyer: string;
    descPatientCaregiver: string;
    tabEvidence: string;
    tabRoster: string;
    tabEscalation: string;
    tabDrgDip: string;
    tabFollowup: string;
    tabAdherence: string;
    btnSwitchRole: string;
    currentRole: string;
  };
  clinicalStandards: {
    eyebrow: string;
    title: string;
    subtitle: string;
    standardNonDiagnostic: string;
    descNonDiagnostic: string;
    detailNonDiagnostic: string;
    standardDataSovereignty: string;
    descDataSovereignty: string;
    detailDataSovereignty: string;
    standardDeterministicEngine: string;
    descDeterministicEngine: string;
    detailDeterministicEngine: string;
    standardFhirArchive: string;
    descFhirArchive: string;
    detailFhirArchive: string;
    standardEscalationBridge: string;
    descEscalationBridge: string;
    detailEscalationBridge: string;
    standardComplianceRedlines: string;
    descComplianceRedlines: string;
    detailComplianceRedlines: string;
    deploymentEyebrow: string;
    deploymentTitle: string;
    tierClinic: string;
    tierClinicDesc: string;
    tierSecondary: string;
    tierSecondaryDesc: string;
    tierTertiary: string;
    tierTertiaryDesc: string;
  };
  modals: {
    demoTitle: string;
    demoSub: string;
    orgLabel: string;
    orgPlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    scenarioLabel: string;
    submitBtn: string;
    submittedTitle: string;
    submittedDesc: string;
    safetyTitle: string;
    safetySub: string;
    safetyPillars: { title: string; body: string }[];
    closeBtn: string;
  };
}

export const UI_DICTIONARY: Record<Locale, UiDictionary> = {
  "zh-CN": {
    brandName: "中净",
    brandSub: "临床 AI 操作系统",
    nav: {
      platform: "临床工作台",
      standards: "临床标准",
      agents: "随访目录",
      constellation: "安全架构",
      safety: "临床验证",
      roi: "效益测算",
      research: "研究",
      login: "院内节点",
      requestDemo: "申请试用",
      megaPlatformDesc: "医院院外语音随访、危急值转接与病历自动归档工作台。",
      megaItems: [
        { title: "随访质控台", desc: "按病区查看接通率与转接耗时。", href: "#platform", tag: "质控" },
        { title: "专科路径库", desc: "1,284 条经科主任审定的随访路径。", href: "#agents" },
        { title: "原声病历库", desc: "院内加密检索出院小结与录音。", href: "#platform" },
        { title: "紫微 6.0 架构", desc: "32 个专科小模型发声前互审。", href: "#constellation", tag: "安全" },
      ],
    },
    hero: {
      eyebrow: "院内闭环临床 AI 操作系统 · SQLite 确定性药典内核",
      headlineLine1: "循证药典、院外随访与病历归档，",
      headlineLine2: "三套临床引擎合入一套医院工作台。",
      subtitle:
        "融合药典肾功折算、32 路发声前语音拦截与原声锚定 SOAP 病程。不下诊断、不改处方，危急体征 1.6 秒转接护师。",
      primaryCta: "申请科室试用",
      secondaryCta: "试听临床录音",
      nonDiagBadge: "严格限定非诊断、非处方临床沟通",
      nonDiagLink: "安全边界说明",
      studioHeader: "临床通话实录",
      studioSub: "左栏对话，右栏同步药典与危急值核验",
      playBtn: "播放",
      pauseBtn: "暂停",
      voiceSynthOn: "语音已开",
      voiceSynthOff: "语音朗读",
      liveHudTitle: "发声前药典与体征核验",
      outcomeLabel: "处置结果",
    },
    ledger: {
      sectionTitle: "生产运行记录",
      stats: [
        { value: "3.68亿", label: "累计随访通话", sub: "覆盖院前、术后与慢病" },
        { value: "0 例", label: "严重不良事件", sub: "非诊断非处方硬锁" },
        { value: "1.6 秒", label: "危急值转接护师", sub: "累计拦截 42,800+ 次" },
        { value: "99.91%", label: "医护盲测准确率", sub: "86 万通双盲评测" },
      ],
      partnerHeading: "部署医学中心与药研机构",
    },
    explorer: {
      eyebrow: "临床路径库",
      title: "1,284 条科室审定随访路径",
      subtitle: "遵循专科指南与护理 SOP，双向对接院内 HIS / EMR。",
      sectorAll: "全部机构",
      sectorProvider: "公立医院",
      sectorPayor: "公卫与商保",
      sectorPharma: "新药与药警",
      searchPlaceholder: "检索病种或手术（如：支架、慢阻肺、肠镜）",
      resetFilters: "重置",
      activeCountSuffix: "条代表路径（点击查看完整 SOP）",
      showAllBtn: "展开全部 11 条代表路径",
      collapseBtn: "收起列表",
      inspectSop: "查看 SOP",
      drawerSopTitle: "标准操作规程（SOP）",
      drawerOpeningTitle: "核身与开场白",
      drawerDeployCta: "申请测试该路径",
    },
    constellation: {
      eyebrow: "紫微 6.0 架构",
      title: "单一模型，不能直接给患者打电话。",
      subtitle:
        "671B 主模型负责温润对话与方言倾听；32 个药典、检验值与重症小模型在发声前 160ms 内执行一票否决。",
      centerNodeTitle: "671B 临床语音主模型",
      centerNodeSub: "162ms 响应 · 适配十大方言与高龄慢语速",
      clickHint: "点击审校通道查看拦截规则",
      tierTitle: "模型规格与部署单价",
      tierSubtitle: "全系内置非处方锁定与护师热转接，支持院内一体机交付。",
      creditsLabel: "并发配额",
      latencyLabel: "响应延迟",
      selectTierBtn: "咨询方案",
    },
    platform: {
      eyebrow: "临床工作台",
      title: "外呼交给系统，判断留给医护。",
      subtitle: "晨会确认出院名单，自动执行第 3、7、14、30 天随访并归档病历。",
      cardHospitalTitle: "三甲医院与紧密型医共体",
      cardHospitalDesc: "覆盖术前宣教、胃肠镜清肠、出院 30 天随访与慢病管理，不增编制实现 97% 随访率。",
      cardHospitalCta: "医院接入方案",
      cardPharmaTitle: "临床试验（CRO）与药物警戒（GVP）",
      cardPharmaDesc: "特药依从管理（PSP）、ePRO 采集与上市后不良事件主动捕获，全程保留原声审计链。",
      cardPharmaCta: "药企合作方案",
      workspaceTitle: "日常工作视图",
      tabs: [
        {
          id: "command",
          label: "质控总览",
          code: "01",
          headline: "全院随访接通率、危急值时效与国考台账",
          desc: "按病区与 DRG 病组汇总延续护理质量，异常患者自动置顶。",
          metrics: [
            { k: "有效接通率", v: "96.8%" },
            { k: "转接护师耗时", v: "1.58 秒" },
            { k: "月省电话工时", v: "14,260 h" },
          ],
          bullets: [
            "自动统计 72 小时与 30 天随访完成率",
            "同步医院 OA / 企业微信科室权限",
            "一键导出公立医院绩效考核台账",
          ],
        },
        {
          id: "orchestration",
          label: "自动排程",
          code: "02",
          headline: "导入出院名单自动外呼，异常实时交班",
          desc: "支持免打扰时段、未接温和重拨与家属核身，自动生成病程小结。",
          metrics: [
            { k: "单机并发线路", v: "400–2,000" },
            { k: "老年方言识别", v: "99.1%" },
            { k: "原声时间绑定", v: "100%" },
          ],
          bullets: [
            "外呼前预览话术提纲与红线阈值",
            "结合近期化验单动态调整追问重点",
            "通过 HL7 FHIR 自动回写院内 EMR",
          ],
        },
        {
          id: "vault",
          label: "病历检索",
          code: "03",
          headline: "院内检索数十万份出院记录与随访原声",
          desc: "按检验值、用药与院后症状快速筛选专病队列，点击即听原声。",
          metrics: [
            { k: "可检索病历", v: "25 万份+" },
            { k: "指标抽取准确", v: "99.3%" },
            { k: "院外数据留存", v: "0 字节" },
          ],
          bullets: [
            "按 eGFR、HbA1c 与依从性筛选队列",
            "摘录同步定位出院小结与录音秒数",
            "数据驻留医院机房，支持断网运行",
          ],
        },
        {
          id: "spaces",
          label: "转诊协同",
          code: "04",
          headline: "三甲医院与社区中心的权限隔离协同",
          desc: "遵循最小必要授权，让专科医师与家庭医生安全共享康复进展。",
          metrics: [
            { k: "下转病摘完整", v: "99.7%" },
            { k: "社区复诊提升", v: "+58.4%" },
            { k: "跨机构调阅", v: "逐笔留痕" },
          ],
          bullets: [
            "跨院区病历字段级权限隔离墙",
            "居家急性加重直锁上级专科号源",
            "支持多中心临床研究伦理合规协作",
          ],
        },
      ],
    },
    safety: {
      eyebrow: "临床验证",
      title: "9,200 名医护、86 万通电话双盲检验。",
      subtitle: "每条路径上线前均须通过五道临床准入关卡。",
      phases: [
        { step: "01", title: "32 模型发声前互审", desc: "160ms 内并行核对药典剂量与危急值。" },
        { step: "02", title: "86 万通医护对抗盲测", desc: "主治医师与护师模拟高龄多病患者压测。" },
        { step: "03", title: "科室主任签字审定", desc: "话术提纲与转接红线经临床主任书面确认。" },
        { step: "04", title: "1.6 秒不断线转接护师", desc: "遇胸痛、气促、低血氧或停药即刻并入人工。" },
        { step: "05", title: "生产环境每日抽检", desc: "自动比对随访录音与 30 天复诊结局。" },
      ],
      chartTitle: "860,000 通临床盲测安全性对比",
      chartSub: "独立临床评审组四级医疗风险盲判",
      legendCorrect: "符合规范",
      legendBenign: "措辞差异（无风险）",
      legendMinor: "轻度风险",
      legendSevere: "严重风险",
    },
    roi: {
      eyebrow: "效益测算",
      title: "测算可释放的护师工时与 DRG 结余",
      subtitle: "基于已上线三甲医院中位运行台账折算。",
      presets: [
        { label: "单体三甲医院", discharges: 85000, nurses: 60, readm: 8.5 },
        { label: "省级医学中心", discharges: 220000, nurses: 150, readm: 9.2 },
        { label: "城市医联体", discharges: 450000, nurses: 320, readm: 10.4 },
      ],
      sliderDischarges: "年出院及纳管慢病人次",
      sliderNurses: "承担电话随访护师人数",
      sliderReadm: "30 天非计划再入院率",
      outHours: "年释放护师工时",
      outReach: "年规范随访通话",
      outPrevented: "年减少再入院（例）",
      outValue: "年度人力释放与 DRG 综合结余",
      unitCases: "人次",
      unitPersons: "人",
      bookReportCta: "获取科室试点测算单",
    },
    researchVoices: {
      researchEyebrow: "技术报告",
      researchTitle: "临床对齐、方言声学与院内推理研究",
      filterAll: "全部",
      filterSafety: "安全对齐",
      filterSpeech: "方言声学",
      filterInference: "院内推理",
      filterBenchmarks: "临床评测",
      readPaper: "摘要",
      voicesEyebrow: "医院反馈",
      voicesTitle: "来自临床一线的使用记录",
    },
    complianceFooter: {
      eyebrow: "数据主权与合规",
      title: "数据全程不出院，支持信创断网部署。",
      subtitle: "国密 SM4 加密、声纹脱敏、院内统一认证，零外部模型训练留存。",
      detailsLink: "详情",
      ctaBannerTitle: "先在一个重点科室开通测试专线",
      ctaBannerSub: "2 小时内配置心内、呼吸、内镜或特药随访脱敏分机。",
      footerTagline: "非诊断临床语音随访与院外患者安全管理",
      copyright:
        "© 2026 中净医疗智能科技有限公司 · 京ICP备2026089120号 · 卫健委备案 NHC-AI-0049",
    },
    roleWorkbench: {
      eyebrow: "四角色临床工作台",
      title: "按角色切换，各司其职的临床协作界面",
      subtitle: "同一套 SQLite 临床数据，四种视角，零重复造轮子。",
      rolePhysician: "临床医师",
      roleNurseDirector: "护理部主任",
      roleHospitalBuyer: "医院采购/院长",
      rolePatientCaregiver: "患者/家属",
      descPhysician: "循证药典、肾功折算、多药配伍禁忌、处方安全审核。",
      descNurseDirector: "出院患者队列、SBAR 转接工单、危急值分派、护理质量看板。",
      descHospitalBuyer: "DRG/DIP 付费模拟、投资回报测算、科室运营分析、分层部署方案。",
      descPatientCaregiver: "院外随访语音、用药依从提醒、安全回复、非诊断健康指引。",
      tabEvidence: "循证药典",
      tabRoster: "患者队列",
      tabEscalation: "SBAR 转接",
      tabDrgDip: "DRG/DIP 付费",
      tabFollowup: "院外随访",
      tabAdherence: "用药依从",
      btnSwitchRole: "切换角色",
      currentRole: "当前角色",
    },
    clinicalStandards: {
      eyebrow: "临床标准与合规框架",
      title: "面向医疗机构的企业级临床 AI 标准",
      subtitle: "每一项功能均围绕医疗质量、数据安全与合规落地而设计。",
      standardNonDiagnostic: "非诊断边界锁恒",
      descNonDiagnostic: "系统仅提供非诊断性院外沟通与随访支持，禁止输出确诊结论；异常体征 1.6 秒内接入人工护师。",
      detailNonDiagnostic: "NON_DIAGNOSTIC_BOUNDARY · 硬锁定，不可绕过",
      standardDataSovereignty: "院内数据主权",
      descDataSovereignty: "患者数据全程留在医院内网，禁止上传公有云；传输与存储使用国密 SM4 加密，支持信创断网部署。",
      detailDataSovereignty: "DATA_SOVEREIGNTY · SM4 加密 · 纯内网交付",
      standardDeterministicEngine: "确定性药典引擎",
      descDeterministicEngine: "基于 KDIGO 2024、国家医保目录与 RxNorm 的 SQLite 确定性核验，eGFR、血钾、配伍禁忌与危急值毫秒级响应。",
      detailDeterministicEngine: "DETERMINISTIC_ENGINE · KDIGO 2024 · NRDL · RxNorm",
      standardFhirArchive: "HL7 FHIR R4 归档",
      descFhirArchive: "随访记录与 SOAP 病程按 FHIR R4 标准结构化，支持 ICD-10 自动编码与 DRG 权重，一键写入院内 EMR。",
      detailFhirArchive: "FHIR_R4 · ICD-10 · DRG 权重 · EMR 写回",
      standardEscalationBridge: "危急值护师转接",
      descEscalationBridge: "32 路发声前确定性核验，触发危急值时 1.6 秒内建立 SBAR 工单并并入值班主管护师。",
      detailEscalationBridge: "ESCALATION_BRIDGE · 1.6s 并入 · SBAR 工单",
      standardComplianceRedlines: "合规红线守恒",
      descComplianceRedlines: "非处方硬锁、禁止诊断越界、院内数据不出域；每一轮语音与病历条目保留完整审计痕迹，留存期不少于 5 年。",
      detailComplianceRedlines: "COMPLIANCE_REDLINES · 5 年审计留存",
      deploymentEyebrow: "医院分级部署",
      deploymentTitle: "按医院等级匹配交付模式",
      tierClinic: "诊所 / 门诊部",
      tierClinicDesc: "轻量 SaaS，按席位付费，移动端优先。",
      tierSecondary: "二级医院",
      tierSecondaryDesc: "云混合部署，轻量临床工作台，核心数据留院内。",
      tierTertiary: "三级医院",
      tierTertiaryDesc: "纯内网断网部署，国密 SM4 加密，最高级别数据主权。",
    },
    modals: {
      demoTitle: "申请临床科室试用",
      demoSub: "2 小时内为您开通对应专科的脱敏测试电话专线与 SOP 提纲。",
      orgLabel: "机构名称",
      orgPlaceholder: "如：上海瑞金医院 心内科",
      roleLabel: "科室与职务",
      rolePlaceholder: "如：护理部主任 / 信息中心主任",
      phoneLabel: "联系电话或邮箱",
      phonePlaceholder: "用于接收测试分机号",
      scenarioLabel: "试用专科或路径",
      submitBtn: "提交申请",
      submittedTitle: "申请已登记",
      submittedDesc: "工单 #ZJ-8942 已生成，医学工程师将在 2 小时内联系您。",
      safetyTitle: "临床安全与非诊断边界说明",
      safetySub: "3.68 亿通通话零严重不良事件的四项硬约束：",
      safetyPillars: [
        { title: "一、非诊断与非处方硬锁定", body: "绝不下达诊断结论，绝不擅自增减处方剂量；诊疗调整一律引导复诊。" },
        { title: "二、32 模型发声前并行否决", body: "160ms 内同步完成药典核对与危急体征审查，存疑即刻拦截。" },
        { title: "三、危急征兆 1.6 秒转接护师", body: "胸痛、气促、低血氧或停药立即保持通话并入值班护师坐席。" },
        { title: "四、数据 100% 驻留院内", body: "支持医院自有信创机房闭环运行，绝不用于院外模型训练。" },
      ],
      closeBtn: "关闭",
    },
  },

  "zh-TW": {
    brandName: "中淨",
    brandSub: "臨床 AI 作業系統",
    nav: {
      platform: "臨床工作台",
      standards: "臨床標準",
      agents: "隨訪目錄",
      constellation: "安全架構",
      safety: "臨床驗證",
      roi: "效益測算",
      research: "研究",
      login: "院內節點",
      requestDemo: "申請試用",
      megaPlatformDesc: "醫院院外語音隨訪、危急值轉接與病歷自動歸檔工作台。",
      megaItems: [
        { title: "隨訪品管台", desc: "依病房檢視接通率與轉接耗時。", href: "#platform", tag: "品管" },
        { title: "專科路徑庫", desc: "1,284 條經科主任審定的隨訪路徑。", href: "#agents" },
        { title: "原聲病歷庫", desc: "院內加密檢索出院病摘與錄音。", href: "#platform" },
        { title: "紫微 6.0 架構", desc: "32 個專科小模型發聲前互審。", href: "#constellation", tag: "安全" },
      ],
    },
    hero: {
      eyebrow: "院內閉環臨床 AI 作業系統 · 確定性藥典內核",
      headlineLine1: "實證藥典、院外隨訪與病歷歸檔，",
      headlineLine2: "三套臨床引擎合入一套醫院工作台。",
      subtitle:
        "融合藥典腎功折算、32 路發聲前語音攔截與原聲錨定 SOAP 病程。不下診斷、不改處方，危急體徵 1.6 秒轉接護理師。",
      primaryCta: "申請科室試用",
      secondaryCta: "試聽臨床錄音",
      nonDiagBadge: "嚴格限定非診斷、非處方臨床溝通",
      nonDiagLink: "安全邊界說明",
      studioHeader: "臨床通話實錄",
      studioSub: "左欄對話，右欄同步藥典與危急值核驗",
      playBtn: "播放",
      pauseBtn: "暫停",
      voiceSynthOn: "語音已開",
      voiceSynthOff: "語音朗讀",
      liveHudTitle: "發聲前藥典與體徵核驗",
      outcomeLabel: "處置結果",
    },
    ledger: {
      sectionTitle: "生產運行紀錄",
      stats: [
        { value: "3.68億", label: "累計隨訪通話", sub: "涵蓋術前、術後與慢病" },
        { value: "0 例", label: "嚴重不良事件", sub: "非診斷非處方硬鎖" },
        { value: "1.6 秒", label: "危急值轉接護理師", sub: "累計攔截 42,800+ 次" },
        { value: "99.91%", label: "醫護盲測準確率", sub: "86 萬通雙盲評測" },
      ],
      partnerHeading: "部署醫學中心與藥研機構",
    },
    explorer: {
      eyebrow: "臨床路徑庫",
      title: "1,284 條科部審定隨訪路徑",
      subtitle: "遵循專科指引與護理 SOP，雙向介接院內 HIS / EMR。",
      sectorAll: "全部機構",
      sectorProvider: "醫學中心",
      sectorPayor: "公衛與健保",
      sectorPharma: "新藥與藥警",
      searchPlaceholder: "檢索病種或手術（如：支架、肺阻塞、腸鏡）",
      resetFilters: "重置",
      activeCountSuffix: "條代表路徑（點擊檢視完整 SOP）",
      showAllBtn: "展開全部 11 條代表路徑",
      collapseBtn: "收起列表",
      inspectSop: "檢視 SOP",
      drawerSopTitle: "標準作業程序（SOP）",
      drawerOpeningTitle: "核身與開場白",
      drawerDeployCta: "申請測試該路徑",
    },
    constellation: {
      eyebrow: "紫微 6.0 架構",
      title: "單一模型，不能直接給病患打電話。",
      subtitle:
        "671B 主模型負責溫和對話與方言傾聽；32 個藥典、檢驗值與重症小模型在發聲前 160ms 內執行一票否決。",
      centerNodeTitle: "671B 臨床語音主模型",
      centerNodeSub: "162ms 響應 · 適配多方言與高齡慢語速",
      clickHint: "點擊審校通道檢視攔截規則",
      tierTitle: "模型規格與部署單價",
      tierSubtitle: "全系內建非處方鎖定與護理師熱轉接，支援院內伺服器交付。",
      creditsLabel: "並發配額",
      latencyLabel: "響應延遲",
      selectTierBtn: "諮詢方案",
    },
    platform: {
      eyebrow: "臨床工作台",
      title: "外呼交給系統，判斷留給醫護。",
      subtitle: "晨會確認出院名單，自動執行第 3、7、14、30 天隨訪並歸檔病歷。",
      cardHospitalTitle: "醫學中心與區域醫療聯盟",
      cardHospitalDesc: "涵蓋術前衛教、腸胃鏡清腸、出院 30 天隨訪與慢病管理，不增人力達成 97% 隨訪率。",
      cardHospitalCta: "醫院介接方案",
      cardPharmaTitle: "臨床試驗（CRO）與藥物警戒（GVP）",
      cardPharmaDesc: "特藥順從管理（PSP）、ePRO 採集與上市後不良事件主動捕獲，全程保留原聲審計鏈。",
      cardPharmaCta: "藥企合作方案",
      workspaceTitle: "日常工作視圖",
      tabs: [
        {
          id: "command",
          label: "品管總覽",
          code: "01",
          headline: "全院隨訪接通率、危急值時效與評鑑台帳",
          desc: "依病房與 DRG 病組彙整延續照護品質，異常病患自動置頂。",
          metrics: [
            { k: "有效接通率", v: "96.8%" },
            { k: "轉接護理師耗時", v: "1.58 秒" },
            { k: "月省電話工時", v: "14,260 h" },
          ],
          bullets: [
            "自動統計 72 小時與 30 天隨訪完成率",
            "同步醫院 SSO 單一簽入科別權限",
            "一鍵匯出醫院評鑑延續照護台帳",
          ],
        },
        {
          id: "orchestration",
          label: "自動排程",
          code: "02",
          headline: "匯入出院名單自動外呼，異常即時交班",
          desc: "支援免打擾時段、未接溫和重撥與家屬核身，自動產生病程小結。",
          metrics: [
            { k: "單機並發線路", v: "400–2,000" },
            { k: "高齡方言辨識", v: "99.1%" },
            { k: "原聲時間綁定", v: "100%" },
          ],
          bullets: [
            "外呼前預覽話術提綱與紅線閾值",
            "結合近期檢驗單動態調整追問重點",
            "透過 HL7 FHIR 自動回寫院內 EMR",
          ],
        },
        {
          id: "vault",
          label: "病歷檢索",
          code: "03",
          headline: "院內檢索數十萬份出院紀錄與隨訪原聲",
          desc: "依檢驗值、用藥與院後症狀快速篩選專病世代，點擊即聽原聲。",
          metrics: [
            { k: "可檢索病歷", v: "25 萬份+" },
            { k: "指標抽取準確", v: "99.3%" },
            { k: "院外資料留存", v: "0 Byte" },
          ],
          bullets: [
            "依 eGFR、HbA1c 與順從性篩選世代",
            "摘錄同步定位出院病摘與錄音秒數",
            "資料駐留醫院機房，支援斷網運行",
          ],
        },
        {
          id: "spaces",
          label: "轉診協同",
          code: "04",
          headline: "醫學中心與基層診所之權限隔離協同",
          desc: "遵循最小必要授權，讓專科醫師與家庭醫師安全共享復健進展。",
          metrics: [
            { k: "下轉病摘完整", v: "99.7%" },
            { k: "診所回診提升", v: "+58.4%" },
            { k: "跨機構調閱", v: "逐筆留痕" },
          ],
          bullets: [
            "跨院區病歷欄位級權限隔離牆",
            "居家急性惡化直鎖上級專科號源",
            "支援多中心臨床研究倫理合規協作",
          ],
        },
      ],
    },
    safety: {
      eyebrow: "臨床驗證",
      title: "9,200 名醫護、86 萬通電話雙盲檢驗。",
      subtitle: "每條路徑上線前均須通過五道臨床准入關卡。",
      phases: [
        { step: "01", title: "32 模型發聲前互審", desc: "160ms 內並行核對藥典劑量與危急值。" },
        { step: "02", title: "86 萬通醫護對抗盲測", desc: "主治醫師與護理師模擬高齡共病病患壓測。" },
        { step: "03", title: "科部主任簽署審定", desc: "話術提綱與轉接紅線經臨床主任書面確認。" },
        { step: "04", title: "1.6 秒不斷線轉接護理師", desc: "遇胸痛、喘促、低血氧或停藥即刻併入人工。" },
        { step: "05", title: "生產環境每日抽檢", desc: "自動比對隨訪錄音與 30 天回診結局。" },
      ],
      chartTitle: "860,000 通臨床盲測安全性對比",
      chartSub: "獨立臨床評審組四級醫療風險盲判",
      legendCorrect: "符合規範",
      legendBenign: "措辭差異（無風險）",
      legendMinor: "輕度風險",
      legendSevere: "嚴重風險",
    },
    roi: {
      eyebrow: "效益測算",
      title: "測算可釋放之護理工時與 DRG 結餘",
      subtitle: "基於已上線醫學中心中位運行台帳折算。",
      presets: [
        { label: "區域教學醫院", discharges: 85000, nurses: 60, readm: 8.5 },
        { label: "大型醫學中心", discharges: 220000, nurses: 150, readm: 9.2 },
        { label: "跨院醫療體系", discharges: 450000, nurses: 320, readm: 10.4 },
      ],
      sliderDischarges: "年出院及納管慢病人次",
      sliderNurses: "承擔電話隨訪護理師人數",
      sliderReadm: "30 天非計畫再入院率",
      outHours: "年釋放護理師工時",
      outReach: "年規範隨訪通話",
      outPrevented: "年減少再入院（例）",
      outValue: "年度人力釋放與 DRG 綜合結餘",
      unitCases: "人次",
      unitPersons: "人",
      bookReportCta: "索取科別試點測算單",
    },
    researchVoices: {
      researchEyebrow: "技術報告",
      researchTitle: "臨床對齊、方言聲學與院內推理研究",
      filterAll: "全部",
      filterSafety: "安全對齊",
      filterSpeech: "方言聲學",
      filterInference: "院內推理",
      filterBenchmarks: "臨床評測",
      readPaper: "摘要",
      voicesEyebrow: "醫院回饋",
      voicesTitle: "來自臨床一線的使用紀錄",
    },
    complianceFooter: {
      eyebrow: "資料主權與合規",
      title: "資料全程不出院，支援純內網斷網部署。",
      subtitle: "SM4 加密、聲紋去識別、院內單一簽入，零外部模型訓練留存。",
      detailsLink: "詳情",
      ctaBannerTitle: "先在一個重點科別開通測試專線",
      ctaBannerSub: "2 小時內配置心內、胸腔、內視鏡或特藥隨訪測試分機。",
      footerTagline: "非診斷臨床語音隨訪與院外病患安全管理",
      copyright:
        "© 2026 中淨醫療智能科技有限公司 · 醫療AI備案 NHC-AI-0049",
    },
    roleWorkbench: {
      eyebrow: "四角色臨床工作台",
      title: "按角色切換，各司其職的臨床協作介面",
      subtitle: "同一套 SQLite 臨床資料，四種視角，零重複造輪子。",
      rolePhysician: "臨床醫師",
      roleNurseDirector: "護理部主任",
      roleHospitalBuyer: "醫院採購/院長",
      rolePatientCaregiver: "病患/家屬",
      descPhysician: "循證藥典、腎功折算、多藥配伍禁忌、處方安全審核。",
      descNurseDirector: "出院病患隊列、SBAR 轉接工單、危急值分派、護理品質看板。",
      descHospitalBuyer: "DRG/DIP 付費模擬、投資回報試算、科室營運分析、分層部署方案。",
      descPatientCaregiver: "院外隨訪語音、用藥依從提醒、安全回覆、非診斷健康指引。",
      tabEvidence: "循證藥典",
      tabRoster: "病患隊列",
      tabEscalation: "SBAR 轉接",
      tabDrgDip: "DRG/DIP 付費",
      tabFollowup: "院外隨訪",
      tabAdherence: "用藥依從",
      btnSwitchRole: "切換角色",
      currentRole: "目前角色",
    },
    clinicalStandards: {
      eyebrow: "臨床標準與合規框架",
      title: "面向醫療機構的企業級臨床 AI 標準",
      subtitle: "每一項功能均圍繞醫療品質、資料安全與合規落地而設計。",
      standardNonDiagnostic: "非診斷邊界鎖恆",
      descNonDiagnostic: "系統僅提供非診斷性院外溝通與隨訪支持，禁止輸出確診結論；異常體征 1.6 秒內接入人工護師。",
      detailNonDiagnostic: "NON_DIAGNOSTIC_BOUNDARY · 硬鎖定，不可繞過",
      standardDataSovereignty: "院內資料主權",
      descDataSovereignty: "病患資料全程留在醫院內網，禁止上傳公有雲；傳輸與儲存使用國密 SM4 加密，支援純內網斷網部署。",
      detailDataSovereignty: "DATA_SOVEREIGNTY · SM4 加密 · 純內網交付",
      standardDeterministicEngine: "確定性藥典引擎",
      descDeterministicEngine: "基於 KDIGO 2024、國家醫保目錄與 RxNorm 的 SQLite 確定性核驗，eGFR、血鉀、配伍禁忌與危急值毫秒級響應。",
      detailDeterministicEngine: "DETERMINISTIC_ENGINE · KDIGO 2024 · NRDL · RxNorm",
      standardFhirArchive: "HL7 FHIR R4 歸檔",
      descFhirArchive: "隨訪記錄與 SOAP 病程按 FHIR R4 標準結構化，支援 ICD-10 自動編碼與 DRG 權重，一鍵寫入院內 EMR。",
      detailFhirArchive: "FHIR_R4 · ICD-10 · DRG 權重 · EMR 寫回",
      standardEscalationBridge: "危急值護師轉接",
      descEscalationBridge: "32 路發聲前確定性核驗，觸發危急值時 1.6 秒內建立 SBAR 工單並併入值班主管護師。",
      detailEscalationBridge: "ESCALATION_BRIDGE · 1.6s 併入 · SBAR 工單",
      standardComplianceRedlines: "合規紅線守恆",
      descComplianceRedlines: "非處方硬鎖、禁止診斷越界、院內資料不出域；每一輪語音與病歷條目保留完整審計痕跡，留存期不少於 5 年。",
      detailComplianceRedlines: "COMPLIANCE_REDLINES · 5 年審計留存",
      deploymentEyebrow: "醫院分級部署",
      deploymentTitle: "按醫院等級匹配交付模式",
      tierClinic: "診所 / 門診部",
      tierClinicDesc: "輕量 SaaS，按席位付費，移動端優先。",
      tierSecondary: "二級醫院",
      tierSecondaryDesc: "雲混合部署，輕量臨床工作台，核心資料留院內。",
      tierTertiary: "三級醫院",
      tierTertiaryDesc: "純內網斷網部署，國密 SM4 加密，最高級別資料主權。",
    },
    modals: {
      demoTitle: "申請臨床科別試用",
      demoSub: "2 小時內為您開通對應專科之去識別化測試專線與 SOP 提綱。",
      orgLabel: "機構名稱",
      orgPlaceholder: "如：華東協和醫院 心臟內科",
      roleLabel: "科別與職務",
      rolePlaceholder: "如：護理部主任 / 資訊主任",
      phoneLabel: "聯絡電話或信箱",
      phonePlaceholder: "用於接收測試分機號",
      scenarioLabel: "試用專科或路徑",
      submitBtn: "提交申請",
      submittedTitle: "申請已登記",
      submittedDesc: "工單 #ZJ-8942 已產生，醫學工程師將於 2 小時內聯繫您。",
      safetyTitle: "臨床安全與非診斷邊界說明",
      safetySub: "3.68 億通通話零嚴重不良事件的四項硬約束：",
      safetyPillars: [
        { title: "一、非診斷與非處方硬鎖定", body: "絕不下達診斷結論，絕不擅自增減處方劑量；診療調整一律引導回診。" },
        { title: "二、32 模型發聲前並行否決", body: "160ms 內同步完成藥典核對與危急體徵審查，存疑即刻攔截。" },
        { title: "三、危急徵兆 1.6 秒轉接護理師", body: "胸痛、喘促、低血氧或停藥立即保持通話併入值班護理師坐席。" },
        { title: "四、資料 100% 駐留院內", body: "支援醫院自有機房閉環運行，絕不用於院外模型訓練。" },
      ],
      closeBtn: "關閉",
    },
  },

  en: {
    brandName: "ZhongJing",
    brandSub: "Clinical AI OS",
    nav: {
      platform: "Clinical OS",
      standards: "Clinical Standards",
      agents: "Protocols",
      constellation: "Architecture",
      safety: "Validation",
      roi: "Impact",
      research: "Research",
      login: "Intranet Node",
      requestDemo: "Request Pilot",
      megaPlatformDesc: "Post-discharge voice outreach, nurse escalation, and EHR charting.",
      megaItems: [
        { title: "Quality Console", desc: "Reach rates and escalation speed by ward.", href: "#platform", tag: "QA" },
        { title: "Protocol Library", desc: "1,284 department-approved clinical pathways.", href: "#agents" },
        { title: "Chart & Audio Vault", desc: "On-premise search across calls and charts.", href: "#platform" },
        { title: "ZiWei 6.0 Core", desc: "32 pharmacopeia & vital verifiers per turn.", href: "#constellation", tag: "Safety" },
      ],
    },
    hero: {
      eyebrow: "Air-Gapped Hospital Clinical AI OS · Deterministic SQLite Core",
      headlineLine1: "Evidence, voice outreach, and EMR charting,",
      headlineLine2: "unified in one hospital workbench.",
      subtitle:
        "Uniting KDIGO/RxNorm dosing checks, 32-gate pre-speech voice guardrails, and audio-anchored HL7 FHIR R4 notes—never diagnosing or altering prescriptions.",
      primaryCta: "Request Department Pilot",
      secondaryCta: "Hear Clinical Calls",
      nonDiagBadge: "Strictly non-diagnostic, non-prescribing scope",
      nonDiagLink: "Safety Charter",
      studioHeader: "Clinical Call Studio",
      studioSub: "Transcript on the left, live pharmacopeia checks on the right",
      playBtn: "Play",
      pauseBtn: "Pause",
      voiceSynthOn: "Audio On",
      voiceSynthOff: "Enable Audio",
      liveHudTitle: "Pre-Speech Pharmacopeia & Vitals Audit",
      outcomeLabel: "Disposition",
    },
    ledger: {
      sectionTitle: "Production Record",
      stats: [
        { value: "368M", label: "Patient calls completed", sub: "Prep, discharge & chronic care" },
        { value: "0", label: "Severe harm events", sub: "Hard non-prescribing lock" },
        { value: "1.6s", label: "Live nurse handoff", sub: "42,800+ acute escalations" },
        { value: "99.91%", label: "Clinician blind accuracy", sub: "860,000 audited test calls" },
      ],
      partnerHeading: "Deployed Medical Centers & Biopharma",
    },
    explorer: {
      eyebrow: "Protocol Directory",
      title: "1,284 Department-Certified Voice Protocols",
      subtitle: "Built from specialty SOPs with bidirectional HL7 FHIR R4 integration.",
      sectorAll: "All",
      sectorProvider: "Hospitals",
      sectorPayor: "Payors",
      sectorPharma: "Biopharma",
      searchPlaceholder: "Search condition or procedure (e.g., stent, COPD, endoscopy)",
      resetFilters: "Reset",
      activeCountSuffix: "featured protocols (click for full SOP)",
      showAllBtn: "Show all 11 featured protocols",
      collapseBtn: "Show fewer",
      inspectSop: "View SOP",
      drawerSopTitle: "Standard Operating Procedure (SOP)",
      drawerOpeningTitle: "Verified Opening Script",
      drawerDeployCta: "Pilot This Protocol",
    },
    constellation: {
      eyebrow: "ZiWei 6.0 Architecture",
      title: "No single LLM should call patients alone.",
      subtitle:
        "A 671B dialogue model handles natural speech and regional dialects; 32 pharmacology and vital-sign models enforce deterministic veto power under 160ms.",
      centerNodeTitle: "671B Clinical Dialogue Core",
      centerNodeSub: "162ms response · Dialect & geriatric speech adaptive",
      clickHint: "Select any lane to inspect its veto rule",
      tierTitle: "Model Tiers & Sizing",
      tierSubtitle: "All tiers enforce Rx locks and 1.6s RN transfer on hospital appliances.",
      creditsLabel: "Quota",
      latencyLabel: "Latency",
      selectTierBtn: "Inquire",
    },
    platform: {
      eyebrow: "Clinical Workspace",
      title: "Automate phone outreach. Keep judgment human.",
      subtitle: "Approve the morning discharge list once; Day 3–30 calls and SOAP notes run automatically.",
      cardHospitalTitle: "Tertiary Hospitals & Health Networks",
      cardHospitalDesc: "Pre-procedure prep, bowel-prep checks, and 30-day discharge outreach—97% reach with zero added headcount.",
      cardHospitalCta: "Hospital IT Spec",
      cardPharmaTitle: "Clinical Trials & Pharmacovigilance",
      cardPharmaDesc: "Specialty drug adherence (PSP), scheduled ePROs, and active adverse-event capture with audio audit trails.",
      cardPharmaCta: "Biopharma Spec",
      workspaceTitle: "Workstation Views",
      tabs: [
        {
          id: "command",
          label: "Quality",
          code: "01",
          headline: "Ward reach rates, escalation speed, and accreditation ledgers",
          desc: "Surfaces unreached or symptomatic DRG cohort patients at the top of the shift queue.",
          metrics: [
            { k: "Effective reach", v: "96.8%" },
            { k: "Nurse transfer", v: "1.58 s" },
            { k: "Hours saved / mo", v: "14,260 h" },
          ],
          bullets: [
            "72-hour and 30-day completion by clinical ward",
            "Synced with hospital SAML SSO permissions",
            "One-click accreditation audit export",
          ],
        },
        {
          id: "orchestration",
          label: "Scheduling",
          code: "02",
          headline: "Approve roster once; red flags route straight to nurses",
          desc: "Respects quiet hours, verifies caregivers, and files audio-cited SOAP notes.",
          metrics: [
            { k: "Lines / appliance", v: "400–2,000" },
            { k: "Dialect ASR", v: "99.1%" },
            { k: "Audio citation", v: "100%" },
          ],
          bullets: [
            "Preview thresholds before cohort launch",
            "Adapts questions to recent K+, eGFR & HbA1c labs",
            "Bidirectional HL7 FHIR R4 EMR write-back",
          ],
        },
        {
          id: "vault",
          label: "Archive",
          code: "03",
          headline: "Query 250,000+ longitudinal charts and call audio on-premise",
          desc: "Screen cohorts by labs, medications, and symptoms with instant audio playback.",
          metrics: [
            { k: "Indexed charts", v: "250k+" },
            { k: "Entity F1", v: "99.3%" },
            { k: "External retention", v: "0 Bytes" },
          ],
          bullets: [
            "Filter cohorts across labs and drug adherence",
            "Every finding links to exact call timestamp",
            "Air-gapped inside hospital server rooms",
          ],
        },
        {
          id: "spaces",
          label: "Referrals",
          code: "04",
          headline: "Permission-scoped continuity across hospitals and GP clinics",
          desc: "Lets specialists and community physicians coordinate care under strict PIPL walls.",
          metrics: [
            { k: "Summary integrity", v: "99.7%" },
            { k: "GP retention", v: "+58.4%" },
            { k: "Access audit", v: "Per-query" },
          ],
          bullets: [
            "Field-level walls across care settings",
            "Fast-track specialist booking on deterioration",
            "Compliant sponsor, CRO & site collaboration",
          ],
        },
      ],
    },
    safety: {
      eyebrow: "Clinical Validation",
      title: "Blind-tested across 860,000 calls by 9,200+ clinicians.",
      subtitle: "Five mandatory clinical gates before hospital deployment.",
      phases: [
        { step: "01", title: "32-Model Pre-Speech Veto", desc: "Audits dosing and red-flag vitals within 160ms." },
        { step: "02", title: "860k Clinician Stress Calls", desc: "Physicians and RNs role-play complex elderly patients." },
        { step: "03", title: "Department Chair Sign-Off", desc: "Written approval on every script and threshold." },
        { step: "04", title: "1.6s Live Nurse Bridge", desc: "Instant transfer with SBAR card on acute symptoms." },
        { step: "05", title: "Daily Production Sampling", desc: "Cross-checks calls against 30-day outcomes." },
      ],
      chartTitle: "Safety Evaluation by Architecture (n = 860,000)",
      chartSub: "Independent 4-tier clinical harm grading",
      legendCorrect: "Appropriate",
      legendBenign: "Minor variance (0 risk)",
      legendMinor: "Minor risk",
      legendSevere: "Severe risk",
    },
    roi: {
      eyebrow: "Impact Calculator",
      title: "Estimate nursing hours reclaimed & DRG savings",
      subtitle: "Modeled from deployed tertiary hospital ledgers.",
      presets: [
        { label: "Tertiary Hospital", discharges: 85000, nurses: 60, readm: 8.5 },
        { label: "Academic Center", discharges: 220000, nurses: 150, readm: 9.2 },
        { label: "Health System", discharges: 450000, nurses: 320, readm: 10.4 },
      ],
      sliderDischarges: "Annual discharges & chronic cohort",
      sliderNurses: "Nurses on phone outreach",
      sliderReadm: "Baseline 30-day readmission rate",
      outHours: "Nursing hours saved / yr",
      outReach: "Standardized calls / yr",
      outPrevented: "Avoided readmissions / yr",
      outValue: "Estimated annual net quality savings",
      unitCases: "pts",
      unitPersons: "RNs",
      bookReportCta: "Request Department Pilot Sheet",
    },
    researchVoices: {
      researchEyebrow: "Publications",
      researchTitle: "Safety alignment, dialect speech & intranet inference",
      filterAll: "All",
      filterSafety: "Safety",
      filterSpeech: "Speech",
      filterInference: "Inference",
      filterBenchmarks: "Benchmarks",
      readPaper: "Abstract",
      voicesEyebrow: "Field Notes",
      voicesTitle: "From hospital leaders & pharmacovigilance teams",
    },
    complianceFooter: {
      eyebrow: "Security & Governance",
      title: "100% inside hospital firewalls. Air-gapped ready.",
      subtitle: "SM4 encryption, voice de-identification, hospital SSO, and zero external training.",
      detailsLink: "Spec",
      ctaBannerTitle: "Pilot ZhongJing in one department first",
      ctaBannerSub: "Test extensions provisioned within two hours.",
      footerTagline: "Non-diagnostic clinical voice outreach & patient safety",
      copyright:
        "© 2026 ZhongJing Clinical AI Technologies · ICP 2026089120 · NHC-AI-0049",
    },
    roleWorkbench: {
      eyebrow: "Four-Role Clinical Workbench",
      title: "Role-based interfaces, each purpose-built",
      subtitle: "One SQLite clinical dataset, four views, zero duplicated effort.",
      rolePhysician: "Physician",
      roleNurseDirector: "Nurse Director",
      roleHospitalBuyer: "Hospital Buyer / CFO",
      rolePatientCaregiver: "Patient / Caregiver",
      descPhysician: "Evidence formulary, renal dosing, multi-drug DDI checks, prescription safety review.",
      descNurseDirector: "Discharged patient roster, SBAR escalation queue, critical-value triage, nursing quality dashboard.",
      descHospitalBuyer: "DRG/DIP payment simulation, ROI calculator, department operations analysis, tiered deployment plans.",
      descPatientCaregiver: "Post-discharge voice follow-up, medication adherence reminders, safe spoken replies, non-diagnostic health guidance.",
      tabEvidence: "Evidence Formulary",
      tabRoster: "Patient Roster",
      tabEscalation: "SBAR Escalation",
      tabDrgDip: "DRG/DIP Payment",
      tabFollowup: "Post-Discharge Follow-up",
      tabAdherence: "Medication Adherence",
      btnSwitchRole: "Switch Role",
      currentRole: "Current Role",
    },
    clinicalStandards: {
      eyebrow: "Clinical Standards & Compliance Framework",
      title: "Enterprise-Grade Clinical AI Standards for Healthcare Institutions",
      subtitle: "Every feature is designed around medical quality, data security, and compliant deployment.",
      standardNonDiagnostic: "Non-Diagnostic Boundary Lock",
      descNonDiagnostic: "System provides non-diagnostic post-discharge communication and follow-up support only; no diagnostic conclusions are issued. Red-flag symptoms are bridged to a human RN within 1.6 seconds.",
      detailNonDiagnostic: "NON_DIAGNOSTIC_BOUNDARY · Hard lock, non-bypassable",
      standardDataSovereignty: "In-Hospital Data Sovereignty",
      descDataSovereignty: "Patient data remains entirely within the hospital intranet; no upload to public cloud. Transmission and storage use SM4 encryption. Supports air-gapped on-premise deployment.",
      detailDataSovereignty: "DATA_SOVEREIGNTY · SM4 Encryption · Air-Gapped Ready",
      standardDeterministicEngine: "Deterministic Pharmacopeia Engine",
      descDeterministicEngine: "SQLite deterministic verification built on KDIGO 2024, National Reimbursement Drug List, and RxNorm. eGFR, potassium, drug-drug interactions, and critical values verified in milliseconds.",
      detailDeterministicEngine: "DETERMINISTIC_ENGINE · KDIGO 2024 · NRDL · RxNorm",
      standardFhirArchive: "HL7 FHIR R4 Archiving",
      descFhirArchive: "Follow-up records and SOAP notes structured per FHIR R4, with automatic ICD-10 coding and DRG weights. One-click write-back to hospital EMR.",
      detailFhirArchive: "FHIR_R4 · ICD-10 · DRG Weights · EMR Write-Back",
      standardEscalationBridge: "Critical-Value RN Bridge",
      descEscalationBridge: "32 pre-speech deterministic verification gates. When critical values are triggered, an SBAR ticket is established within 1.6 seconds and routed to the charge nurse.",
      detailEscalationBridge: "ESCALATION_BRIDGE · 1.6s Handoff · SBAR Ticket",
      standardComplianceRedlines: "Compliance Redlines",
      descComplianceRedlines: "Hard non-prescribing lock, no diagnostic override, in-hospital data residency. Every voice turn and chart entry retains a full audit trail, retained for at least 5 years.",
      detailComplianceRedlines: "COMPLIANCE_REDLINES · 5-Year Audit Retention",
      deploymentEyebrow: "Hospital Tier Deployment",
      deploymentTitle: "Delivery Matched to Hospital Tier",
      tierClinic: "Clinic / Outpatient",
      tierClinicDesc: "Lightweight SaaS, per-seat billing, mobile-first.",
      tierSecondary: "Secondary Hospital",
      tierSecondaryDesc: "Cloud-hybrid deployment, lightweight clinical workbench, core data stays on-premise.",
      tierTertiary: "Tertiary Hospital",
      tierTertiaryDesc: "Air-gapped intranet deployment, SM4 encryption, highest level of data sovereignty.",
    },
    modals: {
      demoTitle: "Request Department Pilot",
      demoSub: "Test extension and specialty SOP provisioned within 2 hours.",
      orgLabel: "Organization",
      orgPlaceholder: "e.g., Ruijin Hospital Cardiology",
      roleLabel: "Role",
      rolePlaceholder: "e.g., Nursing Director / CMIO",
      phoneLabel: "Phone or Work Email",
      phonePlaceholder: "For test line credentials",
      scenarioLabel: "Pathway",
      submitBtn: "Submit",
      submittedTitle: "Pilot Request Logged",
      submittedDesc: "Ticket #ZJ-8942 created. Our clinical engineer will reach out within 2 hours.",
      safetyTitle: "Clinical Safety Charter",
      safetySub: "Four structural locks behind 368M calls with zero severe harm:",
      safetyPillars: [
        { title: "1. Non-Diagnostic & Non-Prescribing Lock", body: "Never diagnoses or alters dosages; clinical changes always route to physicians." },
        { title: "2. 32-Model Pre-Speech Veto", body: "Audits pharmacology and vitals in 160ms prior to audio output." },
        { title: "3. 1.6s Uninterrupted Nurse Bridge", body: "Bridges live calls with SBAR summaries on any red-flag symptom." },
        { title: "4. On-Premise Data Residency", body: "Runs inside hospital data centers; zero external model training." },
      ],
      closeBtn: "Close",
    },
  },

  ja: {
    brandName: "中浄",
    brandSub: "臨床AI基盤",
    nav: {
      platform: "臨床OS",
      standards: "臨床標準",
      agents: "パス一覧",
      constellation: "安全構造",
      safety: "臨床検証",
      roi: "効果試算",
      research: "研究",
      login: "院内拠点",
      requestDemo: "トライアル",
      megaPlatformDesc: "退院後音声フォロー・看護師転送・カルテ自動記録基盤。",
      megaItems: [
        { title: "品質管理画面", desc: "病棟別の到達率と転送時間。", href: "#platform", tag: "品質" },
        { title: "標準パス一覧", desc: "診療科承認済の1,284パス。", href: "#agents" },
        { title: "音声・カルテ庫", desc: "院内閉域での横断検索。", href: "#platform" },
        { title: "紫微 6.0 構造", desc: "発話前に32専門モデルが監査。", href: "#constellation", tag: "安全" },
      ],
    },
    hero: {
      eyebrow: "院内閉域クリニカルAI基盤 · 決定論的薬局方エンジン",
      headlineLine1: "薬局方監査・退院後フォロー・カルテ記録を、",
      headlineLine2: "ひとつの病院ワークベンチに統合。",
      subtitle:
        "KDIGO腎機能換算・発話前32ゲート音声監査・原音連動SOAP記録を統合。診断・処方変更は行わず、危険兆候は1.6秒で看護師へ接続。",
      primaryCta: "診療科トライアル",
      secondaryCta: "通話を試聴",
      nonDiagBadge: "非診断・非処方の患者対話に厳格限定",
      nonDiagLink: "安全基準",
      studioHeader: "臨床通話スタジオ",
      studioSub: "左に通話記録、右に薬局方・バイタル同期監査",
      playBtn: "再生",
      pauseBtn: "停止",
      voiceSynthOn: "音声オン",
      voiceSynthOff: "音声読上",
      liveHudTitle: "発話前 薬局方・バイタル監査",
      outcomeLabel: "対応結果",
    },
    ledger: {
      sectionTitle: "稼働実績",
      stats: [
        { value: "3.68億", label: "累計フォロー通話", sub: "術前・退院後・慢性期" },
        { value: "0 件", label: "重篤有害事象", sub: "非診断・非処方ロック" },
        { value: "1.6 秒", label: "当直看護師接続", sub: "緊急転送 42,800+ 件" },
        { value: "99.91%", label: "二重盲検正確率", sub: "86万通話で検証" },
      ],
      partnerHeading: "導入医療センター・製薬機関",
    },
    explorer: {
      eyebrow: "クリニカルパス",
      title: "診療科承認済 1,284種の音声パス",
      subtitle: "学会ガイドライン準拠、HL7 FHIR R4で電子カルテ連携。",
      sectorAll: "すべて",
      sectorProvider: "急性期病院",
      sectorPayor: "健保・自治体",
      sectorPharma: "治験・GVP",
      searchPlaceholder: "疾患・手技で検索（例：ステント、COPD、内視鏡）",
      resetFilters: "クリア",
      activeCountSuffix: "件の代表パス（クリックでSOP表示）",
      showAllBtn: "全 11 件の代表パスを表示",
      collapseBtn: "折りたたむ",
      inspectSop: "SOP確認",
      drawerSopTitle: "標準作業手順書（SOP）",
      drawerOpeningTitle: "本人確認・初回発話",
      drawerDeployCta: "このパスを試す",
    },
    constellation: {
      eyebrow: "紫微 6.0 構造",
      title: "単一LLMに、そのまま患者へ電話させない。",
      subtitle:
        "671B対話モデルが方言や高齢者の発話を聞き取り、32の薬理・バイタルモデルが160ms以内に拒否権監査を実行。",
      centerNodeTitle: "671B 臨床対話コア",
      centerNodeSub: "応答 162ms · 方言・高齢者発話速度に適応",
      clickHint: "レーン選択で遮断ルールを表示",
      tierTitle: "モデル階層と単価",
      tierSubtitle: "全階層に非処方ロックと1.6秒看護師接続を標準搭載。",
      creditsLabel: "同時枠",
      latencyLabel: "応答遅延",
      selectTierBtn: "仕様相談",
    },
    platform: {
      eyebrow: "統合ワークベンチ",
      title: "定型架電はシステムへ、臨床判断は医療者へ。",
      subtitle: "朝の退院リスト承認のみで、退院後3〜30日フォローとカルテ記録を自動実行。",
      cardHospitalTitle: "急性期病院・地域医療連携網",
      cardHospitalDesc: "術前確認・内視鏡下剤案内・退院後30日フォローを増員なしで到達率97%へ。",
      cardHospitalCta: "病院連携仕様",
      cardPharmaTitle: "治験（CRO）・製造販売後安全管理（GVP）",
      cardPharmaDesc: "新薬アドヒアランス（PSP）・定時ePRO・有害事象聴取を音声監査証跡付きで運用。",
      cardPharmaCta: "製薬向け仕様",
      workspaceTitle: "業務ビュー",
      tabs: [
        {
          id: "command",
          label: "品質総覧",
          code: "01",
          headline: "病棟別の到達率・緊急転送時間・機能評価帳票",
          desc: "未応答や症状変化のあるDPC/DRG患者を最優先表示。",
          metrics: [
            { k: "有効到達率", v: "96.8%" },
            { k: "看護師接続", v: "1.58 秒" },
            { k: "月間削減工数", v: "14,260 h" },
          ],
          bullets: [
            "72時間・30日完了率を診療科別に集計",
            "院内SAML SSOと閲覧権限を同期",
            "病院機能評価用台帳をワンクリック出力",
          ],
        },
        {
          id: "orchestration",
          label: "自動架電",
          code: "02",
          headline: "リスト承認から再コール・看護師申し送りまで自動化",
          desc: "時間帯配慮・家族確認を備え、音声根拠付きSOAP記録を生成。",
          metrics: [
            { k: "同時回線数", v: "400–2,000" },
            { k: "高齢者認識率", v: "99.1%" },
            { k: "音声紐付率", v: "100%" },
          ],
          bullets: [
            "架電前に閾値とスクリプトをプレビュー",
            "直近の検査値に応じ質問を自動分岐",
            "HL7 FHIR R4で電子カルテへ自動格納",
          ],
        },
        {
          id: "vault",
          label: "カルテ検索",
          code: "03",
          headline: "25万件超の退院記録と通話音声を院内閉域検索",
          desc: "検査値・併用薬・症状でコホートを抽出し、該当発話を即時再生。",
          metrics: [
            { k: "検索症例数", v: "25万+" },
            { k: "抽出精度", v: "99.3%" },
            { k: "外部学習利用", v: "0 Byte" },
          ],
          bullets: [
            "eGFR・HbA1c・服薬状況で即時抽出",
            "全結果に通話タイムスタンプを併記",
            "非接続の院内サーバルームで完結稼働",
          ],
        },
        {
          id: "spaces",
          label: "地域連携",
          code: "04",
          headline: "基幹病院とかかりつけ医の権限分離スペース",
          desc: "最小権限原則のもと、退院後の回復状況を安全に共有。",
          metrics: [
            { k: "サマリー完結", v: "99.7%" },
            { k: "継続受診率", v: "+58.4%" },
            { k: "閲覧ログ監査", v: "全件記録" },
          ],
          bullets: [
            "施設間のフィールド単位アクセス隔壁",
            "増悪兆候検知時に専門外来枠を迅速確保",
            "治験依頼者・CRO・施設間の安全共有",
          ],
        },
      ],
    },
    safety: {
      eyebrow: "臨床検証",
      title: "医師・看護師9,200名による86万通話盲検。",
      subtitle: "稼働前に5段階の臨床審査を必須化。",
      phases: [
        { step: "01", title: "32モデル発話前拒否権監査", desc: "160ms以内に薬局方用量と危険値を照合。" },
        { step: "02", title: "86万回の負荷ブラインド検証", desc: "専門医と熟練看護師が高齢患者を演じ検証。" },
        { step: "03", title: "診療科部長の書面承認", desc: "全スクリプトと転送基準に署名承認を必須化。" },
        { step: "04", title: "1.6秒での当直看護師接続", desc: "胸痛・呼吸苦・休薬検知で即時SBAR転送。" },
        { step: "05", title: "実稼働コールの日次監査", desc: "通話記録と30日転帰を継続照合。" },
      ],
      chartTitle: "モデル構造別の臨床安全性比較（n = 860,000）",
      chartSub: "独立評価委員会による4段階リスク採点",
      legendCorrect: "基準合致",
      legendBenign: "軽微差異（無害）",
      legendMinor: "軽度懸念",
      legendSevere: "重篤リスク",
    },
    roi: {
      eyebrow: "効果試算",
      title: "削減架電工数と再入院抑制効果を試算",
      subtitle: "導入急性期病院の中央値実績に基づく推計。",
      presets: [
        { label: "地域急性期病院", discharges: 85000, nurses: 60, readm: 8.5 },
        { label: "大学病院センター", discharges: 220000, nurses: 150, readm: 9.2 },
        { label: "広域医療グループ", discharges: 450000, nurses: 320, readm: 10.4 },
      ],
      sliderDischarges: "年間退院・慢性期対象患者数",
      sliderNurses: "電話フォロー担当看護師数",
      sliderReadm: "30日予定外再入院率",
      outHours: "年間還元看護時間",
      outReach: "年間完了コール数",
      outPrevented: "年間抑制再入院（件）",
      outValue: "看護工数・DPC品質改善の年間効果",
      unitCases: "名",
      unitPersons: "名",
      bookReportCta: "診療科パイロット試算表を請求",
    },
    researchVoices: {
      researchEyebrow: "技術報告",
      researchTitle: "安全アライメント・方言音響・院内推論",
      filterAll: "すべて",
      filterSafety: "安全性",
      filterSpeech: "方言音響",
      filterInference: "院内推論",
      filterBenchmarks: "ベンチマーク",
      readPaper: "要旨",
      voicesEyebrow: "導入評価",
      voicesTitle: "臨床現場からの評価記録",
    },
    complianceFooter: {
      eyebrow: "データ主権・セキュリティ",
      title: "院内ファイアウォール完結。閉域網納入対応。",
      subtitle: "SM4暗号化、声紋匿名化、院内SSO連携、外部学習ゼロ保証。",
      detailsLink: "仕様",
      ctaBannerTitle: "まずは1つの診療科から専用回線で検証",
      ctaBannerSub: "2時間以内に診療科別の匿名化テスト内線を発行します。",
      footerTagline: "非診断クリニカル音声フォロー＆患者安全基盤",
      copyright:
        "© 2026 ZhongJing Clinical AI Technologies · 届出 NHC-AI-0049",
    },
    roleWorkbench: {
      eyebrow: "四役割臨床ワークベンチ",
      title: "役割ごとに切り替える臨床協作インターフェース",
      subtitle: "一つの SQLite 臨床データセット、四つの視点、重複ゼロ。",
      rolePhysician: "臨床医師",
      roleNurseDirector: "看護部長",
      roleHospitalBuyer: "病院購買・院長",
      rolePatientCaregiver: "患者・家族",
      descPhysician: "エビデンス凾典、腎機能換算、多剤併用禁忌、処方安全レビュー。",
      descNurseDirector: "退院患者レジストラ、SBAR 転送工単、危急値トリアージ、看護品質ダッシュボード。",
      descHospitalBuyer: "DRG/DIP 支払いシミュレーション、ROI 試算、診療科運営分析、階層別展開プラン。",
      descPatientCaregiver: "退院後音声フォローアップ、服薬コンプライアンス通知、安全音声返答、非診断健康ガイダンス。",
      tabEvidence: "エビデンス凾典",
      tabRoster: "患者レジストラ",
      tabEscalation: "SBAR 転送",
      tabDrgDip: "DRG/DIP 支払い",
      tabFollowup: "退院後フォローアップ",
      tabAdherence: "服薬コンプライアンス",
      btnSwitchRole: "役割を切り替え",
      currentRole: "現在の役割",
    },
    clinicalStandards: {
      eyebrow: "臨床標準とコンプライアンスフレームワーク",
      title: "医療機関向けエンタープライズグレード臨床 AI 標準",
      subtitle: "すべての機能は医療品質、データセキュリティ、コンプライアンス対応の導入を中心に設計されています。",
      standardNonDiagnostic: "非診断境界ハードロック",
      descNonDiagnostic: "システムは院外コミュニケーションとフォローアップサポートのみを提供し、確定診断を出力しません。赤旗症状は 1.6 秒以内に人間の看護師に接続されます。",
      detailNonDiagnostic: "NON_DIAGNOSTIC_BOUNDARY · ハードロック、迂回不可",
      standardDataSovereignty: "院内データ主権",
      descDataSovereignty: "患者データはすべて病院内ネットワークに留まり、パブリッククラoudへのアップロードは禁止です。伝送と保存は SM4 暗号化を使用。エアギャップ式オンプレミス導入に対応。",
      detailDataSovereignty: "DATA_SOVEREIGNTY · SM4 暗号化 · エアギャップ導入対応",
      standardDeterministicEngine: "確定性薬典エンジン",
      descDeterministicEngine: "KDIGO 2024、国民医療費適正化計画（NRDL）、RxNorm に基づく SQLite 確定性検証。eGFR、カリウム、薬物相互作用、危急値をミリ秒単位で検証。",
      detailDeterministicEngine: "DETERMINISTIC_ENGINE · KDIGO 2024 · NRDL · RxNorm",
      standardFhirArchive: "HL7 FHIR R4 アーカイブ",
      descFhirArchive: "フォローアップ記録と SOAP 病程を FHIR R4 標準に従って構造化。ICD-10 自動コード化と DRG 重み付け。ワンクリックで病院 EMR に書き戻し。",
      detailFhirArchive: "FHIR_R4 · ICD-10 · DRG 重み · EMR 書き戻し",
      standardEscalationBridge: "危急値看護師ブリッジ",
      descEscalationBridge: "発話前 32 ルートの確定性検証ゲート。危急値がトリガーされた場合、1.6 秒以内に SBAR チケットが作成され、責任看護師にルーティングされます。",
      detailEscalationBridge: "ESCALATION_BRIDGE · 1.6秒 ハンドオフ · SBAR チケット",
      standardComplianceRedlines: "コンプライアンスレッドライン",
      descComplianceRedlines: "非処方ハードロック、診断オーバーライド禁止、院内データ滞留。すべての音声ターンとカルテエントリは完全な監査証跡を保持し、少なくとも 5 年間保持。",
      detailComplianceRedlines: "COMPLIANCE_REDLINES · 5 年監査保持",
      deploymentEyebrow: "病院規模別導入",
      deploymentTitle: "病院規模に応じた導入モデル",
      tierClinic: "クリニック / 外来部門",
      tierClinicDesc: "軽量 SaaS、席単位課金、モバイルファースト。",
      tierSecondary: "二次病院",
      tierSecondaryDesc: "クラウドハイブリッド導入、軽量臨床ワークベンチ、コアデータは院内に保持。",
      tierTertiary: "三次病院",
      tierTertiaryDesc: "院内閉域ネットワーク導入、SM4 暗号化、最高レベルのデータ主権。",
    },
    modals: {
      demoTitle: "診療科トライアル申請",
      demoSub: "2時間以内にテスト回線番号とSOP案をご案内します。",
      orgLabel: "機関名",
      orgPlaceholder: "例：瑞金病院 循環器内科",
      roleLabel: "部署・役職",
      rolePlaceholder: "例：看護部長 / 医療情報部長",
      phoneLabel: "電話番号・メール",
      phonePlaceholder: "テスト内線の送付先",
      scenarioLabel: "対象パス",
      submitBtn: "送信",
      submittedTitle: "申請受付完了",
      submittedDesc: "受付番号 #ZJ-8942 を発行しました。2時間以内にご連絡いたします。",
      safetyTitle: "クリニカル安全基準規約",
      safetySub: "3.68億コールで重篤有害事象ゼロを守る4つの制約：",
      safetyPillars: [
        { title: "一、非診断・非処方の絶対ロック", body: "診断や用量変更指示は一切行わず、主治医へ接続します。" },
        { title: "二、32モデル発話前拒否権監査", body: "発話前160ms以内に薬局方とバイタルを同時監査します。" },
        { title: "三、1.6秒での当直看護師接続", body: "危険兆候時は回線を切らずSBAR要約と共に転送します。" },
        { title: "四、院内閉域データ保持", body: "病院サーバ室で完結稼働し、外部学習には一切使用しません。" },
      ],
      closeBtn: "閉じる",
    },
  },
};
