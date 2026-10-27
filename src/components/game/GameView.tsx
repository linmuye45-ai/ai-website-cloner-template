"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audio } from "@/game/audio";
import { ACHIEVEMENTS, PASSIVES, STAGES, WEAPONS } from "@/game/content";
import { GameEngine, type ChestReward } from "@/game/engine";
import type { HudState, RunStats, SaveData, UpgradeChoice } from "@/game/types";
import { formatCoins, formatTime } from "@/lib/format";
import { SpriteIcon } from "./SpriteIcon";

type ModalKind = "levelup" | "chest" | "pause" | "end" | null;

interface Props {
  characterId: string;
  stageId: string;
  endless: boolean;
  save: SaveData;
  onCommit: (stats: RunStats) => { save: SaveData; newAchievements: string[] };
  onAchievement: (id: string) => boolean;
  onSeen: (id: string) => void;
  onSfx: (v: number) => void;
  onMusic: (v: number) => void;
  onQuit: () => void;
  onRestart: (endless: boolean) => void;
}

interface Banner {
  text: string;
  sub?: string;
  key: number;
}

const INITIAL_HUD: HudState = {
  hp: 100,
  maxHp: 100,
  xpPct: 0,
  level: 1,
  time: 0,
  kills: 0,
  coins: 0,
  bossHp: null,
  bossName: null,
  bossEnraged: false,
  paused: false,
  rerolls: 2,
  weapons: [],
  passives: [],
};

