'use client';

import { LEVELS, type SaveData } from '@/phaser-game/save';
import { SUNNYLAND } from '@/phaser-game/assets';

type Props = {
  save: SaveData;
  booted: boolean;
  onStart: (index: number) => void;
  onSettingsChange: (settings: SaveData['settings']) => void;
};

/**
 * Title screen / level select / settings, rendered as a DOM overlay that
 * matches the 16:9 game frame. Uses the pack's title art and heart icons.
 */
export default function GameMenu({ save, booted, onStart, onSettingsChange }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#1b1230]">
      {/* Parallax-ish backdrop from the pack */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${SUNNYLAND}/textures/Layers/back.png`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70 [image-rendering:pixelated]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b1230]/60 via-transparent to-[#1b1230]/90" />

      <div className="relative flex h-full flex-col items-center justify-center gap-5 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SUNNYLAND}/textures/UI/title-screen.png`}
          alt="Sunny Land"
          className="w-56 [image-rendering:pixelated] sm:w-72"
        />
        <p className="font-mono text-[11px] tracking-widest text-amber-100/80">
          PHASER 3 · CC0 SUNNY LAND
        </p>

        <div className="grid w-full max-w-md gap-2">
          {LEVELS.map((level, i) => {
            const locked = i + 1 > save.unlocked;
            const best = save.best[level.key];
            return (
              <button
                key={level.key}
                disabled={locked || !booted}
                onClick={() => onStart(i)}
                className={`flex items-center justify-between rounded-md border-2 px-4 py-2.5 font-mono text-left transition ${
                  locked
                    ? 'cursor-not-allowed border-white/10 bg-black/50 text-white/35'
                    : 'border-amber-300/70 bg-amber-400/15 text-amber-100 hover:bg-amber-400/30'
                }`}
              >
                <span>
                  <span className="block text-sm font-bold">
                    {i + 1}. {level.title}
                  </span>
                  <span className="block text-[10px] text-white/55">{level.subtitle}</span>
                </span>
                <span className="text-xs">
                  {locked ? '🔒' : best ? `💎 ${best.gems}/${best.total}` : '▶ 开始'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 rounded-md bg-black/45 px-4 py-2 font-mono text-[11px] text-white/80">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={save.settings.muted}
              onChange={(e) =>
                onSettingsChange({ ...save.settings, muted: e.target.checked })
              }
            />
            静音
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            音量
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={save.settings.volume}
              disabled={save.settings.muted}
              onChange={(e) =>
                onSettingsChange({
                  ...save.settings,
                  volume: Number(e.target.value),
                })
              }
              className="w-24 accent-amber-400"
            />
          </label>
        </div>

        <p className="font-mono text-[9px] text-white/40">
          键盘 / 手柄 / 触屏均可 · 进度自动保存在本机
        </p>
      </div>
    </div>
  );
}
