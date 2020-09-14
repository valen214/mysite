

<script lang="ts">
  import { tick } from "svelte";

  const url = new URL(location.href);
  const query = url.searchParams;
  
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



<iframe title="session container"
    bind:this={iframe} {src} >

</iframe>