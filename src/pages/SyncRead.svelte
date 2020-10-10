


<script lang="ts">
  import Button from "./components/Button.svelte";
  import {
    init,
    getSession,
    processSrc,
    createNewSession
  } from "./sync_read/functions";
  import ToolBar from "./sync_read/ToolBar.svelte";

  let url: string;

  let session: string = getSession();
  let loading: boolean = true;
  let src: string = null;
  $: contentHTMLPromise = src && processSrc(src);
  $: url = src;

  init(
    session,
    (_l: boolean) => loading = _l,
    (_src: string) => src = _src,
  );
</script>


<style>
  :global(body) {
    margin: 0;
  }
</style>

<ToolBar
    on:click={() => createNewSession(url)}
    bind:url />
{#if loading}
  Loading
{:else if src}
  {#await contentHTMLPromise}
    Downloading and processing page
  {:then contentHTML}
    {@html contentHTML}
  {:catch error}
    <p style="color: red">{ error.message }</p>
  {/await}
{:else}
  <div>
    Hello World!
  </div>
{/if}




