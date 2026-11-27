import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
 applicationName: "The Dream Station",
 title: "The Dream Station",
 description: "A small interactive story for the quieter hours.",
 manifest: "/manifest.webmanifest",
 robots: { index: false, follow: false },
 appleWebApp: { capable: true, statusBarStyle: "default", title: "Dream Station" },
 icons: { icon: "/icon.svg", apple: "/icon.svg" }
};
export const viewport: Viewport = { themeColor: "#f7f2e9", width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
