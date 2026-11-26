import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VESTI Studio — The operating system for fashion creators",
  description: "A considered creative workspace for fashion creators: identity, fashion composition, campaigns, wardrobe, intelligence, and commercial tools.",
  applicationName: "VESTI Studio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
