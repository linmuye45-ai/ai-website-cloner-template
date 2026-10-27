"use client";

import { useEffect, useRef, useState } from "react";
import { PlatformerGame, VIEW_H, VIEW_W } from "@/game/engine";

type TouchControl = "left" | "right" | "jump" | "dash";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<PlatformerGame | null>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [scale, setScale] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const engine = new PlatformerGame(canvas);
    engineRef.current = engine;
    let disposed = false;
    engine
      .load()
      .then(() => {
        if (disposed) return;
        engine.start();
        setReady(true);
      })
      .catch((err) => console.error("game load failed", err));

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const next = Math.max(
        1,
        Math.floor(Math.min(rect.width / VIEW_W, rect.height / VIEW_H)),
      );
      setScale(next);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => {
      disposed = true;
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const hold = (control: TouchControl) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      engineRef.current?.setTouch(control, true);
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      engineRef.current?.setTouch(control, false);
    },
    onPointerCancel: () => engineRef.current?.setTouch(control, false),
    onPointerLeave: () => engineRef.current?.setTouch(control, false),
  });

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        ref={wrapRef}
        className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-[#3A3646] bg-[#16131F]"
        style={{ minHeight: VIEW_H * 2 }}
      >
        <canvas
          ref={canvasRef}
          width={VIEW_W}
          height={VIEW_H}
          aria-label="Hearthwarden Ember Trail game canvas"
          className="block"
          style={{
            width: VIEW_W * scale,
            height: VIEW_H * scale,
            imageRendering: "pixelated",
          }}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-sm text-[#D8C9A3]">LIGHTING THE HEARTH…</p>
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              engineRef.current?.togglePause();
              setPaused((v) => !v);
            }}
            className="h-9 min-w-9 rounded border border-[#676078] bg-[#211C2E]/90 px-2 font-mono text-xs text-[#F0E6C8] hover:bg-[#2A2733]"
          >
            {paused ? "▶" : "II"}
          </button>
          <button
            type="button"
            onClick={() => setMuted(engineRef.current?.toggleMute() ?? false)}
            className="h-9 min-w-9 rounded border border-[#676078] bg-[#211C2E]/90 px-2 font-mono text-xs text-[#F0E6C8] hover:bg-[#2A2733]"
          >
            {muted ? "MUTE" : "SND"}
          </button>
        </div>
      </div>

      <p className="font-mono text-xs text-[#A79FB4]">
        ARROWS / WASD MOVE · SPACE JUMP (HOLD FOR HEIGHT) · SHIFT EMBER DASH · P PAUSE · M MUTE · ENTER START · GAMEPAD A/X/START
      </p>

      <div className="flex w-full max-w-xl items-end justify-between select-none">
        <div className="flex gap-3">
          <TouchButton label="◀" {...hold("left")} />
          <TouchButton label="▶" {...hold("right")} />
        </div>
        <div className="flex gap-3">
          <TouchButton label="DASH" small {...hold("dash")} />
          <TouchButton label="JUMP" {...hold("jump")} />
        </div>
      </div>
    </div>
  );
}

function TouchButton({
  label,
  small = false,
  ...handlers
}: {
  label: string;
  small?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...handlers}
      className={`flex touch-none items-center justify-center rounded-lg border border-[#676078] bg-[#2A2733] font-mono text-[#F0E6C8] active:bg-[#49A8B0] active:text-[#16131F] ${
        small ? "h-11 w-16 text-xs" : "h-14 w-20 text-sm"
      }`}
      style={{ minWidth: 44, minHeight: 44 }}
    >
      {label}
    </button>
  );
}
