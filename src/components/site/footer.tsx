import { Reveal } from "./reveal";
import { SectionHead } from "./sections";

const PIPELINE = [
  {
    n: "01",
    k: "三份委托书",
    d: "乔布斯式「新时代入口」/ Larry Page 式「AI 时代的 Google」/ 一人超级公司——按顶级创始团队的任务书逐条执行,不是聊想法。",
  },
  {
    n: "02",
    k: "多模型 × 多轮",
    d: "单次输出不作数。同样的任务书跑多轮、跨模型,把方案填进收敛追踪表:连续出现 ≥3 次、平均分 ≥88,进入人工尽调。",
  },
  {
    n: "03",
    k: "2026 事实校准",
    d: "每一个关键判断对齐 2026 年 10 月的公开资料(40+ 来源):关税、监管、巨头动向、融资基准率。拒绝「凭印象」。",
  },
  {
    n: "04",
    k: "投委会红队",
    d: "三问铁律:巨头为什么不能?你为结果负责,负责的凭证是什么?第一个月谁付钱?答不出 = 方案作废。",
  },
];

const DOCS = [
  { f: "round-1-product-revolution.md", d: "第一轮 · 产品革命 → Ember(星火)" },
  { f: "round-2-ai-era-google.md", d: "第二轮 · AI 时代的 Google → Praxis(行索)" },
  { f: "round-3-one-person-supercompany.md", d: "第三轮 · 一人超级公司 → Landed(到岸)· 10 方案评分" },
  { f: "round-4-red-team-investment-committee.md", d: "第四轮 · 投委会红队 + 30 天开工包" },
  { f: "round-5-path-to-10b-100b.md", d: "第五轮 · 百亿千亿反推(本文全部数字的出处)" },
  { f: "convergence-tracker.md", d: "工具 · 跨模型收敛追踪表" },
];

export function Method() {
  return (
    <section id="method" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="METHOD · 方法"
            title={
              <>
                不是灵感,是收敛。
                <br />
                多模型 × 多轮 × 红队
              </>
            }
            sub="单次输出不重要。把同一个任务书交给不同的模型跑几十轮,看什么反复出现——再用投委会的铁律把它们拆到只剩能活下来的。这个网站上的每个数字,都来自这套流程的第五轮。"
          />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="h-full bg-ink-2/80 p-8 transition-colors hover:bg-panel">
                <div className="font-mono text-[13px] tracking-[0.22em] text-gold">
                  {p.n}
                </div>
                <h3 className="mt-3.5 text-[17px] font-semibold tracking-tight">
                  {p.k}
                </h3>
                <p className="mt-3 text-[12.5px] leading-[1.9] text-muted-ink">
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-10 rounded-2xl border border-line bg-panel/30 p-8">
            <div className="label-mono text-gold">
              FULL DOSSIER · 完整档案(7 份 · 约 15 万字)
            </div>
            <div className="mt-5 grid gap-2.5">
              {DOCS.map((d) => (
                <div
                  key={d.f}
                  className="flex flex-col gap-1 rounded-lg border border-line/70 px-5 py-3.5 hover:border-gold/30 sm:flex-row sm:items-baseline sm:gap-5"
                >
                  <code className="w-[320px] shrink-0 font-mono text-[12px] text-sea">
                    docs/strategy/{d.f}
                  </code>
                  <div className="text-[12.5px] text-muted-ink">{d.d}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 50% 120%, rgba(217,164,65,0.12), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-6 pb-16 pt-24 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-none tracking-[-0.04em]">
              到岸 <span className="text-gradient-gold">LANDED</span>
            </div>
            <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.9] text-muted-ink">
              站在买方一边,为结果负责。
              <br />
              从一句话,到一整柜货,
              <span className="text-paper">到岸为止。</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="#top"
              className="rounded-full border border-line-strong px-7 py-3.5 text-center text-[14px] text-paper transition-colors hover:border-gold/50 hover:bg-gold/[0.06]"
            >
              回到顶部 ↑
            </a>
            <a
              href="#sheet"
              className="glow-gold rounded-full bg-gold px-7 py-3.5 text-center text-[14px] font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              再看一眼到岸表
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[11.5px] leading-[1.9] text-muted-ink/70 lg:flex-row lg:justify-between">
          <p className="max-w-[72ch]">
            本站为战略推演与产品概念演示,不构成投资建议;文中概率为作者主观估计,
            市场数字来自 2026 年 10 月公开资料(完整来源见 docs/strategy/ 各轮附录)。
            「三年十位数净资产」没有任何 Prompt 能保证——能保证的只有把每一个假设都写下来,然后逐条证伪。
          </p>
          <p className="shrink-0 font-mono tracking-[0.14em]">
            多模型收敛 · 第五轮 · 2026-10
          </p>
        </div>
      </div>
    </footer>
  );
}
