self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Required to pass PWA install criteria
    e.respondWith(fetch(e.request).catch(() => {
        // Fallback if offline
        return new Response('Offline');
    }));
});
