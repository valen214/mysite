


export function hypenize(str: string){
  return str.replace(/([A-Z])/g, (s, c, i) => {
      return ( i === 0 ? "" : "-" ) + s.toLowerCase();
  });
}


export function capitalize(str: string, delim = /[\-;]/g){
  let a = str.replace(/(^|[\-; ])([a-z])/g, (m, p1, p2) => {
    return p2.toUpperCase();
  })
  
  let b = str.split(delim).map(s => {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }).join("");

  console.assert(a === b, "capitalize:", a, b);

  return b;
}