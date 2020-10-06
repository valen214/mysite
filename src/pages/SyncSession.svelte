

<script lang="ts">
  import randomstring from "../lib/randomstring";

  let session = location.pathname.split("sync-session").pop().slice(1);
  let src = "https://www.ptwxz.com/";
  // new URL(location.href).searchParams.get("src");
  let src_head = "";
  let src_body = "";
  let useIFrameSrc = true;
  let useIFrame = true;
  let iframe: HTMLIFrameElement;

  
  (function registerServiceWorker(){
    // if(!session) return;
    if("serviceWorker" in navigator){
      console.log("registering service worker");
      navigator.serviceWorker.register(
        "/sync-session/service_worker.js", {
          
        }
      ).then(registration => {
        console.log("service worker registered:", registration);
        registration.update();
      }).catch(e => {
        console.error("service worker registration failed:", e)
      });
    }
  })();

  function createUrl({
    srcdoc,
    setsrc
  }: {
    srcdoc?: boolean
    setsrc?: string
  } = {}){
    let url = new URL(location.href);
    if(setsrc){
      url.pathname = "/sync-session/" + session + "/setsrc";
      url.searchParams.set("setsrc", setsrc);
    } else if(srcdoc){
      url.pathname = "/sync-session/" + session + "/srcdoc";
    } else if(session){
      url.pathname = "/sync-session/" + session;
    } else{
      url.pathname = "/sync-session";
    }
    return url.href;
  }

  function setSrcdoc(text: string){
    let parts = text.replaceAll(/href=(?:"([^"]*)"|'([^']*)')/g, (
        match, p1, p2, offset
      ) => {
        let url = p1 || p2;
        if(url.startsWith("//")){
          url = encodeURIComponent("http:" + url);
        } else if(url.startsWith("/")){
          url = encodeURIComponent("ORIGIN://" + url)
        } else{
          url = encodeURIComponent(url);
        }
        return "href=\"" + location.origin +
          "/sync-session/" + session +
          "/setsrc?setsrc=" + url + '"';
      }).replaceAll(/src=(?:"([^"]*)"|'([^']*)')/g, (
        match, p1, p2, offset
      ) => {
        let url = p1 || p2;
        if(url.startsWith("//")){
          url = encodeURIComponent("http:" + url);
        } else if(url.startsWith("/")){
          url = encodeURIComponent("ORIGIN://" + url)
        } else{
          url = encodeURIComponent(url);
        }
        return "src=\"" + location.origin +
          "/sync-session/" + session +
          "/get?src=" + url + '"';
      }).split(/<\/?(?:head|body)[^>]*>/g);
    
    src_head = parts[1] || "";
    let body = parts[3] || ""
    if(body){
      console.log("setSrcdoc, find href:", src_body.search(/href="/g));
      src_body = body;
    } else{
      src_body = body;
    }
  }

  if(session){
    console.log("session found!, loading page from server");
    (async () => {
      let res = await fetch(createUrl({ srcdoc: true }));
      let buffer = await res.arrayBuffer();
      let text = new TextDecoder("gbk").decode(buffer);
      setSrcdoc(text);
    })();
  }

  // $: console.log("$$props:", $$props);
  $: console.log("session:", session);



  window.addEventListener("popstate", (e) => {
    console.log("popstate:", e.state, e);
    session = e?.state?.session;
  });
  window.addEventListener("beforeunload", (e) => {
    // @ts-ignore
    console.log("on before unlaod", document.activeElement.href);

    let pause = 0;
    if(pause){
      e.preventDefault();
      e.returnValue = "Chrome Required";
      return "on before unload";
    }
  });


  async function createNewSession(){
    if(src){
      setSrcdoc("<head></head><body>Loading...</body>");
      session = randomstring(6);
      console.log("create new session:", session, "src:", src);

      let res = await fetch(createUrl({ setsrc: src }));

      location.pathname = "/sync-session/" + session;
      if(1) return;


      let text = await res.text();

      setSrcdoc(text);

      history.pushState({
        session,
      }, "sync session", createUrl());
    } else{
      console.log("no url provided");
    }
  }

  let showToolbar = false;
  let toolbar: HTMLElement;
</script>

<style>
.toolbar {
  background: #aaf;
  width: 100%;
  height: 100px;

  padding-top: 30px;

  position: fixed;
  top: 0;
  
  transform: translateY(-100%);
  z-index: 2000;
}
.toolbar.show {
  transform: translateY(0);
}
.toolbar-tip {
  background: #aaf;
  height: 30px;
  width: 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
}

iframe {
  width: 100%;
  height: 100%;
}
</style>


<svelte:head>
  <title>Sync Session</title>
  <base href="{location.origin}/sync-session{
    session ? '/' + session : ''
  }" />
  {@html session && useIFrame ? src_head : ""}
</svelte:head>


{#if !session}
  <div>
    create new session { location.origin }{ location.search } <br />
    <input type="text" bind:value={src} />
    <button on:click={createNewSession}>GO</button>
  </div>
{:else if useIFrameSrc}
  <iframe
    title="sync session content" { src }
    on:click={e => {
      console.log("click");
    }}>

  </iframe>
{:else if useIFrame}
  <iframe
      title="sync session content"
      srcdoc={`
        <html>
          <head>
            <base href="${location.origin}/sync-session${session ? '/' + session : ''}/get" />
            ${src_head}
          </head><body>${src_body}</body></html>`}>

  </iframe>
{:else}
  {@html src_body}
  <div
      bind:this={toolbar}
      class="toolbar {showToolbar ? 'show' : ''}"
      on:mouseout={() => {
        showToolbar = false;
      }}
      on:mouseover={() => {
        showToolbar = true;
      }}>
    <div on:click={() => {
          session = "";
          history.pushState({
            session,
          }, "sync session", createUrl());
        }}>
      CLEAR SESSION
    </div>
    <input type="text" bind:value={src}/>
    <div 
        class="toolbar-tip">
      tip
    </div>
  </div>
{/if}