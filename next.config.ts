import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";
const ghPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  ...(ghPagesBasePath
    ? {
        basePath: ghPagesBasePath,
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: ghPagesBasePath,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "*.e2b.app",
    "*.e2b.dev",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
