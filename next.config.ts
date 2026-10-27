import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The app is previewed through the e2b.app proxy origin. Next.js 16 blocks
  // cross-origin requests to dev-only endpoints (HMR, RSC flight, chunks
  // preflight) by default, which leaves the browser page unhydrated/blank.
  // The wildcard keeps this working across sandbox-ID changes.
  allowedDevOrigins: ["*.e2b.app", "3000-ivsaj0hpeop3gyarj1f8b.e2b.app"],
};

export default nextConfig;
