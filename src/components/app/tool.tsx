"use client";

import { useEffect, useRef, useState } from "react";
import { generateSheet, GEN_STEPS, type Sheet } from "@/lib/landed";

type Phase = "idle" | "working" | "done";

const DESTINATIONS = ["亚利桑那仓(美西)", "新泽西 FBA(美东)", "自提(港口交货)"];

export function Tool() {
  const [description, setDescription] = useState(
    "3,000 个不锈钢宠物碗,印我 logo,发到亚利桑那的仓",
  );
  const [quantity, setQuantity] = useState(3000);
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [currentCost, setCurrentCost] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("working");
    setStep(0);
    setSheet(null);

    GEN_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), 380 * (i + 1)));
    });

    timers.current.push(
      setTimeout(() => {
        const cc = parseFloat(currentCost);
        setSheet(
          generateSheet({
            description,
            quantity,
            destination,
            currentCost: Number.isFinite(cc) && cc > 0 ? cc : undefined,
          }),
        );
        setPhase("done");
        timers.current.push(
          setTimeout(
            () => sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            80,
          ),
        );
      }, 380 * GEN_STEPS.length + 350),
    );
  }

  return (
    <div className="w-full">
      {/* ── 输入卡 ── */}
      <div className="no-print rounded-2xl border border-line bg-ink-2/80 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:p-9">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-mint" />
          <p className="label-mono text-mint">第一步 · 说一句话</p>
        </div>

        <label className="mt-6 block">
          <span className="text-[14px] text-muted-ink">你想进什么货?</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="例:5,000 件硅胶婴儿餐垫,要合规,到新泽西"
            className="mt-2.5 w-full resize-none rounded-xl border border-line bg-panel/60 px-4 py-3.5 font-mono text-[14px] leading-relaxed text-paper outline-none transition-colors placeholder:text-muted-ink/50 focus:border-gold/50"
          />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="text-[13px] text-muted-ink">数量(件)</span>
            <input
              type="number"
              min={100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="mt-2 w-full rounded-xl border border-line bg-panel/60 px-4 py-3 font-mono text-[14px] text-paper outline-none focus:border-gold/50"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-ink">发到哪</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-panel/60 px-4 py-3 text-[13.5px] text-paper outline-none focus:border-gold/50"
            >
              {DESTINATIONS.map((d) => (
                <option key={d} value={d} className="bg-panel">
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-ink">
              你现在每件到手成本(可不填)
            </span>
            <input
              type="number"
              step="0.01"
              min={0}
              value={currentCost}
              onChange={(e) => setCurrentCost(e.target.value)}
              placeholder="如 5.66"
              className="mt-2 w-full rounded-xl border border-line bg-panel/60 px-4 py-3 font-mono text-[14px] text-paper outline-none placeholder:text-muted-ink/50 focus:border-gold/50"
            />
          </label>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            onClick={run}
            disabled={phase === "working"}
            className="glow-gold rounded-full bg-gold px-8 py-3.5 text-[15px] font-medium text-ink transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
          >
            {phase === "working" ? "正在生成…" : "生成到岸表 →"}
          </button>
          {phase === "done" && (
            <>
              <button
                onClick={run}
                className="rounded-full border border-line-strong px-6 py-3.5 text-[14px] text-paper hover:border-gold/50"
              >
                再来一张
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-full border border-line-strong px-6 py-3.5 text-[14px] text-paper hover:border-gold/50"
              >
                打印 / 存成 PDF
              </button>
            </>
          )}
          <span className="text-[11.5px] text-muted-ink/70">
            演示版:数据为模拟,计算规则与真实一致(到手价 = 报价 × (1+税率) + 运保杂)
          </span>
        </div>
      </div>

      {/* ── 生成过程 ── */}
      {phase === "working" && (
        <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/[0.04] p-7">
          {GEN_STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3.5 py-2 text-[13.5px] transition-opacity duration-300 ${
                i < step ? "opacity-100" : "opacity-30"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  i < step ? "bg-gold text-ink" : "border border-line-strong text-muted-ink"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={i < step ? "text-paper" : "text-muted-ink"}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── 到岸表 ── */}
      {phase === "done" && sheet && (
        <div ref={sheetRef} className="print-sheet mt-8">
          {/* 表头 */}
          <div className="rounded-t-2xl border border-line bg-panel/70 px-7 py-6">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <h3 className="text-[20px] font-semibold tracking-tight text-paper">
                到岸表 · {sheet.category}
              </h3>
              <span className="font-mono text-[12px] text-gold-2">HTS {sheet.hts}</span>
              <span className="text-[12px] text-muted-ink">
                {sheet.quantity.toLocaleString()} 件 · {sheet.destination}
              </span>
              <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                5 家经核验工厂 · 3 个国家
              </span>
            </div>
            <p className="mt-2 text-[11.5px] text-muted-ink/80">
              税费口径:基础税率 + 对华 301 + §122(15%,2026 年)·
              运保杂含运费/保险/港杂/内陆 · 由 Landed 演示版生成
            </p>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto border-x border-line">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-panel/50">
                  {["工厂 · 自证", "FOB 单价", "MOQ", "交期", "税费(基础+301+122)", "运保杂/件", "到手/件", "合规", "过往记录"].map(
                    (h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-4 py-3.5 text-[11px] font-medium tracking-[0.1em] text-muted-ink/70 uppercase"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((r, i) => (
                  <tr
                    key={r.name + i}
                    className={`border-b border-line last:border-0 ${
                      r.best ? "bg-gold/[0.07]" : "hover:bg-panel/40"
                    }`}
                  >
                    <td className="relative px-4 py-4">
                      {r.best && <span className="absolute inset-y-0 left-0 w-[3px] bg-gold" />}
                      <div className="text-[13px] font-medium text-paper">
                        {r.name}
                        {r.best && (
                          <span className="ml-2 rounded-full bg-gold px-2 py-0.5 font-mono text-[10px] text-ink">
                            最优
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-ink/80">{r.meta}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[13px] text-paper">${r.fob.toFixed(2)}</td>
                    <td className="px-4 py-4 font-mono text-[12.5px] text-muted-ink">
                      {r.moq.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-mono text-[12.5px] text-muted-ink">{r.lead} 天</td>
                    <td className="px-4 py-4">
                      <div className="font-mono text-[12px] text-muted-ink">{r.dutyParts}</div>
                      <div className="mt-0.5 font-mono text-[12.5px] text-gold-2">= {r.dutyPct}%</div>
                    </td>
                    <td
                      className={`px-4 py-4 font-mono text-[12px] ${
                        r.trackTone === "warn" ? "text-rose" : "text-muted-ink"
                      }`}
                    >
                      ${r.freight.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className={`font-mono text-[16px] font-medium ${
                          r.best ? "text-gold-2" : "text-paper"
                        }`}
                      >
                        ${r.landed.toFixed(2)}
                      </div>
                      {r.best && (
                        <div className="mt-1 text-[11px] text-mint">
                          较现供应商 −{sheet.savingsPct}%
                        </div>
                      )}
                    </td>
                    <td
                      className={`px-4 py-4 text-[11.5px] ${
                        r.complianceTone === "warn" ? "text-rose" : "text-muted-ink"
                      }`}
                    >
                      {r.compliance}
                    </td>
                    <td
                      className={`px-4 py-4 text-[11.5px] ${
                        r.trackTone === "warn"
                          ? "text-rose"
                          : r.trackTone === "fresh"
                            ? "text-sea"
                            : "text-mint"
                      }`}
                    >
                      {r.track}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 结论 */}
          <div className="rounded-b-2xl border border-gold/25 bg-gold/[0.06] px-7 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[15px] leading-relaxed text-paper">
                  最优组合到手成本{" "}
                  <span className="font-mono text-[19px] text-gold-2">
                    ${sheet.rows[sheet.bestIndex].landed.toFixed(2)}/件
                  </span>
                  {sheet.currentIsEstimated ? (
                    <>
                      {" "}· 按行业均值估算,你现供应商约{" "}
                      <span className="font-mono">${sheet.currentCost.toFixed(2)}/件</span>
                    </>
                  ) : (
                    <>
                      {" "}· 你填的现成本{" "}
                      <span className="font-mono">${sheet.currentCost.toFixed(2)}/件</span>
                    </>
                  )}
                  ,{sheet.quantity.toLocaleString()} 件
                  <span className="text-mint">
                    {" "}
                    省 ${sheet.savingsTotal.toLocaleString()}({sheet.savingsPct}%)
                  </span>
                  。
                </div>
                <div className="mt-2 text-[12px] text-muted-ink">
                  Landed 服务费 {sheet.feePct}%,单独列示、不进上表 · 定金托管 ·
                  第三方验货合格才放款 · 省不到 15% 我们直接劝你别换
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 px-2 text-[11px] leading-[1.8] text-muted-ink/70">
            免责声明:本表由演示版生成,工厂名称与数据为模拟,仅供展示计算逻辑;真实版本将接入核验工厂库、
            报关行复核与实时询价。税费规则(基础税率 + 301 + §122)按 2026 年 10 月口径演示,实际以报关行复核为准。
          </p>
        </div>
      )}
    </div>
  );
}
