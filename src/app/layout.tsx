import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "毛孩日报 PetDaily · 每天一张,毛孩的专属小报",
  description:
    "30 秒填一张,生成你家毛孩今天的专属日报:今日情绪头条、行为小报、健康观察、品种冷知识——截图就能晒。附症状自查。",
  keywords: ["宠物", "毛孩", "宠物情绪", "日报", "PetDaily", "狗", "猫"],
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
      <body className="min-h-full flex flex-col bg-ink text-paper selection:bg-gold/30 selection:text-paper">
        {children}
      </body>
    </html>
  );
}
