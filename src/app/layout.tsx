import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "知微 DeepScholar · 主观题逐行精改与全球闭卷能力清算平台",
  description:
    "对照官方阅卷细则定位丢分步骤，通过两次苏格拉底分步提示引导闭卷掌握，支持学校 1:150 督学白标部署与实测人才清算。",
  manifest: `${basePath}/manifest.webmanifest`,
  openGraph: {
    title: "知微 DeepScholar · 主观题逐行精改与全球闭卷能力清算平台",
    description:
      "从单题逐行批改、学校 1:150 白标督学到全球实测人才与前沿推理数据清算网络。",
    type: "website",
    images: [`${basePath}/images/editorial-library-desk.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "知微 DeepScholar",
    description:
      "把丢分的那一步找出来，练到闭卷也能一次写对。",
    images: [`${basePath}/images/editorial-library-desk.jpg`],
  },
};

const SW_PURGE_BOOTSTRAP = `
(function() {
  try {
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then(function(keys) {
        var hadLegacy = false;
        keys.forEach(function(k) {
          if (k.indexOf("eternal") !== -1 || k !== "deepscholar-clean-v10") {
            hadLegacy = true;
            caches.delete(k);
          }
        });
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then(function(regs) {
            regs.forEach(function(r) { r.unregister(); });
            if (hadLegacy && !sessionStorage.getItem("ds_v10_purged")) {
              sessionStorage.setItem("ds_v10_purged", "1");
              window.location.reload();
            }
          });
        }
      });
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SW_PURGE_BOOTSTRAP }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
