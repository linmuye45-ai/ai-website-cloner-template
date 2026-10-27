import type { Metadata } from "next";
import { Tool } from "@/components/app/tool";

export const metadata: Metadata = {
  title: "到岸 App · 一句话生成到岸表(演示版)",
  description:
    "说一句话,48 小时拿到 5 家经核验工厂的全包比价单:报价、关税、运保杂、合规、过往记录,到手成本一目了然。现在就能试的演示版。",
};

export default function AppPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="no-print border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
          <a href="../index.html" className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 26 26" aria-hidden>
              <rect x="3" y="17" width="5" height="6" rx="1" fill="#8a6a2b" />
              <rect x="10.5" y="11" width="5" height="12" rx="1" fill="#d9a441" />
              <rect x="18" y="3" width="5" height="20" rx="1" fill="#f0c674" />
            </svg>
            <div className="leading-none">
              <div className="text-[14px] font-semibold tracking-tight">
                到岸 <span className="text-gradient-gold font-mono text-[12px] tracking-[0.18em]">LANDED</span>
              </div>
              <div className="label-mono mt-[3px] text-muted-ink/80">App · 演示版</div>
            </div>
          </a>
          <a
            href="../index.html"
            className="rounded-full border border-line-strong px-5 py-2 text-[13px] text-paper transition-colors hover:border-gold/50 hover:bg-gold/[0.06]"
          >
            ← 返回官网
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* mini hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 right-[-10%] h-[380px] w-[380px] rounded-full bg-gold/[0.12] blur-[110px]" />
            <div className="absolute -top-16 left-[-12%] h-[320px] w-[320px] rounded-full bg-sea/[0.07] blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-[1100px] px-6 pb-4 pt-16">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" />
              <p className="label-mono text-gold">48 小时承诺 · 现在就能试</p>
            </div>
            <h1 className="mt-5 max-w-[22ch] text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
              说一句话。
              <br />
              拿到一张<span className="text-gradient-gold">全包比价单</span>。
            </h1>
            <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.9] text-muted-ink">
              5 家核实过的工厂、全部税费、运费保险、合规要求、过往记录——
              最后只看一个数字:<span className="text-paper">到你仓库,每件多少钱</span>。
              挑一家,点确认,货验合格才放款,出事我们赔。
            </p>
          </div>
        </section>

        {/* tool */}
        <section className="mx-auto max-w-[1100px] px-6 pb-8">
          <Tool />
        </section>

        {/* how it works */}
        <section className="no-print mx-auto max-w-[1100px] px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                k: "① 你动嘴,我跑腿",
                d: "不用懂外贸、不用懂税。AI 替你发询价、比价、核验工厂——像雇了个不睡觉的采购员。",
              },
              {
                k: "② 只看一个数字",
                d: "报价单上花花绿绿的费用都不用你算:税、运费、保险全摊进「到手价」,谁便宜一眼看到底。",
              },
              {
                k: "③ 钱有保障",
                d: "钱先托管,验货合格才给工厂。出问题按合同赔。想赊账(先拿货后付款)?正式版提供。",
              },
            ].map((c) => (
              <div key={c.k} className="rounded-2xl border border-line bg-panel/40 p-7">
                <h3 className="text-[16px] font-semibold tracking-tight text-paper">{c.k}</h3>
                <p className="mt-3 text-[13px] leading-[1.95] text-muted-ink">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-ink-2/60 p-7">
            <p className="text-[12.5px] leading-[1.9] text-muted-ink">
              <span className="text-gold">这是什么:</span>
              「到岸」的演示版 App——数据是模拟的,但算法是真的(到手价 = 报价 × (1 + 税率) + 运杂,税率按 2026 年口径:基础税 + 对华 301 + §122)。
              想看这门生意的完整推演(为什么是现在、怎么不被抢走、怎么做到千亿),回
              <a href="../index.html" className="mx-1 text-sea underline-offset-4 hover:underline">官网</a>
              往下滚;给不搞商业的朋友准备了
              <a href="../index.html#plain" className="mx-1 text-sea underline-offset-4 hover:underline">白话版</a>。
            </p>
          </div>
        </section>
      </main>

      <footer className="no-print border-t border-line bg-ink-2/60">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-6 py-8 text-[11.5px] text-muted-ink/70 sm:flex-row sm:justify-between">
          <p>到岸 LANDED · 站在买方一边,为结果负责。演示版,非投资建议。</p>
          <p className="font-mono tracking-[0.12em]">APP DEMO · 2026-10</p>
        </div>
      </footer>
    </div>
  );
}
