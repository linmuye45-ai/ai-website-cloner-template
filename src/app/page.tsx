import type { Metadata } from "next";
import { ReunionTool } from "@/components/reunion/tool";
import { PRICING } from "@/lib/reunion";

export const metadata: Metadata = {
  title: "同框 Reunion · 让没能同框的人,第一次合影",
  description:
    "跨时空全家福:让没能见面的亲人第一次合影,和年轻的爸妈同框,把散落各年的照片拼成一张全家福。情感影像新品类,全球市场空位。",
  keywords: ["全家福", "老照片", "AI合影", "同框", "Reunion", "纪念", "跨时空", "家人"],
};

const STATS = [
  { k: "数字来世市场", v: "$220 亿 → $800 亿", n: "2024 → 2034 预测(Hospice News)" },
  { k: "美图 2026H1 净利", v: "¥6.5 亿", n: "影像订阅付费 1844 万人 · 类目印钞实证" },
  { k: "Deep Nostalgia 首周", v: "1,000 万次", n: "老照片动起来,两周破千万(2021)" },
  { k: "线下全家福均价", v: "¥599+", n: "海马体/天真蓝——我们做到 1/15" },
];

const WHYS = [
  {
    k: "空 位",
    t: "老玩家集体退场,用户抱着「死链」",
    d: "MyHeritage 把 Deep Nostalgia 停了、继任者 DeepStory 2025 年也下线;HereAfter AI 2026 年 7 月关站;StoryFile 破产重组转 B 端。数以百万计的家庭,正找不到地方留住念想——这是品类级的空位。",
  },
  {
    k: "温 度",
    t: "只做合影,不做「对话幽灵」",
    d: "同是怀念,「和逝者聊天」被舆论骂 demonic(2wai 上线即遭围攻),而「一张合影」是温暖的、治疗性的。我们卡在「照片」这条安全的情感刻度上:动人,但不惊悚。",
  },
  {
    k: "复 购",
    t: "不是一锤子买卖,是家庭仪式",
    d: "妙鸭相机死于「一次拍完就走」。同框不同:清明、母亲节、中秋、圣诞、忌日、生日——一年七八个必须补一张的日子;再加上实体相框礼赠,把爆火变成年金。",
  },
];

