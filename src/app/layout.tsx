import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "到岸 LANDED — AI 原生贸易银行 · 三年 $10B · 十年 $100B",
  description:
    "站在买方一边、为结果负责的 AI 贸易公司。一句话输入,48 小时交付到岸表:5 家经核验工厂、2026 全部关税栈、到仓每件成本。千亿路径:贸易公司 → 平台 → 信贷账面 → 基础设施。",
  keywords: [
    "Landed",
    "到岸",
    "AI 贸易",
    "跨境贸易",
    "到岸表",
    "贸易银行",
    "AI 原生",
    "$10B",
    "$100B",
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
      <body className="min-h-full flex flex-col bg-ink text-paper selection:bg-gold/30 selection:text-paper">
        {children}
      </body>
    </html>
  );
}
