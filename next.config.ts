import type { NextConfig } from "next";

// Fully static export: `npm run build` emits a self-contained static site in
// out/ that runs on any static host (GitHub Pages, Cloudflare Pages, Netlify,
// S3, nginx…) with no Node server and no expiring runtime.
//
// NEXT_PUBLIC_BASE_PATH is only needed when hosting under a sub-path such as
// a project GitHub Pages site (https://user.github.io/repo-name). Leave it
// empty for apex/custom domains.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
