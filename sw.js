
const CACHE_NAME = 'mactools-v1.3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the new SW takes control of the page immediately
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Use a Network-First strategy: try network, then fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, clone and update cache
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // If both fail and it's a navigation request, return index
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
