import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmbientCanvas } from "@/components/game/AmbientCanvas";
import { SpriteIcon } from "@/components/game/SpriteIcon";
import { CHARACTERS, ENEMIES, STAGES, WEAPONS } from "@/game/content";
import { LOCALES, LOCALE_LABELS, LOCALE_OG, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

const FEATURE_ICONS = ["icon_storm", "icon_skull", "icon_star", "icon_trophy", "icon_book", "icon_coin"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const d = getDictionary(locale);
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])),
        "x-default": "/en/",
      },
    },
    openGraph: {
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
      url: `/${locale}/`,
      locale: LOCALE_OG[locale],
      siteName: "Duskfall Survivors",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Duskfall Survivors key art" }],
    },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const d = getDictionary(locale);
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
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href={"/play#howto"}>
              {d.nav.manual}
            </Link>
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href={"/play#collection"}>
              {d.nav.bestiary}
            </Link>
            <Link className="rounded px-2 py-1 text-slate-300 hover:text-amber-300" href={`/${locale}/privacy/`}>
              {d.nav.privacy}
            </Link>
            <LanguageLinks locale={locale} />
            <Link href={"/play"} className="pixel-btn pixel-corners btn-gold px-4 py-2 text-[10px] sm:text-xs">
              {d.nav.playFree}
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-10 text-center sm:pt-16">
          <p className="font-pixel mb-4 text-[10px] tracking-[0.45em] text-emerald-300/90 anim-fade-in sm:text-xs">
            {d.hero.eyebrow}
          </p>
          <h1 className="font-pixel text-5xl font-black leading-none text-hard-shadow sm:text-7xl md:text-8xl">
            <span className="shimmer-text">{d.hero.brandTop}</span>
          </h1>
          <h2 className="font-pixel mt-3 text-2xl font-black tracking-[0.35em] text-slate-200 text-hard-shadow sm:text-4xl">
            {d.hero.brandBottom}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{d.hero.tagline}</p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href={"/play"} className="pixel-btn pixel-corners btn-gold px-10 py-4 text-base">
              {d.hero.ctaPrimary}
            </Link>
            <Link href="#how" className="pixel-btn pixel-corners btn-slate px-8 py-4 text-sm">
              {d.hero.ctaSecondary}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 font-pixel text-center sm:gap-12">
            <Stat value={String(baseWeaponCount)} label={d.hero.statWeapons} />
            <Stat value={String(enemyCount)} label={d.hero.statEnemies} />
            <Stat value={String(STAGES.length)} label={d.hero.statStages} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
          {d.features.titlePrefix}
          <span className="text-amber-300">{d.features.titleHighlight}</span>
          {d.features.titleSuffix}
        </h2>
        <p className="mt-3 text-center text-sm text-slate-400">{d.features.lead}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {d.features.items.map((f, i) => (
            <article key={f.title} className="card-hover pixel-corners border-2 border-white/10 bg-[#141b24] p-6">
              <div className="w-fit rounded-lg bg-black/40 p-2.5">
                <SpriteIcon name={FEATURE_ICONS[i]} size={30} />
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
            {d.characters.titlePrefix} <span className="text-amber-300">{d.characters.titleHighlight}</span>
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHARACTERS.map((c) => (
              <article
                key={c.id}
                className="card-hover pixel-corners flex flex-col items-center border-2 border-white/10 bg-black/30 p-6 text-center"
              >
                <div className="flex h-20 items-end">
                  <SpriteIcon name={c.sprite} size={64} />
                </div>
                <h3 className="font-pixel mt-4 text-sm font-bold" style={{ color: c.accent }}>
                  {d.content.character[c.id]?.name ?? c.name}
                </h3>
                <p className="font-pixel text-[9px] tracking-widest text-slate-500">
                  {d.content.character[c.id]?.title ?? c.title}
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
                  {d.content.character[c.id]?.desc ?? c.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
          {d.how.titlePrefix} <span className="text-amber-300">{d.how.titleHighlight}</span>
        </h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {d.how.steps.map((s, i) => (
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
          <Link href={"/play"} className="pixel-btn pixel-corners btn-gold px-12 py-4 text-base">
            {d.how.cta}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#0e141c] py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-pixel text-center text-2xl font-black tracking-[0.2em] text-slate-100 sm:text-3xl">
            {d.faq.title}
          </h2>
          <div className="mt-10 space-y-3">
            {d.faq.items.map((f) => (
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
            <p className="mt-1 text-[11px] text-slate-500">{d.footer.tagline}</p>
          </div>
          <nav className="flex gap-5 font-pixel text-[10px] text-slate-400">
            <Link href={"/play"} className="hover:text-amber-300">{d.nav.playFree}</Link>
            <Link href={`/${locale}/privacy/`} className="hover:text-amber-300">{d.nav.privacy}</Link>
            <Link href={`/${locale}/terms/`} className="hover:text-amber-300">{d.nav.terms}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function LanguageLinks({ locale }: { locale: Locale }) {
  return (
    <span className="flex items-center gap-1 rounded border border-white/15 px-2 py-1">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}/`}
          aria-label={LOCALE_LABELS[l]}
          className={`px-1 ${l === locale ? "text-amber-300" : "text-slate-500 hover:text-slate-200"}`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </span>
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
