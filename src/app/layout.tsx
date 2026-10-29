import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VampireSurvivor25D - 小米平板8直玩版",
  description: "2.5D吸血鬼幸存者·小米平板8触屏优化·越玩越爽·Godot 4.4+Web双端",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
