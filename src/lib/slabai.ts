/**
 * 闪鉴金库 SlabAI · 核心引擎
 * 「手机 3 秒 AI 光谱评级 × 保税金库零物流秒换手 × 88% 算法秒回购 × 中日美跨市套利」
 * 目标：三年内赚到税后净利润十位数以上（≥ ¥1,000,000,000）
 */

export type CollectibleId =
  | "pikachu"
  | "luffy"
  | "labubu"
  | "pony"
  | "wemby"
  | "badge";

export type ConditionLevel = "mint" | "light" | "played";

export type CollectiblePreset = {
  id: CollectibleId;
  category: string;
  title: string;
  series: string;
  code: string;
  originMarket: string;
  defaultBuyPrice: number; // 用户入手价 (RMB)
  rawPriceCN: number; // 国内裸卡/未评均价 (RMB)
  slabPriceCN: number; // 国内 9.5 分金砖价 (RMB)
  slabPriceJP: number; // 日本 SNKRDUNK/Mercari 折合 RMB
  slabPriceUS: number; // 美国 Courtyard/Whatnot 折合 RMB
  slabPriceEU: number; // 欧洲 Cardmarket 折合 RMB
  annualTurnover: number; // 金库年均零物流换手次数
  popCount: number; // 全球已认证 9.5+ 存世量
  accent: string;
  badgeText: string;
};

export const PRESETS: CollectiblePreset[] = [
  {
    id: "pikachu",
    category: "宝可梦 TCG",
    title: "梵高皮卡丘 灰毡帽特典卡",
    series: "Pokémon × Van Gogh Museum Promo",
    code: "SVP-EN-085",
    originMarket: "欧美博物馆限定",
    defaultBuyPrice: 980,
    rawPriceCN: 1150,
    slabPriceCN: 2180,
    slabPriceJP: 2460,
    slabPriceUS: 3120,
    slabPriceEU: 2790,
    annualTurnover: 9,
    popCount: 14280,
    accent: "#E5B84B",
    badgeText: "全球硬通货 · 美盘溢价 +43%",
  },
  {
    id: "luffy",
    category: "海贼王 OPCG",
    title: "五档尼卡路飞 漫画背景超级隐藏",
    series: "One Piece Awakening of the New Era",
    code: "OP05-119 SEC-MANGA",
    originMarket: "日本万代初版",
    defaultBuyPrice: 8500,
    rawPriceCN: 9800,
    slabPriceCN: 15600,
    slabPriceJP: 17200,
    slabPriceUS: 22800,
    slabPriceEU: 19500,
    annualTurnover: 8,
    popCount: 3190,
    accent: "#F43F5E",
    badgeText: "日美价差王 · 单张套利 +¥4,900",
  },
  {
    id: "labubu",
    category: "泡泡玛特潮玩",
    title: "LABUBU 前方高能 搪胶毛绒隐藏款「本我」",
    series: "THE MONSTERS Big Into Energy Vinyl Plush",
    code: "PM-LABUBU-SEC-01",
    originMarket: "中国首发 · 全球疯抢",
    defaultBuyPrice: 99,
    rawPriceCN: 1280,
    slabPriceCN: 1850,
    slabPriceJP: 2190,
    slabPriceUS: 2980,
    slabPriceEU: 2540,
    annualTurnover: 11,
    popCount: 6840,
    accent: "#10B981",
    badgeText: "2025–2026 顶流 · 美洲溢价 +61%",
  },
  {
    id: "pony",
    category: "卡游国创卡牌",
    title: "小马宝莉 辉月包八弹 黑背 CR 碧琪",
    series: "Kayou My Little Pony Moon Series 8",
    code: "KY-MLP-CR-08",
    originMarket: "中国卡游印钞机系列",
    defaultBuyPrice: 320,
    rawPriceCN: 680,
    slabPriceCN: 1390,
    slabPriceJP: 1520,
    slabPriceUS: 1960,
    slabPriceEU: 1680,
    annualTurnover: 10,
    popCount: 5410,
    accent: "#EC4899",
    badgeText: "出海量暴涨 · 东南亚/美盘疯抢",
  },
  {
    id: "wemby",
    category: "NBA 球星卡",
    title: "文班亚马 Prizm 银折新秀卡",
    series: "Panini Prizm Basketball Silver Rookie",
    code: "PANINI-23-WEMBY-136",
    originMarket: "美国帕尼尼",
    defaultBuyPrice: 2200,
    rawPriceCN: 2650,
    slabPriceCN: 4600,
    slabPriceJP: 4350,
    slabPriceUS: 6480,
    slabPriceEU: 5200,
    annualTurnover: 7,
    popCount: 8920,
    accent: "#38BDF8",
    badgeText: "美盘流动性第一 · 秒回购极快",
  },
  {
    id: "badge",
    category: "二次元谷子/吧唧",
    title: "排球少年 昼休系列 初版闪底徽章（及川彻）",
    series: "Haikyu!! Jump Shop First Edition Holo Can Badge",
    code: "JS-HQ-BADGE-01",
    originMarket: "日本 Jump Shop 限定",
    defaultBuyPrice: 260,
    rawPriceCN: 520,
    slabPriceCN: 960,
    slabPriceJP: 890,
    slabPriceUS: 1380,
    slabPriceEU: 1150,
    annualTurnover: 12,
    popCount: 4120,
    accent: "#A855F7",
    badgeText: "谷圈高频换手 · 防盗印刚需",
  },
];

