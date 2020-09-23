

console.log("service worker scope");

self.addEventListener("install", (e) => {
  console.log("service worker installing");
});


self.addEventListener("activate", (e) => {
  console.log("service worker activated");
  e.waitUntil(clients.claim());
})

self.addEventListener("fetch", e => {
  console.log('fetching', e.request);
  e.respondWith(fetch(e.request));
});