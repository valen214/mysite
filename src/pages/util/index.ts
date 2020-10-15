

export function injectScript(url: string, callback?: EventListener){
  let script = document.createElement("script");
  script.src = url;
  if(callback) script.onload = callback;
  document.head.appendChild(script);
}