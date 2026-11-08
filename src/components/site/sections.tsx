import { Reveal } from "./reveal";

/* ── section header helper ─────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[52ch] text-center" : "max-w-[58ch]"}>
      <div
        className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-8 bg-gold/60" />
        <p className="label-mono text-gold">{eyebrow}</p>
      </div>
      <h2 className="mt-6 text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
        {title}
      </h2>
      {sub ? (
        <p className="mt-5 text-[16px] leading-[1.85] text-muted-ink">{sub}</p>
      ) : null}
    </div>
  );
}

/* ── 为什么是现在 ──────────────────────────────────── */

const TIMELINE = [
  {
    when: "2025",
    tag: "小额免税死亡",
    body: "美国取消 $800 de minimis(先对华,后扩至所有国家),小包直邮模式终结——小包量下降 54%。几十万个微型企业一夜之间需要 EIN、报关行、HTS 归类。世界上没有那么多贸易专家。",
    accent: "gold" as const,
  },
  {
    when: "2026 · 02",
    tag: "关税栈重排",
    body: "最高法院终止 IEEPA 关税,进入 Section 122(≤15%)时代。规则一年数变:基础税率 + 301 + 122 逐项叠加。没人看得懂自己的真实到岸成本。",
    accent: "gold" as const,
  },
  {
    when: "2026 · 06",
    tag: "CBP 成文",
    body: "海关将新归类与申报流程正式化。合规从「可选项」变成「门槛」:FDA / CPSC / Prop 65 / UFLPA——每一项都是一次性淘汰一批供应商的裁判。",
    accent: "sea" as const,
  },
  {
    when: "同期",
    tag: "代理能力就位",
    body: "多语言代理第一次能在微信上用中文和义乌工厂砍价,再用英文向凤凰城的卖家解释结果。代理支付层(Visa TAP、Mastercard Agent Pay、x402/AP2、Stripe MPP)已建成。",
    accent: "sea" as const,
  },
];

export function WhyNow() {
  return (
    <section id="now" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="WHY NOW · 2025–2026"
            title={
              <>
                三个月里,几十万个
                <br />
                微型企业同时需要一位贸易专家
              </>
            }
            sub="创业的天时不是「市场很大」,而是需求被外部冲击重排——并且新技术第一次能规模化地「为结果负责」。两件事在 2025–26 年同时发生了。"
          />
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.tag} delay={i * 90}>
              <div className="group relative h-full bg-ink-2/80 p-8 transition-colors hover:bg-panel">
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] ${
                    t.accent === "gold"
                      ? "bg-gradient-to-r from-gold/80 to-transparent"
                      : "bg-gradient-to-r from-sea/80 to-transparent"
                  } opacity-60 transition-opacity group-hover:opacity-100`}
                />
                <div className="label-mono text-muted-ink/70">{t.when}</div>
                <h3 className="mt-3 text-[19px] font-semibold tracking-tight">
                  {t.tag}
                </h3>
                <p className="mt-3.5 text-[13.5px] leading-[1.85] text-muted-ink">
                  {t.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-[13px] text-muted-ink/80">
            <span className="text-gold">天时公式:</span>
            需求被外部冲击重排(关税 × 小额免税取消)× 技术第一次能承担责任(多语言代理 × 代理支付层)。缺任何一项,这门生意都不成立。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 为什么是我们(为什么阿里让不出来) ───────────── */

const RULES = [
  {
    n: "01",
    title: "「站在用户这一边」是巨头共同的盲区",
    body: "Google 站在广告主一边,阿里站在工厂一边,OpenAI 被诉讼与 IPO 锁住。他们只能站在「付钱的那一边」。AI 第一次让「为用户负责」有了可规模化的经济模型——6% 的透明费用。",
  },
  {
    n: "02",
    title: "「能做」已经商品化,「做成了算谁的」才稀缺",
    body: "Instinct、Accio、43,000 个 MCP 服务器都「能做」。承担责任的那一层,才是价值沉淀的那一层。到岸表的 11 列里,最贵的一列是「履约记录」——没有人有这列数据。",
  },
  {
    n: "03",
    title: "合规即获客,门槛即壁垒",
    body: "小额免税取消后每个小进口商都要 EIN、报关行、HTS 归类。Landed 把「关税计算器 + HTS 归类初判」做成免费漏斗:巨头不愿弯腰伺候小票,小贸易商做不起这套合规。",
  },
];

const COMPARE = {
  head: ["", "阿里 Accio(1,000 万月活)", "阿里 Trade Assurance", "到岸 LANDED"],
  rows: [
    ["谁付钱", "工厂(年费 / 广告)", "供应商 2–3%", "买家 · 服务费 6% 单列"],
    ["立场", "帮你找", "事后赔付(平台内)", "为「货到且合格」负责"],
    ["保护范围", "生态内撮合", "30 天窗口 · 追回 60–80% · 不含合规清关 · 不验质量", "验货合格才放款 · 多国货源 · HTS 全关税栈"],
    ["结果数据", "无履约评分", "争议记录", "每单准时率 / 不良率(初期为空,诚实标注)"],
  ],
};

export function Edge() {
  return (
    <section id="edge" className="relative border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="THE BLIND SPOT · 结构性位置"
            title={
              <>
                巨头只能站在
                <br />
                付钱的那一边
              </>
            }
            sub="三轮独立的战略推演撞到同样三条规律。它们解释了为什么这个位置空着,以及为什么它会一直空着。"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {RULES.map((r, i) => (
            <Reveal key={r.n} delay={i * 100}>
              <div className="h-full rounded-2xl border border-line bg-panel/50 p-8 transition-colors hover:border-gold/25">
                <div className="font-mono text-[13px] tracking-[0.2em] text-gold">
                  {r.n}
                </div>
                <h3 className="mt-4 text-[18px] font-semibold leading-snug tracking-tight">
                  {r.title}
                </h3>
                <p className="mt-4 text-[13.5px] leading-[1.9] text-muted-ink">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* comparison table */}
        <Reveal delay={140}>
          <div className="mt-16 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-panel/60">
                  {COMPARE.head.map((h, i) => (
                    <th
                      key={h || "dim"}
                      className={`px-6 py-5 text-[12.5px] font-medium tracking-wide ${
                        i === 0
                          ? "text-muted-ink/60"
                          : i === 3
                            ? "text-gold"
                            : "text-muted-ink"
                      }`}
                    >
                      {h || "维度"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.rows.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-line last:border-0 transition-colors hover:bg-panel/40"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-6 py-5 align-top text-[13px] leading-[1.8] ${
                          j === 0
                            ? "text-paper font-medium"
                            : j === 3
                              ? "text-paper bg-gold/[0.05]"
                              : "text-muted-ink"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 text-[13px] leading-[1.9] text-muted-ink/80">
            <span className="text-gold">修正声明:</span>
            阿里的 Trade Assurance 对买家免费、追回率 60–80%——它不是「不保护」,而是
            <span className="text-paper">事后、平台内、不含合规清关、不验质量、不管多国</span>
            。Landed 的位置不在「更好的搜索」,而在「为结果负责」:订单履约数据 + 验货放款 + 一口价到岸成本。
          </p>
        </Reveal>
      </div>
    </section>
  );
}
