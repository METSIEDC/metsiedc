// CHANGE THIS VERSION NUMBER EVERY TIME YOU UPDATE YOUR SITE (e.g., v2, v3, v4)
const CACHE_NAME = 'mets-iedc-v2'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Add your other pages here
];

// 1. Install Phase
self.addEventListener('install', event => {
  // self.skipWaiting() forces the new app version to install immediately 
  // without waiting for the user to close all open tabs of your app.
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate Phase (Clean up old versions)
self.addEventListener('activate', event => {
  // clients.claim() tells the new service worker to take control immediately
  event.waitUntil(self.clients.claim()); 
  
  // This deletes any old versions of your app from the user's phone
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache version:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch Phase (Stale-While-Revalidate Strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Update the cache with the fresh network response in the background
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails (offline), just rely on the cache
        console.log("Network fetch failed, serving from cache.");
      });

      // Return the cached response immediately if we have it, 
      // otherwise wait for the network response.
      return cachedResponse || fetchPromise;
    })
  );
});
