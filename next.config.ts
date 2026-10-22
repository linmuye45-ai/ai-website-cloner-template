import type { NextConfig } from "next";

// GITHUB_PAGES=1 → 静态导出到 out/,供 GitHub Pages 部署
// 平时(output: standalone)不受影响
const isPages = process.env.GITHUB_PAGES === "1";
const basePath = isPages
  ? `/${process.env.PAGES_BASE_PATH ?? "ai-website-cloner-template"}`
  : "";

const nextConfig: NextConfig = {
  output: isPages ? "export" : "standalone",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
