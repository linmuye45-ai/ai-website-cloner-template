import { Reveal } from "./reveal";

const STATS = [
  { k: "三年目标估值", v: "$10B", note: "第 48–60 月" },
  { k: "十年目标市值", v: "$100B", note: "MELI 模板 $95.8B" },
  { k: "到岸表交付", v: "48h", note: "5 家工厂 · 全关税栈" },
  { k: "Landed 服务费", v: "6%", note: "单列 · 永远透明" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* background: grid + glows + corridor */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,239,232,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,232,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 78%)",
          }}
        />
        <div className="animate-drift absolute -top-40 right-[-12%] h-[560px] w-[560px] rounded-full bg-gold/[0.14] blur-[130px]" />
        <div className="absolute -top-20 left-[-18%] h-[480px] w-[480px] rounded-full bg-sea/[0.07] blur-[120px]" />

        {/* China → US corridor */}
        <svg
          className="absolute bottom-10 left-0 h-[280px] w-full opacity-[0.55]"
          viewBox="0 0 1200 280"
          fill="none"
          aria-hidden
        >
          <path
            d="M -20 220 C 240 140, 520 96, 760 118 C 940 134, 1080 186, 1240 172"
            stroke="#d9a441"
            strokeWidth="1.2"
            strokeDasharray="5 9"
            className="animate-corridor-dash"
            opacity="0.7"
          />
          <path
            d="M -20 220 C 240 140, 520 96, 760 118 C 940 134, 1080 186, 1240 172"
            stroke="url(#corridorGlow)"
            strokeWidth="2.6"
            opacity="0.28"
          />
          <defs>
            <linearGradient id="corridorGlow" x1="0" x2="1">
              <stop offset="0" stopColor="#7fb2e8" />
              <stop offset="1" stopColor="#f0c674" />
            </linearGradient>
          </defs>
          {/* waypoints: 义乌 / 宁波 / 胡志明 / 菲尼克斯 */}
          <circle cx="150" cy="188" r="3.2" fill="#f0c674">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="470" cy="108" r="3.2" fill="#f0c674">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="3.4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="820" cy="122" r="3.2" fill="#7fb2e8">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="3.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1105" cy="178" r="3.2" fill="#7fb2e8">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="4.2s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x="150"
            y="212"
            textAnchor="middle"
            fill="#97a0ab"
            fontSize="11"
            fontFamily="var(--font-geist-mono), monospace"
          >
            YIWU
          </text>
          <text
            x="470"
            y="96"
            textAnchor="middle"
            fill="#97a0ab"
            fontSize="11"
            fontFamily="var(--font-geist-mono), monospace"
          >
            NINGBO
          </text>
          <text
            x="820"
            y="110"
            textAnchor="middle"
            fill="#97a0ab"
            fontSize="11"
            fontFamily="var(--font-geist-mono), monospace"
          >
            HO CHI MINH
          </text>
          <text
            x="1105"
            y="202"
            textAnchor="middle"
            fill="#97a0ab"
            fontSize="11"
            fontFamily="var(--font-geist-mono), monospace"
          >
            PHOENIX, AZ
          </text>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      {/* content */}
      <div className="relative mx-auto max-w-[1240px] px-6 pb-28 pt-40 lg:px-10 lg:pt-48">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            <p className="label-mono text-gold">
              第五轮战略结论 · 2026 年 10 月 · 多模型收敛
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="mt-8 max-w-[16ch] text-[clamp(2.9rem,7.2vw,6.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            说一句话。
            <br />
            剩下的,
            <span className="text-gradient-gold">到岸为止。</span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-8 max-w-[62ch] text-[17px] leading-[1.85] text-muted-ink">
            到岸 <span className="text-paper">LANDED</span>
            ——站在买方一边、为结果负责的 AI 贸易公司。千亿版本是
            <span className="text-paper">「AI 原生贸易银行」</span>
            :贸易公司 → 平台 → 信贷账面 → 基础设施。
            每一步都有一个不可否认的数字,每一步都用债务而不是股权放大。
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="./app/index.html"
              className="glow-gold rounded-full bg-gold px-7 py-3.5 text-[15px] font-medium text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              打开 App,自己生成一张到岸表 →
            </a>
            <a
              href="#sheet"
              className="rounded-full border border-line-strong px-7 py-3.5 text-[15px] text-paper transition-colors hover:border-gold/50 hover:bg-gold/[0.06]"
            >
              先看一张真实的 ↓
            </a>
            <a
              href="#ladder"
              className="text-[13px] text-muted-ink underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              或看千亿阶梯 · 估值 $30M → $100B
            </a>
          </div>
        </Reveal>

        {/* stat strip */}
        <Reveal delay={340}>
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.k}
                className="group bg-ink-2/80 px-7 py-8 transition-colors hover:bg-panel"
              >
                <div className="label-mono text-muted-ink/70">{s.k}</div>
                <div className="mt-3 font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-none text-paper transition-colors group-hover:text-gold-2">
                  {s.v}
                </div>
                <div className="mt-2.5 text-[12px] text-muted-ink">{s.note}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
