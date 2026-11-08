"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eraser,
  FileCode2,
  FileText,
  Loader2,
  Lock,
  PenLine,
  Plus,
  Send,
  ShieldCheck,
  Volume2,
  X,
} from "lucide-react";
import { UI_COPY } from "@/lib/i18n-ui";
import { generateTutorReply } from "@/lib/tutor-engine";
import type {
  CoursePack,
  DocumentSection,
  GatewayConfig,
  ProofOfMasteryRecord,
  TutorChatMessage,
  TutorMode,
  WhiteLabelConfig,
} from "@/types/platform";

interface ImmersiveTutorViewProps {
  brand: WhiteLabelConfig;
  selectedCourse: CoursePack;
  customSections: DocumentSection[];
  onAddCustomSection: (section: DocumentSection) => void;
  gateway: GatewayConfig;
  onRecordMemoryNote: (
    action: string,
    evidence: string,
    sourceRef: string
  ) => void;
  onMintProof: (proof: ProofOfMasteryRecord) => void;
}

function computeProofHash(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `0x${hex.slice(0, 4)}…${hex.slice(4)}`;
}

export function ImmersiveTutorView({
  brand,
  selectedCourse,
  customSections,
  onAddCustomSection,
  gateway,
  onRecordMemoryNote,
  onMintProof,
}: ImmersiveTutorViewProps) {
  const t = UI_COPY[brand.locale].workbench;
  const allSections = [...customSections, ...selectedCourse.sections];
  const [activeSectionId, setActiveSectionId] = useState<string>(
    allSections[0]?.id ?? ""
  );
  const activeSection =
    allSections.find((s) => s.id === activeSectionId) ?? allSections[0];

  const [centerTab, setCenterTab] = useState<"source" | "scratchpad" | "blind">(
    "source"
  );
  const [tutorMode, setTutorMode] = useState<TutorMode>("socratic");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRule, setNewRule] = useState("");
  const [newBody, setNewBody] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Interactive HTML5 Scratchpad + Ink Color
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [inkChoice, setInkChoice] = useState<"ink" | "emerald" | "indigo">(
    "emerald"
  );
  const [stepLines, setStepLines] = useState<string>(
    "Verify continuous domain on [a, b]\nInvert polarity across critical boundary -> sign unchanged\nApply governing rubric bound directly"
  );
  const [audited, setAudited] = useState<boolean>(true);

  // Closed-Book Blind Mastery Gate
  const [gateRunning, setGateRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [gateVariantIdx, setGateVariantIdx] = useState(0);
  const [gatePicked, setGatePicked] = useState<number | null>(null);
  const [mintedHash, setMintedHash] = useState<string | null>(null);

  const gateQuestion =
    selectedCourse.defaultVariants[
      gateVariantIdx % Math.max(1, selectedCourse.defaultVariants.length)
    ];

  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: "init-msg",
      role: "assistant",
      mode: "socratic",
      timestamp: "00:00",
      content: t.tutorWelcome(
        brand.brandName,
        brand.tutorName,
        selectedCourse.title
      ),
      citations: activeSection
        ? [
            {
              sectionId: activeSection.id,
              pageNumber: activeSection.pageNumber,
              sectionCode: activeSection.sectionCode,
              title: activeSection.title,
              snippet: activeSection.keyFormulaOrRule,
            },
          ]
        : [],
      followUpSuggestions: selectedCourse.starterPrompts,
    },
  ]);

  useEffect(() => {
    if (!gateRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setGateRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gateRunning]);

  const resolveStrokeColor = (canvas: HTMLCanvasElement) => {
    if (inkChoice === "emerald") return "#2ea043";
    if (inkChoice === "indigo") return "#7c72ff";
    return getComputedStyle(canvas).color || "#f0f6fc";
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    drawingRef.current = true;
    ctx.strokeStyle = resolveStrokeColor(canvas);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.lineTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    ctx.stroke();
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const parsedDiffLines = stepLines
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const lower = line.toLowerCase();
      const isTrap =
        lower.includes("unchanged") ||
        lower.includes("未") ||
        lower.includes("skip") ||
        lower.includes("直接套用");
      return { idx: idx + 1, text: line, isTrap };
    });

  const handleStartBlindGate = () => {
    setGatePicked(null);
    setMintedHash(null);
    setSecondsLeft(90);
    setGateRunning(true);
  };

  const handleAnswerGate = (idx: number) => {
    if (!gateQuestion || gatePicked !== null) return;
    setGatePicked(idx);
    setGateRunning(false);
    if (idx === gateQuestion.correctIndex) {
      const hash = computeProofHash(
        `${selectedCourse.id}-${gateQuestion.id}-${Date.now()}`
      );
      setMintedHash(hash);
      onMintProof({
        hash,
        courseCode: selectedCourse.code,
        conceptTitle: gateQuestion.knowledgeTag,
        verifiedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        elapsedSeconds: Math.max(1, 90 - secondsLeft),
        stabilityDays: 21,
      });
      onRecordMemoryNote(
        `Proof-of-Mastery ${hash}`,
        `Closed-book verified in ${Math.max(1, 90 - secondsLeft)}s`,
        `P.${gateQuestion.sourcePage}`
      );
    }
  };

  const sendQuestion = async (rawQuestion: string, overrideMode?: TutorMode) => {
    const q = rawQuestion.trim();
    if (!q || isLoading || gateRunning) return;
    const usedMode = overrideMode ?? tutorMode;
    if (overrideMode) setTutorMode(overrideMode);

    const userMsg: TutorChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      mode: usedMode,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const data = await generateTutorReply({
        question: q,
        mode: usedMode,
        locale: brand.locale,
        tutorName: brand.tutorName,
        soulPrompt: brand.soulPrompt,
        sections: allSections,
        gateway,
      });

      const firstCited = data.citations?.[0];
      if (firstCited) {
        setActiveSectionId(firstCited.sectionId);
      }

      if (data.memoryUpdate) {
        onRecordMemoryNote(
          usedMode === "examiner" ? "Rubric Audit" : "Socratic Probe",
          data.memoryUpdate.note,
          firstCited
            ? `P.${firstCited.pageNumber} ${firstCited.sectionCode}`
            : selectedCourse.code
        );
      }

      const aiMsg: TutorChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        mode: usedMode,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        citations: data.citations,
        memoryUpdate: data.memoryUpdate,
        followUpSuggestions: data.followUpSuggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSection = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    const sec: DocumentSection = {
      id: `src-${Date.now()}`,
      pageNumber: 90 + customSections.length,
      sectionCode: `§S.${customSections.length + 1}`,
      title: newTitle.trim(),
      summary: newTitle.trim(),
      content: newBody.trim(),
      keyFormulaOrRule: newRule.trim() || "Strict syllabus criterion",
      examFrequency: "Core",
      commonTrap: "Unverified premise jump",
    };
    onAddCustomSection(sec);
    setActiveSectionId(sec.id);
    setNewTitle("");
    setNewRule("");
    setNewBody("");
    setShowImport(false);
    setCenterTab("source");
  };

  const handleSpeakSection = (sec: DocumentSection) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speakingId === sec.id) {
      setSpeakingId(null);
      return;
    }
    const utter = new SpeechSynthesisUtterance(`${sec.title}. ${sec.content}`);
    utter.lang = selectedCourse.speechLang || "zh-CN";
    utter.rate = 1.04;
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(sec.id);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
      {/* 2-PANE CLAUDE ARTIFACTS × CURSOR × GITHUB STUDIO LAYOUT */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* LEFT ARTIFACT PANE (7 columns): Syllabus + Diff Scratchpad + Blind Mastery Gate */}
        <div className="surface-elevated overflow-hidden rounded-3xl border border-border lg:col-span-7">
          {/* Top Chapter Selector Pill Bar (Replaces cramped 4th sidebar!) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {allSections.map((sec) => {
                const selected = activeSection?.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      if (!gateRunning) setActiveSectionId(sec.id);
                    }}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      selected
                        ? "border border-border bg-card font-semibold text-brand"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                    }`}
                  >
                    p.{sec.pageNumber} {sec.sectionCode}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowImport((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{t.importBtn}</span>
            </button>
          </div>

          {showImport && (
            <div className="space-y-3 border-b border-border bg-muted/20 p-5 text-xs">
              <div className="font-semibold text-foreground">
                {t.importTitle}
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.importSectionLabel}
                  className="rounded-md border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder={t.importRuleLabel}
                  className="rounded-md border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <textarea
                rows={3}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder={t.importBodyLabel}
                className="w-full rounded-md border border-input bg-card p-3 text-xs text-foreground focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleImportSection}
                  className="rounded-md bg-foreground px-3.5 py-1.5 text-xs font-medium text-background"
                >
                  {t.importSubmit}
                </button>
              </div>
            </div>
          )}

          {/* GitHub File-Tab Mode Header */}
          <div className="flex items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-5">
              {(
                [
                  { id: "source", label: t.tabSource, icon: FileText },
                  { id: "scratchpad", label: t.tabScratchpad, icon: FileCode2 },
                  { id: "blind", label: t.tabBlindGate, icon: ShieldCheck },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = centerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCenterTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 border-b-2 py-3 text-xs font-medium transition-colors ${
                      active
                        ? "border-brand text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${active ? "text-brand" : ""}`}
                      strokeWidth={1.75}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {gateRunning && (
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-brand">
                00:{String(secondsLeft).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Left Artifact Stage Content */}
          <div className="p-6 sm:p-7">
            {centerTab === "source" && activeSection && (
              <div className="space-y-6">
                {gateRunning ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 shrink-0 text-brand" />
                    <span>{t.hintsLocked}</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-brand">
                          p.{activeSection.pageNumber} ·{" "}
                          {activeSection.sectionCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSpeakSection(activeSection)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Volume2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span>
                            {speakingId === activeSection.id
                              ? t.stopBtn
                              : t.listenBtn}
                          </span>
                        </button>
                      </div>

                      <h1 className="pt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {activeSection.title}
                      </h1>
                    </div>

                    <p className="text-[15px] leading-[1.8] text-pretty text-foreground/90">
                      {activeSection.content}
                    </p>

                    {/* GitHub Diff-Styled Criterion & Deduction Trap Callouts */}
                    <div className="overflow-hidden rounded-lg border border-border text-xs">
                      <div className="diff-row-add space-y-1 p-4">
                        <div className="font-mono text-[11px] font-semibold uppercase">
                          + {t.criterionLabel}
                        </div>
                        <div className="font-mono text-[13px] leading-relaxed">
                          {activeSection.keyFormulaOrRule}
                        </div>
                      </div>
                      <div className="diff-row-del space-y-1 border-t border-border/50 p-4">
                        <div className="font-mono text-[11px] font-semibold uppercase">
                          - {t.boundaryLabel}
                        </div>
                        <div className="text-[13px] leading-relaxed">
                          {activeSection.commonTrap}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          void sendQuestion(
                            `[p.${activeSection.pageNumber} ${activeSection.sectionCode}] ${activeSection.title}`,
                            "socratic"
                          )
                        }
                        className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
                      >
                        {t.askSocraticBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void sendQuestion(
                            `[p.${activeSection.pageNumber} ${activeSection.sectionCode}] ${activeSection.keyFormulaOrRule}`,
                            "deepsolve"
                          )
                        }
                        className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {t.stepModelBtn}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {centerTab === "scratchpad" && (
              <div className="space-y-6">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t.scratchpadHint}
                </p>

                {/* Vector Ink Scratchpad */}
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <PenLine className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>{t.penTool}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            { id: "emerald", cls: "bg-brand" },
                            { id: "indigo", cls: "bg-indigo-signal" },
                            { id: "ink", cls: "bg-foreground" },
                          ] as const
                        ).map((sw) => (
                          <button
                            key={sw.id}
                            type="button"
                            aria-label={`Ink ${sw.id}`}
                            onClick={() => setInkChoice(sw.id)}
                            className={`h-4 w-4 rounded-full ${sw.cls} ${
                              inkChoice === sw.id
                                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                : "opacity-60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearCanvas}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Eraser className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>{t.clearCanvas}</span>
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={210}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="bg-architectural-stage h-48 w-full cursor-crosshair touch-none text-foreground"
                  />
                </div>

                {/* GitHub Line-by-Line Symbolic Diff Verifier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="symbolic-steps-box"
                      className="text-xs font-semibold text-foreground"
                    >
                      {t.stepInputLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAudited(true);
                        const hasTrap = parsedDiffLines.some((l) => l.isTrap);
                        if (hasTrap) {
                          onRecordMemoryNote(
                            "Diff Step Audit",
                            t.symbolicFlag,
                            activeSection
                              ? `P.${activeSection.pageNumber} ${activeSection.sectionCode}`
                              : selectedCourse.code
                          );
                        }
                      }}
                      className="rounded-full bg-foreground px-3.5 py-1 text-xs font-medium text-background"
                    >
                      {t.verifyStepsBtn}
                    </button>
                  </div>

                  <textarea
                    id="symbolic-steps-box"
                    rows={3}
                    spellCheck={false}
                    value={stepLines}
                    onChange={(e) => setStepLines(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus:border-foreground focus:outline-none"
                  />

                  {audited && parsedDiffLines.length > 0 && (
                    <div className="overflow-hidden rounded-lg border border-border divide-y divide-border/50 font-mono text-xs">
                      {parsedDiffLines.map((row) => (
                        <div
                          key={row.idx}
                          className={`flex items-start gap-3 px-3.5 py-2 ${
                            row.isTrap ? "diff-row-del" : "diff-row-add"
                          }`}
                        >
                          <span className="w-5 shrink-0 opacity-65">
                            0{row.idx}
                          </span>
                          <span className="font-bold">
                            {row.isTrap ? "-" : "+"}
                          </span>
                          <span className="flex-1">{row.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {centerTab === "blind" && gateQuestion && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      {t.blindGateTitle}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.blindGateNotice}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!gateRunning ? (
                      <button
                        type="button"
                        onClick={handleStartBlindGate}
                        className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background"
                      >
                        {t.startGateBtn}
                      </button>
                    ) : (
                      <span className="rounded-full bg-brand-soft px-3 py-1 font-mono text-sm font-semibold tabular-nums text-brand">
                        00:{String(secondsLeft).padStart(2, "0")}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setGateRunning(false);
                        setGatePicked(null);
                        setMintedHash(null);
                        setSecondsLeft(90);
                        setGateVariantIdx((prev) => prev + 1);
                      }}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {t.resetGateBtn}
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <p className="text-[15px] font-medium leading-relaxed text-foreground">
                    {gateQuestion.stem}
                  </p>

                  <div className="space-y-2">
                    {gateQuestion.options.map((opt, idx) => {
                      const picked = gatePicked === idx;
                      const answered = gatePicked !== null;
                      const isRight = idx === gateQuestion.correctIndex;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerGate(idx)}
                          className={`flex w-full items-start justify-between gap-3 rounded-lg border px-4 py-3 text-left text-xs leading-relaxed transition-colors ${
                            answered && isRight
                              ? "diff-row-add border-brand font-medium"
                              : picked && !isRight
                              ? "diff-row-del border-destructive font-medium"
                              : "border-border bg-background hover:bg-muted/40"
                          }`}
                        >
                          <span>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </span>
                          {answered && isRight && (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          )}
                          {picked && !isRight && (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {gatePicked !== null && (
                    <div className="rounded-lg border border-border bg-muted/35 p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span>
                          {mintedHash ? t.gatePassedTitle : t.gateFailedTitle}
                        </span>
                        {mintedHash && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-[11px] text-brand">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>{mintedHash}</span>
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed text-muted-foreground">
                        {gateQuestion.rubricAndAnalysis}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CO-EXAMINER PANE (5 columns): Socratic & Rubric Stream */}
        <div className="surface-elevated flex h-[680px] flex-col overflow-hidden rounded-3xl border border-border lg:col-span-5">
          {/* Inspector Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="text-xs font-semibold text-foreground">
                {brand.tutorName}
              </span>
            </div>

            <div
              role="group"
              aria-label="Diagnostic mode"
              className="inline-flex rounded-full border border-border bg-card p-0.5"
            >
              {(
                [
                  { id: "socratic", label: t.modeSocratic },
                  { id: "deepsolve", label: t.modeProof },
                  { id: "examiner", label: t.modeRubric },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTutorMode(m.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    tutorMode === m.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Stream */}
          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {gateRunning ? (
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 shrink-0 text-brand" />
                <span>{t.hintsLocked}</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[94%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "border border-border bg-muted/25 text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-line text-pretty">
                      {msg.content}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
                        <span className="text-[11px] text-muted-foreground">
                          {t.citationPrefix}:
                        </span>
                        {msg.citations.map((cit) => (
                          <button
                            key={cit.sectionId}
                            type="button"
                            onClick={() => {
                              setActiveSectionId(cit.sectionId);
                              setCenterTab("source");
                            }}
                            className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-brand"
                          >
                            p.{cit.pageNumber} · {cit.sectionCode}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.memoryUpdate && (
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-1.5 font-mono text-[10px] text-muted-foreground">
                        <span className="truncate">
                          {msg.memoryUpdate.layer} · {msg.memoryUpdate.note}
                        </span>
                        <span className="shrink-0 text-brand">
                          {msg.memoryUpdate.fsrsNextReview.slice(0, 18)}
                        </span>
                      </div>
                    )}
                  </div>

                  {msg.followUpSuggestions &&
                    msg.followUpSuggestions.length > 0 && (
                      <div className="mt-2 flex max-w-[94%] flex-wrap gap-1.5">
                        {msg.followUpSuggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => void sendQuestion(sug)}
                            className="rounded-full border border-border bg-card px-2.5 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                <span>{t.loadingStatus}</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-card p-3.5">
            <div className="flex gap-2">
              <label htmlFor="inspector-prompt-input" className="sr-only">
                {t.inputPlaceholder}
              </label>
              <input
                id="inspector-prompt-input"
                type="text"
                autoComplete="off"
                disabled={gateRunning}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendQuestion(inputText);
                  }
                }}
                placeholder={gateRunning ? t.hintsLocked : t.inputPlaceholder}
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-[13px] text-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                disabled={isLoading || gateRunning || !inputText.trim()}
                onClick={() => void sendQuestion(inputText)}
                aria-label={t.sendBtn}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>{t.sendBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
