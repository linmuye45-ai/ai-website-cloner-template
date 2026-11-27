import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXORA's first release is a static-first Web/PWA. No server-side routes
  // or authentication are required for the initial validated experience.
  output: "export",
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
