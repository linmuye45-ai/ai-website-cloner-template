/**
 * 到岸表生成器 · 演示版计算引擎
 * 纯前端、确定性生成:同一个输入永远得到同一张表。
 * 数据为模拟,但计算规则(到岸成本 = 报价 × (1+税率) + 运保杂)是真实公式。
 */

export type FactoryRow = {
  name: string;
  meta: string;
  fob: number;
  moq: number;
  lead: number;
  dutyParts: string;
  dutyPct: number;
  freight: number;
  landed: number;
  compliance: string;
  complianceTone: "ok" | "warn";
  track: string;
  trackTone: "ok" | "fresh" | "warn";
  best?: boolean;
};

export type Sheet = {
  category: string;
  hts: string;
  quantity: number;
  destination: string;
  rows: FactoryRow[];
  bestIndex: number;
  currentCost: number;
  currentIsEstimated: boolean;
  savingsPct: number;
  savingsTotal: number;
  feePct: number;
};

/* ── 确定性随机 ── */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── 品类库:关键词 → 海关身份证号(HTS)与规则 ── */

type Category = {
  key: string;
  name: string;
  hts: string;
  mfn: number; // 基础税率
  sec301: number; // 对华加征(2026 年仍在)
  baseFob: number;
  compliance: string;
};

const CATEGORIES: (Category & { kw: string[] })[] = [
  {
    key: "petbowl",
    name: "不锈钢宠物碗",
    hts: "7323.93.00",
    mfn: 2.0,
    sec301: 25,
    baseFob: 2.85,
    compliance: "FDA 食品接触检测 · Prop 65 警示语",
    kw: ["宠物", "pet", "碗", "bowl", "喂食", "食盆"],
  },
  {
    key: "placemat",
    name: "硅胶婴儿餐垫",
    hts: "3924.10.40",
    mfn: 3.4,
    sec301: 7.5,
    baseFob: 1.2,
    compliance: "CPSC · CPSIA 铅/邻苯二甲酸酯 · FDA 食品接触",
    kw: ["婴儿", "baby", "餐垫", "placemat", "硅胶", "儿童", "kids", "婴童"],
  },
  {
    key: "speaker",
    name: "蓝牙音箱",
    hts: "8518.22.00",
    mfn: 4.9,
    sec301: 25,
    baseFob: 8.5,
    compliance: "FCC Part 15 认证 · UL 62368(建议)",
    kw: ["蓝牙", "音箱", "speaker", "bluetooth", "音响", "耳机", "earphone", "headphone"],
  },
  {
    key: "tshirt",
    name: "棉质 T 恤",
    hts: "6109.10.00",
    mfn: 16.5,
    sec301: 7.5,
    baseFob: 3.2,
    compliance: "FTC 纤维成分标签 · 原产地标记 · 纺织标签",
    kw: ["t恤", "t-shirt", "tshirt", "shirt", "衣服", "服装", "卫衣", "hoodie", "服饰"],
  },
  {
    key: "mug",
    name: "陶瓷马克杯",
    hts: "6912.00.48",
    mfn: 9.8,
    sec301: 25,
    baseFob: 1.85,
    compliance: "FDA 食品接触 · 铅镉溶出检测 · Prop 65",
    kw: ["马克杯", "mug", "陶瓷", "ceramic", "杯子", "咖啡杯"],
  },
  {
    key: "lamp",
    name: "LED 台灯",
    hts: "9405.42.00",
    mfn: 3.9,
    sec301: 25,
    baseFob: 6.4,
    compliance: "FCC · UL 认证 · 部分州能效标签",
    kw: ["灯", "lamp", "led", "照明", "台灯", "light"],
  },
  {
    key: "yogamat",
    name: "瑜伽垫",
    hts: "4016.91.00",
    mfn: 3.0,
    sec301: 25,
    baseFob: 4.2,
    compliance: "Prop 65 · 邻苯二甲酸酯检测",
    kw: ["瑜伽", "yoga", "垫", "mat", "健身", "运动"],
  },
  {
    key: "phonecase",
    name: "手机壳",
    hts: "3926.90.99",
    mfn: 5.3,
    sec301: 25,
    baseFob: 0.95,
    compliance: "Prop 65(视材质)· 无特殊认证",
    kw: ["手机壳", "phone case", "保护壳", "手机套"],
  },
];

const GENERIC: Category = {
  key: "generic",
  name: "未分类商品",
  hts: "待人工归类",
  mfn: 0,
  sec301: 0,
  baseFob: 5.0,
  compliance: "需人工归类后确认合规要求",
};

function matchCategory(desc: string): Category {
  const d = desc.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.kw.some((k) => d.includes(k.toLowerCase()))) return c;
  }
  return GENERIC;
}

/* ── 工厂名库 ── */

