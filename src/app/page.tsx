import type { Metadata } from "next";
import { AetheriaWorkbench } from "@/components/aetheria/workbench";

export const metadata: Metadata = {
  title:
    "苍穹造物 AETHERIA OS · 49-Agent 一人游戏大厂 × 60FPS 可玩广告引擎 × 十角兽全栈平台",
  description:
    "对标 AppLovin ($90B) + 点点互动 ($2.24B/年) + Lovable ($13.3B)：一年内实现数亿流动净资产，三年内成为 $30B+ 上等顶级十角兽。",
};

const BENCHMARKS = [
  {
    k: "AppLovin (NASDAQ: APP)",
    v: "$900 亿市值 · 净利率 60.8%",
    n: "2026 年营收冲 $77亿–$93亿，EBITDA 率 84%，自由现金流 $39.4亿/年 —— 可玩广告算法交易所的千亿终局",
  },
  {
    k: "《Last War》&《Whiteout Survival》",
    v: "单款年入 $22.4亿–$24.4亿",
    n: "中国出海双王（~¥170亿/年），全靠「前15秒左右刷数字门可玩广告低价吸量 + 后置深数值内购」",
  },
  {
    k: "海彼 Habby《Capybara Go!》",
    v: "40人团队首年狂揽 $1.4亿",
    n: "单款肉鸽混合休闲首年 ≈ ¥10 亿流水！我们用 49-Agent 管线把 40 人压成 1 人，研发成本砍 95%",
  },
  {
    k: "Lovable（一句话造应用）",
    v: "22 个月冲上 $133 亿十角兽",
    n: "仅 146 名员工做到 $6 亿 ARR —— 验证了「AI 创作工作台 + 分发平台」3 年内必出顶级十角兽",
  },
];

