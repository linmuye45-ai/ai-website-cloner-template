import type { NextConfig } from "next";

// NEXT_PUBLIC_EXPORT=1 produces a fully static `out/` bundle for GitHub
// Pages (no Node server needed). Default mode keeps the dev/standalone setup.
const isStaticExport = process.env.NEXT_PUBLIC_EXPORT === "1";
// Project pages are served under /<repo-name>; root-localhost dev stays ''.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  // Directory-style URLs (/play/index.html) resolve reliably on static hosts.
  trailingSlash: isStaticExport ? true : undefined,
  basePath: isStaticExport ? basePath : undefined,
  images: isStaticExport ? { unoptimized: true } : undefined,
  // The app is previewed through the e2b.app proxy origin. Next.js 16 blocks
  // cross-origin requests to dev-only endpoints (HMR, RSC flight, chunks
  // preflight) by default, which leaves the browser page unhydrated/blank.
  // The wildcard keeps this working across sandbox-ID changes.
  allowedDevOrigins: ["*.e2b.app", "3000-ivsaj0hpeop3gyarj1f8b.e2b.app"],
};

export default nextConfig;
