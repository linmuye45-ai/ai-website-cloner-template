"use client";

import { ACHIEVEMENTS, ENEMIES, STAGES } from "@/game/content";
import type { SaveData } from "@/game/types";
import { formatCoins, formatTime } from "@/lib/format";
import { LocaleSwitcher, useI18n } from "@/i18n/I18nProvider";
import { SpriteIcon } from "./SpriteIcon";

interface Props {
  save: SaveData;
  onBack: () => void;
}

export function CollectionScreen({ save, onBack }: Props) {
  const { t, enemyName, stageName, stageSubtitle, achievementName, achievementDesc } = useI18n();
  const enemies = Object.values(ENEMIES);
  const seenCount = enemies.filter((e) => save.seenEnemies.includes(e.id)).length;

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-10">
        <button onClick={onBack} className="pixel-btn pixel-corners btn-ghost px-4 py-2 text-xs">
          {t("game.select.back")}
        </button>
        <h1 className="font-pixel text-lg font-black tracking-[0.25em] text-slate-100">
          {t("game.collection.title")}
        </h1>
        <div className="flex items-center gap-3">
          <LocaleSwitcher compact />
          <div className="hud-chip pixel-corners flex items-center gap-2 px-3 py-2">
            <SpriteIcon name="icon_coin" size={18} />
            <span className="font-pixel text-sm font-bold text-amber-300">{formatCoins(save.coins)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard icon="icon_clock" label={t("game.collection.runs")} value={save.totalRuns} />
          <SummaryCard icon="icon_skull" label={t("game.collection.totalKills")} value={save.totalKills} />
          <SummaryCard icon="icon_coin" label={t("game.collection.coinsEarned")} value={save.totalCoins} />
          <SummaryCard
            icon="icon_book"
            label={t("game.collection.bestiary")}
            value={`${seenCount}/${enemies.length}`}
          />
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">
            {t("game.collection.bestiaryTitle")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {enemies.map((e) => {
              const seen = save.seenEnemies.includes(e.id);
              return (
                <div
                  key={e.id}
                  className={`pixel-corners flex flex-col items-center gap-2 border-2 p-3 text-center ${
                    seen ? "border-white/10 bg-black/30" : "border-white/5 bg-black/50"
                  }`}
                >
                  <div style={{ filter: seen ? "none" : "brightness(0.18)" }}>
                    <SpriteIcon name={e.sprite} size={e.boss ? 52 : 40} />
                  </div>
                  <p className="font-pixel text-[10px] font-bold text-slate-200">
                    {seen ? enemyName(e.id) : t("game.collection.unknown")}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {e.boss && (
                      <span className="font-pixel rounded bg-red-500/20 px-1.5 py-0.5 text-[8px] text-red-300">
                        {t("game.collection.bossTag")}
                      </span>
                    )}
                    {e.elite && (
                      <span className="font-pixel rounded bg-purple-500/20 px-1.5 py-0.5 text-[8px] text-purple-300">
                        {t("game.collection.eliteTag")}
                      </span>
                    )}
                    {seen && (
                      <span className="font-pixel rounded bg-white/5 px-1.5 py-0.5 text-[8px] text-slate-400">
                        XP {e.xp}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">
              {t("game.collection.stageRecords")}
            </h2>
            <div className="space-y-3">
              {STAGES.map((s) => {
                const best = save.best[s.id];
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3"
                  >
                    <div>
                      <p className="font-pixel text-xs font-bold" style={{ color: s.accent }}>
                        {stageName(s.id)}
                      </p>
                      <p className="font-pixel text-[9px] text-slate-500">{stageSubtitle(s.id)}</p>
                    </div>
                    {best ? (
                      <div className="text-right font-pixel text-[10px] text-slate-300">
                        <p className={best.victory ? "text-emerald-300" : "text-slate-300"}>
                          {best.victory ? t("game.collection.cleared") : formatTime(best.time)}
                        </p>
                        <p className="text-slate-500">
                          {best.kills} {t("game.hud.kills")} · {t("game.hud.level")} {best.level}
                        </p>
                      </div>
                    ) : (
                      <span className="font-pixel text-[10px] text-slate-600">{t("game.collection.untried")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">
              {t("game.collection.achievements")} · {save.achievements.length}/{ACHIEVEMENTS.length}
            </h2>
            <div className="space-y-2.5">
              {ACHIEVEMENTS.map((a) => {
                const got = save.achievements.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      got ? "border-amber-400/30 bg-amber-400/5" : "border-white/10 bg-black/30"
                    }`}
                  >
                    <div style={{ filter: got ? "none" : "grayscale(1) brightness(0.5)" }}>
                      <SpriteIcon name={a.icon} size={24} />
                    </div>
                    <div>
                      <p className={`font-pixel text-[11px] font-bold ${got ? "text-amber-300" : "text-slate-400"}`}>
                        {achievementName(a.id)}
                      </p>
                      <p className="text-[10px] text-slate-500">{achievementDesc(a.id)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="pixel-panel pixel-corners flex items-center gap-3 p-4">
      <SpriteIcon name={icon} size={26} />
      <div>
        <p className="text-base font-black text-slate-100">{typeof value === "number" ? formatCoins(value) : value}</p>
        <p className="font-pixel text-[9px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}
