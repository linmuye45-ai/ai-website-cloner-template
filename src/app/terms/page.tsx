import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Duskfall Survivors: original intellectual property, acceptable use, disclaimers and DMCA notice procedure.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    h: "1. Acceptance",
    p: [
      "By accessing or playing Duskfall Survivors (the “Game”) you agree to these terms. If you do not agree, do not use the Game.",
    ],
  },
  {
    h: "2. Original intellectual property",
    p: [
      "All Game content — including source code, pixel-art sprites, level data, synthesized music and sound effects, names, characters and text — is original work created for this project and is made available under the repository's open-source license. No art, audio, names or other assets from third-party commercial games are included or distributed with the Game.",
      "Trademarks of other games referenced in comparisons or documentation belong to their respective owners; reference does not imply affiliation or endorsement.",
    ],
  },
  {
    h: "3. Acceptable use",
    p: ["You agree not to:"],
    list: [
      "Attempt to disrupt, overload or reverse-attack the hosting infrastructure",
      "Redistribute the Game while misrepresenting its ownership or stripping license notices",
      "Use the Game to harass, threaten or target other people — it contains no social features, and any such use occurs outside the software",
      "Automate access in ways that violate the terms of any platform the site is hosted on",
    ],
  },
  {
    h: "4. User data",
    p: [
      "The Game stores progress locally on your device and maintains no user accounts. You control that data; see the Privacy Policy for details.",
    ],
  },
  {
    h: "5. Disclaimers",
    p: [
      "The Game is provided “as is” without warranties of any kind, express or implied, including fitness for a particular purpose or uninterrupted availability. High scores and saved progress can be lost if browser storage is cleared or corrupted.",
      "To the maximum extent permitted by law, the maintainers are not liable for indirect, incidental or consequential damages arising from use of the Game.",
    ],
  },
  {
    h: "6. DMCA / copyright notices",
    p: [
      "If you believe content in the repository infringes your copyright, submit a notice containing: (a) identification of the copyrighted work; (b) the exact file/URL allegedly infringing; (c) your contact details; (d) a good-faith belief statement; (e) a statement under penalty of perjury that the information is accurate and you are authorized to act; and (f) a physical or electronic signature. File it through the repository's issue tracker. Valid notices will be reviewed promptly and content removed where appropriate, with a counter-notice process available.",
    ],
  },
  {
    h: "7. Changes",
    p: [
      "These terms may be revised; continued use after changes constitutes acceptance. The updated date below identifies the current version.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <Link href="/" className="font-pixel text-[10px] text-slate-400 hover:text-amber-300">
        ← Back to site
      </Link>
      <h1 className="font-pixel mt-6 text-3xl font-black tracking-[0.15em] text-slate-100">
        Terms of Service
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
