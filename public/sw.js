/*
 * Duskfall Survivors — offline-first service worker.
 * Runtime cache-first for same-origin GETs: after the first visit every
 * game asset (HTML, hashed JS/CSS, sprites are inlined in JS, icons) keeps
 * working with no network at all. No remote origins are ever contacted.
 */
const CACHE_VERSION = "duskfall-v2";
const CORE_ASSETS = ["./", "./play/", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch third parties

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline and uncached: fall back to the game shell for navigations.
          if (req.mode === "navigate") return caches.match("./play/");
          return Response.error();
        });
    }),
  );
});
