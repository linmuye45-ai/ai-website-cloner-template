import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMNIVERSE — The world is yours to make",
  description: "An interactive prototype for the next generation of playable worlds.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable}`}><body>{children}</body></html>;
}
