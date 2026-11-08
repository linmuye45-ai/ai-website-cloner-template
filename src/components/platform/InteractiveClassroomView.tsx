"use client";

import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw, Send, Volume2 } from "lucide-react";
import { UI_COPY } from "@/lib/i18n-ui";
import type {
  ClassroomTurn,
  CoursePack,
  WhiteLabelConfig,
} from "@/types/platform";

interface InteractiveClassroomViewProps {
  brand: WhiteLabelConfig;
  selectedCourse: CoursePack;
}

export function InteractiveClassroomView({
  brand,
  selectedCourse,
}: InteractiveClassroomViewProps) {
  const t = UI_COPY[brand.locale].seminar;
  const baseTurns = selectedCourse.classroomTurns;
  const [visibleCount, setVisibleCount] = useState<number>(2);
  const [approxMode, setApproxMode] = useState<"left" | "right" | "trap">(
    "left"
  );
  const [partitions, setPartitions] = useState<number>(6);
  const [interjections, setInterjections] = useState<ClassroomTurn[]>([]);
  const [studentInput, setStudentInput] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [gateAnswers, setGateAnswers] = useState<Record<string, number>>({});

  // Exact integral of f(x) = 0.25*x^2 + 0.5 on [0, 4] = 22/3 = 7.3333
  const exactValue = 7.3333;

  // Precision SVG geometry on [0, 4] mapped to SVG [40..510] x [180..24]
  const svgGeometry = useMemo(() => {
    const xMin = 40;
    const xMax = 510;
    const yBase = 182;
    const yTop = 24;
    const f = (x: number) => 0.25 * x * x + 0.5;
    const maxY = f(4); // 4.5

    const mapX = (x: number) => xMin + (x / 4) * (xMax - xMin);
    const mapY = (y: number) => yBase - (y / maxY) * (yBase - yTop);

    // Smooth curve path
    const curveSamples: string[] = [];
    for (let s = 0; s <= 40; s += 1) {
      const xv = (s / 40) * 4;
      const px = mapX(xv).toFixed(1);
      const py = mapY(f(xv)).toFixed(1);
      curveSamples.push(`${s === 0 ? "M" : "L"} ${px} ${py}`);
    }
    const curvePath = curveSamples.join(" ");
    const areaPath = `${curvePath} L ${xMax} ${yBase} L ${xMin} ${yBase} Z`;

    const dx = 4 / partitions;
    let sum = 0;
    const shapes: Array<{ path: string; key: number }> = [];

    for (let i = 0; i < partitions; i += 1) {
      const x0 = i * dx;
      const x1 = x0 + dx;
      const sx0 = mapX(x0);
      const sx1 = mapX(x1);

      if (approxMode === "trap") {
        const y0 = f(x0);
        const y1 = f(x1);
        sum += 0.5 * (y0 + y1) * dx;
        shapes.push({
          key: i,
          path: `M ${sx0.toFixed(1)} ${yBase} L ${sx0.toFixed(1)} ${mapY(
            y0
          ).toFixed(1)} L ${sx1.toFixed(1)} ${mapY(y1).toFixed(
            1
          )} L ${sx1.toFixed(1)} ${yBase} Z`,
        });
      } else {
        const yh = approxMode === "left" ? f(x0) : f(x1);
        sum += yh * dx;
        const sy = mapY(yh);
        shapes.push({
          key: i,
          path: `M ${sx0.toFixed(1)} ${yBase} L ${sx0.toFixed(
            1
          )} ${sy.toFixed(1)} L ${sx1.toFixed(1)} ${sy.toFixed(
            1
          )} L ${sx1.toFixed(1)} ${yBase} Z`,
        });
      }
    }

    return { approxValue: sum, curvePath, areaPath, shapes, xMin, xMax, yBase };
  }, [approxMode, partitions]);

  const displayedBase = baseTurns.slice(0, visibleCount);
  const allTurns = [...displayedBase, ...interjections];
  const activeTurn = allTurns[allTurns.length - 1] ?? baseTurns[0];

  const handleInterject = () => {
    const q = studentInput.trim();
    if (!q) return;
    const sec = selectedCourse.sections[0];
    const userLabel = {
      zh: "提问",
      en: "Learner",
      ja: "受講生",
      es: "Alumno",
    }[brand.locale];

    const userTurn: ClassroomTurn = {
      id: `u-${Date.now()}`,
      speaker: "peer",
      speakerName: userLabel,
      roleBadge: selectedCourse.code,
      content: q,
      boardHighlight: sec
        ? `p.${sec.pageNumber} · ${sec.keyFormulaOrRule}`
        : selectedCourse.title,
    };

    const replyMap = {
      zh: `针对「${q}」：先核查单调性与二阶导符号（${sec?.keyFormulaOrRule ?? ""}），即可严格判定近似误差方向（${sec?.commonTrap ?? ""}）。`,
      en: `On "${q}": verify monotonicity and concavity first (${sec?.keyFormulaOrRule ?? ""}) to prove the exact error sign (${sec?.commonTrap ?? ""}).`,
      ja: `「${q}」について：単調性と凹凸（${sec?.keyFormulaOrRule ?? ""}）を先に確認することで誤差の符号を厳密に特定できます（${sec?.commonTrap ?? ""}）。`,
      es: `Sobre "${q}": verifique monotonía y concavidad primero (${sec?.keyFormulaOrRule ?? ""}) para demostrar el signo del error (${sec?.commonTrap ?? ""}).`,
    }[brand.locale];

    const replyTurn: ClassroomTurn = {
      id: `r-${Date.now() + 1}`,
      speaker: "lecturer",
      speakerName: brand.tutorName,
      roleBadge: selectedCourse.code,
      content: replyMap,
      boardHighlight: sec ? `${sec.sectionCode} · ${sec.keyFormulaOrRule}` : "",
    };

    setInterjections((prev) => [...prev, userTurn, replyTurn]);
    setStudentInput("");
  };

  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const script = selectedCourse.podcastLines.map((s) => s.text).join(" ");
    const utter = new SpeechSynthesisUtterance(
      script || activeTurn?.content || ""
    );
    utter.lang = selectedCourse.speechLang || "zh-CN";
    utter.rate = 1.04;
    utter.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleCopyTranscript = async () => {
    const script = selectedCourse.podcastLines
      .map((s) => `${s.hostName}: ${s.text}`)
      .join("\n");
    await navigator.clipboard.writeText(script);
    setCopiedScript(true);
    window.setTimeout(() => setCopiedScript(false), 1800);
  };

  const errorDelta = svgGeometry.approxValue - exactValue;

  return (
    <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left: Precision SVG Mathematical Geometry Slate */}
        <div className="surface-elevated space-y-5 rounded-xl border border-border p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h1 className="text-base font-semibold text-foreground">
                {t.boardTitle}
              </h1>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {selectedCourse.code} · f(x) = 0.25x² + 0.5, x ∈ [0, 4]
              </p>
            </div>

            <div className="inline-flex rounded-full border border-border bg-muted/60 p-0.5 text-xs">
              {(
                [
                  { id: "left", label: t.leftSum },
                  { id: "right", label: t.rightSum },
                  { id: "trap", label: t.trapezoid },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setApproxMode(m.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                    approxMode === m.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric Telemetry Readout */}
          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-muted/25 text-xs">
            <div className="px-4 py-3">
              <div className="text-[11px] text-muted-foreground">
                {t.exactIntegral}
              </div>
              <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
                {exactValue.toFixed(3)}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[11px] text-muted-foreground">
                {t.approxArea} (n={partitions})
              </div>
              <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-brand">
                {svgGeometry.approxValue.toFixed(3)}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[11px] text-muted-foreground">
                {t.boundDirection}
              </div>
              <div className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                {errorDelta < 0 ? t.underestimate : t.overestimate} (
                {errorDelta >= 0 ? "+" : ""}
                {errorDelta.toFixed(3)})
              </div>
            </div>
          </div>

          {/* Bespoke Mathematical Coordinate SVG */}
          <div className="rounded-lg border border-border bg-background p-4">
            <svg
              viewBox="0 0 540 205"
              className="h-52 w-full overflow-visible"
              role="img"
              aria-label="Riemann and trapezoidal integration plot"
            >
              {/* Horizontal Grid Lines */}
              {[50, 95, 140].map((gy) => (
                <line
                  key={gy}
                  x1={svgGeometry.xMin}
                  y1={gy}
                  x2={svgGeometry.xMax}
                  y2={gy}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Shaded True Area */}
              <path
                d={svgGeometry.areaPath}
                fill="var(--indigo-signal)"
                fillOpacity="0.08"
              />

              {/* Partition Rectangles / Trapezoids */}
              {svgGeometry.shapes.map((sh) => (
                <path
                  key={sh.key}
                  d={sh.path}
                  fill="var(--brand)"
                  fillOpacity="0.2"
                  stroke="var(--brand)"
                  strokeWidth="1.25"
                />
              ))}

              {/* True Smooth Curve f(x) */}
              <path
                d={svgGeometry.curvePath}
                fill="none"
                stroke="var(--indigo-signal)"
                strokeWidth="2.4"
              />

              {/* Axes */}
              <line
                x1={svgGeometry.xMin}
                y1={svgGeometry.yBase}
                x2={svgGeometry.xMax}
                y2={svgGeometry.yBase}
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
              <line
                x1={svgGeometry.xMin}
                y1="18"
                x2={svgGeometry.xMin}
                y2={svgGeometry.yBase}
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />

              {/* X-Axis Labels */}
              {[0, 1, 2, 3, 4].map((tick) => {
                const tx =
                  svgGeometry.xMin +
                  (tick / 4) * (svgGeometry.xMax - svgGeometry.xMin);
                return (
                  <text
                    key={tick}
                    x={tx}
                    y="198"
                    textAnchor="middle"
                    fill="currentColor"
                    fillOpacity="0.6"
                    className="font-mono text-[10px]"
                  >
                    x={tick}
                  </text>
                );
              })}
            </svg>

            <div className="mt-2 flex items-center justify-between gap-4 border-t border-border/70 pt-3 text-xs">
              <span className="font-mono text-muted-foreground">
                Partitions n = {partitions}
              </span>
              <input
                type="range"
                min={3}
                max={16}
                value={partitions}
                onChange={(e) => setPartitions(Number(e.target.value))}
                aria-label="Partition count"
                className="w-48 accent-foreground"
              />
            </div>
          </div>

          {activeTurn?.boardHighlight && (
            <div className="diff-row-add rounded-lg p-3.5 font-mono text-xs leading-relaxed">
              {activeTurn.boardHighlight}
            </div>
          )}

          {/* Review Audio Studio */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/25 p-4 text-xs">
            <div>
              <div className="font-semibold text-foreground">{t.audioTitle}</div>
              <div className="text-[11px] text-muted-foreground">
                {t.audioSub}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background"
              >
                <Volume2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>{isSpeaking ? t.stopAudio : t.playAudio}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyTranscript}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-muted"
              >
                {copiedScript ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-brand" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t.copyTranscript}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Multi-Role Seminar Stream */}
        <div className="surface-elevated flex h-[670px] flex-col overflow-hidden rounded-xl border border-border lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3 text-xs">
            <span className="font-semibold text-foreground">
              {t.dialogueTitle}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => Math.min(prev + 1, baseTurns.length))
                }
                disabled={visibleCount >= baseTurns.length}
                className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background disabled:opacity-40"
              >
                {t.nextTurnBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibleCount(1);
                  setInterjections([]);
                }}
                aria-label={t.resetBtn}
                className="rounded-full border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {allTurns.map((turn) => {
              const cp = turn.checkpointQuestion;
              const chosen = gateAnswers[turn.id];
              return (
                <div
                  key={turn.id}
                  className="space-y-2.5 rounded-xl border border-border bg-muted/25 p-4 text-[13px] text-foreground"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold">{turn.speakerName}</span>
                    <span className="font-mono text-muted-foreground">
                      {turn.roleBadge}
                    </span>
                  </div>
                  <p className="leading-relaxed text-pretty">{turn.content}</p>

                  {cp && (
                    <div className="mt-2 space-y-2 rounded-lg border border-border bg-card p-3.5 text-xs">
                      <div className="font-mono text-[10px] font-semibold uppercase text-brand">
                        {t.gateLabel}
                      </div>
                      <div className="font-medium text-foreground">
                        {cp.prompt}
                      </div>
                      <div className="space-y-1.5">
                        {cp.options.map((opt, idx) => {
                          const answered = chosen !== undefined;
                          const right = idx === cp.correctIndex;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setGateAnswers((prev) => ({
                                  ...prev,
                                  [turn.id]: idx,
                                }))
                              }
                              className={`w-full rounded-md border px-3 py-2 text-left ${
                                answered && right
                                  ? "diff-row-add border-brand font-medium"
                                  : chosen === idx && !right
                                  ? "diff-row-del border-destructive"
                                  : "border-border bg-background hover:bg-muted/30"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {chosen !== undefined && (
                        <p className="text-[11px] text-muted-foreground">
                          {t.explanationPrefix}
                          {cp.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-border bg-card p-3.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleInterject();
                  }
                }}
                placeholder={t.interruptPlaceholder}
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-[13px] text-foreground focus:border-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleInterject}
                disabled={!studentInput.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>{t.interruptBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
