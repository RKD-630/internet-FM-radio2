self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    // Skip cross-origin requests, especially audio streams and APIs
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Basic pass-through fetch handler for same-origin (required for PWA)
    event.respondWith(fetch(event.request).catch(() => new Response('Network error')));
});