const COMPARE = [
  { who: "MyHeritage / Ancestry", weak: "「家谱网站」心智,年费 $119–299,功能停了没人接手", us: "轻量情感入口,¥38 一张就走,年卡做档案" },
  { who: "Remini / Lensa", weak: "通用增强/头像工具,没有家庭叙事,用完即走", us: "场景化情绪仪式 + 时光相册留存" },
  { who: "griefbot 们(2wai/YOV)", weak: "对话式「复活」引发伦理反感与舆论反噬", us: "只做合影——温暖不越界,合规成本也低" },
  { who: "线下影楼(海马体等)", weak: "¥599+/套,要预约要出门,无法跨时空", us: "30 秒、¥38、随时补拍任何年代" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF4E9] text-[#3D2E1E]">
      {/* header */}
      <header className="no-print sticky top-0 z-40 border-b border-[#E4D5C3] bg-[#FAF4E9]/92 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#B23A2E] font-serif text-[13px] font-bold text-[#B23A2E]">框</span>
            <div className="leading-none">
              <div className="font-serif text-[17px] font-bold tracking-[0.22em]">同框</div>
              <div className="mt-0.5 text-[9px] font-semibold tracking-[0.32em] text-[#B09A82] uppercase">Reunion</div>
            </div>
          </div>
          <a
            href="#tool"
            className="rounded-full bg-[#A65B38] px-5 py-2 text-[13px] font-bold text-white transition-transform hover:scale-[1.05]"
          >
            免费生成一张 →
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#D9C6A8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 15%, black 15%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-[960px] px-5 pb-12 pt-16 text-center sm:pt-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E4D5C3] bg-white px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B23A2E]" />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#8A7460]">
              新兴细分 · 情感影像 × 家庭仪式
            </span>
          </div>
          <h1 className="mx-auto mt-7 max-w-[16ch] font-serif text-[clamp(2.5rem,7.5vw,4.8rem)] font-bold leading-[1.16]">
            让没能同框的人,
            <br />
            <span className="text-[#A65B38]">第一次合影</span>。
          </h1>
          <p className="mx-auto mt-6 max-w-[44ch] text-[15.5px] leading-[2.05] text-[#6B5844]">
            有些合影,迟到了几十年——爷爷没能见到孙女,爸妈年轻时没拍过婚纱,隔着大洋的家人年年说「下次」。
            <span className="font-semibold text-[#3D2E1E]">同框</span>把两张跨越时空的照片,合成一张温暖的全家福。
            30 秒生成,截图就能晒。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a
              href="#tool"
              className="rounded-full bg-[#A65B38] px-8 py-4 text-[15px] font-bold text-white shadow-[0_16px_34px_-12px_rgba(166,91,56,0.55)] transition-transform hover:scale-[1.03]"
            >
              生成一张「同框」🖼
            </a>
            <a
              href="#pricing"
              className="rounded-full border-2 border-[#3D2E1E] px-8 py-4 text-[15px] font-bold text-[#3D2E1E] transition-colors hover:bg-[#3D2E1E] hover:text-white"
            >
              看看多少钱
            </a>
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-[960px] px-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k} className="rounded-2xl border border-[#E4D5C3] bg-white px-5 py-5">
              <div className="text-[10.5px] font-semibold tracking-[0.12em] text-[#B09A82] uppercase">{s.k}</div>
              <div className="mt-2 font-serif text-[21px] font-bold leading-tight text-[#A65B38]">{s.v}</div>
              <div className="mt-2 text-[11px] leading-relaxed text-[#8A7460]">{s.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* tool */}
      <section id="tool" className="mx-auto max-w-[960px] scroll-mt-16 px-5 pt-16">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#A65B38] uppercase">Live Demo</div>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,4.2vw,2.6rem)] font-bold">
            来,补上那张迟到的合影
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[14px] leading-[1.9] text-[#8A7460]">
            照片只在你的浏览器里处理,不上传、不留存。四个场景,总有一个是你家的故事。
          </p>
        </div>
        <div className="mt-9">
          <ReunionTool />
        </div>
      </section>

      {/* why now */}
      <section className="mx-auto max-w-[960px] px-5 pt-24">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#A65B38] uppercase">Why Now</div>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold">
            为什么是现在,为什么是我们
          </h2>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {WHYS.map((c) => (
            <div key={c.k} className="rounded-[18px] border border-[#E4D5C3] bg-white p-7">
              <div className="inline-block rounded-full border border-[#A65B38] px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-[#A65B38]">
                {c.k}
              </div>
              <h3 className="mt-4 font-serif text-[18px] font-bold leading-relaxed">{c.t}</h3>
              <p className="mt-3 text-[13px] leading-[2] text-[#6B5844]">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="mx-auto max-w-[960px] scroll-mt-16 px-5 pt-24">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#A65B38] uppercase">Pricing</div>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold">
            比一顿火锅便宜的团圆
          </h2>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`rounded-[20px] border-2 p-7 ${
                p.highlight
                  ? "border-[#A65B38] bg-white shadow-[0_24px_60px_-24px_rgba(166,91,56,0.45)]"
                  : "border-[#E4D5C3] bg-white"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-serif text-[20px] font-bold">{p.name}</div>
                  <div className="mt-1 text-[10px] tracking-[0.3em] text-[#B09A82] uppercase">{p.en}</div>
                </div>
                {p.highlight && (
                  <span className="rounded-full bg-[#A65B38] px-3 py-1 text-[10px] font-bold text-white">
                    最多人选
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-serif text-[38px] font-bold leading-none text-[#A65B38]">{p.price}</span>
                <span className="text-[13px] text-[#B09A82]">{p.unit}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-[12.5px] leading-relaxed text-[#6B5844]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A65B38]" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-[11.5px] text-[#B09A82]">
          首次生成免费(带水印预览)· 所有 AI 生成内容按《AI生成合成内容标识办法》标注「AI 生成」
        </p>
      </section>

      {/* vs */}
      <section className="mx-auto max-w-[960px] px-5 pt-24">
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-[0.22em] text-[#A65B38] uppercase">Why Us</div>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,4vw,2.4rem)] font-bold">
            全球对照,一眼看清空位
          </h2>
        </div>
        <div className="mt-9 overflow-hidden rounded-[18px] border border-[#E4D5C3]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4D5C3] bg-[#F2E6D2]">
                <th className="px-5 py-3.5 text-[11.5px] font-semibold text-[#8A7460]">全球对手</th>
                <th className="px-5 py-3.5 text-[11.5px] font-semibold text-[#8A7460]">他们的问题</th>
                <th className="px-5 py-3.5 text-[11.5px] font-semibold text-[#A65B38]">同框</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.who} className="border-b border-[#EDE1D0] bg-white last:border-0">
                  <td className="px-5 py-4 text-[12.5px] font-semibold">{r.who}</td>
                  <td className="px-5 py-4 text-[12px] leading-relaxed text-[#8A7460]">{r.weak}</td>
                  <td className="px-5 py-4 text-[12px] font-semibold leading-relaxed text-[#A65B38]">{r.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-24 border-t border-[#E4D5C3] bg-[#F2E6D2]">
        <div className="mx-auto max-w-[960px] px-5 py-12">
          <div className="text-center">
            <div className="font-serif text-[26px] font-bold tracking-[0.3em]">同框 · REUNION</div>
            <p className="mt-3 text-[13px] leading-[1.95] text-[#8A7460]">
              有些合影,等了几十年。今天补上。
              <br />
              演示版为排版合成示例;正式版提供生成式影像融合,带「AI 生成」显式与隐式标识,需照片授权确认。
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#E0CFB4] pt-6 text-[11px] text-[#B09A82] sm:flex-row">
            <span>
              全球竞品调研与「一年净利过亿」计划见 docs/reunion/ · 旧作:
              <a href="./petdaily/index.html" className="underline hover:text-[#A65B38]">毛孩日报</a> /
              <a href="./landed/index.html" className="underline hover:text-[#A65B38]">到岸</a>
            </span>
            <span className="font-mono tracking-[0.12em]">REUNION · DEMO · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
