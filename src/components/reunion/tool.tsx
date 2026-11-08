"use client";

import { useRef, useState } from "react";
import {
  SCENES,
  generateReunion,
  type SceneId,
  type ReunionCard,
} from "@/lib/reunion";

function PortraitPlaceholder({ kind }: { kind: "old" | "young" }) {
  const warm = kind === "old" ? "#C9A87C" : "#E0B089";
  const dark = kind === "old" ? "#8A6B47" : "#B07B4F";
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
      <rect width="200" height="240" fill={kind === "old" ? "#EFE3CE" : "#F6E8D8"} />
      <circle cx="100" cy="92" r="46" fill={warm} />
      <circle cx="100" cy="86" r="38" fill={kind === "old" ? "#E8D2B2" : "#F2D6B8"} />
      {kind === "old" && (
        <path d="M62 70 Q100 30 138 70 Q120 52 100 50 Q80 52 62 70" fill="#EFEFEF" />
      )}
      <circle cx="86" cy="84" r="3.2" fill={dark} />
      <circle cx="114" cy="84" r="3.2" fill={dark} />
      <path d="M88 102 Q100 110 112 102" stroke={dark} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M40 240 Q40 160 100 152 Q160 160 160 240 Z" fill={warm} />
      <path d="M70 240 Q72 180 100 176 Q128 180 130 240 Z" fill={kind === "old" ? "#DCC39B" : "#EDC5A0"} />
    </svg>
  );
}

type Slot = { label: string; dataUrl: string | null; kind: "old" | "young" };

