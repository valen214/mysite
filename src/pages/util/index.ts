

export function injectScript(url: string, callback?: EventListener){
  let script = document.createElement("script");
  script.src = url;
  if(callback) script.onload = callback;
  document.head.appendChild(script);
}


export function addComma(integer: number){
  return integer.toString().replace(
    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}