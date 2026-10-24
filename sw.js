// Offline cache for the built app. The build fills in CACHE and FILES (see vite.config.ts).
// Everything the app needs is saved on first load, so it opens with no signal in the backyard.
const CACHE = "skyplanner-1da2742-53-3292492263";
const FILES = [
  "./",
  "./apple-touch-icon.png",
  "./assets/index-B_IHqCAF.css",
  "./assets/index-CiLVDz9o.js",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./targets/b33-ngc-2024.jpg",
  "./targets/ic-1318.jpg",
  "./targets/ic-1396.jpg",
  "./targets/ic-1795.jpg",
  "./targets/ic-1805.jpg",
  "./targets/ic-1848.jpg",
  "./targets/ic-405.jpg",
  "./targets/ic-410.jpg",
  "./targets/ic-443.jpg",
  "./targets/ic-5070.jpg",
  "./targets/ic-5146.jpg",
  "./targets/m1.jpg",
  "./targets/m101.jpg",
  "./targets/m13.jpg",
  "./targets/m16.jpg",
  "./targets/m17.jpg",
  "./targets/m20.jpg",
  "./targets/m27.jpg",
  "./targets/m31.jpg",
  "./targets/m33.jpg",
  "./targets/m42.jpg",
  "./targets/m45.jpg",
  "./targets/m51.jpg",
  "./targets/m57.jpg",
  "./targets/m65-m66-ngc-3628.jpg",
  "./targets/m8.jpg",
  "./targets/m81-m82.jpg",
  "./targets/m84-m86.jpg",
  "./targets/ngc-1499.jpg",
  "./targets/ngc-2237.jpg",
  "./targets/ngc-2264.jpg",
  "./targets/ngc-2359.jpg",
  "./targets/ngc-253.jpg",
  "./targets/ngc-281.jpg",
  "./targets/ngc-457.jpg",
  "./targets/ngc-6888.jpg",
  "./targets/ngc-6960.jpg",
  "./targets/ngc-6992.jpg",
  "./targets/ngc-7000.jpg",
  "./targets/ngc-7023.jpg",
  "./targets/ngc-7293.jpg",
  "./targets/ngc-7380.jpg",
  "./targets/ngc-7635.jpg",
  "./targets/ngc-869-884.jpg",
  "./targets/sh2-155.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  // Open the saved copy first; fall back to the network for anything not saved.
  // ignoreSearch so "index.html?x" and "./" both find the app shell.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("./index.html").then((shell) => shell || fetch(req));
      return fetch(req);
    }),
  );
});
