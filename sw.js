// Import Firebase scripts for the Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in the background
firebase.initializeApp({
    apiKey: "AIzaSyAIn9hB7Hx4Nwwk5Ar9bE3tFuo40VkBcc8",
    authDomain: "metsiedc-3010e.firebaseapp.com",
    projectId: "metsiedc-3010e",
    storageBucket: "metsiedc-3010e.firebasestorage.app",
    messagingSenderId: "954403413150",
    appId: "1:954403413150:web:2523a3377f15a3d6002f8f"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './assets/images/logos/MSEM.jpg',
        badge: './assets/images/logos/MSEM.jpg',
        data: { url: payload.data ? payload.data.click_action : '/' }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle clicking the notification
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// Bumped to v15 for a fresh install
const CACHE_NAME = 'mets-iedc-v15'; 

const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json'
];

// 1. Install Phase
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Activate Phase
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

// 3. Fetch Phase
self.addEventListener('fetch', event => {
  // Only intercept standard GET requests (ignores POST requests like form submissions)
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(response => {
          return response || caches.match('./offline.html');
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Safety check: Only cache valid, successful responses
          if (networkResponse && networkResponse.status === 200) {
            // Clone synchronously BEFORE passing to the cache
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.log("Network fetch failed, asset skipped.", error);
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// 4. Message Phase (For the Update Banner)
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
