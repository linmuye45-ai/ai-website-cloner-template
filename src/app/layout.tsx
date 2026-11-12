import type { Metadata } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/500.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { I18nProvider } from "@/context/i18n-context";
import { RevealScroller } from "@/components/RevealScroller";

export const metadata: Metadata = {
  title: "中净医疗 | 临床级非诊断医患语音与院外随访系统",
  description:
    "每一通院外随访背后，32 个专科监督模型同步核对药典与危急值。不越界下诊断，不擅自改处方，协助三甲医院、区域医共体与创新药企守住患者院外安全。",
  icons: {
    icon: "/seo/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zj-white text-zj-ink">
        <I18nProvider>{children}</I18nProvider>
        <RevealScroller />
      </body>
    </html>
  );
}
