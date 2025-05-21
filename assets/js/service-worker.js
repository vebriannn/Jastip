const CACHE_NAME = 'ebook-cache-v1';
const STATIC_FILES_TO_CACHE = [
    '/nemolab/member/css/ebook.css',
    '/nemolab/member/js/ebook.js',
    '/nemolab/member/img/zoomin.png',
    '/nemolab/member/img/zoomout.png',
    '/nemolab/member/img/reset.png',
    '/nemolab/member/img/fullscreen.png',
    '/nemolab/member/img/chevron-left-white.png',
    '/nemolab/member/img/chevron-right-white.png',
    '/nemolab/member/img/loading.gif',
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES_TO_CACHE))
        .catch((error) => {
            console.error('[Service Worker] Failed to cache static files:', error);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (STATIC_FILES_TO_CACHE.some(file => event.request.url.includes(file))) {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            });
        }).catch(() => new Response('Failed to load.'))
    );
});