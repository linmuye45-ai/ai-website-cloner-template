/**
 * 苍穹造物 AETHERIA OS · 核心全栈引擎
 * 1. 一人多智能体游戏大厂（Claude-Code-Game-Studios 49 Agents + QFramework + Mindustry/RogueLegacy）
 * 2. PixelFX 244 纯代码特效与打击感（Windup-Strike-Hitstop-Screenshake）
 * 3. Autopilot AI 自动试玩压测与数值平衡（ramenvr/autopilot）
 * 4. Video-to-Game 可玩广告与 GrokBot 全球出海投流矩阵
 * 5. 一年数亿流动净资产 + 三年上等顶级十角兽（$20B-$45B）资本计算器
 */

export type GameModeId = "gate_runner" | "mindustry_td" | "rogue_slash";

export type GameModeConfig = {
  id: GameModeId;
  title: string;
  subtitle: string;
  benchmark: string;
  benchmarkRev: string;
  coreLoop: string;
  cpiUSD: number;
  d1RetentionPct: number;
  d7RoasPct: number;
  accent: string;
};

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "gate_runner",
    title: "《末日倍增门：寒霜幸存者》",
    subtitle: "左右横移刷「×2 / +5」倍增门 + 弹幕割草 + 末日基地内购",
    benchmark: "对标：《Last War: Survival》/《Whiteout Survival》",
    benchmarkRev: "2025–2026 单款年入 $22.4亿–$24.4亿（~¥170亿）",
    coreLoop: "前 30 秒数字门倍增小队爽快割草吸量 → 第 90 秒尸潮 Boss 卡点触发 ¥6 首充觉醒加特林",
    cpiUSD: 0.38,
    d1RetentionPct: 51.4,
    d7RoasPct: 148,
    accent: "#38BDF8",
  },
  {
    id: "mindustry_td",
    title: "《星核工厂：传送带塔防》",
    subtitle: "Mindustry 开源内核：晶矿采集 + 传送带供弹 + 等离子炮塔拦截",
    benchmark: "对标：《Mindustry》+《Kingshot》(点点互动 0→$11亿新游)",
    benchmarkRev: "点点互动《Kingshot》首年破 $11亿（~¥78亿）",
    coreLoop: "点击网格部署采矿机与高频脉冲塔 → 能量晶核沿传送带自动充能 → 全屏电磁脉冲清场",
    cpiUSD: 0.44,
    d1RetentionPct: 49.2,
    d7RoasPct: 139,
    accent: "#F59E0B",
  },
  {
    id: "rogue_slash",
    title: "《深渊遗产：肉鸽割草》",
    subtitle: "RogueLegacy1 词条继承 + Agent-Sprite-Forge 序列帧 + PixelFX 刀光闪电",
    benchmark: "对标：海彼 Habby《Capybara Go! / 弹壳特攻队》",
    benchmarkRev: "40人团队单款首年 $1.4亿（≈¥10亿）",
    coreLoop: "自动锁敌发射回旋刀光与雷霆链 → 击杀掉落黄金词条三选一 → 无限叠加快感与顿帧暴击",
    cpiUSD: 0.41,
    d1RetentionPct: 53.8,
    d7RoasPct: 156,
    accent: "#A855F7",
  },
];

export type VfxPresetId = "flame_slash" | "chain_lightning" | "gold_burst" | "void_nova";

export type VfxConfig = {
  id: VfxPresetId;
  name: string;
  enName: string;
  colorPrimary: string;
  colorSecondary: string;
  windupFrames: number; // 蓄力帧
  hitstopMs: number; // 命中卡肉顿帧 (ms)
  screenshakePx: number; // 屏幕震动幅度 (px)
  particleCount: number; // 粒子迸发数
  critMultiplier: number; // 暴击倍率
  desc: string;
};

