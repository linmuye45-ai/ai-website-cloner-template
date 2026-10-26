"use client";

import { AmbientCanvas } from "./AmbientCanvas";
import { SpriteIcon } from "./SpriteIcon";
import type { SaveData, ScreenId } from "@/game/types";
import { formatCoins } from "@/lib/format";

interface Props {
  save: SaveData;
  onNavigate: (s: ScreenId) => void;
  onSfx: (v: number) => void;
  onMusic: (v: number) => void;
}

export function TitleScreen({ save, onNavigate, onSfx, onMusic }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0f14]">
      <AmbientCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f14]/70 via-transparent to-[#0b0f14]/90" />

      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-10">
        <div className="hud-chip pixel-corners flex items-center gap-2 px-4 py-2">
          <SpriteIcon name="icon_coin" size={20} />
          <span className="font-pixel text-sm font-bold text-amber-300">{formatCoins(save.coins)}</span>
          <span className="font-pixel text-[10px] text-slate-400">vault</span>
        </div>
        <div className="hud-chip pixel-corners hidden items-center gap-4 px-4 py-2 sm:flex">
          <label className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-slate-400">SFX</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              defaultValue={save.settings.sfx}
              onChange={(e) => onSfx(Number(e.target.value))}
              className="h-1 w-24 accent-amber-400"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-slate-400">MUSIC</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              defaultValue={save.settings.music}
              onChange={(e) => onMusic(Number(e.target.value))}
              className="h-1 w-24 accent-amber-400"
            />
          </label>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-6 text-center">
        <p className="font-pixel mb-4 text-xs tracking-[0.4em] text-emerald-300/90 anim-fade-in">
          A 16-bit horde survival
        </p>
        <h1 className="font-pixel text-5xl font-black leading-none text-hard-shadow sm:text-7xl md:text-8xl">
          <span className="shimmer-text">DUSKFALL</span>
        </h1>
        <h2 className="font-pixel mt-3 text-2xl font-black tracking-[0.35em] text-slate-200 text-hard-shadow sm:text-4xl">
          SURVIVORS
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
          The dead rise at dusk and they do not stop coming. Survive fifteen minutes of
          escalating waves, master eight auto-firing weapons, and fell the bosses that
          hunt you through the dark.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-4 anim-fade-up">
          <button
            onClick={() => onNavigate("select")}
            className="pixel-btn pixel-corners btn-gold px-8 py-4 text-base"
          >
            ⚔ Start Run
          </button>
          <button
            onClick={() => onNavigate("howto")}
            className="pixel-btn pixel-corners btn-slate px-8 py-3 text-sm"
          >
            How to Play
          </button>
          <button
            onClick={() => onNavigate("collection")}
            className="pixel-btn pixel-corners btn-ghost px-8 py-3 text-sm"
          >
            Bestiary &amp; Records
          </button>
        </div>

        <div className="mt-10 flex items-center gap-6 font-pixel text-[10px] text-slate-400">
          <span className="flex items-center gap-2">
            <kbd className="hud-chip pixel-corners px-2 py-1 text-slate-200">WASD</kbd> move
          </span>
          <span className="flex items-center gap-2">
            <kbd className="hud-chip pixel-corners px-2 py-1 text-slate-200">ESC</kbd> pause
          </span>
          <span className="hidden sm:inline">weapons fire automatically</span>
        </div>
      </main>

      <footer className="relative z-10 pb-5 text-center font-pixel text-[10px] text-slate-500">
        Original pixel art, code and audio synthesis — no third-party game assets · v1.0
      </footer>
    </div>
  );
}
