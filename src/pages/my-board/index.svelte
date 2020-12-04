

<script lang="ts">
  import type { Item, ItemStore } from "./index";

  import TopBar from "./TopBar.svelte";
  import ExplorerPanel from "./explorer-panel/index.svelte";
  import ContentPanel from "./ContentPanel.svelte";
  import {
    getItem,
    listItem,
  } from "./model/items";

  let items: Item[];
  
  listItem().then(ids => {
    return ids.map(id => {
      return getItem(id);
    })
  }).then(async _items => {
    items = (await Promise.all(_items));
  });


  let showing_item: Item = null;

  (function test(){
    setTimeout(() => {
      showing_item = items[1];
    }, 200)
  })();
</script>


<div class="root">
  <TopBar />
  <div class="page-content">
    <ExplorerPanel
        className=""
        { items }
        on:item_click={e => {
          let key = e?.detail?.key;
          showing_item = items[key];
        }}/>
    <ContentPanel
        className=""
        item={showing_item}/>
  </div>
</div>


<svelte:head>
  <title>My Board</title>
</svelte:head>
<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
  }

  .root {
    height: 100vh;
    width: 100vw;
    position: relative;
    top: 0;
    left: 0;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto;
  }

  .page-content {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100%;
  }
</style>