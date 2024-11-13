const CACHE_NAME = 'nganya-groove-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        if (fetchResponse.status === 404) {
          return new Response('Content not found', { status: 404 });
        }
        return fetchResponse;
      });
    }).catch(() => {
      return new Response('You are offline', { status: 503 });
    })
  );
});