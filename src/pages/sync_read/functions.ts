

export function getSession(){
  return location.pathname.match(/sync-read\/(.+)$/)?.[1];
}




export async function fetchSrc(session: string){
  const res = await fetch(`/sync-read/${session}/src`);
  return res.text();
}


export function fetchByServer(src: string){
  return fetch(location.origin +
      "/sync-read/get/?src=" + encodeURIComponent(src)
  );
}




function attemptToExtractCharset(html: string){
  return html.match(/charset="?([^">\/\s]+)/i)?.[1];
}
function extractPassageContent(html: string, src: string): string{

  let base = src.slice(0, src.lastIndexOf('/') + 1);

  html = html.slice(
      html.indexOf("<H1>"),
      html.indexOf("<center>")
  );
  html = html.slice(0, html.indexOf("<table")) +
      html.slice(html.lastIndexOf("</table>") + 8);
  html = html.replace(/href="/gu, () => {
    return `href="${location.origin}${location.pathname}?setsrc=${base}`;
  });
  return html;
}
export async function processSrc(src: string){
  let res = await fetchByServer(src);
  let charset = attemptToExtractCharset(await res.clone().text());
  let buffer = await res.arrayBuffer();
  let html = new TextDecoder(charset).decode(buffer);

  let body = extractPassageContent(html, src);

  console.log(body);
  return `<div>
  ${body}
</div>`;
}