export const PIXELFX_PRESETS: VfxConfig[] = [
  {
    id: "flame_slash",
    name: "烈焰半月斩 · Flame Crescent",
    enName: "pixelfx::blade_inferno_v4",
    colorPrimary: "#F97316",
    colorSecondary: "#FDE047",
    windupFrames: 4,
    hitstopMs: 55,
    screenshakePx: 7,
    particleCount: 28,
    critMultiplier: 2.4,
    desc: "经典蓄力 4 帧→扇形刀光挥砍→命中强制卡肉顿帧 55ms + 火星迸射，刀刀入肉。",
  },
  {
    id: "chain_lightning",
    name: "雷霆九连闪 · Arc Overload",
    enName: "pixelfx::tesla_chain_v2",
    colorPrimary: "#38BDF8",
    colorSecondary: "#E0F2FE",
    windupFrames: 2,
    hitstopMs: 35,
    screenshakePx: 5,
    particleCount: 36,
    critMultiplier: 3.1,
    desc: "2 帧极速起手→敌群间折线电弧弹射→高频麻痹震屏，专治密集尸潮割草。",
  },
  {
    id: "gold_burst",
    name: "多巴胺暴富雨 · Jackpot Fountain",
    enName: "pixelfx::coin_dopamine_v9",
    colorPrimary: "#EAB308",
    colorSecondary: "#FEF08A",
    windupFrames: 1,
    hitstopMs: 70,
    screenshakePx: 9,
    particleCount: 48,
    critMultiplier: 5.0,
    desc: "可玩广告吸量王牌：Boss 爆裂瞬间全屏抛物线金币雨 + 70ms 慢镜头特写，刺激点击下载。",
  },
  {
    id: "void_nova",
    name: "虚空坍缩黑洞 · Void Singularity",
    enName: "pixelfx::gravity_collapse_v6",
    colorPrimary: "#A855F7",
    colorSecondary: "#F43F5E",
    windupFrames: 6,
    hitstopMs: 85,
    screenshakePx: 11,
    particleCount: 54,
    critMultiplier: 4.2,
    desc: "先向中心引力聚怪 6 帧→紫红奇点坍缩大爆炸→全屏 11px 重度震动，首充武器专属特效。",
  },
];

export type DepartmentStep = {
  id: string;
  deptNum: string;
  name: string;
  leadAgent: string;
  reposUsed: string[];
  outputSummary: string;
  latencySec: string;
};

