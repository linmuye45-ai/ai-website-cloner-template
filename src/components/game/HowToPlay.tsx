"use client";

import { PASSIVES, WEAPONS } from "@/game/content";
import { LocaleSwitcher, useI18n } from "@/i18n/I18nProvider";
import { SpriteIcon } from "./SpriteIcon";

interface Props {
  onBack: () => void;
}

const THREAT_ICONS = ["en_cultist", "en_beetle", "en_bloater", "en_slime"];
const PICKUP_ICONS = ["gem_1", "coin", "chicken", "magnet", "chest"];
const BASE_WEAPONS = Object.values(WEAPONS).filter((w) => !w.evolvedFrom);
const EVO_WEAPONS = Object.values(WEAPONS).filter((w) => w.evolvedFrom);

export function HowToPlay({ onBack }: Props) {
  const { t, weaponName, weaponDesc, passiveName, dict } = useI18n();
  const h = dict.game.howto;

  return (
    <div className="min-h-screen w-full bg-[#0b0f14]">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-10">
        <button onClick={onBack} className="pixel-btn pixel-corners btn-ghost px-4 py-2 text-xs">
          {t("game.select.back")}
        </button>
        <h1 className="font-pixel text-lg font-black tracking-[0.25em] text-slate-100">{h.title}</h1>
        <LocaleSwitcher compact />
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8">
        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">{h.loopTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {h.loop.map((step, i) => (
              <div key={step.t} className="relative rounded-lg border border-white/10 bg-black/30 p-4">
                <span className="font-pixel absolute -top-3 left-3 rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black">
                  {i + 1}
                </span>
                <p className="font-pixel mt-2 text-xs font-bold text-slate-100">{step.t}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">
            {h.compendiumTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {BASE_WEAPONS.map((w) => (
              <div key={w.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="mt-0.5 rounded bg-white/5 p-1.5">
                  <SpriteIcon name={w.icon} size={28} />
                </div>
                <div>
                  <p className="font-pixel text-xs font-bold" style={{ color: w.color }}>
                    {weaponName(w.id)}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{weaponDesc(w.id)}</p>
                  <p className="font-pixel mt-1.5 text-[9px] text-slate-500">
                    {h.rankLine} {w.levels[7].damage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-2 text-sm font-bold tracking-[0.2em] text-amber-300">{h.forgeTitle}</h2>
          <p className="mb-5 text-[11px] leading-relaxed text-slate-400">{h.forgeLead}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {EVO_WEAPONS.map((evo) => {
              const base = WEAPONS[evo.evolvedFrom!];
              const relic = PASSIVES[evo.requires!];
              return (
                <div
                  key={evo.id}
                  className="flex items-center gap-3 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3"
                >
                  <div className="flex items-center gap-1.5">
                    <SpriteIcon name={base.icon} size={26} />
                    <span className="font-pixel text-[10px] text-slate-500">+</span>
                    <SpriteIcon name={relic.icon} size={22} />
                  </div>
                  <span className="font-pixel text-sm text-amber-300">→</span>
                  <div>
                    <p className="font-pixel text-xs font-bold" style={{ color: evo.color }}>
                      {weaponName(evo.id)}
                    </p>
                    <p className="font-pixel mt-0.5 text-[9px] text-slate-500">
                      {weaponName(base.id)} × {passiveName(relic.id)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">{h.threatsTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {h.threats.map((threat, i) => (
              <div key={threat.name} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="mt-0.5 rounded bg-white/5 p-1.5">
                  <SpriteIcon name={THREAT_ICONS[i]} size={30} />
                </div>
                <div>
                  <p className="font-pixel text-xs font-bold text-rose-300">{threat.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{threat.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">{h.relicsTitle}</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {Object.values(PASSIVES).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/30 p-2.5">
                  <SpriteIcon name={p.icon} size={22} />
                  <div>
                    <p className="font-pixel text-[11px] font-bold text-slate-200">{passiveName(p.id)}</p>
                    <p className="text-[10px] text-slate-500">{dict.content.passive[p.id]?.desc ?? p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">{h.pickupsTitle}</h2>
            <div className="space-y-2.5">
              {h.pickups.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-2.5">
                  <SpriteIcon name={PICKUP_ICONS[i]} size={26} />
                  <div>
                    <p className="font-pixel text-[11px] font-bold text-slate-200">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3">
              <p className="font-pixel text-[10px] leading-relaxed text-amber-200/90">{h.tip}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