const CN_NAMES = [
  "宁波恒星金属制品", "东莞骏丰餐厨", "深圳启航电子", "泉州织语服饰",
  "青岛海岳家居", "义乌美加日用品", "佛山铂锐家电", "苏州明卓硅胶",
  "中山光语照明", "东莞富琪运动用品", "汕头嘉禾玩具", "杭州星野日用品",
];
const VN_NAMES = [
  "Sông Hồng Manufacturing · 海防", "Tân Phát Plastics · 胡志明",
  "VinaHome Housewares · 河内", "Minh Khai Textiles · 海防",
];
const IN_NAMES = [
  "Inox Home · 浦那", "Anand Textiles · 清奈",
  "Bharat Plastics · 新德里", "Kaveri Metals · 钦奈",
];

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/* ── 生成器 ── */

export function generateSheet(input: {
  description: string;
  quantity: number;
  destination: string;
  currentCost?: number;
}): Sheet {
  const desc = input.description.trim() || "普通商品";
  const qty = Math.max(100, Math.min(1000000, Math.floor(input.quantity) || 3000));
  const seed = hashStr(`${desc}|${qty}|${input.destination}`);
  const rng = mulberry32(seed);
  const cat = matchCategory(desc);

  // 5 家:3 中国 + 1 越南 + 1 印度;其中 1 家中国可能是「贸易商」(约一半概率)
  const usedCN = new Set<string>();
  const rows: FactoryRow[] = [];
  const tradingIdx = rng() > 0.5 ? 2 : -1;

  for (let i = 0; i < 5; i++) {
    const isCN = i < 3;
    const country = isCN ? "中国" : i === 3 ? "越南" : "印度";
    let name: string;
    if (isCN) {
      do { name = pick(CN_NAMES, rng); } while (usedCN.has(name) && usedCN.size < CN_NAMES.length);
      usedCN.add(name);
    } else if (i === 3) {
      name = pick(VN_NAMES, rng);
    } else {
      name = pick(IN_NAMES, rng);
    }

    const isTrading = i === tradingIdx;
    const fob = round2(cat.baseFob * (0.88 + rng() * 0.26) * (isTrading ? 0.92 : 1));
    const moq = pick([500, 1000, 1500, 2000, 3000, 5000], rng);
    const lead = 24 + Math.floor(rng() * 17);
    const dutyPct = round2(cat.mfn + (isCN ? cat.sec301 : 0) + 15); // MFN + 301 + §122
    const dutyParts = `${cat.mfn}% + ${isCN ? cat.sec301 : 0}% + 15%`;
    const freightBase = isCN ? 0.32 : i === 3 ? 0.28 : 0.36;
    const freight = round2((freightBase + rng() * 0.12) * (1 + cat.baseFob / 12));
    const landed = round2(fob * (1 + dutyPct / 100) + freight);

    let compliance = cat.compliance;
    let complianceTone: FactoryRow["complianceTone"] = "ok";
    let track: string;
    let trackTone: FactoryRow["trackTone"] = "ok";

    if (isTrading) {
      compliance = "未提供检测报告 ⚠";
      complianceTone = "warn";
      track = "不透明 ⚠ 港杂另计";
      trackTone = "warn";
    } else if (rng() > 0.55) {
      track = `准时 ${91 + Math.floor(rng() * 8)}% · 不良 ${(0.8 + rng() * 1.8).toFixed(1)}%`;
    } else {
      track = "首单 · 无记录(诚实标注)";
      trackTone = "fresh";
    }

    rows.push({
      name,
      meta: `${country} · ${isTrading ? "贸易商" : "工厂"} · 自证:${isTrading ? "未提供 ⚠" : "营业执照 + 验厂报告"}`,
      fob, moq, lead, dutyParts, dutyPct, freight, landed,
      compliance, complianceTone, track, trackTone,
    });
  }

  // 最优 = 合规无警示里到手价最低
  let bestIndex = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].complianceTone === "warn") continue;
    if (rows[bestIndex].complianceTone === "warn" || rows[i].landed < rows[bestIndex].landed) bestIndex = i;
  }
  rows[bestIndex].best = true;

  const best = rows[bestIndex].landed;
  const estimated = input.currentCost === undefined || Number.isNaN(input.currentCost) || input.currentCost <= 0;
  const currentCost = estimated ? round2(best * (1.28 + rng() * 0.17)) : round2(input.currentCost!);
  const savingsPct = Math.max(0, Math.round(((currentCost - best) / currentCost) * 100));
  const savingsTotal = Math.max(0, Math.round((currentCost - best) * qty));

  return {
    category: cat.name,
    hts: cat.hts,
    quantity: qty,
    destination: input.destination,
    rows,
    bestIndex,
    currentCost,
    currentIsEstimated: estimated,
    savingsPct,
    savingsTotal,
    feePct: 6,
  };
}

export const GEN_STEPS = [
  "读懂你的一句话",
  "确定海关身份证号(HTS 归类)",
  "核对 2026 年全部税费(基础税 + 301 + 122)",
  "向中国 / 越南 / 印度的工厂同时询价",
  "核验工厂身份与合规记录",
  "算清到手成本,挑出最划算的一家",
];
