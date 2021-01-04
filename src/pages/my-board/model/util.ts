

import type { Item } from "./index";

export function randomstring(length: number,
  dict="abcdefghijklmnopqrstuvwxyz" +
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
  return new Array(length).fill(0).map(() => {
    // String.prototype.charAt() strips decimal places
    return dict.charAt(Math.random() * dict.length);
  }).join("")
};

export function toID(arg: string | Item): string {
  if(!arg){
    return null;
  }
  if(typeof arg === "string"){
    return arg;
  } else {
    return arg.id;
  }
}


export function generateID(isDuplicated?: (id: string) => boolean){
  let id = (
    r => `${r(4)}-${r(4)}-${r(6)}-${r(4)}`
  )(randomstring);

  if(( typeof isDuplicated === "function" ) &&
      isDuplicated(id)){
    return generateID(isDuplicated);
  }

  return id;
}

export async function binaryToBase64(data: any): Promise<string> {
  return new Response(data).arrayBuffer().then(buffer => {
    let arr = new Uint8Array(buffer);
    let base64 = btoa(new TextDecoder('utf8').decode(arr))
    return base64;
  })
}

export async function base64ToBlob(base64: string): Promise<Blob> {
  let arr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  // let arr1 = new TextEncoder().encode(atob(base64));
  // console.assert(arr.every((e, i) => e === arr[i]));
  return new Blob([ arr ]);
}