export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duskfall Survivors",
    short_name: "Duskfall",
    description: "16-bit pixel-art horde survival roguelite, free in your browser.",
    start_url: `${basePath}/play/`,
    scope: `${basePath}/`,
    display: "fullscreen",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    orientation: "any",
    categories: ["games", "entertainment"],
    lang: "en",
    icons: [
      { src: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
