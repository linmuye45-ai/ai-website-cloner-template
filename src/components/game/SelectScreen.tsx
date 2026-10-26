"use client";

import { useState } from "react";
import { CHARACTERS, STAGES, WEAPONS } from "@/game/content";
import type { SaveData } from "@/game/types";
import { formatCoins, formatTime } from "@/lib/format";
import { SpriteIcon } from "./SpriteIcon";

interface Props {
  save: SaveData;
  onBack: () => void;
  onStart: (characterId: string, stageId: string) => void;
  onPurchase: (characterId: string) => void;
}

export function SelectScreen({ save, onBack, onStart, onPurchase }: Props) {
  const [characterId, setCharacterId] = useState("aldric");
  const [stageId, setStageId] = useState("graveyard");
  const character = CHARACTERS.find((c) => c.id === characterId)!;
  const owned = save.owned.includes(characterId);
  const canAfford = save.coins >= character.cost;

  return (
    <div className="relative min-h-screen w-full bg-[#0b0f14]">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 500px at 70% -10%, rgba(124,92,191,0.18), transparent), radial-gradient(700px 400px at 10% 110%, rgba(74,222,128,0.1), transparent)",
        }}
      />
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-10">
        <button onClick={onBack} className="pixel-btn pixel-corners btn-ghost px-4 py-2 text-xs">
          ← Back
        </button>
        <h1 className="font-pixel text-lg font-black tracking-[0.25em] text-slate-100">Prepare for Dusk</h1>
        <div className="hud-chip pixel-corners flex items-center gap-2 px-3 py-2">
          <SpriteIcon name="icon_coin" size={18} />
          <span className="font-pixel text-sm font-bold text-amber-300">{formatCoins(save.coins)}</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Characters */}
        <section className="pixel-panel pixel-corners p-5 anim-fade-up">
          <h2 className="font-pixel mb-4 text-sm font-bold tracking-[0.2em] text-amber-300">Choose Survivor</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {CHARACTERS.map((c) => {
              const isOwned = save.owned.includes(c.id);
              const active = c.id === characterId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCharacterId(c.id)}
                  className={`card-hover pixel-corners relative flex flex-col items-center gap-2 border-2 p-3 ${
                    active ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-black/30"
                  }`}
                >
                  {!isOwned && (
                    <span className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 font-pixel text-[9px] text-amber-300">
                      <SpriteIcon name="icon_coin" size={10} />
                      {c.cost}
                    </span>
                  )}
                  <div
                    className="flex h-16 items-end justify-center"
                    style={{ filter: isOwned ? "none" : "brightness(0.45) saturate(0.4)" }}
                  >
                    <SpriteIcon name={c.sprite} size={52} frame={0} />
                  </div>
                  <div className="text-center">
                    <p className="font-pixel text-xs font-bold" style={{ color: c.accent }}>
                      {c.name}
                    </p>
                    <p className="font-pixel text-[9px] text-slate-400">{c.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-3">
              <SpriteIcon name={character.sprite} size={56} />
              <div>
                <p className="font-pixel text-base font-bold" style={{ color: character.accent }}>
                  {character.name} <span className="text-slate-400">· {character.title}</span>
                </p>
                <p className="mt-1 text-xs text-slate-300">{character.desc}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 font-pixel text-[10px] text-slate-300 sm:grid-cols-3">
              <Stat label="Health" value={character.stats.maxHp} />
              <Stat label="Speed" value={character.stats.speed} />
              <Stat label="Might" value={`${Math.round(character.stats.might * 100)}%`} />
              <Stat label="Armor" value={character.stats.armor} />
              <Stat label="Cooldown" value={`${Math.round(character.stats.cooldown * 100)}%`} />
              <Stat label="Magnet" value={character.stats.magnet} />
            </div>
            <div className="mt-3 flex items-center gap-2 font-pixel text-[10px] text-slate-400">
              <SpriteIcon name={WEAPONS[character.weapon].icon} size={18} />
              Starts with <span className="text-slate-200">{WEAPONS[character.weapon].name}</span>
            </div>
          </div>
        </section>

        {/* Stages */}
        <section className="pixel-panel pixel-corners p-5 anim-fade-up" style={{ animationDelay: "80ms" }}>
          <h2 className="font-pixel mb-4 text-sm font-bold tracking-[0.2em] text-amber-300">Choose Stage</h2>
          <div className="flex flex-col gap-3">
            {STAGES.map((s) => {
              const active = s.id === stageId;
              const best = save.best[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => setStageId(s.id)}
                  className={`card-hover pixel-corners border-2 p-4 text-left ${
                    active ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-black/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[10px] tracking-[0.3em]" style={{ color: s.accent }}>
                      {s.subtitle}
                    </span>
                    {best?.victory && <SpriteIcon name="icon_trophy" size={16} />}
                  </div>
                  <p className="font-pixel mt-1 text-sm font-bold text-slate-100">{s.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{s.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2 font-pixel text-[9px]">
                    <span className="hud-chip pixel-corners px-2 py-1 text-slate-300">15:00 survival</span>
                    <span className="hud-chip pixel-corners px-2 py-1 text-red-300">
                      HP ×{s.hpScale.toFixed(2)}
                    </span>
                    <span className="hud-chip pixel-corners px-2 py-1 text-orange-300">
                      DMG ×{s.dmgScale.toFixed(2)}
                    </span>
                    {best && (
                      <span className="hud-chip pixel-corners px-2 py-1 text-emerald-300">
                        Best {formatTime(best.time)} · {best.kills} kills
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            {owned ? (
              <button
                onClick={() => onStart(characterId, stageId)}
                className="pixel-btn pixel-corners btn-gold w-full py-4 text-base"
              >
                ▶ Begin Run
              </button>
            ) : (
              <button
                disabled={!canAfford}
                onClick={() => onPurchase(characterId)}
                className="pixel-btn pixel-corners btn-gold w-full py-4 text-sm"
              >
                {canAfford
                  ? `Recruit ${character.name} — ${character.cost} coins`
                  : `Need ${character.cost - save.coins} more coins`}
              </button>
            )}
            <p className="mt-2 text-center font-pixel text-[9px] text-slate-500">{character.unlockHint}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-1">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}
