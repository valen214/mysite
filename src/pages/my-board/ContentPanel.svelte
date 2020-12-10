<script lang="ts">
  import type { Item } from "./index";
  import TextItem from "./content-panel/TextItem.svelte";
  import MyBoard from "./model/MyBoard";
  
  import app from "./index";

  export let className = "";
  let item: Item = null;

  
  app.on("activeitemchange", (active_item_id) => {
    item = app.active_item;
    console.assert(active_item_id === item.id,
        "active_item in app does not equal to listener info");
  })


</script>

{#if item?.type === "image"}
  <div class={className}>
    { item.title }
  </div>

{:else if item?.type === "text"}
  <TextItem { item } />
{:else if item?.type === "folder"}
  <div class={className}>
    { item.name }
  </div>
{:else}
  <div>
    nothing selected
  </div>

{/if}


<style>


</style>