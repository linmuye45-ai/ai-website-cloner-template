'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type * as Phaser from 'phaser';
import type { HudState } from '@/phaser-game/frameConfig';
import type { PlayScene } from '@/phaser-game/PlayScene';

const INITIAL_HUD: HudState = {
  hp: 3,
  maxHp: 3,
  gems: 0,
  gemTotal: 0,
  fruits: 0,
  status: 'play',
};

/**
 * Client wrapper around the Phaser 3 Sunny Land build: owns the game
 * instance, renders the DOM HUD, touch controls and status overlays.
 */
export default function PhaserGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;
    void (async () => {
      const { createGame } = await import('@/phaser-game/createGame');
      if (cancelled || !hostRef.current) return;
      game = createGame(hostRef.current);
      gameRef.current = game;
      game.events.on('hud', (state: HudState) => setHud(state));
      game.events.once('ready', () => setReady(true));
      setReady(true);
    })();
    return () => {
      cancelled = true;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const sendInput = useCallback((key: 'left' | 'right' | 'jump', down: boolean) => {
    const scene = gameRef.current?.scene.getScene('Play') as PlayScene | undefined;
    scene?.setVirtualInput(key, down);
  }, []);

  const restart = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    const scene = game.scene.getScene('Play') as PlayScene | undefined;
    scene?.scene.restart();
    setHud(INITIAL_HUD);
  }, []);

  const toggleMute = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    game.sound.mute = !game.sound.mute;
    setMuted(game.sound.mute);
  }, []);

  const holdProps = (key: 'left' | 'right' | 'jump') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      sendInput(key, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      sendInput(key, false);
    },
    onPointerLeave: () => sendInput(key, false),
    onPointerCancel: () => sendInput(key, false),
  });

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-[960px] overflow-hidden rounded-lg border-2 border-[#3a2a4a] bg-[#1b1230] shadow-[0_0_40px_rgba(120,70,200,0.35)]">
        {/* Phaser mounts here; 16:9 frame */}
        <div ref={hostRef} className="aspect-video w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex gap-1">
            {Array.from({ length: hud.maxHp }).map((_, i) => (
              <img
                key={i}
                src={
                  i < hud.hp
                    ? '/vendor/sunnyland/textures/UI/Heart.png'
                    : '/vendor/sunnyland/textures/UI/Heart-bg.png'
                }
                alt=""
                className="h-5 w-5 object-contain [image-rendering:pixelated] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              />
            ))}
          </div>
          <div className="flex items-center gap-3 rounded bg-black/45 px-2 py-1 font-mono text-xs text-amber-200">
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-[13px] w-[15px] bg-[url('/vendor/sunnyland/textures/Items/gem.png')] bg-[length:500%_100%] bg-left [image-rendering:pixelated]"
              />
              {hud.gems}/{hud.gemTotal}
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-[21px] w-[21px] bg-[url('/vendor/sunnyland/textures/Items/cherry.png')] bg-[length:500%_100%] bg-left [image-rendering:pixelated]"
              />
              {hud.fruits}
            </span>
            <button
              onClick={toggleMute}
              className="pointer-events-auto rounded px-1 text-white/80 hover:text-white"
              aria-label={muted ? '取消静音' : '静音'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Desktop hint */}
        {ready && hud.status === 'play' && (
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/70">
            ← → / A D 移动 · 空格 / W 跳跃 · 手柄自动识别 · 踩头击败敌人
          </p>
        )}

        {/* Win / death overlays */}
        {hud.status !== 'play' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 text-center">
            <h3
              className={`font-mono text-2xl font-bold ${
                hud.status === 'win' ? 'text-amber-300' : 'text-red-400'
              }`}
            >
              {hud.status === 'win' ? '关卡完成！' : '你倒下了…'}
            </h3>
            {hud.status === 'win' && (
              <p className="font-mono text-sm text-white/80">
                宝石 {hud.gems}/{hud.gemTotal} · 樱桃 {hud.fruits}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={restart}
                className="rounded border-2 border-amber-300 bg-amber-400/90 px-4 py-1.5 font-mono text-sm font-bold text-purple-950 transition hover:bg-amber-300"
              >
                重新开始
              </button>
              <Link
                href="/"
                className="rounded border-2 border-white/40 px-4 py-1.5 font-mono text-sm text-white/80 transition hover:bg-white/10"
              >
                回首页
              </Link>
            </div>
          </div>
        )}

        {/* Touch controls */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:hidden">
          <div className="flex gap-3">
            <button
              {...holdProps('left')}
              className="h-14 w-14 touch-none rounded-full border-2 border-white/40 bg-white/15 text-xl text-white active:bg-white/35"
              aria-label="左"
            >
              ◀
            </button>
            <button
              {...holdProps('right')}
              className="h-14 w-14 touch-none rounded-full border-2 border-white/40 bg-white/15 text-xl text-white active:bg-white/35"
              aria-label="右"
            >
              ▶
            </button>
          </div>
          <button
            {...holdProps('jump')}
            className="h-16 w-16 touch-none rounded-full border-2 border-amber-300/60 bg-amber-400/25 font-mono text-xs font-bold text-amber-100 active:bg-amber-400/50"
            aria-label="跳"
          >
            跳
          </button>
        </div>
      </div>
    </div>
  );
}
