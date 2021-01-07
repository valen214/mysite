

export function filterObjectByKeys(
  obj: any,
  keys: string[]
){
  let out: any = {};
  let setA = new Set(Object.keys(obj));
  let setB = new Set(keys);

  if(setB.size < setA.size){
    [ setA, setB ] = [ setB, setA ];
  }

  for(let key of setA){
    if(setB.has(key)){
      out[key] = obj[key];
    }
  }

  return out;
}


export function toString(arg: any): string {
  if(typeof arg === "object"){
    return JSON.stringify(arg);
  } else if(typeof arg === "string"){
    return arg;
  }
  return Object.prototype.toString.apply(arg);
}