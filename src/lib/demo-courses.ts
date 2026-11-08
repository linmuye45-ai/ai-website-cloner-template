import { LOCALIZED_EXTRA_COURSES } from "@/lib/global-markets";
import type { CoursePack, LocaleCode } from "@/types/platform";

export const COURSE_PACKS: CoursePack[] = [
  {
    id: "ap-calc",
    locales: ["zh", "en"],
    code: "AP-CALC-BC",
    title: "AP Calculus BC · 微积分 FRQ 满分核心讲义",
    category: "国际课程 / 美高留学（客单价 ¥2,980–¥6,800 / $390+）",
    marketPositioning: "北美家长付费极爽快，私教时薪 $120+，AI 伴学替代率极高",
    avgTicketNote: "建议加售价 $390 / ¥2,980 · 8–10 人回本",
    speechLang: "zh-CN",
    visualizerType: "calculus-riemann",
    starterPrompts: [
      "为什么定积分换元法必须同步改变积分上下限？我老是在这扣分",
      "用苏格拉底提问带我推导拉格朗日余项（Lagrange Error Bound）怎么估界",
      "帮我批改这道题：∫₀¹ 2x·cos(x²)dx，我算出来是 sin(1) - sin(0) = sin(1)，步骤规范吗？",
    ],
    sections: [
      {
        id: "calc-s1",
        pageNumber: 14,
        sectionCode: "§2.1",
        title: "黎曼和（Riemann Sums）与定积分凹凸性误差判定",
        summary: "左/右黎曼和与梯形法则在单调性与凹凸性约束下的高估/低估严格判据。",
        content:
          "设函数 f(x) 在闭区间 [a, b] 上连续。若 f(x) 单调递增，左黎曼和（Left Riemann Sum）必为定积分 ∫ₐᵇ f(x)dx 的低估值（Underestimate），右黎曼和必为高估值（Overestimate）。梯形法则（Trapezoidal Rule）的高低估取决于二阶导数 f''(x) 的符号：曲线上凹（f''(x) > 0，Concave Up）时割线位于弧线上方，梯形和必高估真实面积，f''(x) < 0 时则必低估。AP 阅卷要求显式写出单调性或凹凸性理由，仅写高低估结论得 0 分。",
        keyFormulaOrRule:
          "f'(x) > 0 ⇒ Lₙ < ∫ₐᵇ f(x)dx < Rₙ ； f''(x) > 0 ⇒ Tₙ > ∫ₐᵇ f(x)dx",
        examFrequency: "极高频必考",
        commonTrap: "把梯形法则的高低估错误归因于函数单调递增，而非二阶导凹凸性！",
      },
      {
        id: "calc-s2",
        pageNumber: 29,
        sectionCode: "§3.4",
        title: "定积分换元法（u-Substitution）与上下限同步变换铁律",
        summary: "复合函数积分换元时的微分凑配与新变量区间映射规范写法。",
        content:
          "计算定积分 ∫ₐᵇ f(g(x))·g'(x)dx 时，令 u = g(x)，则 du = g'(x)dx。此时必须立刻将原 x 的积分限 [a, b] 映射为 u 的积分限 [g(a), g(b)]，即原式严格等于 ∫_{g(a)}^{g(b)} f(u)du。AP FRQ 阅卷中，最致命的书写扣分（Linkage Error）是在写出 du 之后仍保留原 x 的上下限，例如写成 ∫₀¹ cos(u)du（当 u = x² 时正确写法为 ∫₀¹，但若原限为 [0, 2] 则必须改为 ∫₀⁴），一旦等号连接了不等价的上下限，即便最终答案碰巧算对，过程分直接扣除 1–2 分。",
        keyFormulaOrRule:
          "∫ₐᵇ f(g(x))g'(x)dx = ∫_{g(a)}^{g(b)} f(u)du （严禁混合 x 限与 u 变量）",
        examFrequency: "极高频必考",
        commonTrap: "换元后忘记把上限 x=2 变成 u=g(2)=4，导致等式链逻辑断裂（Linkage Error）。",
      },
      {
        id: "calc-s3",
        pageNumber: 46,
        sectionCode: "§5.2",
        title: "泰勒多项式与交错级数 / 拉格朗日余项误差界",
        summary: "BC 压轴第 6 题必考：区分交错级数余项 AST 与拉格朗日误差界。",
        content:
          "在 AP Calculus BC 第 6 道 FRQ 压轴题中，误差估计仅有两条合法路径：(1) 若级数在给定点严格满足交错级数判别法（正负交替、绝对值单调递减且趋于 0），则截断误差 |Rₙ(x)| 严格小于首个被省略项的绝对值 |aₙ₊₁|；(2) 若非交错级数，必须启用拉格朗日余项公式 |Rₙ(x)| ≤ max|f⁽ⁿ⁺¹⁾(z)| · |x - c|ⁿ⁺¹ / (n+1)!，其中 z 介于 x 与中心 c 之间。阅卷严禁直接把 f⁽ⁿ⁺¹⁾(c) 当作最大值代入，必须取区间边界或题干给定的导数上界 M。",
        keyFormulaOrRule:
          "|Rₙ(x)| ≤ M · |x - c|ⁿ⁺¹ / (n + 1)! ，其中 M = max_{z∈[c,x]} |f⁽ⁿ⁺¹⁾(z)|",
        examFrequency: "易错拉分项",
        commonTrap: "把中心点导数值当作区间最大导数上界 M，直接痛失压轴最后 2 分。",
      },
    ],
    classroomTitle: "OpenMAIC 多智能体课堂：为什么你的微积分 FRQ 明明算对答案却被扣分？",
    classroomTurns: [
      {
        id: "ct-1",
        speaker: "lecturer",
        speakerName: "Prof. Lin（主讲名师分身）",
        roleBadge: "主讲教授",
        content:
          "同学们看左侧交互黑板上的曲线 f(x) = 0.25x² + 1。它是单调递增且上凹（Concave Up）的。现在把分割数 n 从 4 调大到 12，观察左黎曼和矩形与真实曲边梯形之间那块白色缺口的变化。",
        boardHighlight: "观察 n 增大时左黎曼和低估误差 ΔS 的收敛过程",
      },
      {
        id: "ct-2",
        speaker: "peer",
        speakerName: "同桌学伴 Leo",
        roleBadge: "AI 学伴踩坑提问",
        content:
          "老师！既然函数递增时左黎曼和低估、右黎曼和高估，那如果改用梯形法则（Trapezoidal Rule），是不是因为递增也会高估呀？",
      },
      {
        id: "ct-3",
        speaker: "assistant",
        speakerName: "助教小微（记忆巡检）",
        roleBadge: "AI 督学助教",
        content:
          "Leo 踩中了教材 [P.14 §2.1] 标红的头号陷阱！系统检索到上周模考全班 42% 同学在这里丢了理由分——梯形上底是一条连接两点的割线，决定割线在曲线上方还是下方的，到底是一阶导还是二阶导？我们来做个 15 秒通关检验！",
        checkpointQuestion: {
          prompt:
            "已知光滑函数 g(x) 在 [1, 5] 上满足 g'(x) > 0 且 g''(x) < 0（递增但下凹）。用 4 等分梯形法则 T₄ 近似 ∫₁⁵ g(x)dx，则 T₄ 相比真实值是：",
          options: [
            "高估值，因为 g'(x) > 0 函数单调递增",
            "低估值，因为 g''(x) < 0 曲线下凹，割线始终位于弧线下方",
            "高估值，因为 g''(x) < 0 二阶导为负",
            "无法判断，必须知道三阶导符号",
          ],
          correctIndex: 1,
          explanation:
            "满分采分点：梯形法则只看凹凸性（二阶导）！g''(x) < 0 意味着图像 Concave Down（向上凸/下凹），连接曲线上任意两点的弦都在弧线下方，因此 T₄ 必为低估值（Underestimate）。",
        },
      },
      {
        id: "ct-4",
        speaker: "lecturer",
        speakerName: "Prof. Lin（主讲名师分身）",
        roleBadge: "主讲教授",
        content:
          "漂亮！闯关通过！记住口诀：『左右看单调，梯形看凹凸』。考场上把 because g''(x) < 0 (g is concave down) on [1,5] 这半句话写进卷面，2 分稳稳落袋！",
      },
    ],
    podcastTitle: "3分钟考前磨耳朵：AP 微积分 FRQ 阅卷官最恨的三大书写失误",
    podcastLines: [
      {
        id: "p1",
        host: "A",
        hostName: "林老师",
        timestamp: "00:00",
        text: "早安！离 AP 大考还有最后冲刺期，今天我们用三分钟拆掉微积分 BC 卷面上最冤枉的三个隐形扣分雷区。",
      },
      {
        id: "p2",
        host: "B",
        hostName: "学姐苏苏",
        timestamp: "00:24",
        text: "第一个绝对是 Linkage Error 等号不等价！好多学弟换元令 u 等于 x 平方后，积分号上面还挂着原来的 x 上下限，哪怕最后结果算对，阅卷官直接划掉一分！",
      },
      {
        id: "p3",
        host: "A",
        hostName: "林老师",
        timestamp: "00:52",
        text: "没错，见 u 必换限！第二个雷区在黎曼和理由题：左和右和看一阶导单调性，梯形和切线近似一律看二阶导凹凸性，千万别张冠李戴。",
      },
      {
        id: "p4",
        host: "B",
        hostName: "学姐苏苏",
        timestamp: "01:25",
        text: "第三个就是第六道级数压轴题啦：只要看到正负交替且绝对值递减趋零，立刻秒用交错级数首项余项；不交错再搬拉格朗日公式！祝大家稳拿 5 分！",
      },
    ],
    defaultVariants: [
      {
        id: "qv-calc-1",
        tier: "L1 基础母题稳固",
        stem: "计算定积分 ∫₀² 3x² · e^(x³) dx 时，若令 u = x³，下列哪一步等价变形符合 AP FRQ 满分书写规范？",
        options: [
          "∫₀² e^u du = e² - 1",
          "∫₀⁸ e^u du = e⁸ - 1",
          "3 ∫₀⁸ e^u du = 3(e⁸ - 1)",
          "∫₀² 3e^u du = 3(e² - 1)",
        ],
        correctIndex: 1,
        knowledgeTag: "定积分换元上下限映射",
        sourcePage: 29,
        rubricAndAnalysis:
          "由 u = x³ 得 du = 3x²dx，刚好凑齐被积表达式；同时下限 x=0 ⇒ u=0，上限 x=2 ⇒ u=2³=8，故原式严格等于 ∫₀⁸ e^u du = e⁸ - 1。",
        trapWarning: "选项 A 漏换上限（典型 Linkage Error 重灾区），选项 C 重复乘了系数 3。",
      },
      {
        id: "qv-calc-2",
        tier: "L2 高频陷阱变式",
        stem: "可微函数 f 满足 f'(x) < 0 且 f''(x) > 0 在区间 [0, 6] 上恒成立。设 L₃ 为左黎曼和，T₃ 为梯形和，I = ∫₀⁶ f(x)dx，则三者大小关系必为：",
        options: [
          "L₃ < I < T₃",
          "T₃ < I < L₃",
          "I < L₃ 且 I < T₃（两者均为高估值）",
          "L₃ < T₃ < I（两者均为低估值）",
        ],
        correctIndex: 2,
        knowledgeTag: "单调性与凹凸性双重误差判别",
        sourcePage: 14,
        rubricAndAnalysis:
          "拆解两步：(1) 因 f'(x) < 0 单调递减，左端点总是子区间最高点，故左黎曼和 L₃ > I（高估）；(2) 因 f''(x) > 0 曲线上凹，梯形割线位于弧线上方，故梯形和 T₃ > I（同样高估）！所以两者都大于真实积分 I。",
        trapWarning: "考生极易背死“左低右高”口诀而忽略本题 f'(x) < 0 是递减函数！",
      },
      {
        id: "qv-calc-3",
        tier: "L3 压轴综合拔高",
        stem: "设 f(x) 在 x=0 处的三阶泰勒多项式为 P₃(x)，已知对任意 z ∈ [0, 0.5] 均有 |f⁽⁴⁾(z)| ≤ 48。用拉格朗日余项估计 |f(0.5) - P₃(0.5)| 的最小确定上界为：",
        options: [
          "1 / 8",
          "3 / 16",
          "1 / 16",
          "3 / 8",
        ],
        correctIndex: 0,
        knowledgeTag: "拉格朗日误差界 Lagrange Error Bound",
        sourcePage: 46,
        rubricAndAnalysis:
          "代入公式 |R₃(0.5)| ≤ M · |0.5 - 0|⁴ / 4! = 48 × (1/16) / 24 = (48 / 24) × (1/16) = 2 / 16 = 1/8。",
        trapWarning: "极易把 4! 算成 4（选 D）或把次数写成 3 次方而非 n+1=4 次方！",
      },
    ],
    studentProfile: {
      studentName: "陈同学（美高 11 年级）",
      targetGoal: "5 月 AP Calculus BC 冲刺满分 5 分（目标卷面 ≥ 82/108）",
      currentPredictedScore: "5 分稳态（模考等效 86/108）",
      baselineScore: "3 分边缘（入学模考 54/108）",
      studyStreakDays: 26,
      weeklyHoursSaved: 6.5,
      l3SynthesisStrategy:
        "该生计算直觉强但卷面严谨度曾偏弱。近两周通过强制开启『FRQ 阅卷官扣分点拦截』，换元漏改上下限错误已从 50% 降至 0%；下阶段重点使用 FSRS 间隔强化级数收敛半径端点检验与极坐标面积求导。",
      l1Traces: [
        {
          id: "l1-1",
          timestamp: "今天 20:14",
          action: "完成 §3.4 换元积分变式组",
          evidence: "连续 3 道含指数与三角复合换元均主动先写 u 积分新上下限，耗时 4m12s",
          sourceRef: "讲义 P.29 §3.4",
          masteryDelta: "+14% 规范度",
        },
        {
          id: "l1-2",
          timestamp: "昨天 21:40",
          action: "沉浸式伴读划线追问",
          evidence: "追问『拉格朗日余项中 M 为什么不能直接代入 f⁽⁴⁾(0)』，已完成反例推导验证",
          sourceRef: "讲义 P.46 §5.2",
          masteryDelta: "+19% 概念深度",
        },
        {
          id: "l1-3",
          timestamp: "3天前 19:55",
          action: "课堂小测曾错选",
          evidence: "在递减函数左黎曼和题中惯性误选低估，经二阶导+单调双轴对比后订正通过",
          sourceRef: "讲义 P.14 §2.1",
          masteryDelta: "已入错题滚动池",
        },
      ],
      l2Surfaces: [
        {
          id: "l2-1",
          concept: "定积分换元与 Linkage 书写规范",
          accuracyRate: 94,
          errorPattern: "已克服原漏换上限习惯，书写链路完整",
          linkedL1Ids: ["l1-1"],
          fsrsStabilityDays: 18.5,
          nextReviewLabel: "6 天后抽检",
        },
        {
          id: "l2-2",
          concept: "黎曼和与梯形近似高低估理由表述",
          accuracyRate: 82,
          errorPattern: "递减函数场景偶发手快，需保持先标 f' 与 f'' 符号",
          linkedL1Ids: ["l1-3"],
          fsrsStabilityDays: 5.2,
          nextReviewLabel: "明晚 20:30 必刷",
        },
        {
          id: "l2-3",
          concept: "泰勒级数拉格朗日误差界计算",
          accuracyRate: 76,
          errorPattern: "阶乘 (n+1)! 与幂次偶有心算跳步失误",
          linkedL1Ids: ["l1-2"],
          fsrsStabilityDays: 3.1,
          nextReviewLabel: "今晚 21:15 强化",
        },
      ],
    },
  },
  {
    id: "ielts-writing",
    locales: ["zh", "en"],
    code: "IELTS-WR-8.0",
    title: "雅思学术写作 8.0 · 前考官四维采分与让步论证母题库",
    category: "留学语培工作室（客单价 ¥4,800–¥19,800 / $690+）",
    marketPositioning: "语培机构最大人力黑洞就是人工改作文！AI 秒批+逐句升格直接省掉 80% 助教工资",
    avgTicketNote: "作文精批督学卡 ¥1,980 / $290 · 毛利率 94%",
    speechLang: "en-GB",
    visualizerType: "ielts-band",
    starterPrompts: [
      "按雅思考官 TR/CC/LR/GRA 四维标准批改我这句开头段：Nowadays AI is very popular and has pros and cons.",
      "为什么我背了很多高级大词，写作还是万年卡在 5.5–6.0 分？",
      "教我怎么写 Task 2 双边讨论题的『让步反驳段（Concession & Refutation）』才能拿 7.5+",
    ],
    sections: [
      {
        id: "ielts-s1",
        pageNumber: 8,
        sectionCode: "§1.2",
        title: "万年 6.0 分死穴：机械连接词滥用与隐性逻辑衔接（CC 维度）",
        summary: "考官为什么一看到 Firstly / Moreover / In a nutshell 堆砌就直接判 6.0 上限？",
        content:
          "根据剑桥雅思官方评分细则（Band Descriptors），Coherence and Cohesion（CC 连贯与衔接）6 分与 7+ 分的核心分水岭在于：6 分考生依赖句首机械过渡词（Mechanical Linkers，如 Firstly, Secondly, What is more），句子内部却毫无指代链；而 7.5–8.0 分范文采用隐性词汇衔接（Lexical Chaining & Referencing），即用 this trajectory、such short-sighted intervention、the aforementioned dilemma 自然承接上句核心命题，做到『去连接词仍严丝合缝』。",
        keyFormulaOrRule:
          "7.5+ 衔接公式：指示代词 + 上文动作抽象名词化（This proliferation of...）替代生硬 Moreover",
        examFrequency: "极高频必考",
        commonTrap: "每句话开头都塞一个华丽连接词，被考官判定为 Over-use of cohesive devices。",
      },
      {
        id: "ielts-s2",
        pageNumber: 21,
        sectionCode: "§2.5",
        title: "让步反驳段（Concession-Refutation）黄金四句骨架（TR 维度）",
        summary: "Task Response 冲 7.5+ 必备：先承认对方合理内核，再击穿其前提边界。",
        content:
          "单边绝对化论证在雅思 Task 2 中极易因『论证未充分展开或过度泛化（Over-generalisation）』卡在 6.0。高分让步反驳段严格遵循四步逻辑链：(1) 客观陈述对立面最强理由（Granted, proponents of X contend that...）；(2) 给出具体机制解释对立面为何看似合理；(3) 转折指出其忽视的现实约束或长远代价（Nevertheless, this line of reasoning overlooks...）；(4) 收束回己方核心立场。切忌立一个稻草人靶子再轻易打倒。",
        keyFormulaOrRule:
          "Granted [对方最强论据] → Mechanism → Nevertheless, this overlooks [核心盲区] → Reinforce Thesis",
        examFrequency: "极高频必考",
        commonTrap: "前半段把对方观点夸得太绝对，后半段转折却只喊口号没有逻辑拆解，导致立场自相矛盾！",
      },
    ],
    classroomTitle: "OpenMAIC 写作工坊：3 分钟把 5.5 分中式流水账改写成 7.5+ 考官地道论证",
    classroomTurns: [
      {
        id: "ielts-c1",
        speaker: "lecturer",
        speakerName: "Advisor Evelyn（前考官分身）",
        roleBadge: "主讲考官",
        content:
          "来看左侧评分雷达图！绝大多数中国考生以为词汇越生僻分数越高，结果在 LR 维度塞满字典大词因搭配不当（Collocation Error）倒扣分，而真正拉分的 TR 论证链条只有一层。",
        boardHighlight: "对比 6.0 模板句与 8.0 名词化指代衔接",
      },
      {
        id: "ielts-c2",
        speaker: "assistant",
        speakerName: "助教小微",
        roleBadge: "AI 精批助教",
        content:
          "我们来现场实战检验一下教材 [P.8 §1.2] 的指代衔接法！下面哪句承接『Many cities are expanding highway networks to ease congestion』最符合 7.5+ 考官审美？",
        checkpointQuestion: {
          prompt:
            "前句：Many metropolises are aggressively widening highway networks to alleviate traffic congestion. 请选择最地道的 7.5+ 衔接下句：",
          options: [
            "What is more, in a nutshell, cars will become more and more.",
            "Yet this supply-side expansion rarely delivers lasting relief, as newly added lanes swiftly induce extra private car trips.",
            "Secondly, governments also need to build subways every day.",
            "On the contrary, highways are bad for people's health.",
          ],
          correctIndex: 1,
          explanation:
            "选项 B 用『this supply-side expansion』精准抽象概括上句的扩建高速路行为，并用诱导需求（induce extra private car trips）给出严密因果机制，TR 与 CC 同时拿到 8.0 级表现！",
        },
      },
    ],
    podcastTitle: "双语备考电台：雅思考官平均 2 分半批一篇作文，他第一眼到底扫哪里？",
    podcastLines: [
      {
        id: "ip1",
        host: "A",
        hostName: "Evelyn 老师",
        timestamp: "00:00",
        text: "很多同学好奇，雅思考官阅卷时平均两到三分钟判完一篇大作文，他们是怎么在这么短时间锁定你是 6.0 还是 7.5 的？",
      },
      {
        id: "ip2",
        host: "B",
        hostName: "高分学员 Mia",
        timestamp: "00:22",
        text: "我以前背了二十个万能开头模板，结果三次考试写作全是 6.0！后来用了系统精批才发现，考官第一眼就看每段中心句和句间指代链。",
      },
      {
        id: "ip3",
        host: "A",
        hostName: "Evelyn 老师",
        timestamp: "00:49",
        text: "完全正确！删掉生硬的 What is more，学会用 This shift 或 Such short-sighted measures 把上下句焊死，再配合具体因果链，分数立刻破局。",
      },
    ],
    defaultVariants: [
      {
        id: "qv-ielts-1",
        tier: "L1 基础母题稳固",
        stem: "在雅思写作 CC（连贯与衔接）评分中，将考生死死卡在 6.0 分的典型特征是：",
        options: [
          "全文只有 4 个自然段",
          "机械堆砌句首过渡词（Firstly/Moreover），缺乏代词与同义抽象名词的句内指代",
          "没有使用倒装句和虚拟语气",
          "字数控制在 275 词左右",
        ],
        correctIndex: 1,
        knowledgeTag: "CC 隐性衔接与指代链",
        sourcePage: 8,
        rubricAndAnalysis:
          "剑桥官方评分标准明确指出：6 分特征为『uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical』。四段式与 275 词完全符合高分标准。",
        trapWarning: "不要迷信语法炫技（倒装/虚拟），逻辑断层才是 6.0 铁顶。",
      },
      {
        id: "qv-ielts-2",
        tier: "L2 高频陷阱变式",
        stem: "撰写让步反驳段（Concession-Refutation）时，下列哪种写法会导致 TR（任务回应）维度被判『立场模糊（Unclear Position）』？",
        options: [
          "用 Granted 承认对方论点在短期低成本场景下确实有效，随后指出其长期生态代价远超收益",
          "花 90 词详尽论证对立面三大无可辩驳的优势，段末仅用一句 However, I still disagree 草草收尾",
          "将让步反驳段放在主体第二段或第三段",
          "使用具体行业案例支撑反驳部分",
        ],
        correctIndex: 1,
        knowledgeTag: "TR 让步反驳重心控制",
        sourcePage: 21,
        rubricAndAnalysis:
          "让步段必须遵循『欲抑先扬，重在反驳（30% 让步 + 70% 拆解反击）』。若前重后轻且反驳无实质论据，考官会直接判定整段实际上在支持反方，导致全文立场撕裂。",
        trapWarning: "让步部分切忌喧宾夺主，反驳句必须直击对方成立的隐含前提！",
      },
    ],
    studentProfile: {
      studentName: "林同学（冲刺英国 G5 硕士 Con-Offer）",
      targetGoal: "雅思总分 7.5（写作单项小分必须 ≥ 6.5，冲 7.0）",
      currentPredictedScore: "写作 7.0 稳态（TR 7 / CC 7 / LR 7 / GRA 7）",
      baselineScore: "写作 5.5（万年机械模板+中式跳跃论证）",
      studyStreakDays: 19,
      weeklyHoursSaved: 8.0,
      l3SynthesisStrategy:
        "已彻底戒除套句模板习惯，近 5 篇限时大作文隐性名词化指代覆盖率达 85%。接下来 10 天重点攻克教育类与科技伦理类抽象话题的具体动词短语搭配（Collocations）。",
      l1Traces: [
        {
          id: "il1-1",
          timestamp: "今天 19:20",
          action: "限时提交科技类 Task 2 全文精批",
          evidence: "成功使用『This algorithmic echo chamber』承接前句推荐算法弊端，获 CC 7.5 评级",
          sourceRef: "讲义 P.8 §1.2",
          masteryDelta: "+0.5 Band 衔接表现",
        },
        {
          id: "il1-2",
          timestamp: "昨天 22:05",
          action: "让步段专项重写训练",
          evidence: "修正了早先头重脚轻毛病，用成本外部性拆解了无人驾驶短期失业担忧",
          sourceRef: "讲义 P.21 §2.5",
          masteryDelta: "+18% 论证严密度",
        },
      ],
      l2Surfaces: [
        {
          id: "il2-1",
          concept: "句间抽象名词化指代（Lexical Chaining）",
          accuracyRate: 88,
          errorPattern: "偶有冠词 the / this 混用，整体流畅自然",
          linkedL1Ids: ["il1-1"],
          fsrsStabilityDays: 14.0,
          nextReviewLabel: "5 天后模考复核",
        },
        {
          id: "il2-2",
          concept: "让步反驳段 3:7 篇幅配比与前提拆解",
          accuracyRate: 81,
          errorPattern: "政府投资类话题反驳角度略单一，建议补充机会成本视角",
          linkedL1Ids: ["il1-2"],
          fsrsStabilityDays: 4.5,
          nextReviewLabel: "明晚 20:00 专项练",
        },
      ],
    },
  },
  {
    id: "bar-crimlaw",
    locales: ["zh"],
    code: "LAW-BAR-CRIM",
    title: "法考刑法主观题 · 因果关系介入因素与观点展示核心卷",
    category: "成人职业考证（法考/CPA/医考 · 客单价 ¥1,980–¥6,980）",
    marketPositioning: "在职考生时间极碎、愿意为『省时精准押题+主观题采分点精批』重金买单",
    avgTicketNote: "主观题冲刺私教包 ¥2,680/季 · 复购率极高",
    speechLang: "zh-CN",
    visualizerType: "legal-tree",
    starterPrompts: [
      "甲捅伤乙后逃离，救护车途中遇罕见泥石流致乙死亡，死亡结果能归责于甲吗？按法考采分点怎么写？",
      "主观题遇到『偶然防卫』要求观点展示时，两套结论怎么排版才不丢分？",
      "帮我检查这段法言法语：甲想杀乙结果打偏打死丙，因为甲坏所以甲构成故意杀人既遂。",
    ],
    sections: [
      {
        id: "law-s1",
        pageNumber: 33,
        sectionCode: "§4.2",
        title: "刑法上的因果关系与介入因素异常性三步判断法则",
        summary: "存在被害人自身行为、第三人行为或自然事件介入时的结果归属铁律。",
        content:
          "实行行为与危害结果之间出现介入因素时（如第三人过失、被害人特殊反应或自然事件），主观题采分三段论依次考察三点：(1) 先行行为是否制造了紧迫生命危险。(2) 介入因素相对先行行为属于异常独立，还是通常诱发。(3) 介入因素对死亡结果的作用力大小。先行行为致人重伤濒死时，医生一般医疗失误属于通常介入因素，因果关系不断裂，仍归责于前行为人。若遇重大医疗事故或罕见泥石流，则属于异常且起决定作用的介入因素，前行为仅负故意杀人未遂或故意伤害罪责。",
        keyFormulaOrRule:
          "前行为危险紧迫度 + 介入因素异常性（核心权重）+ 介入因素贡献度 ⇒ 决定是否中断结果归责",
        examFrequency: "极高频必考",
        commonTrap: "只写『有因果关系/无因果关系』结论，漏写介入因素异常性的三层法理比对，扣掉 60% 分值！",
      },
    ],
    classroomTitle: "OpenMAIC 法考精讲：一棵决策树秒杀主观题所有『多因一果』介入难题",
    classroomTurns: [
      {
        id: "law-c1",
        speaker: "lecturer",
        speakerName: "周教授（刑法主讲分身）",
        roleBadge: "刑法主讲",
        content:
          "看左侧归责三阶决策树。阅卷老师改一道主观题小问只有十几秒，他找的就是『高概率诱发 vs 独立异常介入』这组采分词。",
        boardHighlight: "先行行为作用力 × 介入因素异常性矩阵",
      },
      {
        id: "law-c2",
        speaker: "assistant",
        speakerName: "助教小微",
        roleBadge: "法考督学官",
        content: "立刻来做一道真题级切片判断，检验 [P.33 §4.2] 是否真正吃透！",
        checkpointQuestion: {
          prompt:
            "甲深夜在高速公路中央追砍乙，乙惊慌翻越护栏逃命时被正常行驶的丙车撞死。关于乙的死亡结果归属，下列表述符合法考主观题标准答案的是：",
          options: [
            "因果关系中断，因为直接撞死乙的是丙的汽车而非甲的刀",
            "因果关系不中断，高速公路深夜追砍使乙陷入极度紧迫危险，仓皇翻越护栏被撞属于该危险高概率诱发的通常介入反应，死亡结果归责于甲",
            "甲与丙构成共同过失致人死亡罪",
            "属于意外事件，甲仅构成寻衅滋事罪",
          ],
          correctIndex: 1,
          explanation:
            "满分法言法语：甲在封闭高速路追砍制造了极高致死风险，被害人慌不择路翻越护栏并非异常自陷风险，正常行驶车辆亦非异常独立介入，故因果链不断裂，死亡结果归属于甲！",
        },
      },
    ],
    podcastTitle: "通勤法考电台：主观题如何把大白话翻译成阅卷老师一眼给满分的法言法语？",
    podcastLines: [
      {
        id: "lp1",
        host: "A",
        hostName: "周教授",
        timestamp: "00:00",
        text: "在职备考的同学最痛的就是：心里明明知道甲有罪，一写到卷面上就成了『因为甲太坏了所以既遂』，一分采分点都拿不到。",
      },
      {
        id: "lp2",
        host: "B",
        hostName: "上岸学长阿泽",
        timestamp: "00:25",
        text: "太真实了！后来用督学系统每天练两道微案例精批，强迫自己按『制造法益侵害紧迫危险—介入因素是否异常—客观归责结论』三句话模板输出，主观题直接飙到 126 分！",
      },
    ],
    defaultVariants: [
      {
        id: "qv-law-1",
        tier: "L2 高频陷阱变式",
        stem: "甲投毒杀乙（致死量），乙腹痛送医途中，救护车被闯红灯的醉驾货车撞毁致乙当场死亡。甲的刑事责任应认定为：",
        options: [
          "故意杀人罪既遂，因为毒药本身已达致死量",
          "故意杀人罪未遂，醉驾货车惨烈车祸系独立且异常的介入因素，截断了毒发死亡进程",
          "故意伤害罪（致人死亡）",
          "故意杀人罪犯罪中止",
        ],
        correctIndex: 1,
        knowledgeTag: "异常介入因素中断归责",
        sourcePage: 33,
        rubricAndAnalysis:
          "虽然甲投放了致死量毒药（先行行为危险大），但乙最终死于闯红灯货车撞击（颅脑损伤当场死亡），该介入因素相对投毒行为具有高度异常性且独立主导了死亡结果，故死亡结果不归责于甲，甲成立故意杀人罪（未遂）。",
        trapWarning: "切勿用假设因果关系（『就算不撞车也会毒死』）替代现实因果流程审视！",
      },
    ],
    studentProfile: {
      studentName: "张律准考生（在职二战主观题）",
      targetGoal: "10 月法考主观题冲刺 120+ 稳过线（去年 104 分惜败）",
      currentPredictedScore: "123 分（刑法与民商综合采分命中率 89%）",
      baselineScore: "104 分（大白话严重、观点展示漏写反方理由）",
      studyStreakDays: 34,
      weeklyHoursSaved: 9.5,
      l3SynthesisStrategy:
        "每天通勤午休与晚间共投入 75 分钟，系统自动过滤已熟练掌握的总则概念，集中火力循环批改『具体打击错误（法定符合说 vs 具体符合说）』与『刑诉非法证据排除法条定位』。",
      l1Traces: [
        {
          id: "ll1-1",
          timestamp: "今天 12:40",
          action: "午休完成介入因素主观微案例精批",
          evidence: "完整写出先行行为紧迫度、异常性、贡献度三要素，采分关键词全中",
          sourceRef: "密押卷 P.33 §4.2",
          masteryDelta: "+22% 采分完整度",
        },
      ],
      l2Surfaces: [
        {
          id: "ll2-1",
          concept: "因果关系介入因素三步判断法",
          accuracyRate: 91,
          errorPattern: "法言法语已高度规范，注意控制单小问字数在 180 字内",
          linkedL1Ids: ["ll1-1"],
          fsrsStabilityDays: 16.2,
          nextReviewLabel: "7 天后抽背",
        },
      ],
    },
  },
  {
    id: "usmle-cardio",
    locales: ["en", "zh"],
    code: "USMLE-STEP1",
    title: "USMLE Step 1 · Cardiovascular Pathophysiology & Hemodynamics",
    category: "Global Medical Prep ($299/yr Pass · $5,900 Agency OEM)",
    marketPositioning: "US/UK/IMG med students spend $1,000+ on question banks; Socratic pathophys reasoning dominates static PDFs",
    avgTicketNote: "Stripe Global $79/mo or $299/yr · 95% Gross Margin",
    speechLang: "en-US",
    visualizerType: "usmle-pathway",
    starterPrompts: [
      "Walk me Socratically through how acute blood loss changes PCWP, SVR, and mixed venous O2.",
      "Why are ACE inhibitors contraindicated in bilateral renal artery stenosis? Explain via glomerular pressure.",
    ],
    sections: [
      {
        id: "med-s1",
        pageNumber: 52,
        sectionCode: "§6.3",
        title: "RAAS Activation & Efferent Arteriole Constriction in Renal Stenosis",
        summary: "Angiotensin II preferentially constricts efferent arterioles to preserve GFR under hypoperfusion.",
        content:
          "In bilateral renal artery stenosis, renal perfusion pressure drops markedly, triggering juxtaglomerular renin release and elevated Angiotensin II (AT-II). AT-II preferentially constricts the efferent arteriole, maintaining intraglomerular hydrostatic pressure and preserving GFR despite reduced renal blood flow. Administering an ACE inhibitor or ARB blocks AT-II synthesis/action, abruptly dilating the efferent arteriole, causing a precipitous drop in GFR and acute rise in serum creatinine.",
        keyFormulaOrRule:
          "Bilateral RAS + ACEi ⇒ Loss of AT-II efferent constriction ⇒ Sharp ↓ P_GC ⇒ Acute ↓ GFR (↑ Cr)",
        examFrequency: "极高频必考",
        commonTrap: "Confusing afferent prostaglandin dilation (blocked by NSAIDs) with efferent AT-II constriction (blocked by ACEi/ARBs)!",
      },
    ],
    classroomTitle: "OpenMAIC Clinical Rounds: Hemodynamic Arrows & Glomerular Autoregulation",
    classroomTurns: [
      {
        id: "med-c1",
        speaker: "lecturer",
        speakerName: "Dr. Carter (Attending Tutor)",
        roleBadge: "Chief Attending",
        content:
          "Look at the glomerular pressure diagram on the board: NSAIDs shut the front door (afferent arteriole via ↓ prostaglandins), while ACE inhibitors throw wide open the back door (efferent arteriole via ↓ Angiotensin II). Either way, glomerular filtration pressure crashes!",
        boardHighlight: "Afferent (PGs) vs Efferent (AT-II) Pressure Gate",
      },
      {
        id: "med-c2",
        speaker: "assistant",
        speakerName: "Resident AI",
        roleBadge: "NBME Coach",
        content: "Quick NBME-style arrow check on [P.52 §6.3] before we advance!",
        checkpointQuestion: {
          prompt:
            "A 68-year-old man with resistant hypertension and bilateral renal bruits starts lisinopril. Five days later, serum creatinine jumps from 1.1 to 2.9 mg/dL. Which hemodynamic shift directly caused this?",
          options: [
            "Constriction of afferent arterioles due to bradykinin accumulation",
            "Dilation of efferent arterioles due to decreased Angiotensin II",
            "Increased glomerular capillary hydrostatic pressure",
            "Aldosterone-mediated sodium retention in the collecting duct",
          ],
          correctIndex: 1,
          explanation:
            "Lisinopril (ACEi) decreases Angiotensin II, removing efferent arteriolar tone. In bilateral RAS, kidneys depend on efferent constriction to maintain GFR; dilating the efferent vessel drops intraglomerular pressure and precipitates acute prerenal-like GFR decline.",
        },
      },
    ],
    podcastTitle: "High-Yield Audio Recall: Mastering Renal & Cardiac Arrows in 3 Minutes",
    podcastLines: [
      {
        id: "mp1",
        host: "A",
        hostName: "Dr. Carter",
        timestamp: "00:00",
        text: "Welcome back to High-Yield Recall! Today's two-minute pearl saves points on every single NBME block: Afferent versus Efferent glomerular tone.",
      },
      {
        id: "mp2",
        host: "B",
        hostName: "Med Fellow Maya",
        timestamp: "00:25",
        text: "Remember the golden mnemonic: Prostaglandins Keep the Door Open at the Afferent side, while Angiotensin Constricts the Exit at the Efferent side!",
      },
    ],
    defaultVariants: [
      {
        id: "qv-med-1",
        tier: "L2 高频陷阱变式",
        stem: "Which medication combination creates a 'double-hit' acute drop in glomerular hydrostatic pressure (P_GC) in a volume-depleted patient?",
        options: [
          "Amlodipine + Hydrochlorothiazide",
          "Ibuprofen (NSAID) + Enalapril (ACE inhibitor)",
          "Metoprolol + Atorvastatin",
          "Furosemide + Potassium chloride",
        ],
        correctIndex: 1,
        knowledgeTag: "Glomerular Autoregulation Double-Hit",
        sourcePage: 52,
        rubricAndAnalysis:
          "Ibuprofen inhibits vasodilatory prostaglandins (constricting the afferent arteriole, ↓ inflow), while Enalapril blocks Angiotensin II (dilating the efferent arteriole, ↓ outflow resistance). Together they catastrophically collapse P_GC and GFR.",
        trapWarning: "Classic Step 1 'triple whammy' nephrotoxicity mechanism (Diuretic + NSAID + ACEi/ARB).",
      },
    ],
    studentProfile: {
      studentName: "Alex K. (MS2 · USMLE Step 1 Prep)",
      targetGoal: "First-Pass NBME > 78% Probability (>99% Pass Margin)",
      currentPredictedScore: "81% NBME Form Equivalent",
      baselineScore: "61% Baseline Diagnostic",
      studyStreakDays: 41,
      weeklyHoursSaved: 11.0,
      l3SynthesisStrategy:
        "Cardiorenal hemodynamic arrows mastered at 92% retention. Next 7 days focus on shock mixed-venous O2 differentiation and antiarrhythmic Vaughan-Williams phase curves via FSRS.",
      l1Traces: [
        {
          id: "ml1-1",
          timestamp: "Today 18:10",
          action: "Completed Cardiorenal Arrow Drill",
          evidence: "Resolved bilateral RAS + ACEi vignette in 38s with zero hints",
          sourceRef: "Syllabus P.52 §6.3",
          masteryDelta: "+16% Speed & Recall",
        },
      ],
      l2Surfaces: [
        {
          id: "ml2-1",
          concept: "RAAS & Glomerular Starling Forces",
          accuracyRate: 93,
          errorPattern: "Solid mechanism recall across drug perturbations",
          linkedL1Ids: ["ml1-1"],
          fsrsStabilityDays: 21.4,
          nextReviewLabel: "Review in 9 days",
        },
      ],
    },
  },
];

