/**
 * 同框 Reunion · 演示版引擎
 * 「让没能同框的人,第一次合影」——跨时空全家福。
 * 演示版:确定性文案生成 + 相框排版;正式版接入生成式影像模型(带 AI 标识与授权校验)。
 */

export type SceneId = "meet" | "young" | "far" | "family";

export type Scene = {
  id: SceneId;
  title: string;
  tagline: string;
  leftLabel: string;
  rightLabel: string;
};

export const SCENES: Scene[] = [
  {
    id: "meet",
    title: "第一次见面",
    tagline: "让没能见到的亲人,第一次见到孩子",
    leftLabel: "那时的 TA",
    rightLabel: "现在的 TA",
  },
  {
    id: "young",
    title: "年轻的爸妈",
    tagline: "和 20 岁的妈妈/爸爸,拍一张合照",
    leftLabel: "年轻的 TA",
    rightLabel: "现在的你",
  },
  {
    id: "far",
    title: "跨越山海",
    tagline: "隔着大洋、隔着病房、隔着疫情的那张合影",
    leftLabel: "在那边",
    rightLabel: "在这边",
  },
  {
    id: "family",
    title: "时光全家福",
    tagline: "把散落在各年的照片,拼成一张全家福",
    leftLabel: "早年的家人",
    rightLabel: "如今的家人",
  },
];

export type ReunionInput = {
  scene: SceneId;
  leftTitle: string; // 爷爷/外婆/年轻的妈妈…
  rightTitle: string; // 孙女/儿子/我…
  rightName: string;
  leftYear: string;
  rightYear: string;
  note: string;
};

export type ReunionCard = {
  scene: Scene;
  caption: string[];
  stamp: string; // 印章文字
  yearGap: number | null;
  dateStr: string;
  footer: string;
};

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

const CAPTIONS: Record<SceneId, string[][]> = {
  meet: [
    [
      "「{L},这是{R}。」",
      "她叫{RName},出生在{RYear}年。你们没能见面——但今天,你们终于同框了。",
      "血缘是一条看不见的线,照片把它系上了。",
    ],
    [
      "有些见面,迟到了几十年。",
      "{R}今年来到了这个世界,而{L}在{LYear}年就离开了。{RName}会长大,会看到这张照片:原来你一直都在。",
      "这张合影不是拼接,是团圆。",
    ],
  ],
  young: [
    [
      "翻到{L}{LYear}年的老照片时,你愣了很久。",
      "原来{R}也年轻过:眼神亮亮的,像极了现在的{RName}。今天,让你们同龄同框。",
      "你走过的路,TA 早就走过一遍。",
    ],
    [
      "「{RName},来,跟{L}合张影。」",
      "照片里的{L}{LYear}岁,比你现在还小。一晃,TA 把最好的年头都给了这个家。",
      "这张照片补上了一句没说出口的谢谢。",
    ],
  ],
  far: [
    [
      "{L}在电话那头,{R}在这头。相隔{gapText},合照这件事一拖再拖。",
      "今天不等了。把两张照片放进同一个相框——距离再远,也是站在一起。",
      "想家的时候,就看看这张。",
    ],
    [
      "机票太贵,假期太短,团圆太难。",
      "那就先拍一张「假装在一起」的合影:{L}和{RName},{RYear}年,同框留念。",
      "等真的见面那天,再换一张真的。",
    ],
  ],
  family: [
    [
      "这张全家福,晚到了好些年。",
      "把{LYear}年的老照片和{RYear}年的新照片放在一起,一家人就齐了。{RName}在,{L}也在。",
      "家不是一个地址,是所有人的总和。",
    ],
    [
      "有人在照片里,有人在照片外。今天,都在。",
      "{L}与{RName},同框于{RYear}年。看,咱们家的阵容一直很齐整。",
      "这就是全家福该有的样子。",
    ],
  ],
};

const STAMPS: Record<SceneId, string[]> = {
  meet: ["团圆", "初见", "同框"],
  young: ["芳华", "同框", "念"],
  far: ["团圆", "同框", "念"],
  family: ["全家福", "同框", "团圆"],
};

export function generateReunion(input: ReunionInput): ReunionCard {
  const seed = hashStr(
    `${input.scene}|${input.leftTitle}|${input.rightTitle}|${input.rightName}|${input.leftYear}|${input.rightYear}|${input.note}`,
  );
  const rng = mulberry32(seed);
  const scene = SCENES.find((s) => s.id === input.scene)!;

  const ly = parseInt(input.leftYear, 10);
  const ry = parseInt(input.rightYear, 10);
  const yearGap = Number.isFinite(ly) && Number.isFinite(ry) ? Math.abs(ry - ly) : null;

  const vars = (t: string) =>
    t
      .replaceAll("{L}", input.leftTitle || "TA")
      .replaceAll("{R}", input.rightTitle || "家人")
      .replaceAll("{RName}", input.rightName || "家人")
      .replaceAll("{LYear}", input.leftYear || "那年")
      .replaceAll("{RYear}", input.rightYear || "今年")
      .replaceAll("{gapText}", yearGap ? `${yearGap} 公里外的日子` : "那么远的距离");

  const raw = pick(CAPTIONS[input.scene], rng);
  const caption = raw.map(vars);
  if (input.note.trim()) {
    caption.push(`你留了一句话:「${input.note.trim()}」——已刻进这张合影。`);
  }

  const today = new Date();
  return {
    scene,
    caption,
    stamp: pick(STAMPS[input.scene], rng),
    yearGap,
    dateStr: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
    footer: "AI 生成合成内容 · 已按《AI生成合成内容标识办法》标注",
  };
}

/* ── 定价(演示) ── */

export const PRICING = [
  {
    name: "一张",
    price: "¥38",
    unit: "/ 张",
    en: "Single",
    items: ["高清「同框」合影 ×1", "AI 老照片修复 + 上色", "无水印下载 · 可打印", "相当于线下照相馆的 1/15"],
  },
  {
    name: "时光",
    price: "¥168",
    unit: "/ 年",
    en: "Family",
    highlight: true,
    items: [
      "全部场景无限生成",
      "「时光相册」永久家庭档案",
      "纪念日/生日自动提醒补一张",
      "全家共享(5 位成员)",
      "每年一次免费更新全家福",
    ],
  },
  {
    name: "时光相框",
    price: "¥299",
    unit: "/ 件",
    en: "Print",
    items: ["博物馆级艺术微喷", "胡桃木相框 · 直邮到家", "母亲节/清明/圣诞礼赠首选", "线下影楼同款要 ¥599+"],
  },
];
