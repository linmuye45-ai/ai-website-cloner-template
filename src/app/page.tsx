"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { detectLocale } from "@/i18n/config";

// Root URL has no locale segment: send first-time visitors to a localized
// landing based on their saved preference or browser language. The locale
// pages themselves are fully static and linked from sitemap/hreflang, so
// crawlers never depend on this client redirect.
export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${detectLocale()}/`);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f14]">
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <p className="font-pixel text-xs tracking-[0.3em] text-slate-500">DUSKFALL…</p>
    </main>
  );
}