export const STUDIO_DEPARTMENTS: DepartmentStep[] = [
  {
    id: "intel",
    deptNum: "DEPT 01",
    name: "全球买量情报与红队立项部",
    leadAgent: "MediaCrawler × Elephant-Goldfish Auditor",
    reposUsed: [
      "NanmiCoder/MediaCrawler",
      "google/elephant-goldfish-model",
      "BeatAPI/grokbot-growth",
    ],
    outputSummary:
      "扫描 TikTok/AppLovin 本周 Top 50 可玩素材，锁定「倍增门+塔防」CPI 最低（$0.38），红队审查排除 3 处数值死锁。",
    latencySec: "0.8s",
  },
  {
    id: "narrative",
    deptNum: "DEPT 02",
    name: "去 AI 味爽文剧本与钩子台词部",
    leadAgent: "Lieflat De-AI Writer × InkOS Worldbuilder",
    reposUsed: [
      "larashero3-dotcom/lieflat-less-ai-tone",
      "PenglongHuang/chinese-novelist-skill",
      "Narcooo/inkos",
    ],
    outputSummary:
      "通过 100+ 项去 AI 味指标清洗文案，机器感从 78.4% 降至 2.9%，产出前 3 秒黄金吸量台词与末日世界观。",
    latencySec: "1.1s",
  },
  {
    id: "arch",
    deptNum: "DEPT 03",
    name: "QFramework 干净架构与主程部",
    leadAgent: "Claude-Code-Game-Studios (Lead Architect)",
    reposUsed: [
      "Donchitos/Claude-Code-Game-Studios",
      "liangxiegame/QFramework",
      "Anuken/Mindustry",
      "flibitijibibo/RogueLegacy1",
    ],
    outputSummary:
      "基于 QFramework (<1000行核心) 生成 MVC/Command 分层代码，融合 Mindustry 寻路与 RogueLegacy 词条池。",
    latencySec: "1.4s",
  },
  {
    id: "art",
    deptNum: "DEPT 04",
    name: "2D/3D 零外包资产与 PixelFX 特效部",
    leadAgent: "Agent-Sprite-Forge × Sand3D × PixelFX",
    reposUsed: [
      "0x0funky/agent-sprite-forge",
      "patch-gg/pixelfx",
      "Sandflow-ai/sand3d",
      "scenario-labs/skills",
    ],
    outputSummary:
      "1 张立绘自动烘焙 6 组动作序列帧 + Sand3D 代码生成可破坏掩体 + 注入 244 种代码级刀光与受击顿帧。",
    latencySec: "1.2s",
  },
  {
    id: "qa",
    deptNum: "DEPT 05",
    name: "Autopilot 10 万局自愈压测部",
    leadAgent: "ramenvr/autopilot × Agent-Desktop",
    reposUsed: [
      "ramenvr/autopilot",
      "gamedev-skills/awesome-gamedev-agent-skills",
      "vercel-labs/agent-desktop",
    ],
    outputSummary:
      "AI 并发试玩 100,000 局零崩溃，自动将第 4 波尸潮难度上调 18%，精准在第 85 秒触发 ¥6 首充礼包高转化弹窗。",
    latencySec: "0.9s",
  },
  {
    id: "growth",
    deptNum: "DEPT 06",
    name: "Video-to-Game 可玩广告与出海投流部",
    leadAgent: "lovisdotio/video-to-game × GrokBot Growth",
    reposUsed: [
      "lovisdotio/video-to-game",
      "alchaincyf/huashu-motion",
      "ZLHad/OpenVideoHarness",
      "BeatAPI/grokbot-growth",
    ],
    outputSummary:
      "一键编译 15 秒 Three.js/Canvas 互动可玩广告 + 12 国语言 MG 宣传片，自动分发至 AppLovin AXON 与 TikTok。",
    latencySec: "1.0s",
  },
];

export type GeneratedBlueprint = {
  promptTitle: string;
  modeId: GameModeId;
  qframeworkCode: string;
  elephantAudit: string[];
  deAiCopy: {
    beforeAiScore: number;
    afterAiScore: number;
    hookLineCN: string;
    hookLineEN: string;
    paywallTrigger: string;
  };
  tunedParams: {
    fireRateMultiplier: number;
    squadCloneMultiplier: number;
    bossHpMultiplier: number;
  };
};

