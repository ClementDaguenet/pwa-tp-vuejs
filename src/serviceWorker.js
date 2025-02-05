import { precacheAndRoute } from 'workbox-precaching';

// Injecte la liste des fichiers à pré-cacher
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installing Service Worker...");
  
    event.waitUntil(
      caches.open("pwa-cache").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/favicon.ico",
          "/manifest.json",
          "/img/icons/android-chrome-192x192.png",
          "/img/icons/android-chrome-512x512.png",
        ]);
      })
    );
  });
  
  self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activating Service Worker...");
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  