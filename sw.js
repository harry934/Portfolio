const CACHE_NAME = 'harry-portfolio-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/about.js',
    '/about.css',
    '/site.webmanifest',
    '/assets/img/profile.webp',
    '/assets/img/chillen.webp',
    '/assets/img/nss.webp',
    '/assets/img/IoT.webp',
    '/assets/img/pfp1.webp',
    '/assets/img/gym.webp',
    '/assets/img/tech.webp',
    // Fallback fonts/icons might be cached lazily, but let's cache the core ones we know
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like Formspree or analytics, from being strictly cache-first
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('fonts') && !event.request.url.includes('cdn.jsdelivr')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found, else network
                return response || fetch(event.request);
            })
    );
});
