

<script>
  import Button from "./components/Button.svelte";
  import { init, submit } from "./http-request/functions";

  let method;
  let url;

  init();
</script>

<style>
  :global(html),
  :global(body) {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }


  select,
  input {
    border: 1px solid rgba(0, 0, 0, 0.2);
    height: 50px;
    font-size: 25px;
  }
</style>

<div>
  <select class="text-input-field" bind:value={ method }>
    {#each ["GET", "POST", "PUT", "HEAD", "DELETE"] as method}
      <option value={method}>
        {method}
      </option>
    {/each}
  </select>
  <input bind:value={url} placeholder="url" />
  <Button on:click={() => {
    submit(url);
  }}>GO</Button>
</div>