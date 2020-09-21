
<svelte:options tag="sync-session"/>

<script lang="ts">
  import randomstring from "../lib/randomstring";

  const query = new URL(location.href).searchParams;
  
  let session = query.get("session");
  let src = query.get("src");

  $: console.log("session:", session);
  $: {
    let url = new URL(location.href);
    let _session = url.searchParams.get("session");
    if(session){
      url.searchParams.set("session", session);
    } else{
      url.searchParams.delete("session");
    }
    if(!_session){

      history.pushState({
      session,
    }, "sync session", url.href);
    } else{

      history.replaceState({
      session,
    }, "sync session", url.href);
    }
  };

  let iframe: HTMLIFrameElement;


  let a = false;

  window.addEventListener("popstate", (e) => {
    console.log(e);
    console.log("popstate:", e.state);
    session = e.state.session;
  });
</script>

<style>
iframe {
  resize: both;
  overflow: auto;
  border: none;
}
</style>


<svelte:head>
  <title>Sync Session</title>
</svelte:head>

<base href="abcdabcacd" />

{#if !session}
  <div>
    create new session { location.origin } { location.search } <br />
    <input type="text" bind:value={src} />
    <button on:click={() => {
      if(src){
        session = randomstring(6);
      } else{
        console.log("no url provided");
      }
    }}>GO</button>
  </div>
{:else}
  <iframe title="session container"
      bind:this={iframe} {src}
      on:error={() => {
        console.log("error: iframe failed to load src:", src);
        session = "";
      }}>

  </iframe>
{/if}