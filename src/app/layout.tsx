import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "知微 DeepScholar — 真题逐行精改、步骤验算与实测人才结算平台",
  description:
    "面向高难度考试的逐行批改、代数微积分步骤验算、1:150 教师督学组卷与高分人才审校结算系统。",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/manifest.webmanifest`,
};

const SW_PURGE_BOOTSTRAP = `
(function() {
  try {
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then(function(keys) {
        var hadLegacy = false;
        keys.forEach(function(k) {
          if (k.indexOf("eternal") !== -1 || k !== "deepscholar-clean-v9") {
            hadLegacy = true;
            caches.delete(k);
          }
        });
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then(function(regs) {
            regs.forEach(function(r) { r.unregister(); });
            if (hadLegacy && !sessionStorage.getItem("ds_v9_purged")) {
              sessionStorage.setItem("ds_v9_purged", "1");
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
        <a
          href="#main-workspace"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-xs focus:font-medium text-foreground focus:ring-2 focus:ring-ring"
        >
          跳转至主工作区
        </a>
        {children}
      </body>
    </html>
  );
}
