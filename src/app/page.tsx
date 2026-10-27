import type { Metadata } from "next";
import Link from "next/link";
import { AmbientCanvas } from "@/components/game/AmbientCanvas";
import { SpriteIcon } from "@/components/game/SpriteIcon";
import { CHARACTERS, ENEMIES, STAGES, WEAPONS } from "@/game/content";

export const metadata: Metadata = {
  title: "Duskfall Survivors — Free 16-bit Pixel Horde Survival Game",
  description:
    "Play Duskfall Survivors free in your browser: 15 minutes of escalating monster waves, eight evolvable weapons, dynamic night lighting, screen-filling bosses and roguelite builds. No download, no sign-up.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Duskfall Survivors — 16-bit Pixel Horde Survival",
    description:
      "Survive the dusk. Eight evolvable weapons, four enemy archetypes, three cursed stages — free in your browser.",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Duskfall Survivors key art" }],
  },
};

const FEATURES = [
  {
    icon: "icon_storm",
    title: "Eight evolvable weapons",
    body: "Homing bolts, arcing whips, meteoric axes, lightning sigils and more — each with eight ranks and a powerful final evolution.",
  },
  {
    icon: "icon_skull",
    title: "Four enemy archetypes",
    body: "Ranged cultists that kite you, telegraphing chargers, fuse-lit exploders and slimes that split into smaller kin.",
  },
  {
    icon: "icon_star",
    title: "Dynamic night lighting",
    body: "Darkness deepens minute by minute. Your flickering light pool, projectiles and explosions carve visibility out of the night.",
  },
  {
    icon: "icon_trophy",
    title: "Three bosses every run",
    body: "At 05:00, 10:00 and 14:00 a boss hunts you down — and enrages at half health with summon swarms and radial bullet bursts.",
  },
  {
    icon: "icon_book",
    title: "Roguelite draft economy",
    body: "Three-card level-ups, two rerolls, skip-for-XP and six weapon plus six relic slots. No two builds play the same.",
  },
  {
    icon: "icon_coin",
    title: "Persistent vault",
    body: "Coins bank between runs to unlock new survivors. Records, bestiary and ten achievements persist entirely on your device.",
  },
];

const STEPS = [
  { t: "Move", d: "WASD or arrow keys on desktop, drag-to-steer joystick on touch screens." },
  { t: "Auto-fire", d: "Weapons target and fire on their own. Positioning is the entire skill." },
  { t: "Collect", d: "Vacuum XP gems, coins, healing chickens and lodestones off the killing field." },
  { t: "Draft", d: "Every level pauses the fight for a three-card upgrade. Reroll twice or skip for XP." },
  { t: "Survive 15:00", d: "Beat three bosses, then push into endless mode where difficulty never stops scaling." },
];

const FAQ = [
  {
    q: "Is Duskfall Survivors really free?",
    a: "Yes. There are no purchases, no ads, no accounts and no sign-up. Open the page and play.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The game runs in any modern browser using the Canvas 2D API. It also works on touch devices with a virtual joystick.",
  },
  {
    q: "Does it collect my data?",
    a: "No personal data is collected and nothing is uploaded. Save data (coins, unlocks, settings) lives only in your browser's localStorage. See the Privacy page for details.",
  },
  {
    q: "How long is a run?",
    a: "A stage takes fifteen minutes to clear, with bosses at five, ten and fourteen minutes. Cleared runs can continue in endless mode.",
  },
  {
    q: "Are the art and sounds original?",
    a: "Every sprite is authored as original pixel art rendered in code, and all music plus sound effects are synthesized with the Web Audio API. No third-party game assets are used.",
  },
];

