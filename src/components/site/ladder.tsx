"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { SectionHead } from "./sections";

type Stage = {
  time: string;
  label: string;
  val: string;
  h: number;
  raise: string;
  ownership: string;
  liquidity: string;
  milestone: string;
  emphasis?: boolean;
};

const STAGES: Stage[] = [
  {
    time: "第 0–6 月",
    label: "自举验证",
    val: "—",
    h: 12,
    raise: "自有资金 · 不垫资",
    ownership: "100%",
    liquidity: "—",
    milestone:
      "每周 3 张到岸表;季度复购 GMV >60%;GMV run-rate $5M;到岸表自动化 80%。第四轮的四个条件(合规品类 / 不垫资 / 第 6 月 Pro / 第 12 月账期)在这里是「种子轮证据」。",
  },
  {
    time: "第 6 月",
    label: "种子轮",
    val: "$30–50M",
    h: 22,
    raise: "$4–6M",
    ownership: "~80%",
    liquidity: "—",
    milestone:
      "必须融资——不是缺钱,是千亿公司的时钟从第一笔机构资本开始走。每晚 6 个月,平台转换与账面转换各晚 6 个月。",
    emphasis: true,
  },
  {
    time: "第 15 月",
    label: "A 轮",
    val: "$200–350M",
    h: 34,
    raise: "$25–35M",
    ownership: "~60%",
    liquidity: "—",
    milestone:
      "3 个品类、2 条走廊(中国→美国主走廊 + 越南/印度对冲);GMV run-rate $50M;Landed Pro 订阅;合作方账期试点;毛收入 run-rate $5M。",
  },
  {
    time: "第 27 月",
    label: "B 轮 + 首个信贷设施",
    val: "$1–1.5B",
    h: 50,
    raise: "$100M 股权 + $100–150M 债务",
    ownership: "~40%",
    liquidity: "二级 5–10%(约 $20–60M)",
    milestone:
      "第二幕启动:工厂竞标、Landed Verified Factory。GMV run-rate $400M;自有信贷账面 $50M(先用合作方资金);收入 run-rate $40M;坏账 <1%。",
  },
  {
    time: "第 40 月",
    label: "C 轮 + 仓储性融资",
    val: "$4–7B",
    h: 68,
    raise: "$250–350M 股权 + $1B 债务",
    ownership: "~28%",
    liquidity: "二级 10–15%(约 $150–300M)",
    milestone:
      "第三幕:信贷账面 $400–600M;GMV run-rate $2B;5 条走廊;收入 run-rate $200M(货物 5% + 金融/服务 5% 混合抽成);核心业务 EBITDA 转正。",
    emphasis: true,
  },
  {
    time: "第 48–60 月",
    label: "$10B",
    val: "$10B",
    h: 84,
    raise: "D 轮或上市前轮",
    ownership: "~22%",
    liquidity: "账面 ~$2B",
    milestone:
      "GMV run-rate $6–8B;信贷账面 $1.5–2B;收入 $600M–1B;增速 >80%。账面十位数——注意,这是估值,不是现金。",
    emphasis: true,
  },
  {
    time: "第 10 年",
    label: "$100B",
    val: "$100B",
    h: 100,
    raise: "上市后 · 债务市场",
    ownership: "~15%",
    liquidity: "现金十位数",
    milestone:
      "GMV $150–250B(≈全球中小企业跨境贸易的 2–4%);收入 $15–25B;金融收入过半;25%+ 增速;多走廊、多币种。MELI 模板:$95.8B 市值、$28.9B 收入、$14.6B 信贷账面。",
    emphasis: true,
  },
];

const ACTS = [
  {
    n: "幕一",
    name: "贸易公司",
    sub: "我做",
    trigger: "触发:季度复购 GMV >60%",
    body: "以 Landed 名义下单、交货、担责。抽 6–10%(传统贸易公司 10–30%)。利润养组织,订单攒履约数据。",
  },
  {
    n: "幕二",
    name: "平台",
    sub: "别人通过我做",
    trigger: "触发:第 27 月前平台 GMV 必须出现",
    body: "工厂为 Landed 的询价竞标;Verified Factory 认证;供应商结果评分向保险、银行、平台授权。「贸易通过它发生」。",
  },
  {
    n: "幕三",
    name: "贸易银行",
    sub: "用自有证据链放贷",
    trigger: "触发:坏账 <1% + 合作方资金跑通",
    body: "买家 Net-60 账期、工厂早付折扣——贸易融资是最厚的利润池(缺口 $2.5 万亿)。用自己的验货/物流/清关数据定价风险,用债权而非股权放大。",
  },
  {
    n: "幕四",
    name: "基础设施",
    sub: "别人在我上面建",
    trigger: "触发:信贷账面 $400–600M",
    body: "仓储性融资、资产证券化、走廊级标准。全球中小企业跨境贸易的「水电煤」——十年后的收入结构里,金融过半。",
  },
];

const REFS = [
  "Amazon:书店 → 平台 → AWS",
  "MELI:市场 → 支付 → 信贷账面 $14.6B",
  "Shopify:工具 → 平台 → 金融",
  "腾讯:社交 → 内容/支付 → 生态",
  "Apple:硬件 → 生态 → 服务",
];

