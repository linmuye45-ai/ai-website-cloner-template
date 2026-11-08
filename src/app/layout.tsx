import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "闪鉴金库 SlabAI · 3秒 AI 光谱评级 × 保税金库 88% 秒回购 × 全球潮玩卡牌跨市套利",
  description:
    "潮玩卡牌界的得物 + 纳斯达克金库：手机拍一下 3 秒测出卡牌/Labubu/谷子微米级评分与中、日、美、欧四地实时价差；顺丰入保税金库换 NFC 金砖，88% 公允价 1 秒现金回购，零物流高频换手，三年税后净利剑指十位数（≥10亿）。",
  keywords: [
    "SlabAI",
    "闪鉴金库",
    "卡牌评级",
    "PSA",
    "泡泡玛特",
    "Labubu",
    "卡游",
    "宝可梦",
    "海贼王",
    "谷子",
    "千岛",
    "Whatnot",
    "Courtyard",
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
      <body className="min-h-full flex flex-col bg-[#090B0E] text-[#F5F3EE] selection:bg-[#E5B84B]/30 selection:text-[#F5F3EE]">
        {children}
      </body>
    </html>
  );
}
