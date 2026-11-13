const CACHE_NAME = "mini-dreamcom-v4";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./delivery.js",
    "./manifest.json",
    "./icon.svg",
    "./mini-perros-calientes.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombres) => {
            return Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((respuesta) => {
                if (respuesta.ok) {
                    const copia = respuesta.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, copia);
                    });
                }

                return respuesta;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
