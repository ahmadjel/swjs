// Ultra Blog Template - Service Worker v1.0
// Aggressive caching for performance

const CACHE_VERSION = 'ultra-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/offline.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys
                        .filter((key) => key !== CACHE_STATIC && key !== CACHE_DYNAMIC && key !== CACHE_IMAGES)
                        .map((key) => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome extensions and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;

    // Handle images separately
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
        return;
    }

    // Handle other requests
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version and update in background
                    event.waitUntil(updateCache(request));
                    return cachedResponse;
                }

                // Fetch from network and cache
                return fetch(request)
                    .then((networkResponse) => {
                        // Only cache successful responses
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_DYNAMIC)
                                .then((cache) => cache.put(request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline fallback
                        if (request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});

// Handle image requests with separate cache
function handleImageRequest(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_IMAGES)
                            .then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                });
        });
}

// Update cache in background
function updateCache(request) {
    return fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                return caches.open(CACHE_DYNAMIC)
                    .then((cache) => cache.put(request, networkResponse.clone()));
            }
        })
        .catch(() => {
            // Silently fail - cached version is still valid
        });
}

// Listen for message from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
