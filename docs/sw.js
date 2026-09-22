/* SoulCap service worker.
 * Offline is not a nice-to-have here — techniques and the help screen must work
 * with no connection at all. Everything needed for that is precached.
 *
 * Paths are relative so they resolve against the SW scope, which works both on
 * GitHub Pages (/SoulCap/) and when served from a local directory.
 *
 * Bump CACHE on every asset change or users get a stale build.
 */
var CACHE = 'soulcap-v831';

var ASSETS = [
  './',
  'index.html',
  'VERSION.json',
  'brand.css',
  'app.css',
  'brand-palette.js',
  'data.js',
  'app.js',
  'vendor/gsap.min.js',
  'vendor/breath-orb.js',
  'vendor/local-lock.js',
  'vendor/cap-foundation.css',
  'modules/route-calm.js',
  'modules/route-me.js',
  'data/skills.json',
  'data/articles.json',
  'data/experiences.json',
  'data/screeners.json',
  'data/stories.json',
  'data/distortions.json',
  'data/domain-meta.json',
  'data/approach-packs.json',
  'privacy.html',
  'manifest.json',
  'icons/mark.svg',
  'icons/favicon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon-180.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        /* Per-URL add — one missing asset must not abort the whole install (CI / flaky servers). */
        return Promise.all(ASSETS.map(function (url) {
          return c.add(url).catch(function () { return null; });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first so updates land, cache as the offline floor.
  if (req.mode === 'navigate') {
    var scopePath = new URL(self.registration.scope).pathname;
    var shellNavigation = url.pathname === scopePath || url.pathname === scopePath + 'index.html';
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(shellNavigation ? 'index.html' : req, copy); });
          return res;
        })
        .catch(function () { return caches.match(shellNavigation ? 'index.html' : req); })
    );
    return;
  }

  // Everything else cache-first — assets are versioned by the cache name.
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
