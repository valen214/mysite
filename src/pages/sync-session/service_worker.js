

console.log("service worker scope");

self.addEventListener("install", (e) => {
  console.log("service worker installing");
  self.skipWaiting();
});


self.addEventListener("activate", (e) => {
  console.log("service worker activated");
  self.skipWaiting();
  e.waitUntil(clients.claim());
  self.skipWaiting();
})


const HANDLE_METHOD_PASSTHROUGH = 1;
const HANDLE_METHOD_FULLPATH = 2;
const HANDLE_METHOD_REPLACE_ORIGIN = 3;

function handleMethod(urlString){
  let url = new URL(urlString);
  if(url.origin === location.origin){
    if(url.pathname.startsWith("/sync-session")){
      return HANDLE_METHOD_PASSTHROUGH;
    }
    return HANDLE_METHOD_REPLACE_ORIGIN;
  } else if(url.origin === "http://localhost:8080"){
    return HANDLE_METHOD_PASSTHROUGH;
  }
  return HANDLE_METHOD_FULLPATH;
}


function getSession(req){
  let url = new URL(req.referrer);
  let parts = url.pathname.split("/");
  if(parts[1] === "sync-session"){
    return parts[2];
  } else{
    console.error("cannot identify session from:", req.referrer);
  }
}

let firstRequest = true;
self.addEventListener("fetch", async e => {
  console.log("lcoation.origin:", location.origin);

  let session = getSession(e.request);
  let url;

  switch(handleMethod(e.request.url)){
  case HANDLE_METHOD_PASSTHROUGH:
    console.log("PASSTHROUGHT:", e.request.url);
    e.respondWith(fetch(e.request));
    break;
  case HANDLE_METHOD_REPLACE_ORIGIN:
    url = new URL(location.href)
    url.searchParams.set("src",
        e.request.url.replace(location.origin, "ORIGIN://"));
    url.pathname = `/sync-session/${session}/get`;

    console.log("REDIRECT:", e.request.url, "=>", url.href);

    e.respondWith(fetch(url.href, {
      // ...e.request
    }));
    break;
  case HANDLE_METHOD_FULLPATH:
    url = new URL(location.href)
    url.searchParams.set("src", e.request.url);
    url.pathname = `/sync-session/${session}/get`;

    console.log("REDIRECT:", e.request.url, "=>", url.href);

    e.respondWith(fetch(url.href, {
      // ...e.request
    }));
    break;
  default:
    console.error("FATAL: unreachable code");
    e.respondWith(fetch(e.request));
    
    break;
  }
});