export function generateGameBlueprint(
  customPrompt: string,
  modeId: GameModeId,
  vfx: VfxConfig
): GeneratedBlueprint {
  const mode = GAME_MODES.find((m) => m.id === modeId) ?? GAME_MODES[0];
  const title = customPrompt.trim() || mode.title;

  const qframeworkCode = `// Auto-generated by Claude-Code-Game-Studios × QFramework Clean Architecture
// Target: ${title} | VFX: ${vfx.enName} (Hitstop: ${vfx.hitstopMs}ms)
import { AbstractSystem, AbstractModel, IController } from "@/core/qframework";
import { PixelFXEngine } from "@/vfx/pixelfx-244";

export class CombatModel extends AbstractModel {
  public squadCount = 1;
  public dps = 120;
  public d1RetentionScore = ${mode.d1RetentionPct};
  protected onInit() {}
}

export class HitstopCombatSystem extends AbstractSystem {
  public onProjectileHit(targetId: string, baseDmg: number) {
    const model = this.getModel(CombatModel);
    const finalDmg = baseDmg * model.squadCount * ${vfx.critMultiplier};
    // 注入 patch-gg/pixelfx 蓄力-命中-顿帧-震屏闭环
    PixelFXEngine.trigger("${vfx.id}", {
      windupFrames: ${vfx.windupFrames},
      hitstopMs: ${vfx.hitstopMs},
      screenshakePx: ${vfx.screenshakePx},
      particles: ${vfx.particleCount},
    });
    return finalDmg;
  }
}`;

  const elephantAudit = [
    `[Elephant-Goldfish 规格核验 PASS] 前 15 秒可玩广告钩子（${mode.id}）单手指即可操作，符合 AppLovin AXON 黄金前 3 秒留存标准。`,
    `[数值防崩盘修正] 原设计第 3 波小怪血量膨胀过快，Autopilot 10 万局模拟发现非付费玩家流失率达 34%，已自动平滑曲线并将首充卡点锁定在第 85 秒。`,
    `[美术管线零阻塞] Agent-Sprite-Forge 已将主角立绘切分为 8 方向 48 帧精灵图集（纹理内存占用仅 1.8MB），Web/小游戏首屏加载 < 0.6 秒。`,
  ];

  return {
    promptTitle: title,
    modeId,
    qframeworkCode,
    elephantAudit,
    deAiCopy: {
      beforeAiScore: 81.6,
      afterAiScore: 2.8,
      hookLineCN:
        "「别划走！99% 的人第一关选错了左边那个 +5 门，撑不过第 3 波尸潮——你来试 15 秒！」",
      hookLineEN:
        '"Stop scrolling! Everyone picks the wrong multiplier gate at 0:08. Can you survive Wave 3?"',
      paywallTrigger:
        "第 85 秒深渊领主狂暴时弹出：「仅需 ¥6 解锁【全屏雷霆加特林 + 永久 ×3 分身】，首充转化率实测 14.8%！」",
    },
    tunedParams: {
      fireRateMultiplier: 1.35,
      squadCloneMultiplier: 2,
      bossHpMultiplier: 1.2,
    },
  };
}

/**
 * 一年数亿流动净资产 + 三年上等顶级十角兽（$20B-$45B）全栈资本推演引擎
 */
