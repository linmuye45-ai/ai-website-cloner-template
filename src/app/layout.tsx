import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "同框 Reunion · 让没能同框的人,第一次合影",
  description:
    "跨时空全家福:让没能见面的亲人第一次合影,和年轻的爸妈同框,把散落各年的照片拼成一张全家福。30 秒生成,截图就能晒。",
  keywords: ["全家福", "老照片", "AI合影", "同框", "Reunion", "纪念", "家人"],
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
