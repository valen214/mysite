
<svelte:options tag="sync-session"/>

<script lang="ts">
  import { tick } from "svelte";

  const url = new URL(location.href);
  const query = url.searchParams;
  
  let session = query.get("session");
  console.log("session:", session);

  let src = query.get("src");
  console.log("src:", src);

  let iframe: HTMLIFrameElement;

  (async () => {
    await tick();
    console.log(iframe);
  })();

  let a = false;
</script>

<style>
iframe {
  resize: both;
  overflow: auto;
  border: none;
}
</style>


{#if !session}
  <div on:click={() => { a = !a; }}>
    create new session { location.origin } { location.search } <br />
    a: { a }
  </div>
{:else}
  <iframe title="session container"
      bind:this={iframe} {src} >

  </iframe>
{/if}