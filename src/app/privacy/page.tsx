import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Duskfall Survivors privacy policy: no accounts, no tracking, no servers. Save data stays in your browser's localStorage.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    h: "The short version",
    p: [
      "Duskfall Survivors does not collect personal data, has no accounts, runs no analytics or advertising scripts, and uploads nothing from your device. The game is fully playable with JavaScript in your browser and stores its save data locally.",
    ],
  },
  {
    h: "What is stored on your device",
    p: [
      "The game uses your browser's localStorage (key: duskfall-survivors-save-v1) to persist the following:",
    ],
    list: [
      "Vault coin balance and total coins earned",
      "Unlocked characters, achievements and bestiary entries",
      "Per-stage best records (time survived, kills, level, victory flag)",
      "Run counters and your sound/music volume preferences",
    ],
  },
  {
    h: "What is NOT collected",
    list: [
      "No name, email, phone number, location or payment information",
      "No cookies, fingerprinting, analytics or advertising identifiers",
      "No gameplay telemetry or network requests carrying your data",
      "No third-party trackers, embeds or external fonts",
    ],
  },
  {
    h: "Network and hosting",
    p: [
      "The site itself is served as static web assets by the hosting provider you obtained it from. The game logic, rendering and audio synthesis all execute locally in your browser; gameplay never communicates with a backend.",
    ],
  },
  {
    h: "Audio and permissions",
    p: [
      "Sound effects and music are synthesized locally with the Web Audio API after you interact with the page (browsers require a user gesture before audio can start). No microphone or other device permission is requested.",
    ],
  },
  {
    h: "How to delete your data",
    p: [
      "All saved data can be removed at any time: open the site, then clear the site's storage via your browser's site settings, or run localStorage.removeItem('duskfall-survivors-save-v1') in the browser console. Uninstalling the site/PWA or clearing browsing data also removes it.",
    ],
  },
  {
    h: "Children",
    p: [
      "The game contains cartoon/fantasy combat with no realistic violence, no gore and no social features, and collects no data, so it is suitable for a broad audience. Because no personal data is collected, no parental-consent data flows exist.",
    ],
  },
  {
    h: "Changes and contact",
    p: [
      "This policy may be updated as the game evolves; material changes will be reflected by the updated date below. Questions can be filed as an issue on the project's public repository.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <Link href="/" className="font-pixel text-[10px] text-slate-400 hover:text-amber-300">
        ← Back to site
      </Link>
      <h1 className="font-pixel mt-6 text-3xl font-black tracking-[0.15em] text-slate-100">
        Privacy Policy
      </h1>
      <p className="font-pixel mt-2 text-[10px] tracking-widest text-slate-500">
        Last updated: 27 October 2026 · Effective immediately
      </p>
      <div className="mt-10 space-y-9">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-pixel text-sm font-bold text-amber-300">{s.h}</h2>
            {s.p?.map((t) => (
              <p key={t} className="mt-3 text-[13px] leading-relaxed text-slate-300">
                {t}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[13px] leading-relaxed text-slate-300">
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