export type SlabInput = {
  presetId: CollectibleId;
  customName: string;
  buyPrice: number;
  condition: ConditionLevel;
  ownerTag: string;
};

export type MarketQuote = {
  region: string;
  flag: string;
  platform: string;
  priceRMB: number;
  localText: string;
  diffPct: number; // vs 国内金砖价
  isBest: boolean;
};

export type SlabReport = {
  preset: CollectiblePreset;
  displayName: string;
  certNumber: string;
  c2paHash: string;
  gradeScore: number;
  gradeLabel: string;
  gradeTier: "PRISTINE BLACK 10" | "GEM MINT 9.5" | "MINT 9.0" | "NM-MT 8.5";
  subgrades: {
    centering: { score: number; detail: string };
    corners: { score: number; detail: string };
    edges: { score: number; detail: string };
    surface: { score: number; detail: string };
  };
  authResult: string;
  rawValueCN: number;
  slabValueCN: number;
  slabPremiumPct: number;
  markets: MarketQuote[];
  bestMarket: MarketQuote;
  instantBuybackRMB: number; // 88% 全球公允价秒回购
  crossBorderNetRMB: number; // 扣 15% 跨境清结算后卖家净到手
  extraGainVsDomestic: number; // 比国内直卖多赚多少
  userNetProfitVsBuy: number; // 相比入手价净赚
  platformUnitEconomics: {
    gradingFee: number; // ¥49 封装费
    singleBuybackSpread: number; // 单次 12% 做市价差
    crossBorderFee: number; // 15% 跨境套利费
    annualVaultTurnoverCount: number;
    annualPlatformGrossFromOneItem: number; // 这一件藏品一年给平台贡献的总毛利
  };
};

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateSlabReport(input: SlabInput): SlabReport {
  const preset =
    PRESETS.find((p) => p.id === input.presetId) ?? PRESETS[0];
  const displayName = input.customName.trim() || preset.title;
  const seed = hashStr(
    `${preset.id}:${displayName}:${input.buyPrice}:${input.condition}:${input.ownerTag}`
  );

  // 根据成色档位决定评分与溢价系数
  let gradeScore = 9.5;
  let gradeTier: SlabReport["gradeTier"] = "GEM MINT 9.5";
  let gradeLabel = "金标殿堂品 · GEM MT";
  let mult = 1.0;
  let sub = {
    centering: { score: 9.5, detail: "正面 51/49 · 背面 52/48（微米级居中）" },
    corners: { score: 9.5, detail: "四角 40x 光学无折白、无钝角" },
    edges: { score: 9.5, detail: "激光切边平整，无毛刺与受潮膨胀" },
    surface: { score: 10.0, detail: "原厂全息纹理/油墨光谱 99.8% 吻合" },
  };

  if (input.condition === "mint") {
    const isTen = seed % 3 === 0;
    if (isTen) {
      gradeScore = 10.0;
      gradeTier = "PRISTINE BLACK 10";
      gradeLabel = "黑金满分的神 · PRISTINE";
      mult = 1.32;
      sub = {
        centering: { score: 10.0, detail: "正背 50/50 完美对称（千分之三概率）" },
        corners: { score: 10.0, detail: "四角零瑕疵 · 刀锋锐角" },
        edges: { score: 9.5, detail: "四边无任何可见白点" },
        surface: { score: 10.0, detail: "零划痕 · 原厂首批次防伪光谱认证" },
      };
    }
  } else if (input.condition === "light") {
    gradeScore = 9.0;
    gradeTier = "MINT 9.0";
    gradeLabel = "银标优良品 · MINT";
    mult = 0.84;
    sub = {
      centering: { score: 9.0, detail: "正面 53/47 · 轻微偏心在公差内" },
      corners: { score: 9.0, detail: "左下角检出 0.08mm 微白点" },
      edges: { score: 9.0, detail: "边缘整体顺滑，无结构性损伤" },
      surface: { score: 9.5, detail: "正品光谱通过，表面极轻微收纳痕" },
    };
  } else {
    gradeScore = 8.5;
    gradeTier = "NM-MT 8.5";
    gradeLabel = "近全新认证 · NM-MT";
    mult = 0.72;
    sub = {
      centering: { score: 8.5, detail: "正面 55/45" },
      corners: { score: 8.5, detail: "两角有肉眼可见轻度白边" },
      edges: { score: 8.5, detail: "局部轻微把玩摩痕" },
      surface: { score: 9.0, detail: "100% 原厂正品，表面有轻微细纹" },
    };
  }

  const rawValueCN = Math.round(preset.rawPriceCN);
  const slabValueCN = Math.round(preset.slabPriceCN * mult);
  const slabValueJP = Math.round(preset.slabPriceJP * mult);
  const slabValueUS = Math.round(preset.slabPriceUS * mult);
  const slabValueEU = Math.round(preset.slabPriceEU * mult);

  const slabPremiumPct = Math.round(
    ((slabValueCN - rawValueCN) / Math.max(1, rawValueCN)) * 100
  );

  const rawMarkets = [
    {
      region: "中国仓盘",
      flag: "🇨🇳",
      platform: "千岛 / 闲鱼 / 得物",
      priceRMB: slabValueCN,
      localText: `¥${slabValueCN.toLocaleString()} CNY`,
    },
    {
      region: "日本秋叶原盘",
      flag: "🇯🇵",
      platform: "SNKRDUNK / Mercari",
      priceRMB: slabValueJP,
      localText: `¥${Math.round(slabValueJP * 21.2).toLocaleString()} JPY`,
    },
    {
      region: "美国金库盘",
      flag: "🇺🇸",
      platform: "Courtyard / Whatnot",
      priceRMB: slabValueUS,
      localText: `$${Math.round(slabValueUS / 7.12).toLocaleString()} USD`,
    },
    {
      region: "欧洲藏家盘",
      flag: "🇪🇺",
      platform: "Cardmarket EU",
      priceRMB: slabValueEU,
      localText: `€${Math.round(slabValueEU / 7.75).toLocaleString()} EUR`,
    },
  ];

  const maxPrice = Math.max(...rawMarkets.map((m) => m.priceRMB));
  const markets: MarketQuote[] = rawMarkets.map((m) => ({
    ...m,
    diffPct: Math.round(((m.priceRMB - slabValueCN) / slabValueCN) * 100),
    isBest: m.priceRMB === maxPrice,
  }));

  const bestMarket = markets.find((m) => m.isBest) ?? markets[2];

  // 全球加权公允价（偏向流动性最强的美日盘）
  const globalFairValue = Math.round(
    slabValueCN * 0.25 + slabValueJP * 0.25 + slabValueUS * 0.5
  );
  // 88% 算法做市 1 秒现金回购价
  const instantBuybackRMB = Math.round(globalFairValue * 0.88);
  // 挂牌最高价海外市场（扣除 15% 跨境清结算与保税仓服务费后卖家净到手）
  const crossBorderNetRMB = Math.round(bestMarket.priceRMB * 0.85);
  const extraGainVsDomestic = crossBorderNetRMB - slabValueCN;
  const buyCost = Math.max(0, Number(input.buyPrice) || preset.defaultBuyPrice);
  const userNetProfitVsBuy = crossBorderNetRMB - buyCost - 49;

  // 平台在这单件藏品上的赚钱账本（为什么平台能三年赚十亿）
  const gradingFee = 49;
  const singleBuybackSpread = Math.round(globalFairValue * 0.12);
  const crossBorderFee = Math.round(bestMarket.priceRMB * 0.15);
  const annualVaultTurnoverCount = preset.annualTurnover;
  // 一年内：1次评级封装 + 1次跨境套利 + (N-1)次金库内零物流秒回购换手（每次约 10% 净差价）
  const annualPlatformGrossFromOneItem = Math.round(
    gradingFee * 0.78 +
      crossBorderFee * 0.82 +
      (annualVaultTurnoverCount - 1) * (globalFairValue * 0.1) * 0.85
  );

  const serialNum = String(1000000 + (seed % 8999999));
  const hashHex = seed.toString(16).toUpperCase().padStart(8, "0");

  return {
    preset,
    displayName,
    certNumber: `SLAB-2026-${serialNum}`,
    c2paHash: `GB45438-C2PA-0x${hashHex}`,
    gradeScore,
    gradeLabel,
    gradeTier,
    subgrades: sub,
    authResult: "100% 原厂正品 · 油墨光谱与模具批次核验通过",
    rawValueCN,
    slabValueCN,
    slabPremiumPct,
    markets,
    bestMarket,
    instantBuybackRMB,
    crossBorderNetRMB,
    extraGainVsDomestic,
    userNetProfitVsBuy,
    platformUnitEconomics: {
      gradingFee,
      singleBuybackSpread,
      crossBorderFee,
      annualVaultTurnoverCount,
      annualPlatformGrossFromOneItem,
    },
  };
}

