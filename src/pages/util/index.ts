

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


export function randomstring(length: number,
  dict="abcdefghijklmnopqrstuvwxyz" +
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
  return new Array(length).fill(0).map(() => {
    // String.prototype.charAt() strips decimal places
    return dict.charAt(Math.random() * dict.length);
  }).join("")
};