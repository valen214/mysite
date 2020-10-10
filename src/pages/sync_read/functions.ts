


export async function createNewSession(
  url_input: HTMLInputElement | string
){
  let url: string;
  if(url_input instanceof HTMLInputElement){
    url = url_input.value;
  } else{
    url = url_input;
  }
  let res = await fetch("/sync-read/new-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      src: url
    })
  });
  let result = await res.json();

  if(!result.success){
    console.error("create new session failed");
    return;
  }

  location.pathname = "/sync-read/" + result.session;
}

// impure
export async function init(
  session: string,
  setLoading: (_l: boolean) => void,
  setSrc: (_src: string) => void,
){
  if(!session){
    setLoading(false);
    return;
  };

  let _src = await fetchSrc(session);
  console.log("_src:", _src);
  setLoading(false);
  if(_src){
    console.log(`_src for session(${session}) exists: ${_src}`);
    setSrc(_src);
  } else{
    console.log("no src! redirected to main page");
    history.replaceState({
      src: null
    }, "sync read", location.origin + "/sync-read");
  }
}


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