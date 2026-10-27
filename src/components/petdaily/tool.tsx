"use client";

import { useState } from "react";
import {
  generatePaper,
  triage,
  SYMPTOMS,
  type PetInput,
  type DailyPaper,
  type TriageResult,
} from "@/lib/petdaily";

const BREEDS = {
  dog: ["柴犬", "金毛", "柯基", "拉布拉多", "泰迪", "边境牧羊犬", "哈士奇", "法国斗牛犬", "比熊", "中华田园犬"],
  cat: ["英短", "美短", "布偶", "橘猫", "狸花猫", "暹罗", "缅因"],
};

const CHOICES = [
  { key: "diet", label: "今天吃了多少?", options: ["吃得少", "正常", "吃得多"] },
  { key: "water", label: "喝水呢?", options: ["喝得少", "正常", "喝得多"] },
  { key: "activity", label: "活动量?", options: ["不爱动", "正常", "疯玩"] },
  { key: "spirit", label: "精神状态?", options: ["蔫蔫的", "正常", "超兴奋"] },
] as const;

const LEVEL_DOT = ["#E8703A", "#8FA98F", "#E8703A"];
const LEVEL_TEXT = ["留 意", "正 常", "活 跃"];

export function PetTool() {
  const [name, setName] = useState("豆豆");
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [breed, setBreed] = useState("柴犬");
  const [age, setAge] = useState("3 岁");
  const [vals, setVals] = useState<Record<string, number>>({
    diet: 1, water: 1, activity: 2, spirit: 1,
  });
  const [note, setNote] = useState("今天带它去了趟公园,遇到一只柯基");
  const [paper, setPaper] = useState<DailyPaper | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [tri, setTri] = useState<TriageResult | null>(null);

  function generate() {
    const input: PetInput = {
      name: name.trim() || "毛孩",
      species,
      breed,
      age,
      diet: vals.diet,
      water: vals.water,
      activity: vals.activity,
      spirit: vals.spirit,
      note,
    };
    setPaper(generatePaper(input));
    setTimeout(
      () => document.getElementById("paper-card")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  }

  function switchSpecies(s: "dog" | "cat") {
    setSpecies(s);
    setBreed(BREEDS[s][0]);
    setPaper(null);
  }

  function toggleSymptom(id: string) {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    setTri(triage(next));
  }

  return (
    <div className="w-full">
      {/* ── 表单 ── */}
      <div className="no-print rounded-[20px] border border-[#E5D9C8] bg-white p-6 shadow-[0_18px_50px_-20px_rgba(90,60,30,0.25)] sm:p-9">
        <div className="flex items-center gap-2.5">
          <span className="text-[18px]">🐾</span>
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[#C2542A] uppercase">
            30 秒填一张,今天就有得晒
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">它叫什么?</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              className="mt-2 w-full rounded-xl border border-[#E5D9C8] bg-[#FDFAF5] px-4 py-3 text-[15px] font-semibold text-[#2A2118] outline-none focus:border-[#E8703A]"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">猫还是狗?</span>
            <div className="mt-2 flex gap-2">
              {(["dog", "cat"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => switchSpecies(s)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-[14px] transition-colors ${
                    species === s
                      ? "border-[#E8703A] bg-[#E8703A] text-white font-semibold"
                      : "border-[#E5D9C8] bg-[#FDFAF5] text-[#8A7460]"
                  }`}
                >
                  {s === "dog" ? "🐶 狗" : "🐱 猫"}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">品种</span>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5D9C8] bg-[#FDFAF5] px-4 py-3 text-[15px] text-[#2A2118] outline-none focus:border-[#E8703A]"
            >
              {BREEDS[species].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[13px] text-[#8A7460]">年龄</span>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              maxLength={10}
              className="mt-2 w-full rounded-xl border border-[#E5D9C8] bg-[#FDFAF5] px-4 py-3 text-[15px] text-[#2A2118] outline-none focus:border-[#E8703A]"
            />
          </label>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHOICES.map((c) => (
            <div key={c.key}>
              <span className="text-[13px] text-[#8A7460]">{c.label}</span>
              <div className="mt-2 flex gap-1.5">
                {c.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => { setVals({ ...vals, [c.key]: i }); setPaper(null); }}
                    className={`flex-1 rounded-lg border px-2 py-2 text-[12px] transition-colors ${
                      vals[c.key] === i
                        ? "border-[#2A2118] bg-[#2A2118] text-[#FDFAF5] font-semibold"
                        : "border-[#E5D9C8] bg-[#FDFAF5] text-[#8A7460]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="text-[13px] text-[#8A7460]">今天有什么值得记录的?(可不填)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
            placeholder="例:拆了一个纸巾 / 学会了击掌 / 在窗台看了一下午鸟"
            className="mt-2 w-full rounded-xl border border-[#E5D9C8] bg-[#FDFAF5] px-4 py-3 text-[14px] text-[#2A2118] outline-none placeholder:text-[#C4B39E] focus:border-[#E8703A]"
          />
        </label>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            onClick={generate}
            className="rounded-full bg-[#E8703A] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(232,112,58,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            生成今日毛孩日报 📰
          </button>
          {paper && (
            <button
              onClick={() => window.print()}
              className="rounded-full border border-[#E5D9C8] px-6 py-3.5 text-[14px] text-[#2A2118] hover:border-[#E8703A]"
            >
              打印 / 存成图片
            </button>
          )}
          <span className="text-[11.5px] text-[#B09A82]">
            演示版:内容由规则引擎生成 · 正式版接入多模态模型(准确率更高)
          </span>
        </div>
      </div>

      {/* ── 日报卡片 ── */}
      {paper && (
        <div id="paper-card" className="print-sheet mt-10">
          <div className="mx-auto max-w-[860px] rounded-[20px] border-[3px] border-[#2A2118] bg-[#FDFAF5] p-2 shadow-[0_30px_80px_-30px_rgba(90,60,30,0.4)]">
            <div className="rounded-[14px] border border-[#E5D9C8] px-6 py-7 sm:px-10">
              {/* 报头 */}
              <div className="flex items-baseline justify-between border-b-[3px] border-double border-[#2A2118] pb-4">
                <h3 className="font-serif text-[30px] font-bold tracking-[0.12em] text-[#2A2118] sm:text-[36px]">
                  毛孩日报
                </h3>
                <div className="text-right text-[11px] text-[#8A7460]">
                  <div>{paper.date}</div>
                  <div>第 {paper.issue} 期 · 宠物情绪版</div>
                </div>
              </div>

              {/* 头条 */}
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#E8703A] px-3.5 py-1.5 text-[12px] font-bold text-white">
                    {paper.moodEmoji} 今日情绪 · {paper.moodWord}
                  </span>
                  <span className="text-[12px] text-[#8A7460]">
                    {paper.name} · {paper.breed} · {paper.age}
                  </span>
                </div>
                <h4 className="mt-4 font-serif text-[24px] font-bold leading-[1.45] text-[#2A2118] sm:text-[30px]">
                  {paper.headline}
                </h4>
              </div>

              {/* 正文两栏 */}
              <div className="mt-6 gap-8 border-t border-[#E5D9C8] pt-6 md:columns-2">
                {paper.story.map((para, i) => (
                  <p key={i} className="mb-4 break-inside-avoid text-[13.5px] leading-[2] text-[#4A3B2C]">
                    {para}
                  </p>
                ))}
              </div>

              {/* 健康四格 */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {paper.health.map((h) => (
                  <div key={h.label} className="rounded-xl border border-[#E5D9C8] bg-white px-4 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#2A2118]">{h.label}</span>
                      <span
                        className="text-[10px] font-bold tracking-widest"
                        style={{ color: h.level === 1 ? "#E8703A" : h.level === 3 ? "#B4622E" : "#7A9E7E" }}
                      >
                        {LEVEL_TEXT[h.level - 1]}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            background: n <= h.level
                              ? h.level === 1 ? "#E8703A" : h.level === 3 ? "#B4622E" : "#7A9E7E"
                              : "#EDE3D4",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-[10.5px] leading-relaxed text-[#8A7460]">{h.note}</div>
                  </div>
                ))}
              </div>

              {/* 冷知识 + 明日建议 + 评分 */}
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-dashed border-[#C9B89E] px-5 py-4">
                  <div className="text-[11px] font-bold tracking-[0.15em] text-[#C2542A]">品种冷知识</div>
                  <p className="mt-2 text-[12.5px] leading-[1.9] text-[#4A3B2C]">{paper.funFact}</p>
                </div>
                <div className="rounded-xl border border-dashed border-[#C9B89E] px-5 py-4">
                  <div className="text-[11px] font-bold tracking-[0.15em] text-[#C2542A]">明日建议</div>
                  <p className="mt-2 text-[12.5px] leading-[1.9] text-[#4A3B2C]">{paper.tomorrow}</p>
                </div>
                <div className="rounded-xl bg-[#2A2118] px-5 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] tracking-[0.15em] opacity-70">可爱指数</div>
                      <div className="font-serif text-[28px] font-bold leading-none">{paper.cuteScore}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] tracking-[0.15em] opacity-70">人宠关系分</div>
                      <div className="font-serif text-[28px] font-bold leading-none">{paper.bondScore}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10.5px] leading-relaxed opacity-70">
                    评分仅供娱乐,但「它今天很想你」是认真的。
                  </div>
                </div>
              </div>

              {/* 报尾 */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5D9C8] pt-4 text-[10.5px] text-[#B09A82]">
                <span>由 毛孩日报 PetDaily 生成 · 截图晒出你家毛孩的今日份可爱</span>
                <span className="font-mono">PETDAILY · DEMO · 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 症状自查 ── */}
      <div className="no-print mt-14 rounded-[20px] border border-[#E5D9C8] bg-white p-6 sm:p-9">
        <div className="flex items-center gap-2.5">
          <span className="text-[18px]">🩺</span>
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[#C2542A] uppercase">
            症状自查 · 该不该去医院,先问清楚
          </p>
        </div>
        <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2A2118]">
          它今天有哪里不对劲吗?(可多选)
        </h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#8A7460]">
          这不是诊断,只帮你判断<span className="text-[#2A2118] font-semibold">就医时机</span>——
          选完立刻给你三级建议。拿不准就选上,宁可多跑一趟。
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {SYMPTOMS.map((s) => {
            const on = checked.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  on ? "border-[#E8703A] bg-[#FDF0E7]" : "border-[#EDE3D4] bg-[#FDFAF5] hover:border-[#C9B89E]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border text-[10px] ${
                    on ? "border-[#E8703A] bg-[#E8703A] text-white" : "border-[#C9B89E]"
                  }`}
                  style={{ height: 18, width: 18 }}
                >
                  {on ? "✓" : ""}
                </span>
                <span className={`text-[12.5px] leading-relaxed ${on ? "text-[#2A2118] font-semibold" : "text-[#6B5844]"}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {tri && (
          <div
            className="mt-6 rounded-2xl border-2 px-6 py-6"
            style={{
              borderColor: tri.tier === 3 ? "#D64524" : tri.tier === 2 ? "#E8A33A" : "#7A9E7E",
              background: tri.tier === 3 ? "#FDECE6" : tri.tier === 2 ? "#FDF4E4" : "#EEF4EE",
            }}
          >
            <div className="font-serif text-[22px] font-bold text-[#2A2118]">{tri.title}</div>
            <p className="mt-3 text-[13.5px] leading-[2] text-[#4A3B2C]">{tri.advice}</p>
            <div className="mt-4 space-y-2">
              {tri.picked.map((s) => (
                <div key={s.id} className="flex gap-2.5 text-[12px] leading-relaxed text-[#6B5844]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8703A]" />
                  <span><span className="font-semibold text-[#2A2118]">{s.label}:</span> {s.why}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-[#B09A82]">
              免责:本工具提供的是就医时机建议,不构成医疗诊断。拿不准的时候,相信你的直觉——多跑一趟医院永远不亏。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
