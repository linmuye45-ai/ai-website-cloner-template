import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duskfall Survivors — Pixel Horde Survival",
  description:
    "An original 16-bit pixel-art horde survival game. Auto-firing weapons, relentless waves, roguelite upgrades and screen-filling bosses — built with the Canvas 2D API.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0b0f14] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
