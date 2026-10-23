// Offline cache for the built app. The build fills in CACHE and FILES (see vite.config.ts).
// Everything the app needs is saved on first load, so it opens with no signal in the backyard.
const CACHE = "skyplanner-ff2fd4b-8-4241009692";
const FILES = [
  "./",
  "./apple-touch-icon.png",
  "./assets/index-Cx78DQCl.css",
  "./assets/index-DKDzfKk2.js",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest"
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