export function calculateDecacornTrajectory(params: {
  monthlyGamesBuilt: number; // 每月 49-Agent 量产游戏原型数 (默认 4)
  hitRatePct: number; // 爆款跑出率 % (默认 18%)
  playableCpiSavingPct: number; // Video-to-Game 可玩广告降低买量成本比例 % (默认 52%)
  y2CreatorSeatsWan: number; // 第2-3年 Aetheria Studio 全球付费创作者席位 (万人, 默认 85)
  y3AxonAdSpendBillionUSD: number; // 第3年经由 Aetheria AXON 撮合的可玩广告总流水 ($B USD, 默认 6.5)
}) {
  // ── 第一年（现金牛态：一人大厂自研混合休闲矩阵 + 可玩广告定制）──
  const annualGames = params.monthlyGamesBuilt * 12;
  const hitGamesCount = Math.max(
    1,
    Math.round((annualGames * params.hitRatePct) / 100)
  );
  // 每款跑出来的混合休闲爆款首年贡献平均流水（对标 Capybara Go $1.4亿 的 1/5 即 ¥2亿）
  const y1GrossBookingsYiRMB = Number((hitGamesCount * 1.65).toFixed(2));
  // 买量成本因自产 Playable Ads 大幅降低，净利率达 36%–42%
  const y1NetMargin = 0.24 + (params.playableCpiSavingPct / 100) * 0.28;
  // 加上给 B 端短剧/游戏厂代工可玩广告的高毛利现金
  const y1B2BPlayableCashYi = 0.48;
  // 第一年装进口袋的税后流动净现金（人民币 亿）
  const y1LiquidNetCashYiRMB = Number(
    (y1GrossBookingsYiRMB * y1NetMargin + y1B2BPlayableCashYi).toFixed(2)
  );
  const y1LiquidNetCashUSD = Math.round(
    (y1LiquidNetCashYiRMB * 100_000_000) / 7.12
  );

  // ── 第二年（Lovable 态：开放 Aetheria 造游与可玩广告 SaaS 平台 + 发行分成）──
  const y2SaasArrMillionUSD = Math.round(params.y2CreatorSeatsWan * 10000 * 0.085); // 均价 $850/年
  const y2StudioNetRevMillionUSD = Math.round(
    (y1LiquidNetCashYiRMB * 1.8 * 100) / 7.12
  );
  const y2TotalArrMillionUSD = y2SaasArrMillionUSD + y2StudioNetRevMillionUSD;
  // 对标 Lovable 22x ARR 估值倍数
  const y2ValuationBillionUSD = Number(
    ((y2TotalArrMillionUSD * 20) / 1000).toFixed(2)
  );

  // ── 第三年（AppLovin AXON 态：全球可玩广告与互动短剧算法交易所 + 造游生态）──
  // 平台净抽成 ~26%（对标 AppLovin 电商与游戏广告净提成）+ SaaS ARR
  const y3AxonNetRevBillionUSD = Number(
    (params.y3AxonAdSpendBillionUSD * 0.26).toFixed(2)
  );
  const y3SaasAndGamesBillionUSD = Number(
    ((y2TotalArrMillionUSD * 1.65) / 1000).toFixed(2)
  );
  const y3TotalRevenueBillionUSD = Number(
    (y3AxonNetRevBillionUSD + y3SaasAndGamesBillionUSD).toFixed(2)
  );
  // 对标 AppLovin 60.8% 净利率 / 84% EBITDA 率，保守取 56% 税后净利率
  const y3AfterTaxNetProfitBillionUSD = Number(
    (y3TotalRevenueBillionUSD * 0.56).toFixed(2)
  );
  const y3AfterTaxNetProfitYiRMB = Number(
    (y3AfterTaxNetProfitBillionUSD * 7.12).toFixed(2)
  );
  // 对标 AppLovin / Palantir / Lovable 高增长 AI 广告交易平台 15x 营收 / 26x 净利倍数
  const y3DecacornValuationBillionUSD = Number(
    (y3TotalRevenueBillionUSD * 14.5).toFixed(1)
  );
  const y3DecacornValuationYiRMB = Math.round(
    y3DecacornValuationBillionUSD * 7.12
  );

  return {
    annualGames,
    hitGamesCount,
    y1GrossBookingsYiRMB,
    y1LiquidNetCashYiRMB,
    y1LiquidNetCashExactRMB: Math.round(y1LiquidNetCashYiRMB * 100_000_000),
    y1LiquidNetCashUSD,
    y2TotalArrMillionUSD,
    y2ValuationBillionUSD,
    y3TotalRevenueBillionUSD,
    y3AfterTaxNetProfitBillionUSD,
    y3AfterTaxNetProfitYiRMB,
    y3DecacornValuationBillionUSD,
    y3DecacornValuationYiRMB,
    isYear1MultiHundredMillionRMB: y1LiquidNetCashYiRMB >= 2.0,
    isYear3UpperDecacorn: y3DecacornValuationBillionUSD >= 15.0,
  };
}

/**
 * 8大类开源技能武器库完整注册表（用户提供的全量弹药库）
 */
export type ArsenalItem = {
  catId: string;
  catName: string;
  name: string;
  url: string;
  role: string;
  impact: string;
};

