"use client";

import { useEffect } from "react";

// Registers the offline service worker. basePath must be respected when the
// site is hosted under a sub-path (e.g. project GitHub Pages).
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const onLoad = () => {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
        // Registration can fail on insecure origins / file:// — the game
        // itself still works, only offline caching is unavailable.
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