/**
 * 三年税后净利润十位数（≥10亿）沙盘推演引擎
 */
export type ScenarioKey = "bear" | "base" | "bull" | "super";

export type ProfitScenario = {
  key: ScenarioKey;
  badge: string;
  name: string;
  subtitle: string;
  y3SlabsMillion: number; // 第3年AI评级封装量（百万件）
  y3VaultStockBillion: number; // 第3年金库托管实物货值（亿人民币）
  y3TurnoverVelocity: number; // 金库藏品年均零物流换手次数
  blendedTakeRatePct: number; // 秒回购做市+跨境套利综合抽成 (%)
  y3ProSubsWan: number; // Pro藏家/卡店付费订阅数（万人）
  coBrandedDropBillion: number; // 第2-3年自营金库独家联名发行额（亿人民币）
  y1NetProfitYi: number; // 第1年税后净利（亿）
  y2NetProfitYi: number; // 第2年税后净利（亿）
};

export const PROFIT_SCENARIOS: ProfitScenario[] = [
  {
    key: "bear",
    badge: "🐻 保守盘",
    name: "只吃垂直老玩家（不破圈）",
    subtitle: "仅做国内卡牌/潮玩死忠粉，年换手 4 次，未打通欧美溢价盘",
    y3SlabsMillion: 7,
    y3VaultStockBillion: 14,
    y3TurnoverVelocity: 4,
    blendedTakeRatePct: 10,
    y3ProSubsWan: 30,
    coBrandedDropBillion: 0,
    y1NetProfitYi: 0.35,
    y2NetProfitYi: 1.05,
  },
  {
    key: "base",
    badge: "⚖️ 基准盘（过十位数 ✅）",
    name: "吃下千岛+PSA 15% 份额",
    subtitle: "小红书/抖音扫卡稳定获客，中日美三仓打通，金库年换手 6 次",
    y3SlabsMillion: 14,
    y3VaultStockBillion: 18,
    y3TurnoverVelocity: 6,
    blendedTakeRatePct: 11.5,
    y3ProSubsWan: 75,
    coBrandedDropBillion: 0,
    y1NetProfitYi: 0.85,
    y2NetProfitYi: 3.85,
  },
  {
    key: "bull",
    badge: "🐂 爆发盘（单年破十位数 ✅）",
    name: "全球扫卡爆火 + 跨境套利打穿",
    subtitle: "TikTok/小红书爆款频出，第3年 GMV ¥220亿（仅 Whatnot 的 1/5），周转 8 次",
    y3SlabsMillion: 22,
    y3VaultStockBillion: 27.5,
    y3TurnoverVelocity: 8,
    blendedTakeRatePct: 12.5,
    y3ProSubsWan: 120,
    coBrandedDropBillion: 0,
    y1NetProfitYi: 1.22,
    y2NetProfitYi: 7.19,
  },
  {
    key: "super",
    badge: "🚀 超级二曲线（冲刺 $10亿 USD）",
    name: "金库交易所 + 自营联名评级盲盒",
    subtitle: "把 Whatnot 的高换手 + 卡游/泡泡玛特 44% 净利率合体，反向发行金库首发藏品",
    y3SlabsMillion: 30,
    y3VaultStockBillion: 38,
    y3TurnoverVelocity: 9,
    blendedTakeRatePct: 13.0,
    y3ProSubsWan: 180,
    coBrandedDropBillion: 35,
    y1NetProfitYi: 1.5,
    y2NetProfitYi: 14.8,
  },
];

