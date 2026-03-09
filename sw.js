// Version bumped to v8 to trigger the clean update
const CACHE_NAME = 'mets-iedc-v8'; 

const urlsToCache = [
  './',
  './index.html',
  './offline.html', 
  './manifest.json'
];

// 1. Install Phase (Correctly formatted without skipWaiting so the Banner works)
self.addEventListener('install', event => {
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

// 3. Fetch Phase (Smart Offline Routing & Fixed Clone Error)
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
    // For all other requests (images, CSS, JS), use Stale-While-Revalidate
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            // FIX: Clone the response synchronously BEFORE opening the cache
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          console.log("Network fetch failed for asset.");
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// 4. Message Phase (Listens for the PWA "Refresh" button)
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