export const ALL_GLOBAL_COURSES: CoursePack[] = [
  ...COURSE_PACKS,
  ...LOCALIZED_EXTRA_COURSES,
];

export function getCoursesForLocale(locale: LocaleCode): CoursePack[] {
  const prioritized = ALL_GLOBAL_COURSES.filter((c) =>
    c.locales.includes(locale)
  );
  const others = ALL_GLOBAL_COURSES.filter((c) => !c.locales.includes(locale));
  if (locale === "ja") {
    const jpFirst = ALL_GLOBAL_COURSES.filter((c) => c.id === "ja-todai-math");
    const rest = ALL_GLOBAL_COURSES.filter((c) => c.id !== "ja-todai-math");
    return [...jpFirst, ...rest];
  }
  if (locale === "en") {
    const usmleFirst = ALL_GLOBAL_COURSES.filter(
      (c) => c.id === "usmle-cardio" || c.id === "ap-calc"
    );
    const rest = ALL_GLOBAL_COURSES.filter(
      (c) => c.id !== "usmle-cardio" && c.id !== "ap-calc"
    );
    return [...usmleFirst, ...rest];
  }
  return [...prioritized, ...others];
}

export const ASSET_LIGHT_SOP_STEPS = [
  {
    phase: "第 1 步 · 启动预算仅 ¥2,680（严控 ≤1万红线，绝不提前租贵服务器）",
    cost: "¥2,680",
    dailyTime: "前 3 天 · 每天 2 小时",
    details: [
      "个体工商户/轻型科技主体线上注册 + 合规收款码/自动发卡通道：约 ¥300–¥600",
      "独立高信任域名（2个：1个母品牌官网 + 1个客户体验泛域名）+ 基础展示节点（Vercel/轻量云）：¥280/年",
      "DeepSeek-V3 / Qwen-Plus 企业高并发 API 预充值：¥500（按单生月均 15 万 Token 仅耗费 ¥2.4 算，够支撑前 200 名重度付费学员！）",
      "飞书多维表格 CRM + 3 分钟高清实机贴牌演示录屏制作：¥0（纯自制）+ 预留 ¥1,300 机动备用金（总启动开支仅 ¥2,680，手里留足 ¥7,320 安全垫！）",
    ],
  },
  {
    phase: "第 2 步 · 合法『空手套白狼』核心机制：先收 ¥19,800 首付款，再花 ¥99 开专属容器！",
    cost: "0 库存风险",
    dailyTime: "每天 1.5 小时发定制链接",
    details: [
      "每天筛选 10 家高客单小型工作室（小红书/抖音搜『雅思工作室』『AP微积分一对一』『法考主观题带背』，挑粉丝 2000–3万、客单价过万但还在靠人工助教改作业的老板）",
      "用本系统右上角『3秒客户贴牌预览』输入对方机构名，录一段 45 秒专属演示视频私信老板：『王校长，帮贵校把内部讲义做成了带您品牌 Logo 的 24h 微信伴学助教与家长周报系统，转化 8 个老学员当场回本，给您开了 48 小时专属体验号』",
      "签单铁律：标准年费 ¥39,800，前 5 家种子客户给『联合标杆共创价 ¥19,800（签约付全款或 70% 首款 ¥13,860）』——钱到账后，当天晚上花 15 分钟在轻量云开一台 ¥99/月独立 Docker 实例（运行官方 Apache-2.0 DeepTutor 镜像）完成交付，净赚 ¥18,000+ 现金流！",
    ],
  },
  {
    phase: "第 3 步 · 渠道军火商裂变（把你的每天 2 小时放大 50 倍）",
    cost: "成交后才分钱（零底薪）",
    dailyTime: "每天 30 分钟管代理商群",
    details: [
      "拿着前 3 家真实回款案例，不招底薪销售，直接招募『教培软件代理商 / 校长圈群主 / 垂直教师博主』做零门槛城市合伙人",
      "给出无法拒绝的分润：渠道每成交 1 家 ¥39,800 机构白标，当场结算 55%（¥21,890 现金归渠道），你躺收 ¥17,910 纯利 + 次年全额算力包续费抽成！",
      "C 端散户与独立老师同步躺赚：在演示页开放 ¥399/年教师出卷会员与 ¥699/年备考伴学卡，付款自动发卡密（License Key），全程无需人工介入客服。",
    ],
  },
];
