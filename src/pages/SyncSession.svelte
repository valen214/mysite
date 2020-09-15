

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
</script>

<style>
iframe {
  resize: both;
  overflow: auto;
  border: none;
}
</style>


{#if !session}
  <div>
    create new session
  </div>
{:else}
  <iframe title="session container"
      bind:this={iframe} {src} >

  </iframe>
{/if}