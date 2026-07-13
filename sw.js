// Minimal service worker for Parikino Marae public site.
// This exists purely to satisfy PWA installability requirements
// (Chrome requires a registered service worker with a fetch handler
// before it will offer "Add to Home screen" / "Install app").
//
// It does basic offline caching of the core pages so the site still
// opens (even if stale) without a connection, but it deliberately
// stays out of the way otherwise — network requests pass straight
// through except for simple caching of the pages themselves.

const CACHE_NAME = "parikino-marae-v1";
const CORE_ASSETS = ["/", "/index.html", "/bookings.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
