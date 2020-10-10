

import _path from "path";

export function randomstring(length: number,
  dict="abcdefghijklmnopqrstuvwxyz" +
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
  return new Array(5).fill(0).map(() => {
    // String.prototype.charAt() strips decimal places
    return dict.charAt(Math.random() * dict.length);
  }).join("")
};


export function serverRoot(path?: string){
  return _path.join(__dirname, path);
}


export function fileFromRoot(path?: string){
  return path;
}