const CACHE_NAME = 'mets-iedc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other local pages here like '/events.html', '/about.html'
];

// Install the service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept network requests and serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update the service worker and remove old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for push events from the server
self.addEventListener('push', event => {
    let body = "New update from MET'S IEDC!";
    
    // If the server sent a specific message payload, use it
    if (event.data) {
        body = event.data.text();
    }

    const options = {
        body: body,
        icon: 'assets/icons/icon-192x192.png',
        badge: 'assets/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        // Actions allow users to interact directly from the notification popup
        actions: [
            { action: 'explore', title: 'View Event Details' },
            { action: 'close', title: 'Dismiss' }
        ]
    };

    // Show the notification
    event.waitUntil(
        self.registration.showNotification("MET'S IEDC Innovation Hub", options)
    );
});

// Handle what happens when the user clicks the notification
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the events page if they click the specific "View Event Details" action button
        event.waitUntil(
            clients.openWindow('/event.html')
        );
    } else {
        // Open the main site if they click the general body of the notification
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
