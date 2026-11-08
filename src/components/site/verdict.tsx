import { Reveal } from "./reveal";
import { SectionHead } from "./sections";

/* ── 诚实的概率 ────────────────────────────────────── */

const ODDS = [
  {
    name: "Landed · 贸易银行",
    role: "主选 · 风投路径",
    y3: "1–2%",
    y10: "~1%",
    note: "千亿镜头下最高的一个。靠四幕转换 + 债务放大。",
  },
  {
    name: "Ember · 星火",
    role: "第二家公司 / 消费心之选",
    y3: "<1%",
    y10: "~2%",
    note: "天花板不低于 Landed、护城河更深,但没有债务放大器。行业流失 7.4%/月是头号死因。",
  },
  {
    name: "Praxis · 训练场",
    role: "嵌入 Landed Gym",
    y3: "2–4%",
    y10: "~1%",
    note: "最快三年向量(实验室年花 >$10 亿买真实环境);二元:代理世界开放则 Google 级,否则归零。",
  },
];

const KILLERS = [
  {
    k: "停在第一幕",
    v: "第 27 月前平台 GMV 必须出现;否则承认是贸易公司",
  },
  { k: "单一走廊", v: "第 15 月起每 12 个月加一条走廊(越南/印度/墨西哥)" },
  { k: "抽成压缩", v: "费用永远透明,用金融/服务收入补货物抽成" },
  {
    k: "欺诈(Stenn / Greensill 死因)",
    v: "每单四眼复核;账面先用合作方资金;坏账 <1% 是硬门槛",
  },
  {
    k: "创始人天花板",
    v: "B 轮前引入信贷/资本市场联合创始人级人物(新增第六条件)",
  },
];