export function GameView(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const [modal, setModal] = useState<ModalKind>(null);
  const [choices, setChoices] = useState<UpgradeChoice[]>([]);
  const [chest, setChest] = useState<ChestReward | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [popups, setPopups] = useState<{ id: number; text: string }[]>([]);
  const [endStats, setEndStats] = useState<{ stats: RunStats; newAch: string[] } | null>(null);
  const [joy, setJoy] = useState<{ active: boolean; ox: number; oy: number; dx: number; dy: number }>({
    active: false,
    ox: 0,
    oy: 0,
    dx: 0,
    dy: 0,
  });
  const toastId = useRef(0);
  const stage = STAGES.find((s) => s.id === props.stageId)!;

  const pushToast = useCallback((text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const pushPopup = useCallback((text: string) => {
    const id = ++toastId.current;
    setPopups((p) => [...p, { id, text }]);
    window.setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 3400);
  }, []);

  // Mounts exactly once per run — GameView is keyed-remounted on every restart.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audio.resume();
    audio.setSfxVolume(props.save.settings.sfx);
    audio.setMusicVolume(props.save.settings.music);
    audio.startMusic();

    const engine = new GameEngine(canvas, {
      characterId: props.characterId,
      stageId: props.stageId,
      endless: props.endless,
      callbacks: {
        onLevelUp: (c) => {
          setChoices(c);
          setModal("levelup");
        },
        onChest: (r) => {
          setChest(r);
          setModal("chest");
        },
        onEnd: (stats) => {
          const result = props.onCommit(stats);
          setEndStats({ stats, newAch: result.newAchievements });
          setModal("end");
          audio.stopMusic();
        },
        onBanner: (text, sub) => {
          setBanner({ text, sub, key: Date.now() });
          window.setTimeout(() => setBanner((b) => (b && b.text === text ? null : b)), 3000);
        },
        onToast: pushToast,
        onAchievement: (id) => {
          const isNew = props.onAchievement(id);
          if (isNew) {
            const def = ACHIEVEMENTS.find((a) => a.id === id);
            pushPopup(`Achievement unlocked — ${def?.name ?? id}`);
          }
        },
        onSeen: props.onSeen,
        onPauseChange: (paused) => {
          if (!paused) {
            setModal((m) => (m === "pause" ? null : m));
          }
        },
      },
    });
    engineRef.current = engine;
    setBanner({ text: stage.name, sub: "Survive until 15:00", key: Date.now() });
    window.setTimeout(() => setBanner(null), 3000);

    const hudTimer = window.setInterval(() => setHud(engine.getHud()), 100);
    return () => {
      window.clearInterval(hudTimer);
      engine.destroy();
      engineRef.current = null;
      audio.stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pause menu follows engine pause when no other modal is open
  useEffect(() => {
    if (hud.paused && modal === null) setModal("pause");
    if (!hud.paused && modal === "pause") setModal(null);
  }, [hud.paused, modal]);

  // keyboard selection for level-up
  useEffect(() => {
    if (modal !== "levelup") return;
    const handler = (e: KeyboardEvent): void => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) pick(choices[n - 1]);
      if (e.key.toLowerCase() === "r") reroll();
      if (e.key.toLowerCase() === "s" && e.ctrlKey) skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, choices]);

  const reroll = (): void => {
    const next = engineRef.current?.rerollChoices();
    if (next) {
      setChoices(next);
      setHud((h) => ({ ...h, rerolls: Math.max(0, h.rerolls - 1) }));
    }
  };

  const skip = (): void => {
    audio.play("click");
    setModal(null);
    setChoices([]);
    engineRef.current?.skipUpgrade();
  };

  const pick = (choice: UpgradeChoice): void => {
    audio.play("click");
    setModal(null);
    setChoices([]);
    // engine may immediately re-open the modal if multiple levels were queued
    engineRef.current?.pickUpgrade(choice);
  };

  const closeChest = (): void => {
    audio.play("click");
    engineRef.current?.closeChest();
    setModal(null);
    setChest(null);
  };

  const resume = (): void => {
    audio.play("click");
    engineRef.current?.setPaused(false);
    setModal(null);
  };

  // touch joystick
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.pointerType !== "touch" || modal) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setJoy({ active: true, ox: e.clientX, oy: e.clientY, dx: 0, dy: 0 });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!joy.active) return;
    const dx = e.clientX - joy.ox;
    const dy = e.clientY - joy.oy;
    const len = Math.hypot(dx, dy);
    const max = 56;
    const cl = Math.min(len, max);
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;
    setJoy((j) => ({ ...j, dx: nx * cl, dy: ny * cl }));
    engineRef.current?.setTouch(nx * Math.min(1, len / 18), ny * Math.min(1, len / 18));
  };
  const onPointerUp = (): void => {
    setJoy({ active: false, ox: 0, oy: 0, dx: 0, dy: 0 });
    engineRef.current?.clearTouch();
  };

  const hpPct = Math.max(0, (hud.hp / hud.maxHp) * 100);
  const lowHp = hpPct < 30;

  return (
    <div
      className="scanlines relative h-[100dvh] w-full select-none overflow-hidden bg-black"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ imageRendering: "pixelated" }} />

      {/* XP bar */}
      <div className="absolute inset-x-0 top-0 z-20 h-2.5 bg-black/70">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-[width] duration-150"
          style={{ width: `${hud.xpPct * 100}%`, boxShadow: "0 0 12px rgba(56,189,248,0.7)" }}
        />
      </div>

      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex items-start justify-between px-4">
        <div className="hud-chip pixel-corners w-44 px-3 py-2 sm:w-56">
          <div className="flex items-center justify-between font-pixel text-[10px]">
            <span className="text-slate-300">LV {hud.level}</span>
            <span className={lowHp ? "font-bold text-red-400 anim-blink" : "text-slate-300"}>
              {hud.hp}/{hud.maxHp}
            </span>
          </div>
          <div className="mt-1 h-2.5 border border-black/60 bg-black/60">
            <div
              className={`h-full transition-[width] duration-150 ${lowHp ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-lime-400"}`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
        </div>

        <div className="hud-chip pixel-corners px-5 py-2 text-center">
          <p className="font-pixel text-xl font-black tracking-widest text-slate-100 sm:text-2xl">
            {formatTime(hud.time)}
          </p>
          {hud.bossHp !== null && (
            <div className="mt-1 w-44 sm:w-64">
              <p className="font-pixel mb-1 text-[9px] tracking-[0.25em] text-red-300">
                {hud.bossName}
                {hud.bossEnraged && <span className="ml-2 animate-pulse text-red-400">ENRAGED</span>}
              </p>
              <div className="h-2 border border-black/60 bg-black/60">
                <div
                  className={`h-full ${
                    hud.bossEnraged
                      ? "animate-pulse bg-gradient-to-r from-red-500 via-orange-400 to-red-500"
                      : "bg-gradient-to-r from-red-600 to-rose-400"
                  }`}
                  style={{ width: `${hud.bossHp * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hud-chip pixel-corners flex gap-4 px-3 py-2 font-pixel text-[10px]">
          <span className="flex items-center gap-1.5 text-slate-200">
            <SpriteIcon name="icon_skull" size={14} /> {hud.kills}
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <SpriteIcon name="icon_coin" size={14} /> {hud.coins}
          </span>
        </div>
      </div>

      {/* Weapon / passive trays */}
      <div className="pointer-events-none absolute bottom-3 left-4 z-20 flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1.5">
          {hud.weapons.map((w) => (
            <div key={w.id} className="hud-chip pixel-corners relative p-1.5" title={WEAPONS[w.id]?.name}>
              <SpriteIcon name={w.icon} size={22} />
              <span className="font-pixel absolute -bottom-1 -right-1 rounded bg-amber-400 px-1 text-[8px] font-black text-black">
                {w.level}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hud.passives.map((p) => (
            <div key={p.id} className="hud-chip pixel-corners relative p-1" title={PASSIVES[p.id]?.name}>
              <SpriteIcon name={p.icon} size={18} />
              <span className="font-pixel absolute -bottom-1 -right-1 rounded bg-sky-400 px-1 text-[8px] font-black text-black">
                {p.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      {banner && (
        <div key={banner.key} className="pointer-events-none absolute inset-x-0 top-[22%] z-30 text-center anim-banner">
          <h2 className="font-pixel text-3xl font-black tracking-[0.2em] text-amber-300 text-glow-gold sm:text-5xl">
            {banner.text}
          </h2>
          {banner.sub && <p className="font-pixel mt-2 text-xs tracking-[0.3em] text-slate-200">{banner.sub}</p>}
        </div>
      )}

      {/* Toasts */}
      <div className="pointer-events-none absolute left-1/2 top-24 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="hud-chip pixel-corners anim-pop px-4 py-2 font-pixel text-[11px] text-slate-100">
            {t.text}
          </div>
        ))}
      </div>

      {/* Achievement popups */}
      <div className="pointer-events-none absolute right-4 top-20 z-30 flex flex-col gap-2">
        {popups.map((p) => (
          <div key={p.id} className="hud-chip pixel-corners anim-pop flex items-center gap-2 border-amber-400/40 px-3 py-2">
            <SpriteIcon name="icon_trophy" size={20} />
            <span className="font-pixel text-[10px] text-amber-300">{p.text}</span>
          </div>
        ))}
      </div>

      {/* Touch joystick */}
      {joy.active && (
        <div
          className="pointer-events-none absolute z-30 h-28 w-28 rounded-full border-2 border-white/25 bg-white/5"
          style={{ left: joy.ox - 56, top: joy.oy - 56 }}
        >
          <div
            className="absolute h-12 w-12 rounded-full border-2 border-amber-400/70 bg-amber-400/30"
            style={{ left: 56 - 24 + joy.dx, top: 56 - 24 + joy.dy }}
          />
        </div>
      )}

      {/* Level up modal */}
      {modal === "levelup" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm anim-fade-in">
          <div className="w-full max-w-3xl">
            <h2 className="font-pixel mb-1 text-center text-3xl font-black tracking-[0.25em] text-sky-300 text-glow-blue">
              Level Up
            </h2>
            <p className="font-pixel mb-6 text-center text-[10px] tracking-[0.3em] text-slate-400">Choose an upgrade</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {choices.map((c, i) => (
                <button
                  key={`${c.id}-${c.level}`}
                  onClick={() => pick(c)}
                  className={`card-hover pixel-corners relative flex flex-col items-center gap-3 border-2 p-5 text-center ${
                    c.evolution
                      ? "border-amber-400 bg-gradient-to-b from-[#3a2f14] to-[#1c1608] shadow-[0_0_28px_rgba(245,197,66,0.35)]"
                      : "bg-gradient-to-b from-[#1c2636] to-[#121824]"
                  }`}
                  style={{ borderColor: c.evolution ? undefined : `${c.color}55` }}
                >
                  <span className="font-pixel absolute left-2 top-2 text-[10px] text-slate-500">{i + 1}</span>
                  {c.evolution ? (
                    <span className="font-pixel absolute right-2 top-2 animate-pulse rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-black text-black">
                      EVOLUTION
                    </span>
                  ) : (
                    c.isNew && (
                      <span className="font-pixel absolute right-2 top-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black text-black">
                        NEW
                      </span>
                    )
                  )}
                  <div className="rounded-lg bg-black/40 p-3">
                    <SpriteIcon name={c.icon} size={44} />
                  </div>
                  <div>
                    <p className="font-pixel text-sm font-bold" style={{ color: c.color }}>
                      {c.name}
                    </p>
                    {!c.isNew && (
                      <p className="font-pixel mt-0.5 text-[9px] text-slate-400">
                        Rank {c.level}{c.maxLevel > 1 ? ` / ${c.maxLevel}` : ""}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">{c.desc}</p>
                </button>
              ))}
            </div>
            <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3">
              <button
                onClick={reroll}
                disabled={hud.rerolls <= 0}
                className="pixel-btn pixel-corners btn-slate px-5 py-2.5 text-xs"
              >
                ↻ Reroll ({hud.rerolls})
              </button>
              <span className="font-pixel text-[9px] text-slate-500">1–3 pick · R reroll</span>
              <button onClick={skip} className="pixel-btn pixel-corners btn-ghost px-5 py-2.5 text-xs">
                Skip → +25% XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chest modal */}
      {modal === "chest" && chest && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm anim-fade-in">
          <div className="pixel-panel pixel-corners anim-pop w-full max-w-md p-8 text-center">
            <div className="anim-float mx-auto w-fit">
              <SpriteIcon name="chest_open" size={88} />
            </div>
            <h2 className="font-pixel mt-4 text-2xl font-black tracking-[0.2em] text-amber-300 text-glow-gold">
              Treasure!
            </h2>
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-center gap-2 font-pixel text-sm text-slate-200">
                <SpriteIcon name="icon_coin" size={20} /> +{chest.coins} coins
              </div>
              <div className="flex items-center justify-center gap-2 font-pixel text-sm text-emerald-300">
                <SpriteIcon name="icon_heart" size={20} /> +{chest.heal} health
              </div>
              {chest.upgrade && (
                <div className="flex items-center justify-center gap-2 font-pixel text-sm text-sky-300">
                  <SpriteIcon name={chest.upgrade.icon} size={20} />
                  {chest.upgrade.name} → rank {chest.upgrade.level}
                </div>
              )}
            </div>
            <button onClick={closeChest} className="pixel-btn pixel-corners btn-gold mt-7 w-full py-3 text-sm">
              Collect
            </button>
          </div>
        </div>
      )}

      {/* Pause menu */}
      {modal === "pause" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm anim-fade-in">
          <div className="pixel-panel pixel-corners anim-pop w-full max-w-sm p-7">
            <h2 className="font-pixel mb-6 text-center text-2xl font-black tracking-[0.3em] text-slate-100">Paused</h2>
            <div className="flex flex-col gap-3">
              <button onClick={resume} className="pixel-btn pixel-corners btn-gold py-3 text-sm">
                Resume
              </button>
              <button onClick={() => props.onRestart(props.endless)} className="pixel-btn pixel-corners btn-slate py-3 text-sm">
                Restart Run
              </button>
              <div className="hud-chip pixel-corners flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="font-pixel text-[10px] text-slate-400">SFX</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={props.save.settings.sfx}
                  onChange={(e) => props.onSfx(Number(e.target.value))}
                  className="h-1 flex-1 accent-amber-400"
                />
              </div>
              <div className="hud-chip pixel-corners flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="font-pixel text-[10px] text-slate-400">MUSIC</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={props.save.settings.music}
                  onChange={(e) => props.onMusic(Number(e.target.value))}
                  className="h-1 flex-1 accent-amber-400"
                />
              </div>
              <button onClick={props.onQuit} className="pixel-btn pixel-corners btn-danger py-3 text-sm">
                Quit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End screen */}
      {modal === "end" && endStats && (
        <EndScreen
          data={endStats}
          endless={props.endless}
          onRetry={() => props.onRestart(false)}
          onEndless={() => {
            engineRef.current?.continueEndless();
            setModal(null);
            setEndStats(null);
            audio.startMusic();
          }}
          onQuit={props.onQuit}
        />
      )}
    </div>
  );
}

function EndScreen({
  data,
  endless,
  onRetry,
  onEndless,
  onQuit,
}: {
  data: { stats: RunStats; newAch: string[] };
  endless: boolean;
  onRetry: () => void;
  onEndless: () => void;
  onQuit: () => void;
}) {
  const { stats: s, newAch } = data;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm anim-fade-in">
      <div className="pixel-panel pixel-corners anim-pop w-full max-w-lg p-8 text-center">
        <p className="font-pixel text-[10px] tracking-[0.4em] text-slate-400">
          {s.victory ? "Stage cleared" : "You were consumed by the dusk"}
        </p>
        <h2
          className={`font-pixel mt-2 text-4xl font-black tracking-[0.15em] ${
            s.victory ? "shimmer-text" : "text-red-400 text-hard-shadow"
          }`}
        >
          {s.victory ? "VICTORY" : "DEFEAT"}
        </h2>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatBox icon="icon_clock" label="Time" value={formatTime(s.time)} />
          <StatBox icon="icon_skull" label="Kills" value={s.kills} />
          <StatBox icon="icon_star" label="Level" value={s.level} />
          <StatBox icon="icon_coin" label="Coins" value={formatCoins(s.coins)} />
          <StatBox icon="icon_heart" label="Damage taken" value={s.damageTaken} />
          <StatBox icon="icon_growth" label="Gems" value={s.gems} />
        </div>

        {newAch.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
            <p className="font-pixel text-[10px] tracking-[0.2em] text-amber-300">
              New achievements · {newAch.length}
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3">
          {s.victory && !endless && (
            <button onClick={onEndless} className="pixel-btn pixel-corners btn-gold py-3 text-sm">
              ∞ Continue in Endless Mode
            </button>
          )}
          <button onClick={onRetry} className="pixel-btn pixel-corners btn-slate py-3 text-sm">
            Retry Run
          </button>
          <button onClick={onQuit} className="pixel-btn pixel-corners btn-ghost py-3 text-sm">
            Back to Title
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="mx-auto w-fit">
        <SpriteIcon name={icon} size={20} />
      </div>
      <p className="font-pixel mt-1.5 text-base font-black text-slate-100">{value}</p>
      <p className="font-pixel text-[8px] tracking-widest text-slate-500">{label}</p>
    </div>
  );
}
