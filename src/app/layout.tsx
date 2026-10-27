import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://duskfall-survivors.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Duskfall Survivors — Free 16-bit Pixel Horde Survival Game",
    template: "%s · Duskfall Survivors",
  },
  description:
    "An original 16-bit pixel-art horde survival game. Auto-firing weapons, escalating waves, dynamic night lighting, roguelite upgrades and screen-filling bosses — free in your browser.",
  keywords: [
    "browser game",
    "pixel art",
    "horde survival",
    "roguelite",
    "vampire survivors like",
    "free game",
    "canvas game",
    "indie game",
    "16-bit",
    "no download game",
  ],
  authors: [{ name: "Duskfall Survivors contributors" }],
  applicationName: "Duskfall Survivors",
  category: "games",
  openGraph: {
    type: "website",
    siteName: "Duskfall Survivors",
    title: "Duskfall Survivors — 16-bit Pixel Horde Survival",
    description:
      "Survive the dusk. Eight evolvable weapons, four enemy archetypes, three cursed stages — free in your browser.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Duskfall Survivors key art" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duskfall Survivors — 16-bit Pixel Horde Survival",
    description:
      "Fifteen minutes of escalating monster waves, evolvable weapons and dynamic night lighting. Free in your browser.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0f14",
  colorScheme: "dark",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Duskfall Survivors",
  description:
    "An original 16-bit pixel-art horde survival roguelite with auto-firing weapons, dynamic night lighting and boss fights, playable free in the browser.",
  url: SITE_URL,
  genre: ["Roguelite", "Survival", "Action", "Pixel Art"],
  gamePlatform: "Web Browser",
  operatingSystem: "Any modern web browser",
  applicationCategory: "Game",
  playableMode: "SinglePlayer",
  inLanguage: ["en", "zh-CN", "ja", "es"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  contentRating: "Fantasy violence",
  publisher: { "@type": "Organization", name: "Duskfall Survivors" },
  keywords: "horde survival, roguelite, pixel art, browser game, indie",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  // Note: under static export the root layout does not receive child dynamic
  // segments in params, so localized <html lang> is applied by an inline
  // script in [locale]/layout.tsx; hreflang alternates carry the SEO signal.
  void params;
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0b0f14] text-slate-100 antialiased">
        <script
          type="application/ld+json"
          // JSON-LD is static, trusted content built in-repo
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
