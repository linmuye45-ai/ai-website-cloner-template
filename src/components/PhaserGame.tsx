'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type * as Phaser from 'phaser';
import type { HudState } from '@/phaser-game/frameConfig';
import type { PlayScene } from '@/phaser-game/PlayScene';
import GameMenu from './GameMenu';
import {
  LEVELS,
  loadSave,
  recordClear,
  saveSettings,
  type SaveData,
} from '@/phaser-game/save';
import { SUNNYLAND } from '@/phaser-game/assets';

const INITIAL_HUD: HudState = {
  hp: 3,
  maxHp: 3,
  gems: 0,
  gemTotal: 0,
  fruits: 0,
  status: 'play',
};

type Screen = 'menu' | 'play';
type ClearInfo = { index: number; gems: number; gemTotal: number; fruits: number };

/**
 * Owns the Phaser game instance and the game-flow state machine:
 * boot → menu → level → win/death overlay → next level or menu.
 * Save profile lives in localStorage; audio settings sync into Phaser.
 */
export default function PhaserGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState<Screen>('menu');
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const [clear, setClear] = useState<ClearInfo | null>(null);
  const levelIndexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;
    void (async () => {
      const { createGame } = await import('@/phaser-game/createGame');
      if (cancelled || !hostRef.current) return;
      game = createGame(hostRef.current);
      gameRef.current = game;
      game.events.on('booted', () => setBooted(true));
      game.events.on('hud', (state: HudState) => setHud(state));
      game.events.on(
        'level-complete',
        (info: Omit<ClearInfo, 'index'> & { mapKey: string }) => {
          const index = LEVELS.findIndex((l) => l.key === info.mapKey);
          levelIndexRef.current = index;
          setSave((prev) =>
            recordClear(prev, index, {
              gems: info.gems,
              total: info.gemTotal,
              fruits: info.fruits,
            }),
          );
          setClear({
            index,
            gems: info.gems,
            gemTotal: info.gemTotal,
            fruits: info.fruits,
          });
        },
      );
    });
    return () => {
      cancelled = true;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const applyAudio = useCallback((settings: SaveData['settings']) => {
    const game = gameRef.current;
    if (!game) return;
    game.registry.set('volume', settings.volume);
    game.registry.set('muted', settings.muted);
    game.sound.volume = settings.volume;
    game.sound.mute = settings.muted;
  }, []);

  const startLevel = useCallback(
    (index: number) => {
      const game = gameRef.current;
      if (!game) return;
      const level = LEVELS[index];
      levelIndexRef.current = index;
      applyAudio(save.settings);
      setClear(null);
      setHud(INITIAL_HUD);
      const scene = game.scene.getScene('Play') as PlayScene;
      scene.scene.start('Play', { mapKey: level.key, musicKey: level.musicKey });
      setScreen('play');
    },
    [applyAudio, save.settings],
  );

  const backToMenu = useCallback(() => {
    const game = gameRef.current;
    game?.scene.stop('Play');
    setClear(null);
    setHud(INITIAL_HUD);
    setScreen('menu');
  }, []);

  const restart = useCallback(() => {
    startLevel(levelIndexRef.current);
  }, [startLevel]);

  const changeSettings = useCallback(
    (settings: SaveData['settings']) => {
      setSave((prev) => saveSettings(prev, settings));
      applyAudio(settings);
    },
    [applyAudio],
  );

  const toggleMute = useCallback(() => {
    changeSettings({ ...save.settings, muted: !save.settings.muted });
  }, [changeSettings, save.settings]);

  const sendInput = useCallback((key: 'left' | 'right' | 'jump', down: boolean) => {
    const scene = gameRef.current?.scene.getScene('Play') as PlayScene | undefined;
    scene?.setVirtualInput(key, down);
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

  const hasNext = clear !== null && clear.index + 1 < LEVELS.length;

  return (
    <div className="w-full">
      {/* The Phaser canvas host is always mounted; the menu overlays it. */}
      <div className="relative mx-auto w-full max-w-[960px]">
        <div
          ref={hostRef}
          className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-[#3a2a4a] bg-[#1b1230] shadow-[0_0_40px_rgba(120,70,200,0.35)] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
        >
          {screen === 'play' && (
            <>
              {/* HUD */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
                <div className="flex gap-1">
                  {Array.from({ length: hud.maxHp }).map((_, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={
                        i < hud.hp
                          ? `${SUNNYLAND}/textures/UI/Heart.png`
                          : `${SUNNYLAND}/textures/UI/Heart-bg.png`
                      }
                      alt=""
                      className="h-5 w-5 object-contain [image-rendering:pixelated] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded bg-black/45 px-2 py-1 font-mono text-xs text-amber-200">
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-[13px] w-[15px] bg-left [image-rendering:pixelated]"
                      style={{
                        backgroundImage: `url('${SUNNYLAND}/textures/Items/gem.png')`,
                        backgroundSize: '500% 100%',
                      }}
                    />
                    {hud.gems}/{hud.gemTotal}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-[21px] w-[21px] bg-left [image-rendering:pixelated]"
                      style={{
                        backgroundImage: `url('${SUNNYLAND}/textures/Items/cherry.png')`,
                        backgroundSize: '500% 100%',
                      }}
                    />
                    {hud.fruits}
                  </span>
                  <button
                    onClick={toggleMute}
                    className="pointer-events-auto rounded px-1 text-white/80 hover:text-white"
                    aria-label={save.settings.muted ? '取消静音' : '静音'}
                  >
                    {save.settings.muted ? '🔇' : '🔊'}
                  </button>
                  <button
                    onClick={backToMenu}
                    className="pointer-events-auto rounded px-1 text-white/80 hover:text-white"
                    aria-label="返回菜单"
                  >
                    ☰
                  </button>
                </div>
              </div>

              {/* Hint */}
              {hud.status === 'play' && (
                <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/70">
                  ← → / A D 移动 · 空格 / W 跳跃 · 手柄自动识别 · 踩头击败敌人
                </p>
              )}

              {/* Win / death overlays */}
              {hud.status !== 'play' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/65 text-center">
                  <h3
                    className={`font-mono text-2xl font-bold ${
                      hud.status === 'win' ? 'text-amber-300' : 'text-red-400'
                    }`}
                  >
                    {hud.status === 'win' ? '关卡完成！' : '你倒下了…'}
                  </h3>
                  {hud.status === 'win' && clear && (
                    <p className="font-mono text-sm text-white/80">
                      宝石 {clear.gems}/{clear.gemTotal} · 樱桃 {clear.fruits}
                      {clear.index + 1 < save.unlocked ? ' · 下一关已解锁' : ''}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    {hud.status === 'win' && hasNext && (
                      <button
                        onClick={() => startLevel(clear!.index + 1)}
                        className="rounded border-2 border-green-300 bg-green-400/90 px-4 py-1.5 font-mono text-sm font-bold text-purple-950 transition hover:bg-green-300"
                      >
                        下一关 →
                      </button>
                    )}
                    <button
                      onClick={restart}
                      className="rounded border-2 border-amber-300 bg-amber-400/90 px-4 py-1.5 font-mono text-sm font-bold text-purple-950 transition hover:bg-amber-300"
                    >
                      重新开始
                    </button>
                    <button
                      onClick={backToMenu}
                      className="rounded border-2 border-white/40 px-4 py-1.5 font-mono text-sm text-white/80 transition hover:bg-white/10"
                    >
                      选关菜单
                    </button>
                  </div>
                </div>
              )}

              {/* Touch controls */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 md:hidden">
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
            </>
          )}
        </div>

        {screen === 'menu' && (
          <div className="absolute inset-0 z-30">
            <GameMenu
              save={save}
              booted={booted}
              onStart={startLevel}
              onSettingsChange={changeSettings}
            />
          </div>
        )}
      </div>

      <p className="mx-auto mt-3 max-w-[960px] text-center font-mono text-[10px] text-white/40">
        美术/音频/地图：WispSnow SunnyLand（CC0-1.0）· 引擎：Phaser 3（MIT）·
        自研引擎版请访问 <Link href="/game" className="text-amber-300/80 underline">/game</Link>
      </p>
    </div>
  );
}