export function Ladder() {
  const [sel, setSel] = useState(4);
  const s = STAGES[sel];

  return (
    <section id="ladder" className="relative border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="THE LADDER · 千亿阶梯"
            title={
              <>
                三年 $10B,十年 $100B。
                <br />
                每一级都有一个不可否认的数字。
              </>
            }
            sub="2024–26 年做到 $10B 的公司全部落在四种模式:卖给 AI 建设潮、开发者工具、病毒式消费 AI、高价值垂直代理。儿童消费与实物贸易一家都没有——所以这是 8–12 年的千亿故事,靠的是「四幕」转换,而不是单一产品爆发。"
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-14 rounded-2xl border border-line bg-ink-2/70 p-6 sm:p-8">
            {/* staircase */}
            <div className="flex h-[300px] items-end gap-2 sm:gap-3">
              {STAGES.map((st, i) => (
                <button
                  key={st.time}
                  onClick={() => setSel(i)}
                  aria-pressed={i === sel}
                  className="group flex h-full flex-1 cursor-pointer flex-col justify-end"
                >
                  <div
                    className={`mb-2 text-center font-mono text-[10px] tracking-wide transition-colors sm:text-[11px] ${
                      i === sel ? "text-gold-2" : "text-muted-ink/60"
                    }`}
                  >
                    {st.val}
                  </div>
                  <div
                    className={`animate-bar-rise w-full rounded-t-lg border border-b-0 transition-all duration-300 ${
                      i === sel
                        ? "border-gold/60 bg-gradient-to-t from-gold-3/80 via-gold/70 to-gold-2/90 shadow-[0_0_36px_-6px_rgba(217,164,65,0.55)]"
                        : "border-line-strong bg-gradient-to-t from-panel to-panel-2 group-hover:from-gold-3/30 group-hover:to-gold/20"
                    }`}
                    style={{
                      height: `${st.h}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                  <div
                    className={`mt-2.5 text-center text-[10px] leading-tight transition-colors sm:text-[11px] ${
                      i === sel ? "text-paper" : "text-muted-ink/70"
                    }`}
                  >
                    {st.time}
                  </div>
                </button>
              ))}
            </div>

            {/* detail */}
            <div className="mt-8 grid gap-5 rounded-xl border border-line bg-panel/40 p-6 lg:grid-cols-4 lg:p-8">
              <div className="lg:col-span-2">
                <div className="flex items-baseline gap-3">
                  <span className="label-mono text-gold">{s.time}</span>
                  <h3 className="text-[20px] font-semibold tracking-tight">
                    {s.label}
                  </h3>
                </div>
                <p className="mt-3.5 text-[13.5px] leading-[1.95] text-muted-ink">
                  {s.milestone}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
                <div>
                  <div className="label-mono text-muted-ink/60">融资</div>
                  <div className="mt-2 font-mono text-[13.5px] text-paper">
                    {s.raise}
                  </div>
                </div>
                <div>
                  <div className="label-mono text-muted-ink/60">估值</div>
                  <div className="mt-2 font-mono text-[20px] text-gold-2">
                    {s.val}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
                <div>
                  <div className="label-mono text-muted-ink/60">创始人持股</div>
                  <div className="mt-2 font-mono text-[13.5px] text-paper">
                    {s.ownership}
                  </div>
                </div>
                <div>
                  <div className="label-mono text-muted-ink/60">可变现</div>
                  <div className="mt-2 font-mono text-[13.5px] text-mint">
                    {s.liquidity}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 px-1 text-[12px] leading-[1.9] text-muted-ink/80">
              <span className="text-gold">断点纪律:</span>
              第 27 月前平台 GMV 不出现 → 承认这是一家贸易公司,按贸易公司估值,不再讲平台故事;
              第 40 月信贷账面不到 $400–600M → $4–7B 不成立。点击柱子查看每一级。
            </p>
          </div>
        </Reveal>

        {/* four acts */}
        <div className="mt-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" />
              <p className="label-mono text-gold">
                FOUR ACTS · 千亿需要债务放大
              </p>
            </div>
            <h3 className="mt-6 max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.3] tracking-tight">
              三个方向里,只有 Landed 的第三幕能用债务而不是股权扩张
            </h3>
            <p className="mt-4 max-w-[62ch] text-[14.5px] leading-[1.9] text-muted-ink">
              Ember 和 Praxis 只能烧股权开新市场,数学上慢 3–5
              年。贸易银行的每一级都由资产(应收账款、存货、履约证据链)支撑——这就是 MELI
              从市场走到 $95.8B 的路径。
            </p>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {ACTS.map((a, i) => (
              <Reveal key={a.n} delay={i * 80}>
                <div className="h-full bg-ink-2/80 p-7 transition-colors hover:bg-panel">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[12px] tracking-[0.22em] text-gold">
                      {a.n}
                    </span>
                    <span className="text-[11px] text-muted-ink/70">
                      {a.sub}
                    </span>
                  </div>
                  <h4 className="mt-3 text-[19px] font-semibold tracking-tight">
                    {a.name}
                  </h4>
                  <div className="mt-2 font-mono text-[11px] text-sea">
                    {a.trigger}
                  </div>
                  <p className="mt-3.5 text-[12.5px] leading-[1.9] text-muted-ink">
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {REFS.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-line px-4 py-2 text-[11.5px] text-muted-ink transition-colors hover:border-gold/40 hover:text-paper"
                >
                  {r}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
