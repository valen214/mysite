

<script lang="ts">
  import type { Item } from "./index";

  import TopBar from "./TopBar.svelte";
  import ExplorerPanel from "./explorer-panel/index.svelte";
  import ContentPanel from "./ContentPanel.svelte";

  import MyBoard from "./model/MyBoard";

  let app = new MyBoard();
  let listed_items: Item[];
  $: {
    listed_items = app.store.listItem(app.active_item?.id, true)
  }
  $: active_item = app.active_item;

  app.on("activeitemchange", () => {
    active_item = app.active_item;
  })

</script>


<div class="root">
  <TopBar />
  <div class="page-content">
    <ExplorerPanel
        className=""
        { app }
        items={listed_items}
        on:item_click={e => {
          let key = e?.detail?.key;
          app.viewItem(key);
        }}/>
    <ContentPanel
        className=""
        item={active_item}/>
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