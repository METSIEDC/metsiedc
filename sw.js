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

// Bumped to v16 for a fresh install
const CACHE_NAME = 'mets-iedc-v17'; 

const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json'
];

// ഈ URL-കൾ സർവീസ് വർക്കർ കാഷ് ചെയ്യില്ല (Firebase & Google APIs)
const IGNORED_URLS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'firebasestorage.googleapis.com',
  'script.google.com',
  'googleusercontent.com'
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
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const shouldIgnore = IGNORED_URLS.some(url => requestUrl.hostname.includes(url));
  
  if (shouldIgnore) {
    return; // Ignore Firebase/Google API requests
  }

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
          // Check if valid before caching
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(()=>console.log("Ignored cache error"));
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
