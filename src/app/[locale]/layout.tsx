import { notFound } from "next/navigation";
import { LOCALES, LOCALE_HTML, isLocale } from "@/i18n/config";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      {/* Runs before hydration so the document language matches the route,
          even though the root <html> tag is shared across static routes. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(LOCALE_HTML[locale])};`,
        }}
      />
      {children}
    </>
  );
}