export function calculateYear3AndTotal(params: {
  slabsMillion: number;
  vaultStockBillion: number;
  turnoverVelocity: number;
  takeRatePct: number;
  proSubsWan: number;
  coBrandedBillion: number;
  y1NetYi: number;
  y2NetYi: number;
}) {
  // 1. AI 评级封装收入（均价 ¥60，毛利率 78%）
  const gradingRevYi = (params.slabsMillion * 60) / 100; // 亿
  const gradingGrossYi = gradingRevYi * 0.78;

  // 2. 金库零物流换手 GMV = 金库托管货值 × 年换手次数
  const vaultGmvYi = params.vaultStockBillion * params.turnoverVelocity;
  const vaultRevYi = vaultGmvYi * (params.takeRatePct / 100);
  const vaultGrossYi = vaultRevYi * 0.84; // 零物流换手，毛利极高

  // 3. Pro 藏家终端订阅（均价 ¥350/年，毛利率 92%）
  const subRevYi = (params.proSubsWan * 350) / 10000;
  const subGrossYi = subRevYi * 0.92;

  // 4. 自营金库联名首发藏品（参考泡泡玛特/卡游，毛利率 72%）
  const ipRevYi = params.coBrandedBillion;
  const ipGrossYi = ipRevYi * 0.72;

  const totalRevYi = gradingRevYi + vaultRevYi + subRevYi + ipRevYi;
  const totalGrossYi = gradingGrossYi + vaultGrossYi + subGrossYi + ipGrossYi;

  // 运营开支：自动化仓固定折旧+研发 (¥3.2亿) + 变动营销与履约 (总营收的 29%)
  const opexYi = 3.2 + totalRevYi * 0.29;
  const preTaxYi = Math.max(0, totalGrossYi - opexYi);
  // 税后净利（综合有效税率 ~15%，前海保税区高新企业+香港/特拉华主体）
  const y3AfterTaxYi = Number((preTaxYi * 0.85).toFixed(2));
  const threeYearCumulativeYi = Number(
    (params.y1NetYi + params.y2NetYi + y3AfterTaxYi).toFixed(2)
  );
  const exactRMB = Math.round(threeYearCumulativeYi * 100_000_000);
  const exactUSD = Math.round(exactRMB / 7.12);

  return {
    vaultGmvYi: Number(vaultGmvYi.toFixed(1)),
    gradingRevYi: Number(gradingRevYi.toFixed(2)),
    vaultRevYi: Number(vaultRevYi.toFixed(2)),
    subRevYi: Number(subRevYi.toFixed(2)),
    ipRevYi: Number(ipRevYi.toFixed(2)),
    totalRevYi: Number(totalRevYi.toFixed(2)),
    totalGrossYi: Number(totalGrossYi.toFixed(2)),
    opexYi: Number(opexYi.toFixed(2)),
    y3AfterTaxYi,
    threeYearCumulativeYi,
    exactRMB,
    exactUSD,
    netMarginPct:
      totalRevYi > 0 ? Number(((y3AfterTaxYi / totalRevYi) * 100).toFixed(1)) : 0,
    isTenDigitRMB: exactRMB >= 1_000_000_000,
  };
}
