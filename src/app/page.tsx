import type { Metadata } from "next";
import { PetTool } from "@/components/petdaily/tool";

export const metadata: Metadata = {
  title: "毛孩日报 PetDaily · 每天一张,毛孩的专属小报",
  description:
    "30 秒填一张,生成你家毛孩今天的专属日报:今日情绪头条、行为小报、健康观察、品种冷知识——截图就能晒。附症状自查:该不该去医院,先问清楚。",
  keywords: ["宠物", "毛孩", "宠物情绪", "狗", "猫", "日报", "PetDaily", "症状自查", "宠物健康"],
};

const STATS = [
  { k: "全球宠物护理市场", v: "$3,000 亿+", n: "美国 $756 亿 · 中国 ¥3,365 亿" },
  { k: "中国「宠物情绪」细分", v: "¥85 亿", n: "2030 年将破 ¥111 亿(情绪白皮书)" },
  { k: "抖音年新增宠物用户", v: "5,000 万", n: "内容平台 = 年轻人养宠第一站" },
  { k: "日本的猫狗数量", v: "多过婴儿", n: "「毛孩子」已是全球现象" },
];

const LOOP = [
  {
    k: "① 每天一张,天天想晒",
    t: "日报 = 每日分享燃料",
    d: "别的 App 是工具,毛孩日报是「仪式」。每天 30 秒,换一张会说话的宠物小报——晒猫晒狗是全网第一流量密码,日报就是为晒而生的。",
  },
  {
    k: "② 攒满一周,上瘾一月",
    t: "周报/月报 = Spotify Wrapped 式爆发",
    d: "日报攒出「毛孩周报」「本月情绪曲线」「年度可爱大赏」——每一次汇总都是一次刷屏级分享,留存和传播同时被点燃。",
  },
  {
    k: "③ 测一测,拉一片",
    t: "「像不像你家毛孩」测试",
    d: "输入名字就能生成性格测试卡,分享给朋友测「你像哪种狗」——社交裂变的经典引信,获客成本趋近于零。",
  },
];

