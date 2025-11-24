// Median UI Enhanced Service Worker v2.0
const CACHE_NAME = 'median-ui-cache-v2';
const CACHE_DURATION = 365 * 24 * 60 * 60; // 1 year

const urlsToCache = [
    '/',
    '/favicon.ico'
];

// Install event - Enhanced caching
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Enhanced cache opened');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Fetch event - Smart caching strategy
self.addEventListener('fetch', function (event) {
    const { request } = event;
    const url = new URL(request.url);

    // Cache fonts and images aggressively
    if (request.destination === 'font') {
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request).then(function (fetchResponse) {
                    return caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
        return;
    }

    // Cache images with stale-while-revalidate
    if (request.destination === 'image') {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(request).then(function (response) {
                    const fetchPromise = fetch(request).then(function (networkResponse) {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                    return response || fetchPromise;
                });
            })
        );
        return;
    }

    // Network first for other requests
    event.respondWith(
        fetch(request).catch(function () {
            return caches.match(request);
        })
    );
});

// Activate event - Cleanup old caches
self.addEventListener('activate', function (event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
