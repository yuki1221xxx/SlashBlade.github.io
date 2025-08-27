const CACHE_NAME = 'anniversary-site-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/images/sample1.png',
    '/images/sample2.png',
    '/images/sample3.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            }
        )
    );
});