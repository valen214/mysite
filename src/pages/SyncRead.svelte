


<script lang="ts">
  import Button from "./components/Button.svelte";
  import {
    getSession,
    fetchSrc,
    processSrc
  } from "./sync_read/functions";

  let url_input: HTMLInputElement;

  let session: string = getSession();
  let loading: boolean = true;
  let src: string = null;
  $: contentHTMLPromise = src && processSrc(src);

  async function createNewSession(){
    let res = await fetch("/sync-read/new-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        src: url_input.value
      })
    });
    let result = await res.json();

    if(!result.success){
      console.error("create new session failed");
      return;
    }

    location.pathname = "/sync-read/" + result.session;
  }

  (async function(){
    if(!session){
      loading = false;
      return;
    };

    src = await fetchSrc(session);
    console.log("src:", src);
    loading = false;
    if(src){
      console.log(`src for session(${session}) exists: ${src}`);
    } else{
      console.log("no src! redirected to main page");
      history.replaceState({
        src: null
      }, "sync read", location.origin + "/sync-read");
    }
  })();
</script>

<style>
  .test-class {
    font-size: 12px;
  }

  input {
    border: solid 1px rgba(0, 0, 0, 0.2);
    height: 2em;
    line-height: 2em;
    font-size: 20px;
    padding-left: 5px;
  }
</style>

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
  <label>
    Create New Session with url:
    <input type="text" bind:this={url_input} />
  </label>
  <Button on:click={createNewSession}>
    Create New Session
    <div class="test-class" slot="class">A</div>
  </Button>
  
  <div>
    Hello World!
  </div>
{/if}