export function ReunionTool() {
  const [scene, setScene] = useState<SceneId>("meet");
  const [leftTitle, setLeftTitle] = useState("爷爷");
  const [rightTitle, setRightTitle] = useState("孙女");
  const [rightName, setRightName] = useState("小满");
  const [leftYear, setLeftYear] = useState("1962");
  const [rightYear, setRightYear] = useState("2026");
  const [note, setNote] = useState("");
  const [slots, setSlots] = useState<Slot[]>([
    { label: "那时的 TA(可选)", dataUrl: null, kind: "old" },
    { label: "现在的 TA(可选)", dataUrl: null, kind: "young" },
  ]);
  const [card, setCard] = useState<ReunionCard | null>(null);
  const [phase, setPhase] = useState<"idle" | "developing">("idle");
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function onUpload(i: number, file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...slots];
      next[i] = { ...next[i], dataUrl: String(reader.result) };
      setSlots(next);
    };
    reader.readAsDataURL(file);
  }

  function generate() {
    setPhase("developing");
    setCard(null);
    setTimeout(() => {
      setCard(
        generateReunion({
          scene,
          leftTitle: leftTitle.trim() || "TA",
          rightTitle: rightTitle.trim() || "家人",
          rightName: rightName.trim() || "家人",
          leftYear: leftYear.trim(),
          rightYear: rightYear.trim(),
          note,
        }),
      );
      setPhase("idle");
      setTimeout(
        () => document.getElementById("frame-card")?.scrollIntoView({ behavior: "smooth", block: "center" }),
        80,
      );
    }, 900);
  }

  return (
    <div className="w-full">
      {/* ── 表单 ── */}
      <div className="no-print rounded-[20px] border border-[#E4D5C3] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(74,48,26,0.35)] sm:p-9">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#A65B38] uppercase">
          一步 · 选一个场景
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScene(s.id); setCard(null); }}
              className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                scene === s.id
                  ? "border-[#A65B38] bg-[#F7EDE3] shadow-[0_10px_24px_-12px_rgba(166,91,56,0.5)]"
                  : "border-[#EDE1D0] bg-[#FDFAF4] hover:border-[#C9A87C]"
              }`}
            >
              <div className={`text-[14px] font-bold ${scene === s.id ? "text-[#A65B38]" : "text-[#3D2E1E]"}`}>
                {s.title}
              </div>
              <div className="mt-1.5 text-[11px] leading-relaxed text-[#8A7460]">{s.tagline}</div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-[#A65B38] uppercase">
          二步 · 告诉我他们是谁
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">TA 是你的…</span>
            <input
              value={leftTitle}
              onChange={(e) => setLeftTitle(e.target.value)}
              maxLength={8}
              placeholder="爷爷/外婆/年轻的妈妈"
              className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[15px] font-semibold text-[#3D2E1E] outline-none focus:border-[#A65B38]"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">同框的是…</span>
            <input
              value={rightTitle}
              onChange={(e) => setRightTitle(e.target.value)}
              maxLength={8}
              placeholder="孙女/儿子/我"
              className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[15px] font-semibold text-[#3D2E1E] outline-none focus:border-[#A65B38]"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">TA 的名字</span>
            <input
              value={rightName}
              onChange={(e) => setRightName(e.target.value)}
              maxLength={10}
              className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[15px] font-semibold text-[#3D2E1E] outline-none focus:border-[#A65B38]"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">老照片年份</span>
            <input
              value={leftYear}
              onChange={(e) => setLeftYear(e.target.value)}
              maxLength={4}
              className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[15px] text-[#3D2E1E] outline-none focus:border-[#A65B38]"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">新照片年份</span>
            <input
              value={rightYear}
              onChange={(e) => setRightYear(e.target.value)}
              maxLength={4}
              className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[15px] font-semibold text-[#3D2E1E] outline-none focus:border-[#A65B38]"
            />
          </label>
        </div>

        <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-[#A65B38] uppercase">
          三步 · 放入照片(可跳过,用示例人像)
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {slots.map((slot, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#8A7460]">{slot.label}</span>
                <button
                  onClick={() => fileRefs[i].current?.click()}
                  className="rounded-full border border-[#E4D5C3] px-3.5 py-1.5 text-[11px] text-[#8A7460] hover:border-[#A65B38] hover:text-[#A65B38]"
                >
                  {slot.dataUrl ? "换一张" : "上传照片"}
                </button>
              </div>
              <input
                ref={fileRefs[i]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(i, e.target.files?.[0])}
              />
              <div
                onClick={() => fileRefs[i].current?.click()}
                className="mt-2 h-[150px] cursor-pointer overflow-hidden rounded-xl border border-[#E4D5C3] bg-[#FDFAF4]"
              >
                {slot.dataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slot.dataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full opacity-70">
                    <PortraitPlaceholder kind={slot.kind} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="text-[13px] text-[#8A7460]">想对 TA 说的一句话(会刻进照片,可不填)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={40}
            placeholder="例:爷爷,我们都很想你"
            className="mt-2 w-full rounded-xl border border-[#E4D5C3] bg-[#FDFAF4] px-4 py-3 text-[14px] text-[#3D2E1E] outline-none placeholder:text-[#C4B39E] focus:border-[#A65B38]"
          />
        </label>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            onClick={generate}
            disabled={phase === "developing"}
            className="rounded-full bg-[#A65B38] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,91,56,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
          >
            {phase === "developing" ? "正在冲洗这张合影…" : "生成「同框」合影 🖼"}
          </button>
          {card && (
            <button
              onClick={() => window.print()}
              className="rounded-full border border-[#E4D5C3] px-6 py-3.5 text-[14px] text-[#3D2E1E] hover:border-[#A65B38]"
            >
              打印 / 存下来
            </button>
          )}
          <span className="text-[11px] text-[#B09A82]">
            演示版:合成排版与文案 · 正式版为生成式影像(带「AI 生成」标识)
          </span>
        </div>
      </div>

      {/* ── 同框相框卡 ── */}
      {card && (
        <div id="frame-card" className="print-sheet mt-12">
          <div className="mx-auto max-w-[720px] rounded-[18px] bg-gradient-to-b from-[#5C4229] to-[#4A3220] p-5 shadow-[0_40px_90px_-30px_rgba(60,36,16,0.55)] sm:p-8">
            <div className="rounded-[8px] bg-[#FBF4E8] p-3 shadow-inner sm:p-5">
              {/* 两张照片 */}
              <div className="grid grid-cols-2 gap-3">
                {slots.map((slot, i) => (
                  <div key={i} className="relative">
                    <div className="aspect-[4/5] overflow-hidden rounded-[6px] border border-[#E0CFB4] bg-[#F2E6D2] shadow-[0_12px_28px_-12px_rgba(74,48,26,0.45)]">
                      {slot.dataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slot.dataUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          style={{ filter: i === 0 ? "sepia(0.45) contrast(1.05)" : "none" }}
                        />
                      ) : (
                        <div className="h-full w-full" style={{ filter: i === 0 ? "sepia(0.35)" : "none" }}>
                          <PortraitPlaceholder kind={slot.kind} />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-center text-[10px] tracking-[0.28em] text-[#A08A6C]">
                      {i === 0
                        ? `${card.scene.leftLabel} · ${leftYear}`
                        : `${card.scene.rightLabel} · ${rightYear}`}
                    </div>
                    {/* 中央印章 */}
                    {i === 0 && (
                      <div className="pointer-events-none absolute -right-[26px] top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-[#B23A2E] bg-[#FBF4E8]/85">
                          <span className="font-serif text-[15px] font-bold text-[#B23A2E]">{card.stamp}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 文案 */}
              <div className="mt-5 border-t border-[#E0CFB4] pt-5">
                {card.caption.map((p, i) => (
                  <p
                    key={i}
                    className={`mb-2.5 leading-[1.95] ${
                      i === 0
                        ? "font-serif text-[17px] font-bold text-[#3D2E1E] sm:text-[19px]"
                        : "text-[13px] text-[#6B5844]"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* 底部 */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#E0CFB4] pt-4">
                <div className="text-[10px] tracking-[0.12em] text-[#A08A6C]">
                  同框 REUNION · {card.dateStr}
                  {card.yearGap !== null && ` · 相隔 ${card.yearGap} 年`}
                </div>
                <div className="rounded border border-[#D9C6A8] px-2.5 py-1 text-[9.5px] tracking-wide text-[#A08A6C]">
                  {card.footer}
                </div>
              </div>
            </div>
          </div>
          <p className="no-print mx-auto mt-4 max-w-[720px] text-center text-[11px] text-[#B09A82]">
            演示版为排版合成示例 · 正式版由生成式影像模型完成融合,并附「AI 生成」显式标识与元数据隐式标识
          </p>
        </div>
      )}
    </div>
  );
}
