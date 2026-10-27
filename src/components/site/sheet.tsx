"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./reveal";
import { SectionHead } from "./sections";

const PROMPTS = [
  "3,000 个不锈钢宠物碗,印我 logo,发到亚利桑那的仓",
  "5,000 件硅胶婴儿餐垫,要 CPSC 合规,到新泽西",
  "10,000 个蓝牙音箱,FCC 认证,走亚马逊 FBA 头程",
];

type Row = {
  factory: string;
  meta: string;
  fob: string;
  moq: string;
  lead: string;
  duty: string;
  dutyPct: string;
  freight: string;
  landed: string;
  compliance: string;
  complianceTone: "ok" | "warn";
  track: string;
  trackTone: "ok" | "fresh" | "warn";
  best?: boolean;
};

const ROWS: Row[] = [
  {
    factory: "宁波恒星金属制品",
    meta: "中国 · 工厂 · 自证:营业执照 + 验厂报告",
    fob: "$2.85",
    moq: "1,000",
    lead: "32 天",
    duty: "2% + 25% + 15%",
    dutyPct: "42%",
    freight: "$0.42",
    landed: "$4.47",
    compliance: "FDA 食品接触 ✓ · Prop 65 警示语",
    complianceTone: "ok",
    track: "准时 96% · 不良 1.2%",
    trackTone: "ok",
  },
  {
    factory: "东莞骏丰餐厨",
    meta: "中国 · 工厂 · 自证:营业执照(新厂房)",
    fob: "$2.72",
    moq: "3,000",
    lead: "38 天",
    duty: "2% + 25% + 15%",
    dutyPct: "42%",
    freight: "$0.42",
    landed: "$4.28",
    compliance: "FDA ✓ · Prop 65 ✓",
    complianceTone: "ok",
    track: "首单 · 无记录(诚实标注)",
    trackTone: "fresh",
  },
  {
    factory: "Sông Hồng Metal",
    meta: "越南 · 工厂 · 自证:原产地证 + 验厂报告",
    fob: "$3.05",
    moq: "1,000",
    lead: "28 天",
    duty: "2% + 0% + 15%",
    dutyPct: "17%",
    freight: "$0.33",
    landed: "$3.90",
    compliance: "FDA ✓ · CPSC 不适用",
    complianceTone: "ok",
    track: "准时 91% · 不良 2.4%",
    trackTone: "ok",
    best: true,
  },
  {
    factory: "Inox Home · 浦那",
    meta: "印度 · 工厂 · 自证:营业执照 + BIS",
    fob: "$3.15",
    moq: "2,000",
    lead: "35 天",
    duty: "2% + 0% + 15%",
    dutyPct: "17%",
    freight: "$0.38",
    landed: "$4.07",
    compliance: "FDA ✓ · Prop 65 警示语",
    complianceTone: "ok",
    track: "首单 · 无记录",
    trackTone: "fresh",
  },
  {
    factory: "深圳某贸易商",
    meta: "中国 · 贸易商 · 自证:未提供 ⚠",
    fob: "$2.60",
    moq: "500",
    lead: "25 天",
    duty: "2% + 25% + 15%",
    dutyPct: "42%",
    freight: "$0.30 ⚠ 港杂未列",
    landed: "$3.99 ⚠",
    compliance: "未提供证据 ⚠",
    complianceTone: "warn",
    track: "不透明 ⚠",
    trackTone: "warn",
  },
];

function TypingPrompt() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing",
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const full = PROMPTS[idx % PROMPTS.length];

    if (phase === "typing") {
      if (text.length < full.length) {
        timer = setTimeout(
          () => setText(full.slice(0, text.length + 1)),
          42 + Math.random() * 40,
        );
      } else {
        timer = setTimeout(() => setPhase("holding"), 300);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), 2600);
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 18);
      } else {
        timer = setTimeout(() => {
          setIdx((i) => i + 1);
          setPhase("typing");
        }, 0);
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, idx]);

  return (
    <div className="rounded-xl border border-gold/25 bg-gold/[0.05] px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="label-mono mt-[5px] shrink-0 text-gold/80">
          输入
        </span>
        <p className="font-mono text-[14px] leading-[1.7] text-paper">
          {text}
          <span className="animate-caret ml-0.5 inline-block h-[15px] w-[8px] translate-y-[2px] bg-gold" />
        </p>
      </div>
    </div>
  );
}

const toneClass = {
  ok: "text-mint",
  fresh: "text-sea",
  warn: "text-rose",
} as const;

