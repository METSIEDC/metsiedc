// Version bumped to v3 to trigger an update for your users
const CACHE_NAME = 'mets-iedc-v7'; 

const urlsToCache = [
  './',
  './index.html',
  './offline.html', // <-- This ensures the offline page is downloaded immediately
  './manifest.json',
  // Add your other core pages here
];

// 1. Install Phase
self.addEventListener('install', event => {
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
  event.waitUntil(self.clients.claim()); 
  
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

// 3. Fetch Phase (Smart Offline Routing)
self.addEventListener('fetch', event => {
  // Check if the request is for a new HTML page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If the network fails (offline), try the cache first
        return caches.match(event.request).then(response => {
          // If the page isn't in the cache, show the cinematic offline.html
          return response || caches.match('./offline.html');
        });
      })
    );
  } else {
    // For all other requests (images, CSS, JS), use your Stale-While-Revalidate strategy
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {
          // Silent fail for assets; they just won't load if offline and not cached
          console.log("Network fetch failed for asset.");
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
// Remove self.skipWaiting() from here
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});
// Listen for the signal from the Update Banner to skip waiting and activate immediately
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
