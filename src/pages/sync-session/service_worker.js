
console.log = () => {};

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

function extractSessionFromUrl(url){
  try{
    url = new URL(url);
    let parts = url.pathname.split("/");
    if(parts[1] === "sync-session"){
      if(parts[2] && parts[2].length !== 6){
        throw new Error("failed to get session");
      }
      return parts[2];
    }
  } catch(e){

  }
}

async function getSession(e){
  let session = extractSessionFromUrl(e.request.referrer);
  if(session) return session;

  session = extractSessionFromUrl(e.request.url);
  if(session) return session;

  let client = await self.clients.get(e.resultingClientId);
  session = extractSessionFromUrl(client.url)
  if(session) return session;

  return "";
}

let firstRequest = true;
self.addEventListener("fetch", e => e.respondWith(async function(){
  if(0) console.log("lcoation.origin:", location.origin,
      "\nclientId:", e.clientId,
      "\nscope:", self.registration.scope, 
      "\ne:", e);

  let session;
  let url;

  switch(handleMethod(e.request.url)){
  case HANDLE_METHOD_PASSTHROUGH:
    console.log("PASSTHROUGHT:", e.request.url);
    return fetch(e.request);
  case HANDLE_METHOD_REPLACE_ORIGIN:
    session = await getSession(e)

    url = new URL(location.href)
    url.searchParams.set("src",
        e.request.url.replace(location.origin, "ORIGIN://"));
    url.pathname = `/sync-session/${session}/get`;

    console.log("REDIRECT:", e.request.url, "=>", url.href);

    return fetch(url.href, {
      // ...e.request
    });
  case HANDLE_METHOD_FULLPATH:
    session = await getSession(e)

    url = new URL(location.href)
    url.searchParams.set("src", e.request.url);
    url.pathname = `/sync-session/${session}/get`;

    console.log("REDIRECT:", e.request.url, "=>", url.href);

    return fetch(url.href, {
      // ...e.request
    });
  default:
    console.error("FATAL: unreachable code");
    return fetch(e.request);
  }
}()));