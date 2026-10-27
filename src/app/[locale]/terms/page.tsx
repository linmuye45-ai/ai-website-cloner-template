import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export function generateStaticParams() {
  return (["en", "zh", "ja", "es"] as Locale[]).map((locale) => ({ locale }));
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
    title: d.legal.terms.title,
    description: d.legal.terms.sections[0].p?.[0] ?? d.legal.terms.title,
    alternates: {
      canonical: `/${locale}/terms/`,
      languages: Object.fromEntries(
        (["en", "zh", "ja", "es"] as Locale[]).map((l) => [l, `/${l}/terms/`]),
      ),
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const d = getDictionary(raw);
  const legal = d.legal.terms;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <Link href={`/${raw}/`} className="font-pixel text-[10px] text-slate-400 hover:text-amber-300">
        {d.legal.back}
      </Link>
      <h1 className="font-pixel mt-6 text-3xl font-black tracking-[0.15em] text-slate-100">{legal.title}</h1>
      <p className="font-pixel mt-2 text-[10px] tracking-widest text-slate-500">{legal.updated}</p>
      <div className="mt-10 space-y-9">
        {legal.sections.map((s) => (
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
