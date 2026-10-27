import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duskfall Survivors",
    short_name: "Duskfall",
    description: "16-bit pixel-art horde survival roguelite, free in your browser.",
    start_url: "/play",
    display: "fullscreen",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    orientation: "any",
    categories: ["games", "entertainment"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