const COMPARE = [
  { who: "硬件翻译项圈($100–700)", weak: "要充电、要戴、准确率被独立研究打到 57%(纯音频)", us: "纯软件零硬件,手机即用" },
  { who: "训练课订阅($8–10/月)", weak: "上课是任务,没人天天打卡", us: "日报是仪式,每天 30 秒就想打开" },
  { who: "宠物医院/问诊 App", weak: "病了才用,平时没存在感", us: "平时天天用,症状自查顺手完成" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A2118]">
      {/* header */}
      <header className="no-print sticky top-0 z-40 border-b border-[#E5D9C8] bg-[#FAF6F0]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[20px]">🐾</span>
            <div className="leading-none">
              <div className="font-serif text-[17px] font-bold tracking-[0.14em]">毛孩日报</div>
              <div className="mt-0.5 text-[9px] font-semibold tracking-[0.28em] text-[#B09A82] uppercase">
                PetDaily
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-[#E5D9C8] px-3.5 py-1.5 text-[11px] text-[#8A7460] sm:block">
              演示版 · 无需下载
            </span>
            <a
              href="#tool"
              className="rounded-full bg-[#E8703A] px-5 py-2 text-[13px] font-bold text-white transition-transform hover:scale-[1.05]"
            >
              免费生成 →
            </a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(#E5D9C8 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-[980px] px-5 pb-10 pt-16 text-center sm:pt-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E5D9C8] bg-white px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8703A]" />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#8A7460]">
              新兴细分 · 宠物情绪 × 每日仪式 × 社交分享
            </span>
          </div>
          <h1 className="mx-auto mt-7 max-w-[18ch] font-serif text-[clamp(2.4rem,7vw,4.6rem)] font-bold leading-[1.18] tracking-[0.02em]">
            每天一张,
            <br />
            毛孩的<span className="text-[#E8703A]">专属小报</span>。
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[15.5px] leading-[2] text-[#6B5844]">
            30 秒填一张,生成它今天的「日报」:今日情绪头条、行为小报、健康观察、品种冷知识。
            <span className="font-semibold text-[#2A2118]">截图就能晒</span>——
            晒猫晒狗是全网第一流量密码,而它是第一张为「晒」而生的宠物小报。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a
              href="#tool"
              className="rounded-full bg-[#E8703A] px-8 py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(232,112,58,0.55)] transition-transform hover:scale-[1.03]"
            >
              现在就生成一张 📰
            </a>
            <a
              href="#check"
              className="rounded-full border-2 border-[#2A2118] px-8 py-4 text-[15px] font-bold text-[#2A2118] transition-colors hover:bg-[#2A2118] hover:text-white"
            >
              症状自查 🩺
            </a>
          </div>
        </div>
      </section>

      {/* stats strip */}
      <section className="mx-auto max-w-[980px] px-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k} className="rounded-2xl border border-[#E5D9C8] bg-white px-5 py-5">
              <div className="text-[10.5px] font-semibold tracking-[0.12em] text-[#B09A82] uppercase">{s.k}</div>
              <div className="mt-2 font-serif text-[24px] font-bold leading-none text-[#E8703A]">{s.v}</div>
              <div className="mt-2 text-[11px] leading-relaxed text-[#8A7460]">{s.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* tool */}
      <section id="tool" className="mx-auto max-w-[980px] scroll-mt-16 px-5 pt-16">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#C2542A] uppercase">Live Demo</div>
          <h2 className="mt-4 font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-bold">
            来,给它出一期今日刊
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[14px] leading-[1.9] text-[#8A7460]">
            全部在你的浏览器里生成,不上传任何数据。同一个输入永远得到同一张报。
          </p>
        </div>
        <div className="mt-9">
          <PetTool />
        </div>
      </section>

      {/* viral loop */}
      <section className="mx-auto max-w-[980px] px-5 pt-20">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#C2542A] uppercase">Why It Spreads</div>
          <h2 className="mt-4 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            爆火不是运气,是设计出来的
          </h2>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {LOOP.map((c) => (
            <div key={c.k} className="rounded-[18px] border border-[#E5D9C8] bg-white p-7">
              <div className="text-[11px] font-bold tracking-[0.16em] text-[#E8703A]">{c.k}</div>
              <h3 className="mt-3 font-serif text-[18px] font-bold">{c.t}</h3>
              <p className="mt-3 text-[13px] leading-[2] text-[#6B5844]">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* vs competitors */}
      <section className="mx-auto max-w-[980px] px-5 pt-20">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#C2542A] uppercase">Why Us</div>
          <h2 className="mt-4 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            别人在卖硬件,我们在造仪式
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-[13.5px] leading-[1.9] text-[#8A7460]">
            全球宠物科技的钱都砸在项圈、摄像头、问诊上——纯软件、天天想打开、晒得出去的那张「小报」,至今没人做。
          </p>
        </div>
        <div className="mt-9 overflow-hidden rounded-[18px] border border-[#E5D9C8]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5D9C8] bg-[#F3EBDD]">
                <th className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#8A7460]">别人</th>
                <th className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#8A7460]">痛点</th>
                <th className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#C2542A]">毛孩日报</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.who} className="border-b border-[#EDE3D4] bg-white last:border-0">
                  <td className="px-5 py-4 text-[12.5px] font-semibold text-[#2A2118]">{r.who}</td>
                  <td className="px-5 py-4 text-[12px] leading-relaxed text-[#8A7460]">{r.weak}</td>
                  <td className="px-5 py-4 text-[12px] font-semibold leading-relaxed text-[#C2542A]">{r.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-24 border-t border-[#E5D9C8] bg-[#F3EBDD]">
        <div className="mx-auto max-w-[980px] px-5 py-12">
          <div className="text-center">
            <div className="font-serif text-[26px] font-bold tracking-[0.14em]">毛孩日报 · PetDaily</div>
            <p className="mt-3 text-[13px] leading-[1.9] text-[#8A7460]">
              每天一张,记录它陪你的一天。
              <br />
              演示版内容由规则引擎生成,仅供体验;症状自查提供就医时机建议,不构成医疗诊断。
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#E5D9C8] pt-6 text-[11px] text-[#B09A82] sm:flex-row">
            <span>全球竞品调研报告见仓库 docs/petdaily/(2026-10 · 覆盖美/中/欧/日/巴西/印度)</span>
            <span className="font-mono tracking-[0.12em]">PETDAILY · DEMO · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
