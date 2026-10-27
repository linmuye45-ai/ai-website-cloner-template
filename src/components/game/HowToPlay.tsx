"use client";

import { PASSIVES, WEAPONS } from "@/game/content";
import { SpriteIcon } from "./SpriteIcon";

const BASE_WEAPONS = Object.values(WEAPONS).filter((w) => !w.evolvedFrom);
const EVO_WEAPONS = Object.values(WEAPONS).filter((w) => w.evolvedFrom);

interface Props {
  onBack: () => void;
}

const LOOP = [
  { t: "Move", d: "WASD or arrow keys. On touch screens, drag anywhere to steer." },
  { t: "Auto-fire", d: "Your weapons target and fire on their own — positioning is everything." },
  { t: "Collect", d: "Enemies drop XP gems. Walk near them and your lodestone drags them in." },
  { t: "Level up", d: "Each level pauses the fight and offers three upgrades. Stack weapons to level 8." },
  { t: "Evolve", d: "A maxed weapon plus its maxed paired relic unlocks a single ultimate evolution." },
  { t: "Survive", d: "Bosses arrive at 05:00, 10:00 and 14:00 — at half health they enrage. Last until 15:00." },
];

const THREATS = [
  { icon: "en_cultist", name: "Hooded Cultist", d: "Keeps its distance, strafes and lobs arcane bolts. Close the gap fast." },
  { icon: "en_beetle", name: "Grave Beetle", d: "Winds up with a red mark, then dashes in a straight line. Sidestep the tell." },
  { icon: "en_bloater", name: "Bloated One", d: "Ignites a fuse when you get close and detonates in an area. Run perpendicular." },
  { icon: "en_slime", name: "Grave Slime", d: "Splits into two smaller slimes on death — clear the minis before they surround you." },
];

const PICKUPS = [
  { icon: "gem_1", name: "XP Gem", d: "Blue, green and red gems grant 1, 5 and 10 experience." },
  { icon: "coin", name: "Coin", d: "Banked after every run. Recruit new survivors in the vault." },
  { icon: "chicken", name: "Roast Chicken", d: "Rare field ration that restores 30 health." },
  { icon: "magnet", name: "Lodestone", d: "Six seconds of vacuum — every gem on screen flies to you." },
  { icon: "chest", name: "Boss Chest", d: "Bosses drop treasure: coins, healing and a free weapon level." },
];

export function HowToPlay({ onBack }: Props) {
  return (
    <div className="min-h-screen w-full bg-[#0b0f14]">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-10">
        <button onClick={onBack} className="pixel-btn pixel-corners btn-ghost px-4 py-2 text-xs">
          ← Back
        </button>
        <h1 className="font-pixel text-lg font-black tracking-[0.25em] text-slate-100">Field Manual</h1>
        <div className="w-20" />
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8">
        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">The Survival Loop</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {LOOP.map((step, i) => (
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
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">Weapon Compendium</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {BASE_WEAPONS.map((w) => (
              <div key={w.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="mt-0.5 rounded bg-white/5 p-1.5">
                  <SpriteIcon name={w.icon} size={28} />
                </div>
                <div>
                  <p className="font-pixel text-xs font-bold" style={{ color: w.color }}>
                    {w.name}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{w.desc}</p>
                  <p className="font-pixel mt-1.5 text-[9px] text-slate-500">8 ranks · max {w.levels[7].damage} base damage</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-2 text-sm font-bold tracking-[0.2em] text-amber-300">Evolution Forge</h2>
          <p className="mb-5 text-[11px] leading-relaxed text-slate-400">
            Max the weapon and its paired relic to rank 5, and the evolution appears in your next level-up draft.
            It replaces the base weapon in the same slot.
          </p>
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
                      {evo.name}
                    </p>
                    <p className="font-pixel mt-0.5 text-[9px] text-slate-500">
                      {base.name} × {relic.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pixel-panel pixel-corners p-6 anim-fade-up">
          <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">Threat Atlas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {THREATS.map((t) => (
              <div key={t.name} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="mt-0.5 rounded bg-white/5 p-1.5">
                  <SpriteIcon name={t.icon} size={30} />
                </div>
                <div>
                  <p className="font-pixel text-xs font-bold text-rose-300">{t.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">Passive Relics</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {Object.values(PASSIVES).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/30 p-2.5">
                  <SpriteIcon name={p.icon} size={22} />
                  <div>
                    <p className="font-pixel text-[11px] font-bold text-slate-200">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pixel-panel pixel-corners p-6 anim-fade-up">
            <h2 className="font-pixel mb-5 text-sm font-bold tracking-[0.2em] text-amber-300">Field Pickups</h2>
            <div className="space-y-2.5">
              {PICKUPS.map((p) => (
                <div key={p.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-2.5">
                  <SpriteIcon name={p.icon} size={26} />
                  <div>
                    <p className="font-pixel text-[11px] font-bold text-slate-200">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3">
              <p className="font-pixel text-[10px] leading-relaxed text-amber-200/90">
                Tip: you can hold six weapons and six relics. When everything is maxed, level-ups
                become Healing Salves. Save relic slots for the pairs behind your evolutions!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
