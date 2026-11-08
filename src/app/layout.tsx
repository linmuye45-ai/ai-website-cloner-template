import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "苍穹造物 AETHERIA OS · 49-Agent 一人游戏大厂 × 60FPS 可玩广告引擎 × 十角兽全栈平台",
  description:
    "对标 AppLovin ($90B) + 点点互动 ($2.24B/年) + Lovable ($13.3B)：融合 Claude-Code-Game-Studios、QFramework、Mindustry、RogueLegacy、PixelFX 244 代码特效、Autopilot 自动压测与 GrokBot 出海增长。一年内实现数亿流动净资产，三年内跃升 $30B+ 上等顶级十角兽。",
  keywords: [
    "Aetheria OS",
    "苍穹造物",
    "Claude-Code-Game-Studios",
    "AppLovin",
    "Playable Ads",
    "可玩广告",
    "一人游戏公司",
    "PixelFX",
    "Autopilot",
    "十角兽",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06080D] text-[#F8FAFC] selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
