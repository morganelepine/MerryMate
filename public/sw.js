const CACHE_NAME = "merrymate-v1";
const STATIC_PRECACHE = [
    "/icons/logo-MerryMate-192.png",
    "/icons/logo-MerryMate-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_PRECACHE)),
    );
    globalThis.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)),
                ),
            ),
    );
    globalThis.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== "GET") return;

    // Cache-first for versioned build assets and icons
    if (
        url.pathname.startsWith("/build/") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname.startsWith("/images/")
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        caches
                            .open(CACHE_NAME)
                            .then((cache) =>
                                cache.put(request, response.clone()),
                            );
                    }
                    return response;
                });
            }),
        );
        return;
    }

    // Stale-while-revalidate for external fonts
    if (
        url.hostname.includes("fonts.googleapis.com") ||
        url.hostname.includes("fonts.gstatic.com") ||
        url.hostname.includes("fonts.bunny.net")
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(request).then((cached) => {
                    const networkFetch = fetch(request).then((response) => {
                        if (response.ok) cache.put(request, response.clone());
                        return response;
                    });
                    return cached ?? networkFetch;
                }),
            ),
        );
        return;
    }

    // Network-first for same-origin navigation and API (Inertia)
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        caches
                            .open(CACHE_NAME)
                            .then((cache) =>
                                cache.put(request, response.clone()),
                            );
                    }
                    return response;
                })
                .catch(() => caches.match(request)),
        );
    }
});
