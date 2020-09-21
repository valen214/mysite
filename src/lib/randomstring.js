









export default function randomstring(length,
  dict="abcdefghijklmnopqrstuvwxyz" +
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
  return crypto.getRandomValues(
      new Uint8Array(length)
    ).reduce((l, r) => (
      l + dict[ Math.trunc(r * dict.length / 256) ]
    ), ""
  );
  // String.prototype.charAt() works too as it also takes non-int
};