export default function LandingPage() {
  const enemyCount = Object.keys(ENEMIES).length;
  const baseWeaponCount = Object.values(WEAPONS).filter((w) => !w.evolvedFrom).length;
  return (
    <main className="relative w-full overflow-hidden bg-[#0b0f14]">
      {/* Hero */}
      <section className="relative min-h-[92vh]">
        <AmbientCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f14]/60 via-transparent to-[#0b0f14]" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <span className="font-pixel text-sm font-black tracking-[0.25em] text-amber-300">DUSKFALL</span>
          <div className="flex items-center gap-2 font-pixel text-[10px] sm:gap-4 sm:text-xs">
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href="/play#howto">
              Manual
            </Link>
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href="/play#collection">
              Bestiary
            </Link>
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href="/privacy">
              Privacy
            </Link>
            <Link
              href="/play"
              className="pixel-btn pixel-corners btn-gold px-4 py-2 text-[10px] sm:text-xs"
            >
              Play Free
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-10 text-center sm:pt-16">
          <p className="font-pixel mb-4 text-[10px] tracking-[0.45em] text-emerald-300/90 anim-fade-in sm:text-xs">
            A 16-bit horde survival
          </p>
          <h1 className="font-pixel text-5xl font-black leading-none text-hard-shadow sm:text-7xl md:text-8xl">
            <span className="shimmer-text">DUSKFALL</span>
          </h1>
          <h2 className="font-pixel mt-3 text-2xl font-black tracking-[0.35em] text-slate-200 text-hard-shadow sm:text-4xl">
            SURVIVORS
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Fifteen minutes. An endless rising dead. Master eight auto-firing weapons, draft a
            broken build, and light the night yourself in this free browser survival roguelite.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/play" className="pixel-btn pixel-corners btn-gold px-10 py-4 text-base">
              ▶ Play Free — No Download
            </Link>
            <Link href="#how" className="pixel-btn pixel-corners btn-slate px-8 py-4 text-sm">
              How it works
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 font-pixel text-center sm:gap-12">
            <Stat value={String(baseWeaponCount)} label="weapons" />
            <Stat value={String(enemyCount)} label="enemy types" />
            <Stat value={String(STAGES.length)} label="cursed stages" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
          Built like a <span className="text-amber-300">full game</span>, not a demo
        </h2>
        <p className="mt-3 text-center text-sm text-slate-400">
          Every system a horde-survival player expects, plus lighting and AI most browser clones skip.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card-hover pixel-corners border-2 border-white/10 bg-[#141b24] p-6">
              <div className="w-fit rounded-lg bg-black/40 p-2.5">
                <SpriteIcon name={f.icon} size={30} />
              </div>
              <h3 className="font-pixel mt-4 text-sm font-bold text-slate-100">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Characters */}
      <section className="border-y border-white/10 bg-[#0e141c] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
            Choose your <span className="text-amber-300">survivor</span>
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHARACTERS.map((c) => (
              <article key={c.id} className="card-hover pixel-corners flex flex-col items-center border-2 border-white/10 bg-black/30 p-6 text-center">
                <div className="flex h-20 items-end">
                  <SpriteIcon name={c.sprite} size={64} />
                </div>
                <h3 className="font-pixel mt-4 text-sm font-bold" style={{ color: c.accent }}>
                  {c.name}
                </h3>
                <p className="font-pixel text-[9px] tracking-widest text-slate-500">{c.title}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-slate-400">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
          From first click to <span className="text-amber-300">stage clear</span>
        </h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.t} className="pixel-corners relative border-2 border-white/10 bg-[#141b24] p-5">
              <span className="font-pixel absolute -top-3 left-4 rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black">
                {i + 1}
              </span>
              <h3 className="font-pixel mt-2 text-xs font-bold text-slate-100">{s.t}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link href="/play" className="pixel-btn pixel-corners btn-gold px-12 py-4 text-base">
            Start your first run
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#0e141c] py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
            Questions
          </h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="pixel-corners group border-2 border-white/10 bg-black/30 px-5 py-4">
                <summary className="font-pixel cursor-pointer list-none text-[13px] font-bold text-slate-100 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-amber-300">+</span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-6 text-[13px] leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-pixel text-xs font-black tracking-[0.25em] text-amber-300">DUSKFALL SURVIVORS</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Original code, pixel art and synthesized audio. No third-party game assets.
            </p>
          </div>
          <nav className="flex gap-5 font-pixel text-[10px] text-slate-400">
            <Link href="/play" className="hover:text-amber-300">Play</Link>
            <Link href="/privacy" className="hover:text-amber-300">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-300">Terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-pixel text-2xl font-black text-amber-300 sm:text-3xl">{value}</p>
      <p className="font-pixel mt-1 text-[9px] tracking-widest text-slate-400">{label}</p>
    </div>
  );
}