export function Odds() {
  return (
    <section id="odds" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="HONEST ODDS · 诚实的概率"
            title={
              <>
                这不是保证。
                <br />
                这是赔率。
              </>
            }
            sub="所有关于「三年十位数净资产」的承诺都是骗局。我们把概率写在第一页:三次顺序尝试合计 3–5%——这是一个人十年里能为自己买到的最好赔率。"
          />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
          {ODDS.map((o, i) => (
            <Reveal key={o.name} delay={i * 90}>
              <div className="h-full bg-ink-2/80 p-8">
                <div className="label-mono text-gold">{o.role}</div>
                <h3 className="mt-3 text-[19px] font-semibold tracking-tight">
                  {o.name}
                </h3>
                <div className="mt-6 flex gap-10">
                  <div>
                    <div className="label-mono text-muted-ink/60">
                      三年 $10B
                    </div>
                    <div className="mt-1.5 font-mono text-[28px] leading-none text-paper">
                      {o.y3}
                    </div>
                  </div>
                  <div>
                    <div className="label-mono text-muted-ink/60">
                      十年 $100B
                    </div>
                    <div className="mt-1.5 font-mono text-[28px] leading-none text-gold-2">
                      {o.y10}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-[12.5px] leading-[1.9] text-muted-ink">
                  {o.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* cash math */}
        <Reveal delay={120}>
          <div className="mt-8 rounded-2xl border border-sea/25 bg-sea/[0.05] p-8">
            <div className="label-mono text-sea">
              那个数字 · 现金数学
            </div>
            <p className="mt-4 max-w-[80ch] text-[15px] leading-[1.95] text-paper">
              「三年十位数<span className="text-gold-2">现金</span>」在数学上需要 $30B+
              估值或 $5B+ 并购:AI 公司创始团队 C 轮后持股中位数 16%,二级出售通常只让卖持股的
              10–25%——$10B 估值时可变现约 $1.5–5 亿。
              所以目标函数是:<span className="text-gold-2">三年 $10B 估值(账面十位数),十年 $100B(现金十位数)</span>。
              前者是融资与执行问题,后者是十年复利与赛道选择问题。
            </p>
          </div>
        </Reveal>

        {/* ceiling killers */}
        <Reveal delay={180}>
          <div className="mt-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-rose/60" />
              <p className="label-mono text-rose">
                CEILING KILLERS · 天花板杀手
              </p>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              {KILLERS.map((k) => (
                <div
                  key={k.k}
                  className="flex flex-col gap-1.5 border-b border-line bg-ink-2/50 px-7 py-5 last:border-0 hover:bg-panel/50 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <div className="w-[220px] shrink-0 text-[14px] font-medium text-rose/90">
                    {k.k}
                  </div>
                  <div className="text-[13px] leading-[1.8] text-muted-ink">
                    {k.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 三案 ──────────────────────────────────────────── */

type Dim = { label: string; score: number; max: number };

const CANDIDATES: {
  name: string;
  en: string;
  tagline: string;
  total: string;
  verdict: string;
  body: string;
  dims: Dim[];
  gold?: boolean;
}[] = [
  {
    name: "Landed(到岸)",
    en: "THE LANDED SHEET",
    tagline: "站在买方一边、为结果负责的 AI 贸易公司",
    total: "91",
    verdict: "主选 · 千亿镜头下的风投路径",
    body: "第一个月就有现金;四个评分维度无短板;第三幕(贸易银行)是三个方向中唯一能用债务放大的。第五轮把它从「自举贸易公司」升级为「AI 原生贸易银行」——自举只是前 6 个月的种子轮筹码。",
    dims: [
      { label: "市场天花板", score: 28, max: 30 },
      { label: "Demo 速度", score: 17, max: 20 },
      { label: "个人启动", score: 19, max: 20 },
      { label: "竞争壁垒", score: 17, max: 20 },
      { label: "全球扩张", score: 10, max: 10 },
    ],
    gold: true,
  },
  {
    name: "Ember(星火)",
    en: "EMBER",
    tagline: "每个孩子一生中的第一位导师",
    total: "90",
    verdict: "第二家公司 / 创始人心在消费端时的主选",
    body: "语音 + 纸张优先、父母治理、3–18 岁终身学习记录。巨头被法律、诉讼、广告模式同时锁死。头号死因不是安全,是流失:行业 7.4%/月。90 天留存 ≥40% 之前不融资。",
    dims: [
      { label: "市场天花板", score: 28, max: 30 },
      { label: "Demo 速度", score: 17, max: 20 },
      { label: "个人启动", score: 17, max: 20 },
      { label: "竞争壁垒", score: 19, max: 20 },
      { label: "全球扩张", score: 9, max: 10 },
    ],
  },
  {
    name: "Praxis(行索 / Landed Gym)",
    en: "PRAXIS",
    tagline: "「能做什么事」的索引 · 真实世界代理训练场",
    total: "83",
    verdict: "嵌入 Landed 的数据加速器 · 2028 年再看",
    body: "OutcomeRank:可信的委托方把重要的事交给它并且做成了的加权和。第五轮重估:先向实验室卖「结果可验证的真实任务环境」(50+ 供应商合计 $8.5B 收入),作为 Landed Gym 供血;永不碰儿童数据;若代理网络证明开放,再分拆。",
    dims: [
      { label: "市场天花板", score: 27, max: 30 },
      { label: "Demo 速度", score: 17, max: 20 },
      { label: "个人启动", score: 15, max: 20 },
      { label: "竞争壁垒", score: 14, max: 20 },
      { label: "全球扩张", score: 10, max: 10 },
    ],
  },
];

const REJECTED = [
  { k: "成年人生活事务代理", why: "2026 年的热门而非 1998:Instinct 一个月 $2.5B→$10B,Google Ask for Me 全美开放" },
  { k: "记忆穿戴硬件", why: "Meta 收了 Limitless,Amazon 收了 Bee;Ive/OpenAI 设备 2027" },
  { k: "家用机器人技能", why: "人形机器人 2027–28 小批量、2030+ 才有渗透;个人无法启动" },
  { k: "通用 AI 找厂搜索", why: "Accio 已有 1,000 万月活;无结果责任 = 无壁垒" },
  { k: "AI 写作 / 聊天 / 套壳 / 简单自动化", why: "拒绝原则:能被一个提示词复制的东西不是公司" },
];

export function Three() {
  return (
    <section id="three" className="relative border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="THE THREE · 三案一个主选"
            title={
              <>
                三个方向,一个主选,
                <br />
                其余各归其位
              </>
            }
            sub="五轮推演、10 个方案、五维评分(天花板 30 / Demo 20 / 个人启动 20 / 壁垒 20 / 全球 10),低于 90 淘汰。以下是活下来的三个。"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CANDIDATES.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-8 transition-colors ${
                  c.gold
                    ? "border-gold/40 bg-gradient-to-b from-gold/[0.08] to-ink-2/80"
                    : "border-line bg-ink-2/70 hover:border-line-strong"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="label-mono text-muted-ink/70">{c.en}</div>
                    <h3 className="mt-2 text-[20px] font-semibold tracking-tight">
                      {c.name}
                    </h3>
                  </div>
                  <div
                    className={`rounded-xl px-3.5 py-2 text-center ${
                      c.gold ? "bg-gold text-ink" : "bg-panel text-paper"
                    }`}
                  >
                    <div className="font-mono text-[22px] leading-none font-semibold">
                      {c.total}
                    </div>
                    <div className="mt-1 text-[9px] tracking-[0.14em] opacity-80">
                      SCORE
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-2 text-[12.5px] ${c.gold ? "text-gold-2" : "text-sea"}`}
                >
                  {c.verdict}
                </div>
                <p className="mt-1.5 text-[13px] font-medium text-paper">
                  {c.tagline}
                </p>
                <p className="mt-4 text-[12.5px] leading-[1.95] text-muted-ink">
                  {c.body}
                </p>

                <div className="mt-6 space-y-2.5 pt-2">
                  {c.dims.map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <div className="w-[72px] shrink-0 text-[11px] text-muted-ink">
                        {d.label}
                      </div>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full ${
                            c.gold ? "bg-gold" : "bg-sea/80"
                          }`}
                          style={{ width: `${(d.score / d.max) * 100}%` }}
                        />
                      </div>
                      <div className="w-[42px] shrink-0 text-right font-mono text-[11px] text-muted-ink">
                        {d.score}/{d.max}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* rejected */}
        <Reveal delay={160}>
          <div className="mt-16">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-muted-ink/40" />
              <p className="label-mono text-muted-ink">
                REJECTED · 一致否决的方向
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {REJECTED.map((r) => (
                <div
                  key={r.k}
                  className="flex flex-col gap-1 rounded-xl border border-line/70 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <div className="w-[240px] shrink-0 text-[13.5px] text-muted-ink line-through decoration-rose/50">
                    {r.k}
                  </div>
                  <div className="text-[12px] leading-[1.8] text-muted-ink/70">
                    {r.why}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