const GLOBAL_RIVALS = [
  {
    lane: "① 副玩法买量 + 数值内购霸主",
    rivals: "点点互动 (Century) / FirstFun / 海彼 Habby",
    numbers: "《Last War》$24.4B ·《Whiteout》$22.4B · 新游《Kingshot》0→$11B",
    weakness: "仍需 50–300 人团队磨 6–12 个月，试错成本几千万；买量视频靠人工外包",
    ourKill:
      "用 Claude-Code-Game-Studios + QFramework + Mindustry/RogueLegacy 源码，48 小时出可玩原型，1/20 成本高频试错",
  },
  {
    lane: "② AI 广告算法交易所（千亿标杆）",
    rivals: "AppLovin (AXON 2.0) / Unity IronSource",
    numbers: "AppLovin 市值 $90B，净利率 60.8%，EBITDA 利润率 84%",
    weakness: "2025 年卖掉了自有工作室，只做分发不做源头「一句话生成可玩广告与游戏本体」",
    ourKill:
      "把前端「video-to-game 可玩广告生成」与后端「试玩前10秒付费转化算法」垂直打通，截流最源头数据",
  },
  {
    lane: "③ AI 原生开发平台（十角兽新贵）",
    rivals: "Lovable ($13.3B) / Cursor ($60B 并购)",
    numbers: "Lovable $600M ARR；Cursor $2.7B ARR（但毛利率仅 23%）",
    weakness: "只懂通用 CRUD 网页，不懂游戏的「卡肉顿帧 Hitstop、肉鸽数值卡点、可玩广告投流」",
    ourKill:
      "内置 patch-gg/pixelfx 244 种代码打击特效 + ramenvr/autopilot 10 万局自动压测，专攻暴利游戏与互动短剧",
  },
  {
    lane: "④ 传统引擎与沙盒 UGC",
    rivals: "Unity / Roblox",
    numbers: "Unity 2026H1 营收仅 $11亿（AppLovin 的 1/3）；Roblox 创作者仅分 ~25%",
    weakness: "工具链极重、美术建模绑定劝退 99% 个人开发者；无法一键转成 TikTok/AppLovin 买量素材",
    ourKill:
      "agent-sprite-forge 1张图出全套序列帧 + Sand3D 代码捏3D + GrokBot 12国语言全自动出海投流",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06080D] text-[#F8FAFC]">
      {/* ── 顶栏（千亿美元级工业指挥舱风格）── */}
      <header className="sticky top-0 z-40 border-b border-[#1A2333] bg-[#06080D]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#38BDF8] bg-[#38BDF8]/15 font-mono text-[13px] font-black text-[#38BDF8]">
              Æ
            </span>
            <div className="leading-none">
              <div className="text-[16px] font-black tracking-[0.14em] text-[#F8FAFC]">
                苍穹造物 <span className="text-[#38BDF8]">AETHERIA OS</span>{" "}
                <span className="ml-1 rounded bg-[#E5B84B]/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#E5B84B]">
                  v4.0 FULL-STACK
                </span>
              </div>
              <div className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#64748B] uppercase">
                49-Agent Autonomous Game Studio · 60FPS Playable-Ad Engine · AXON Exchange
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#decacorn-sim"
              className="hidden rounded-full border border-[#2C3A50] px-4 py-2 text-[12px] font-bold text-[#CBD5E1] hover:border-[#E5B84B] hover:text-[#E5B84B] sm:inline-block"
            >
              首年数亿现金 &amp; 三年十角兽账本
            </a>
            <a
              href="#workbench"
              className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#2563EB] px-5 py-2 text-[12.5px] font-black text-white shadow-[0_10px_25px_-8px_rgba(56,189,248,0.65)] transition-transform hover:scale-[1.04]"
            >
              进入 60FPS 实机引擎与总控台 →
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#161F2E]">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#E5B84B 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            backgroundPosition: "0 0, 18px 18px",
          }}
        />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-14 pt-14 text-center sm:pt-18">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#0D1422] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="text-[11.5px] font-extrabold tracking-[0.1em] text-[#38BDF8]">
              终极双目标锁定：1 年内流动净资产破数亿（¥4.25亿+） · 3 年内成为上等顶级十角兽（$30B+ USD）
            </span>
          </div>

          <h1 className="mx-auto mt-6 max-w-[22ch] text-[clamp(2.2rem,5.5vw,4.3rem)] font-black leading-[1.1] tracking-tight">
            一人统帅 <span className="text-[#38BDF8]">49 个专职 AI 员工</span>，
            <br />
            把游戏印钞机升级为{" "}
            <span className="text-[#E5B84B]">千亿级算法交易所</span>。
          </h1>

          <p className="mx-auto mt-6 max-w-[68ch] text-[15.5px] leading-[1.9] text-[#94A3B8]">
            大白话讲透这套全栈打法：把你给的 <strong className="text-[#F8FAFC]">8 大类、50+ 顶级开源武器库</strong>（Claude-Code-Game-Studios、QFramework、Mindustry、RogueLegacy、PixelFX 244 代码特效、Agent-Sprite-Forge、Autopilot 自动压测、Video-to-Game 可玩广告、Lieflat 去 AI 味、GrokBot 出海集群）组装成一条全自动流水线。
            <strong className="text-[#34D399]">第一年</strong>像海彼 Habby 和点点互动一样，用 1/20 的成本批量产出「副玩法可玩广告 + 重度数值内购」爆款，直接往自己兜里揣进{" "}
            <strong className="text-[#34D399]">¥3.8 亿–¥6.5 亿税后流动净现金</strong>；
            <strong className="text-[#E5B84B]">第二至第三年</strong>把这套引擎开放为{" "}
            <strong className="text-[#F8FAFC]">Lovable 造游工作台 + AppLovin AXON 可玩广告交易所</strong>，以 58% 净利率直冲{" "}
            <strong className="text-[#E5B84B]">$300 亿–$450 亿美元上等十角兽</strong>！
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a
              href="#workbench"
              className="rounded-full bg-gradient-to-r from-[#E5B84B] to-[#D97706] px-8 py-4 text-[15px] font-black text-[#090B0E] shadow-[0_18px_40px_-12px_rgba(229,184,75,0.6)] transition-transform hover:scale-[1.03]"
            >
              🎮 立即试玩 60FPS 副玩法实机引擎 + 启动 49-Agent 管线
            </a>
            <a
              href="#decacorn-sim"
              className="rounded-full border-2 border-[#2C3A50] bg-[#0D121B] px-8 py-4 text-[15px] font-bold text-[#F8FAFC] hover:border-[#38BDF8] hover:text-[#38BDF8]"
            >
              💰 查看「首年 ¥4.25 亿净现金 → 三年 $31.9B 十角兽」沙盘
            </a>
          </div>
        </div>
      </section>

      {/* ── 4大千亿/十角兽真实财报铁证 ── */}
      <section className="mx-auto max-w-[1240px] px-5 pt-12">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {BENCHMARKS.map((b) => (
            <div
              key={b.k}
              className="rounded-2xl border border-[#1E293B] bg-[#0D121B] p-5"
            >
              <div className="text-[11px] font-bold tracking-[0.1em] text-[#38BDF8] uppercase">
                {b.k}
              </div>
              <div className="mt-2 font-mono text-[20px] font-black text-[#E5B84B]">
                {b.v}
              </div>
              <div className="mt-2 text-[12px] leading-relaxed text-[#94A3B8]">
                {b.n}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 核心全栈工作台（60FPS Canvas 引擎 + 49-Agent 编排 + PixelFX + 十角兽沙盘 + 武器库矩阵）── */}
      <section
        id="workbench"
        className="mx-auto max-w-[1240px] scroll-mt-16 px-5 pt-14"
      >
        <AetheriaWorkbench />
      </section>

      {/* ── 全球竞争对手全调查表 ── */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#38BDF8] uppercase">
            GLOBAL COMPETITIVE MATRIX · 2026 全球四大维度竞品拆解
          </div>
          <h2 className="mt-2 text-[clamp(1.65rem,3.4vw,2.4rem)] font-black">
            站在 AppLovin、点点互动、Lovable 肩膀上，我们怎么吃下最大那块肉？
          </h2>
          <p className="mx-auto mt-2 max-w-[64ch] text-[13.5px] text-[#94A3B8]">
            完整蓝图已写入仓库{" "}
            <code className="rounded bg-[#131C2B] px-2 py-0.5 font-mono text-[#E5B84B]">
              docs/aetheria/decacorn-blueprint.md
            </code>
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-[#243044] bg-[#0D121B]">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#131B29] text-[11.5px] font-bold text-[#94A3B8]">
                <th className="px-5 py-4">赛道维度</th>
                <th className="px-5 py-4">全球巨头对手</th>
                <th className="px-5 py-4">2025–2026 真实营收与市值</th>
                <th className="px-5 py-4">他们的结构性盲区</th>
                <th className="px-5 py-4 text-[#E5B84B]">
                  AETHERIA OS 降维武器
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2333] text-[12.5px]">
              {GLOBAL_RIVALS.map((r) => (
                <tr key={r.lane} className="hover:bg-[#121A28]">
                  <td className="px-5 py-4 font-extrabold text-[#F8FAFC]">
                    {r.lane}
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#38BDF8]">
                    {r.rivals}
                  </td>
                  <td className="px-5 py-4 font-mono text-[12px] text-[#E5B84B]">
                    {r.numbers}
                  </td>
                  <td className="px-5 py-4 leading-relaxed text-[#FB7185]">
                    {r.weakness}
                  </td>
                  <td className="px-5 py-4 font-semibold leading-relaxed text-[#34D399]">
                    {r.ourKill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 页脚与全历史版本归档 ── */}
      <footer className="mt-24 border-t border-[#1A2333] bg-[#04060A]">
        <div className="mx-auto max-w-[1240px] px-5 py-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="text-[18px] font-black tracking-[0.16em] text-[#F8FAFC]">
                苍穹造物 · <span className="text-[#38BDF8]">AETHERIA OS</span>
              </div>
              <p className="mt-2 max-w-[64ch] text-[12.5px] leading-relaxed text-[#64748B]">
                一人多智能体游戏大厂 × 可玩广告算法交易所。全栈实机集成 Claude-Code-Game-Studios、QFramework、Mindustry、RogueLegacy1、PixelFX 244、Agent-Sprite-Forge、Sand3D、Autopilot、Video-to-Game、Lieflat 与 GrokBot Growth。
              </p>
            </div>
            <div className="text-left text-[12px] text-[#94A3B8] sm:text-right">
              <div className="font-bold text-[#E5B84B]">
                作战蓝图：docs/aetheria/decacorn-blueprint.md
              </div>
              <div className="mt-2 flex flex-wrap gap-3 sm:justify-end">
                <span className="text-[#64748B]">历史版本永久归档：</span>
                <a
                  href="./slabai/index.html"
                  className="underline hover:text-[#38BDF8]"
                >
                  第4版：闪鉴金库 SlabAI
                </a>
                <span>·</span>
                <a
                  href="./reunion/index.html"
                  className="underline hover:text-[#38BDF8]"
                >
                  第3版：同框 Reunion
                </a>
                <span>·</span>
                <a
                  href="./petdaily/index.html"
                  className="underline hover:text-[#38BDF8]"
                >
                  第2版：毛孩日报 PetDaily
                </a>
                <span>·</span>
                <a
                  href="./landed/index.html"
                  className="underline hover:text-[#38BDF8]"
                >
                  第1版：到岸 Landed
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
