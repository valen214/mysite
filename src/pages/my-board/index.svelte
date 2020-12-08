

<script lang="ts">
  import type { Item } from "./model";
  import { MyBoard } from "./model";

  import TopBar from "./TopBar.svelte";
  import ExplorerPanel from "./explorer-panel";
  import ContentPanel from "./ContentPanel.svelte";
  
  let app = new MyBoard();
  let items: Item[];
  let showing_item: Item = null;

  app.store.getRootItem().then(item => Promise.allSettled(
    item.children.map(id => app.store.downloadItem(id))
  )).then(results => results.map(result => {
    return result.status === "fulfilled" ? result.value : null;
  })).then(values => {
    items = values.filter(Boolean);
  });


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