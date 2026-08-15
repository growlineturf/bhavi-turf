const CACHE = 'turf-admin-v2';
const OFFLINE_URLS = [
  '/admin',
  '/admin/today',
  '/admin/slots',
  '/admin/revenue',
  '/admin/settings',
  '/icon-192.png',
  '/icon-512.png',
];

// Install — pre-cache admin shell pages
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (e) => {
  // Only intercept GET requests for same-origin /admin/* and static assets
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (!url.pathname.startsWith('/admin') && !url.pathname.startsWith('/icon-') && !url.pathname.startsWith('/_next/static')) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache successful responses for admin pages
        if (res.ok && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/icon-'))) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || Response.error()))
  );
});
