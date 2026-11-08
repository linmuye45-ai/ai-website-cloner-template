/**
 * 毛孩日报 PetDaily · 演示版生成引擎
 * 纯前端、确定性生成:同一个输入永远得到同一张报。
 * 语气:懂宠物、不装神医——「健康观察」只谈就医时机,不谈诊断。
 */

export type PetInput = {
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: string;
  diet: number; // 0 吃得少 1 正常 2 吃得多
  water: number; // 0 喝得少 1 正常 2 喝得多
  activity: number; // 0 不爱动 1 正常 2 疯玩
  spirit: number; // 0 蔫蔫 1 正常 2 超兴奋
  note: string;
};

export type HealthCell = {
  label: string;
  level: number; // 1 留意 2 正常 3 活跃
  note: string;
};

export type DailyPaper = {
  date: string;
  issue: number;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: string;
  moodEmoji: string;
  moodWord: string;
  headline: string;
  story: string[];
  health: HealthCell[];
  funFact: string;
  tomorrow: string;
  cuteScore: number;
  bondScore: number;
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

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/* ── 心情与标题库 ── */

const MOODS = {
  dog: [
    {
      word: "阳光开朗",
      emoji: "☀️",
      heads: [
        "今日营业状态满分,尾巴摇成螺旋桨",
        "好消息:它今天觉得全世界都爱它",
        "阳光小狗出街,回头率 200%",
      ],
    },
    {
      word: "小委屈",
      emoji: "🥺",
      heads: [
        "疑似有人忘了开罐头,已记入《委屈日记》",
        "今日份的叹气,比平时多了三成",
        "它用眼神说:你是不是有别的狗了",
      ],
    },
    {
      word: "兴奋过头",
      emoji: "🚀",
      heads: [
        "能量条溢出,建议今晚加一次散步",
        "门口有风吹草动,它已出动三次",
        "今日运动量预警:沙发可能遭殃",
      ],
    },
    {
      word: "慵懒大王",
      emoji: "😴",
      heads: [
        "能躺着绝不坐着,今日节能模式全开",
        "散步邀请被婉拒,它选择了地板",
        "它今天的主要工作:把窝睡出新高度",
      ],
    },
    {
      word: "粘人精",
      emoji: "🩷",
      heads: [
        "你走到哪它跟到哪,包括卫生间",
        "今日贴贴时长已超出日常配额",
        "它把下巴搁在你脚上的次数:数不清",
      ],
    },
    {
      word: "忠诚警卫",
      emoji: "🛡️",
      heads: [
        "楼道里的脚步声,已全部核实完毕",
        "今日安保工作汇报:一切正常,除了快递员",
        "它盯着窗外的样子,像个尽责的小保安",
      ],
    },
  ],
  cat: [
    {
      word: "傲娇",
      emoji: "👑",
      heads: [
        "它今天允许你摸三秒,第四秒翻脸",
        "高冷是它的保护色,蹭你是它的真心",
        "它看你的眼神,像在看一个不错的仆人",
      ],
    },
    {
      word: "薛定谔的乖",
      emoji: "🐾",
      heads: [
        "此刻安静如鸡,五分钟后可能飞檐走壁",
        "乖与不乖,取决于你有没有在看",
        "它在窗台思考猫生,暂时没拆家",
      ],
    },
    {
      word: "巡视领地",
      emoji: "🏰",
      heads: [
        "全屋巡逻完成,一切资产完好,除了纸巾",
        "它今天把每个房间都签了名(蹭的)",
        "领地安全报告:沙发角有可疑气味,已覆盖",
      ],
    },
    {
      word: "嗜睡大橘",
      emoji: "🍊",
      heads: [
        "今日睡眠 16 小时,创本周新高",
        "饭后秒睡,是它坚持多年的生活美学",
        "它用行动证明:猫是液体,床是容器",
      ],
    },
    {
      word: "话痨",
      emoji: "🗣️",
      heads: [
        "今日喵语输出量是平时的两倍",
        "它对着空碗叫了三分钟,很有道理",
        "它有话要说,大概率是:开饭",
      ],
    },
    {
      word: "高冷观察员",
      emoji: "🧐",
      heads: [
        "它在高处俯瞰你,像在做田野调查",
        "它今天盯着你看了很久,若有所思",
        "猫在观察人类行为,论文进度:0 字",
      ],
    },
  ],
} as const;

/* ── 品种冷知识 ── */

const FUN_FACTS: Record<string, string[]> = {
  柴犬: ["柴犬的「微笑」其实是放松的表情,说明它今天很有安全感。", "柴犬祖先是日本山地猎犬,散步时爱走「之」字形侦察路线。"],
  金毛: ["金毛的嘴巴可以叼一颗生鸡蛋而不碎——它们天性知道「轻轻的」。", "金毛游泳时脚趾间有蹼状皮肤,是天生的水中健将。"],
  柯基: ["柯基的小短腿是牧牛犬的标配:牛踢它时,它能低头躲过。", "柯基屁股上有个「口袋」(腰窝),传说是精灵骑它时踩的脚踏。"],
  拉布拉多: ["拉布拉多的「水獭尾」在水里是方向盘,天生会救生。", "拉布拉多是全球最常见的导盲犬,耐心是写在基因里的。"],
  泰迪: ["贵宾犬(泰迪)的智商在犬类排第二,仅次于边牧。", "「泰迪装」只是一种造型,贵宾犬本尊其实是水猎犬。"],
  边境牧羊犬: ["边牧能记住 1,000+ 个玩具名字,是犬类智商第一名。", "边牧放羊时会「盯」(the eye),用眼神控制羊群。"],
  哈士奇: ["哈士奇的毛有两层,能扛住零下 40 度——所以它那么爱拆家是因为热的(并不)。", "哈士奇祖先是西伯利亚雪橇犬,一天能跑 100 公里。"],
  法国斗牛犬: ["法斗不会游泳,夏天出门要特别注意防暑。", "法斗的「蝙蝠耳」是它的招牌,出生时其实是软塌塌的。"],
  比熊: ["比熊的毛不怎么掉,但需要定期修剪——它是一只需要「理发卡」的狗。", "比熊曾是欧洲贵族的掌上明珠,自带气质。"],
  中华田园犬: ["中华田园犬的基因多样性全球领先,身体素质普遍杠杠的。", "田园犬的忠诚度是刻在文化里的:从古画到古诗,都有它的影子。"],
  英短: ["英国短毛猫的「蓝灰色」其实是毛尖泛灰的黑色素。", "英短圆脸大眼的样子,一百多年基本没变过。"],
  美短: ["美短的「虎斑纹」是天然迷彩,祖先是船上的捕鼠猫。", "美短以脾气好著称,是美国最受欢迎的猫之一。"],
  布偶: ["布偶猫被抱起来会像布偶一样放松,名字就是这么来的。", "布偶猫发育慢,要到 3-4 岁才完全长成。"],
  橘猫: ["橘猫里公猫多(约 80%),所以「十橘九胖」有遗传学基础。", "橘猫的「M」形额头花纹,所有虎斑猫都有。"],
  狸花猫: ["狸花猫是中国本土自然品种,捕鼠能力是祖传的。", "狸花猫的花纹是天然迷彩,身体素质在猫界名列前茅。"],
  暹罗: ["暹罗猫的重点色是「温度计」:越冷的地方毛色越深。", "暹罗猫以话多著称,是猫界著名「话痨」。"],
  缅因: ["缅因猫是最大的家猫品种之一,能长到 10 公斤以上。", "缅因猫的「围脖」毛领,冬天自带围巾。"],
};

const SPECIES_FACTS = {
  dog: ["狗的鼻子有 3 亿个嗅觉受器,是人类的 60 倍——今天它闻到的世界比你精彩。", "狗能听懂 150+ 个词和手势,平均智商相当于 2 岁小孩。"],
  cat: ["猫每天睡 12-16 小时,睡觉是猫的正经事。", "猫的呼噜声(25-150 赫兹)被研究认为有助骨骼愈合——它在自我保养。"],
};

/* ── 小报正文素材 ── */

function buildStory(p: PetInput, mood: string, rng: () => number): string[] {
  const s = p.species === "dog" ? "狗子" : "主子";
  const activityLine =
    p.activity === 2
      ? `今天的运动量给它安排得明明白白——${s}回家倒头就睡,睡姿逐渐放飞。`
      : p.activity === 0
        ? `今天不太爱动,可能是天气、可能是心情,也可能只是单纯的懒。${s}的世界你别猜。`
        : `活动量刚刚好:不多不少,正好够它在梦里继续追蝴蝶。`;

  const dietLine =
    p.diet === 0
      ? "食欲比平时弱一点,建议观察明天的状态;如果连续两顿不吃饭,就别再等了。"
      : p.diet === 2
        ? "胃口好得像三天没吃饭(它明明吃了),注意别被它骗出第二顿加餐。"
        : "吃饭节奏稳定,肠胃今天也很给面子。";

  const noteLine = p.note.trim()
    ? `你特别备注了一句:「${p.note.trim()}」——已收录进它的《今日档案》,这类小事它都记着。`
    : "你今天没特别备注,它表示:没什么大事,就是想你了。";

  return [
    `【今日综述】${p.name}(品种:${p.breed})今日情绪定调为「${mood}」。综合进食、饮水、活动与精神状态,它度过了${p.activity >= 2 ? "热闹" : p.activity === 0 ? "悠闲" : "平稳"}的一天。`,
    `【现场报道】${activityLine}${dietLine}`,
    `【编辑部手记】${noteLine} ${s}的世界很简单:你在,它就安心。`,
  ];
}

function buildHealth(p: PetInput): HealthCell[] {
  return [
    {
      label: "食欲",
      level: p.diet === 0 ? 1 : p.diet === 2 ? 3 : 2,
      note: p.diet === 0 ? "比平时弱,持续请就医" : p.diet === 2 ? "胃口超常,注意别过量" : "稳定",
    },
    {
      label: "饮水",
      level: p.water === 0 ? 1 : p.water === 2 ? 3 : 2,
      note: p.water === 0 ? "饮水偏少,天热/换粮都会影响" : p.water === 2 ? "饮水偏多,留意是否持续" : "正常",
    },
    {
      label: "活动量",
      level: p.activity === 0 ? 1 : p.activity === 2 ? 3 : 2,
      note: p.activity === 0 ? "不爱动,结合精神看" : p.activity === 2 ? "精力充沛,晚上会睡很香" : "正常",
    },
    {
      label: "精神",
      level: p.spirit === 0 ? 1 : p.spirit === 2 ? 3 : 2,
      note: p.spirit === 0 ? "有点蔫,值得多看两眼" : p.spirit === 2 ? "情绪高昂,社牛状态" : "正常",
    },
  ];
}

/* ── 生成入口 ── */

export function generatePaper(p: PetInput): DailyPaper {
  const seed = hashStr(
    `${p.name}|${p.species}|${p.breed}|${p.age}|${p.diet}${p.water}${p.activity}${p.spirit}|${p.note}`,
  );
  const rng = mulberry32(seed);

  // 心情倾向:精神+活动主导
  let moodIdx: number;
  if (p.spirit === 2 && p.activity === 2) moodIdx = 2;
  else if (p.spirit === 0) moodIdx = 1;
  else if (p.activity === 0) moodIdx = 3;
  else if (p.spirit === 2) moodIdx = 4;
  else moodIdx = Math.floor(rng() * MOODS[p.species].length);
  const mood = MOODS[p.species][moodIdx % MOODS[p.species].length];

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return {
    date: dateStr,
    issue: 100 + (seed % 900),
    name: p.name || "毛孩",
    species: p.species,
    breed: p.breed,
    age: p.age,
    moodEmoji: mood.emoji,
    moodWord: mood.word,
    headline: pick(mood.heads as unknown as string[], rng),
    story: buildStory(p, mood.word, rng),
    health: buildHealth(p),
    funFact: pick(FUN_FACTS[p.breed] ?? SPECIES_FACTS[p.species], rng),
    tomorrow:
      p.activity === 0
        ? "明天建议:来一场它拒绝不了的散步/逗猫棒,情绪是动出来的。"
        : p.diet === 0
          ? "明天建议:换点新鲜口味试试;连续两顿不吃,直接问医生,别拖。"
          : "明天建议:保持今天的节奏,再来一张日报,攒满一周就能看出它的规律。",
    cuteScore: 85 + (seed % 15),
    bondScore: 70 + ((seed >> 3) % 26),
  };
}

/* ── 症状自查(就医时机建议,不是诊断) ── */

export type Symptom = {
  id: string;
  label: string;
  tier: 1 | 2 | 3; // 1 观察 2 48h内就医 3 立刻就医
  why: string;
};

export const SYMPTOMS: Symptom[] = [
  { id: "vomit-mild", label: "呕吐 1-2 次,之后精神还好", tier: 1, why: "吃太快、换粮、毛球都常见;先禁食 6-12 小时观察。" },
  { id: "vomit-bad", label: "反复呕吐 / 呕吐物带血", tier: 3, why: "可能是异物、中毒或急腹症,拖不得。" },
  { id: "noeat-dog", label: "超过 24 小时不肯吃饭(狗)", tier: 2, why: "狗连续一天不吃就该查;两天以上危险。" },
  { id: "noeat-cat", label: "超过 24 小时不肯吃饭(猫)", tier: 3, why: "猫拒食超 24 小时可能引发脂肪肝,是急症。" },
  { id: "drink", label: "喝水量突然大增、尿也变多", tier: 2, why: "肾病、糖尿病、内分泌问题的常见早期信号。" },
  { id: "limp", label: "跛行 / 不愿跳 / 起身困难", tier: 2, why: "可能是扭伤,也可能涉及关节或骨骼问题。" },
  { id: "ear", label: "频繁挠耳朵、甩头、有异味", tier: 2, why: "耳螨或耳道感染概率高,越拖越难治。" },
  { id: "cough", label: "咳嗽 / 干呕 / 清嗓子", tier: 2, why: "可能是呼吸道感染(如犬窝咳),需要听诊。" },
  { id: "lethargy", label: "精神萎靡、叫它没反应", tier: 3, why: "精神沉郁是所有急症的共同信号,别观察。" },
  { id: "diarrhea-mild", label: "软便 / 轻度腹泻 1-2 次", tier: 1, why: "换粮、着凉常见;补充水分,观察 24 小时。" },
  { id: "diarrhea-bad", label: "血便 / 水样腹泻 / 幼宠腹泻", tier: 3, why: "细小等传染病风险,幼宠尤其危险。" },
  { id: "breath", label: "呼吸急促 / 张口呼吸(非运动后)", tier: 3, why: "心肺问题的红旗信号,立即就医。" },
  { id: "pee-cat", label: "频繁蹲厕所却尿不出(尤其公猫)", tier: 3, why: "泌尿道阻塞 24 小时内可致命,是最高级别的急症。" },
  { id: "eye", label: "眼屎增多 / 流泪 / 眯眼", tier: 2, why: "结膜炎、角膜损伤或异物,眼科问题别乱用药。" },
];

export type TriageResult = {
  tier: 1 | 2 | 3;
  title: string;
  advice: string;
  picked: Symptom[];
};

export function triage(ids: string[]): TriageResult | null {
  const picked = SYMPTOMS.filter((s) => ids.includes(s.id));
  if (picked.length === 0) return null;
  const tier = Math.min(3, Math.max(...picked.map((s) => s.tier))) as 1 | 2 | 3;
  const titles = {
    1: "🟢 先在家观察 24-48 小时",
    2: "🟡 48 小时内去看医生",
    3: "🔴 立刻就医,不要等",
  };
  const advice = {
    1: "暂时不用慌:记录吃喝拉撒和精神状态,保持饮水,饮食清淡。如果症状加重或超过 48 小时没有好转,升级为「预约就医」。",
    2: "这不是急诊,但别拖:提前和宠物医院约好时间,带上症状记录(什么时候开始、频率、视频最好)。医生看视频比看描述有用得多。",
    3: "现在就出发:路上保持它安静、保暖,不要强行喂食喂水。到医院告诉医生:症状从什么时候开始、有没有接触过异物/毒物/其他动物。",
  };
  return { tier, title: titles[tier], advice: advice[tier], picked };
}