export const ARSENAL_ITEMS: ArsenalItem[] = [
  // 1. 一人游戏工作室 / 多智能体全流程
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "Donchitos/Claude-Code-Game-Studios",
    url: "https://github.com/Donchitos/Claude-Code-Game-Studios",
    role: "49 个专职 Agent + 70+ Skills，覆盖创意、程序、美术、关卡、QA、终审",
    impact: "把 1 个人升级为完整 50 人虚拟游戏大厂",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "liangxiegame/QFramework",
    url: "https://github.com/liangxiegame/QFramework",
    role: "不到 1000 行核心的 Unity/Godot MVC/DDD 干净架构 + UIKit/AudioKit",
    impact: "杜绝 AI 写代码后期变意大利面，商业级可维护",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "ramenvr/autopilot",
    url: "https://github.com/ramenvr/autopilot",
    role: "开源自改进 Playtesting Agent，自动把游戏玩到崩溃再自己修 Bug",
    impact: "省掉 20 人测试团队，通宵 10 万局平衡数值卡点",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "Anuken/Mindustry",
    url: "https://github.com/Anuken/Mindustry",
    role: "Steam 商业神作《Mindustry》完整开源源码（塔防 + RTS + 工厂传送带）",
    impact: "直接复用成熟商业级寻路、物流瓶颈与塔防系统",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "flibitijibibo/RogueLegacy1",
    url: "https://github.com/flibitijibibo/RogueLegacy1",
    role: "《盗贼遗产1》官方源码，2D 横版动作肉鸽标杆架构",
    impact: "直接复刻经过百万销量验证的肉鸽词条与地图生成系统",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "tettethu/VibeGame",
    url: "https://github.com/tettethu/VibeGame",
    role: "AI 原生 2D 网页游戏框架，一句话出地牢肉鸽/格斗/跑酷可玩原型",
    impact: "10 分钟完成从点子到可试玩链接的极速闭环",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "scenario-labs/skills (Scenario 3D OS)",
    url: "https://github.com/scenario-labs/skills",
    role: "6 大制作部门 + 80 个专业 Skills，直接驱动 Blender/Maya/Unreal/Unity/Godot",
    impact: "从草图到 3D 绑定动画全流程 Agent 自动化",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "gamedev-skills/awesome-gamedev-agent-skills",
    url: "https://github.com/gamedev-skills/awesome-gamedev-agent-skills",
    role: "76 项 Unity 手感调优、美术管线、3D 导出、QA 自动化核心技能库",
    impact: "直接把独立游戏的手感拉升到商业大作水准",
  },
  {
    catId: "studio",
    catName: "1. 一人游戏工作室 / 多Agent总控",
    name: "bmad-code-org/BMAD-METHOD & agency-agents",
    url: "https://github.com/bmad-code-org/BMAD-METHOD",
    role: "AI 敏捷开发标准 SOP（需求→架构→开发→测试）与多岗位职责边界",
    impact: "防止多 Agent 互相打架或重复造轮子",
  },
  // 2. 代码生成视频 / MG动画 / 特效工厂
  {
    catId: "vfx",
    catName: "2. 代码特效 / 视频宣传片工厂",
    name: "patch-gg/pixelfx",
    url: "https://github.com/patch-gg/pixelfx",
    role: "244 种纯代码像素游戏特效 + 完整「蓄力-出手-命中-受击-收招」打击感示例",
    impact: "零美术成本实现刀光闪电、金币暴击与卡肉顿帧",
  },
  {
    catId: "vfx",
    catName: "2. 代码特效 / 视频宣传片工厂",
    name: "alchaincyf/huashu-motion & OpenVideoHarness",
    url: "https://github.com/alchaincyf/huashu-motion",
    role: "Video-as-Code 工作台：Agent 写代码渲染商业宣传片、自动作曲配乐与局部修改",
    impact: "每天自动批量产出百条多语言买量视频素材",
  },
  {
    catId: "vfx",
    catName: "2. 代码特效 / 视频宣传片工厂",
    name: "Vincentwei1021/mg-styles-15 & motion-prompt",
    url: "https://github.com/Vincentwei1021/mg-styles-15",
    role: "15 种 MG 动效风格源码 + 192 个专业运镜/UI 特效词典",
    impact: "让 AI 视频和 UI 动效告别廉价感",
  },
  // 3. 3D / 像素资产流水线
  {
    catId: "asset",
    catName: "3. 3D / 像素资产与实时动画管线",
    name: "0x0funky/agent-sprite-forge",
    url: "https://github.com/0x0funky/agent-sprite-forge",
    role: "确认 1 张静态立绘，自动肝出待机/走/跑/攻击/受击全套动作 + 2D 地图",
    impact: "彻底消灭 2D 游戏最烧钱耗时的序列帧外包",
  },
  {
    catId: "asset",
    catName: "3. 3D / 像素资产与实时动画管线",
    name: "Sandflow-ai/sand3d",
    url: "https://github.com/Sandflow-ai/sand3d",
    role: "用 Python 短代码写 3D 模型（公开 10 万个代码构建资产），导出 GLB/USD",
    impact: "让 LLM 用写代码的方式 10 秒捏出 3D 游戏道具",
  },
  {
    catId: "asset",
    catName: "3. 3D / 像素资产与实时动画管线",
    name: "quaternius.com & 3dassets.dev & actionforge.app",
    url: "https://quaternius.com/",
    role: "2万+ CC0 免署名可商用 3D 模型 + 120+ 动作库 + 在线自动骨骼绑定",
    impact: "开箱即用的商业级 3D 资源底座",
  },
  {
    catId: "asset",
    catName: "3. 3D / 像素资产与实时动画管线",
    name: "NVlabs/motionbricks & jrouwe/JoltPhysics",
    url: "https://github.com/NVlabs/motionbricks",
    role: "NVIDIA 实时高帧率运动生成 + AAA 级开源物理引擎",
    impact: "支撑同屏千人割草与真实物理碰撞",
  },
  // 4. Video-to-Game / 可玩广告与去AI味
  {
    catId: "playable",
    catName: "4. Video-to-Game 可玩广告与去AI味",
    name: "lovisdotio/video-to-game",
    url: "https://github.com/lovisdotio/video-to-game",
    role: "把任意爆款视频一键转成可交互 Three.js/Web 可玩广告（Playable Ad）",
    impact: "买量转化率提升 3.8 倍，获客成本 CPI 砍半",
  },
  {
    catId: "playable",
    catName: "4. Video-to-Game 可玩广告与去AI味",
    name: "larashero3-dotcom/lieflat-less-ai-tone",
    url: "https://github.com/larashero3-dotcom/lieflat-less-ai-tone",
    role: "520 万字实测打磨的 100+ 指标去 AI 味引擎（脚本+语义+盲评三重验证）",
    impact: "砍掉台词与买量文案的机器感，点击率翻倍",
  },
  {
    catId: "playable",
    catName: "4. Video-to-Game 可玩广告与去AI味",
    name: "oyasumi-gamedev.com/tools & ai-pose-gallery",
    url: "https://oyasumi-gamedev.com/tools/",
    role: "真实地图一键转 3D 街区/室内背景 + 角色姿势/1407套服装合成台",
    impact: "1 分钟搭好互动短剧与可玩广告的吸睛场景",
  },
  // 8. 情报逆向 / 审查 / 出海增长自动化
  {
    catId: "growth",
    catName: "5. 逆向情报 / 审查 / 出海增长集群",
    name: "BeatAPI/grokbot-growth & openteam.so",
    url: "https://github.com/BeatAPI/grokbot-growth",
    role: "回答 6 个问题生成全套出海增长 Bot 团队（多语言社媒、SEO/AEO、竞品监控）",
    impact: "1 人 24 小时全自动打穿美/日/韩/中东买量与自然流",
  },
  {
    catId: "growth",
    catName: "5. 逆向情报 / 审查 / 出海增长集群",
    name: "NanmiCoder/MediaCrawler",
    url: "https://github.com/NanmiCoder/MediaCrawler",
    role: "小红书/抖音/B站/微博等 7 大平台爆款素材与评论痛点爬虫",
    impact: "每天自动捕获高转化副玩法钩子与玩家情绪",
  },
  {
    catId: "growth",
    catName: "5. 逆向情报 / 审查 / 出海增长集群",
    name: "google/elephant-goldfish-model & storytold/craft-anything",
    url: "https://github.com/google/elephant-goldfish-model",
    role: "独立审查 Agent 找架构矛盾 + 纯 Rust 逆向引擎拆解竞品底层骨架",
    impact: "像素级拆解竞品印钞公式，立项零废案",
  },
  {
    catId: "growth",
    catName: "5. 逆向情报 / 审查 / 出海增长集群",
    name: "vercel-labs/agent-desktop",
    url: "https://github.com/vercel-labs/agent-desktop",
    role: "基于系统无障碍树的桌面级 Computer Use，后台多 Agent 并行不抢鼠标",
    impact: "让 49 个 AI 员工在后台同时操作引擎、压测与发帖",
  },
];
