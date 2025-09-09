// Service Worker for PWA functionality
// This file is a template - the actual service worker is generated during build
const CACHE_NAME = '__CACHE_NAME__';
const STATIC_ASSETS = __ASSETS_TO_CACHE__;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  // Skip waiting to immediately activate new service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets with cache name:', CACHE_NAME);
        console.log('Assets to cache:', STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches and take immediate control
self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache with network fallback and cache update strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For HTML requests, use network-first strategy to ensure fresh content
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request)
            .then((response) => response || caches.match('/'));
        })
    );
    return;
  }

  // For static assets, use cache-first with network update for performance
  // but with a strategy that ensures cache invalidation
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Always try to fetch fresh version for static assets with cache names
        const fetchPromise = fetch(event.request)
          .then((fetchResponse) => {
            if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return fetchResponse;
          })
          .catch(() => {
            // If network fails, return cached version
            return response;
          });

        // For versioned assets (with hash in filename), prefer cached version for speed
        if (event.request.url.match(/\.[a-f0-9]{8}\.(js|css)$/)) {
          return response || fetchPromise;
        }

        // For other assets, prefer fresh version
        return fetchPromise.catch(() => response);
      })
      .catch(() => {
        // If no cache match, fetch from network
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
      })
  );
});

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push event for future notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});