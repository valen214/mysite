

export function getQuery(
  key: string,
  url: string = location.href
){
  return new URL(url).searchParams.get(key);
}