export function Sheet() {
  return (
    <section id="sheet" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHead
            eyebrow="THE LANDED SHEET · 到岸表"
            title={
              <>
                一个凤凰城小卖家的
                <br />
                真实问题
              </>
            }
            sub={
              <>
                Shopify 卖家 Sarah · 3,000 个不锈钢宠物碗 · 印 logo ·
                送到亚利桑那的仓。她的供应商报价单上没有关税栈、没有合规、没有「货到了算谁的」。
                她发来一句话,48 小时后收到这张表。
              </>
            }
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 rounded-2xl border border-line bg-ink-2/80 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] sm:p-6">
            <TypingPrompt />

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
              <span className="label-mono text-muted-ink/70">
                到岸表 #1 · 48h 交付
              </span>
              <span className="text-[12px] text-muted-ink">
                HTS 7323.93(不锈钢餐桌厨房具)· 报关行已复核
              </span>
              <span className="text-[12px] text-muted-ink">
                原产国:中国 / 越南 / 印度 · 目的地:亚利桑那仓
              </span>
              <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                5 家经核验工厂 · 2–3 个国家
              </span>
            </div>

            {/* table */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[1120px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-panel/70">
                    {[
                      "工厂 · 自证",
                      "FOB 单价",
                      "MOQ",
                      "交期",
                      "关税栈 MFN + 301 + §122",
                      "运保杂/件",
                      "到仓/件",
                      "合规",
                      "履约记录",
                    ].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-4 py-3.5 text-[11px] font-medium tracking-[0.12em] text-muted-ink/70 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr
                      key={r.factory}
                      className={`border-b border-line last:border-0 transition-colors ${
                        r.best
                          ? "bg-gold/[0.07] hover:bg-gold/[0.1]"
                          : "hover:bg-panel/50"
                      }`}
                    >
                      <td className="relative px-4 py-4">
                        {r.best && (
                          <span className="absolute inset-y-0 left-0 w-[3px] bg-gold" />
                        )}
                        <div className="text-[13.5px] font-medium text-paper">
                          {r.factory}
                          {r.best && (
                            <span className="ml-2 rounded-full bg-gold px-2 py-0.5 font-mono text-[10px] tracking-wider text-ink">
                              最优
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[11.5px] text-muted-ink/80">
                          {r.meta}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-[13.5px] text-paper">
                        {r.fob}
                      </td>
                      <td className="px-4 py-4 font-mono text-[13px] text-muted-ink">
                        {r.moq}
                      </td>
                      <td className="px-4 py-4 font-mono text-[13px] text-muted-ink">
                        {r.lead}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-[12.5px] text-muted-ink">
                          {r.duty}
                        </div>
                        <div className="mt-0.5 font-mono text-[13px] text-gold-2">
                          = {r.dutyPct}
                        </div>
                      </td>
                      <td
                        className={`px-4 py-4 font-mono text-[12.5px] ${
                          r.trackTone === "warn"
                            ? "text-rose"
                            : "text-muted-ink"
                        }`}
                      >
                        {r.freight}
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`font-mono text-[17px] font-medium ${
                            r.best ? "text-gold-2" : "text-paper"
                          }`}
                        >
                          {r.landed}
                        </div>
                        {r.best && (
                          <div className="mt-1 text-[11px] text-mint">
                            较现供应商 −31%
                          </div>
                        )}
                      </td>
                      <td
                        className={`px-4 py-4 text-[12px] ${
                          r.complianceTone === "warn"
                            ? "text-rose"
                            : "text-muted-ink"
                        }`}
                      >
                        {r.compliance}
                      </td>
                      <td
                        className={`px-4 py-4 text-[12px] ${toneClass[r.trackTone]}`}
                      >
                        {r.track}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* verdict bar */}
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-gold/25 bg-gold/[0.06] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[15px] leading-relaxed text-paper">
                  最优组合到仓成本{" "}
                  <span className="font-mono text-[19px] text-gold-2">
                    $3.90/件
                  </span>
                  (越南)· 你现在的供应商折算{" "}
                  <span className="font-mono">$5.66/件</span>——3,000 件
                  <span className="text-mint"> 省 $5,280(−31%)</span>。
                </div>
                <div className="mt-2 text-[12px] text-muted-ink">
                  Landed 服务费 6%,单独列示,不进上表数字 · 定金托管 ·
                  第三方验货合格才放款 · 省不到 15% 我们直接劝你别换
                </div>
              </div>
              <a
                href="./app/index.html"
                className="shrink-0 rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                自己生成一张 →
              </a>
              <a
                href="#ladder"
                className="shrink-0 rounded-full border border-line-strong px-6 py-3 text-[14px] text-paper hover:border-gold/50"
              >
                这张表如何变成 $100B →
              </a>
            </div>
          </div>
        </Reveal>

        {/* three promises */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              k: "一句话输入",
              t: "买家不需要懂贸易",
              d: "链接或照片 + 数量。HTS 归类、关税栈、合规清单、工厂核验——全部是代理的桌面劳动。",
            },
            {
              k: "48 小时交付",
              t: "两周询价 → 两天",
              d: "多语言代理同时在微信和 WhatsApp 上向 3 个国家的工厂询价、核验、砍价。",
            },
            {
              k: "11 列全口径",
              t: "买家唯一关心的数字",
              d: "到仓每件成本。关税逐项列示,风险逐条标注,履约记录初期为空也诚实标注。",
            },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 90}>
              <div className="h-full rounded-2xl border border-line bg-panel/40 p-7">
                <div className="label-mono text-gold">{c.k}</div>
                <h3 className="mt-3 text-[17px] font-semibold tracking-tight">
                  {c.t}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.9] text-muted-ink">
                  {c.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
