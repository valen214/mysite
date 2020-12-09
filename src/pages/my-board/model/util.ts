

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