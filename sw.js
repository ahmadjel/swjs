// Service Worker (sw.js) - Advanced PWA Support v2.1

// 1. Core Cache Names
const CACHE_STATIC_NAME = 'static-assets-v2.1'; // For CSS, JS, Fonts
const CACHE_DYNAMIC_NAME = 'dynamic-content-v2.1'; // For images and posts
const CACHE_OFFLINE_PAGE = 'offline-page-v1'; // For the offline fallback page

// Static files (App Shell) to be precached immediately
const staticFiles = [
  '/', // Homepage
  '/offline.html', // Offline fallback page
  // IMPORTANT: Add paths for your main CSS and JS files here (e.g., '/css/style.min.css')
];

// 2. Installation (Precache App Shell)
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing and Pre-caching App Shell');
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        return cache.addAll(staticFiles);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// 3. Activation (Clean up old caches)
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating and Cleaning up old caches');
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          // Delete any cache that doesn't match the current names
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME && key !== CACHE_OFFLINE_PAGE) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

// 4. Fetch Strategy (Routing requests)
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  // A. Cache First Strategy for Static Assets (Maximum Speed)
  if (staticFiles.includes(requestUrl.pathname)) {
    // If the requested file is a core static asset, serve from cache only.
    event.respondWith(caches.match(event.request));
    return;
  }

  // B. Cache then Network Strategy for Dynamic Content (Images, Posts)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          // Cache Hit: return cached response
          return response;
        } else {
          // Cache Miss: Go to Network
          return fetch(event.request)
            .then(function(res) {
              // Check if response is valid (status 200, basic type)
              if (!res || res.status !== 200 || res.type !== 'basic') {
                return res;
              }
              
              const responseToCache = res.clone();
              
              // Store the new resource in the Dynamic Cache for later use
              caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
              
              return res; // Return the network response
            })
            .catch(function(err) {
              // Network failed: Fallback logic
              // Check if the request is specifically for an HTML page 
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              // For images or other non-HTML assets, fail gracefully
            });
        }
      })
  );
});

// 5. Background Sync (Using the dynamic cache)
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

function syncPosts() {
  return fetch('/feed.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
        return cache.put('/feed.json', new Response(JSON.stringify(data)));
      });
    });
}

// 6. Push Notifications (Core logic unchanged)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'View Now'},
      {action: 'close', title: 'Close'}
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Blog Store Update', options)
  );
});

// 7. Notification Click (Core logic unchanged)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});