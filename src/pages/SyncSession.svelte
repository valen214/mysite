
<svelte:options tag="sync-session"/>

<script lang="ts">
  import randomstring from "../lib/randomstring";

  (function registerServiceWorker(){
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

  const query = new URL(location.href).searchParams;
  
  let session = query.get("session");
  let src = query.get("src");
  let srcdoc = "";
  let src_head = "";
  let src_body = "";


  // $: console.log("$$props:", $$props);
  $: console.log("session:", session);

  let iframe: HTMLIFrameElement;


  window.addEventListener("popstate", (e) => {
    console.log(e);
    console.log("popstate:", e.state);
    session = e?.state?.session;
  });


  async function createNewSession(){
    if(src){
      console.log("src:", src);

      let res = await fetch(location.origin + `/google`);
      let text = await res.text();

      srcdoc = text;
      let parts = text.split(/<\/?(?:head|body)[^>]*>/g);
      src_head = parts[1];
      src_body = parts[3];
      console.log(parts.map(str => str.slice(0, 100)));

      session = randomstring(6);
      let url = new URL(location.href);
      url.searchParams.set("session", session);
      history.pushState({
        session,
      }, "sync session", url.href);
    } else{
      console.log("no url provided");
    }
  }

  let showToolbar = false;
  let toolbar: HTMLElement;
</script>

<svelte:window on:beforeunload={e => {
    e.preventDefault();
    // @ts-ignore
    console.log("on before unlaod", document.activeElement.href);
    console.log(location.href);
    return "on before unload";
  }} />

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
</style>


<svelte:head>
  <title>Sync Session</title>
  {@html session ? src_head : ""}
  <base href="{location.href}/sync-session" />
</svelte:head>


{#if !session}
  <div>
    create new session { location.origin }{ location.search } <br />
    <input type="text" bind:value={src} />
    <button on:click={createNewSession}>GO</button>
  </div>
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
          let url = new URL(location.href);
          url.searchParams.delete("session");
          history.pushState({
            session,
          }, "sync session", url.href);
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