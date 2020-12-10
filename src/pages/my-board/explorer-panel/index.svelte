<script lang="ts">
  import type { Item, ItemStore } from "../index";

  import Button from "../../components/Button.svelte";

  import app from "../index";
  
  export let className = "";
  let items_id: string[] = [];
  $: items = items_id.map(id => app.store.get(id));

  app.on("activefolderchange", (__items_id) => {
    // items = app.current_item_hierarchy.map(id => app.store.get(id));
    items_id = __items_id;
  }).on("activeitemmodified", item => {
    if(items_id.includes(item.id)){
      items = items_id.map(id => {
        if(id === item.id){
          return item;
        }
        return app.store.get(id)
      });
    }
  });


</script>


<div class={className + " explorer-panel"}>
  {#each Object.entries(items) as [key, item]}
    <Button
        nohover
        className="item-tile"
        on:click={() => {
          app.viewItem(item.id);
        }}>
      { "title" in item ? item.title : "" }
    </Button>
    <hr />
  {/each}
</div>

<style>
  hr {
    color: rgba(0, 0, 0, 0.2);
    width: 80%;
    margin: 0 auto;
  }

  .explorer-panel {
    position: relative;
  }

  :global(.item-tile.item-tile) {
    padding: 5px 15px;
    min-height: 50px;
    width: 100%;
    align-items: center;
    justify-content: left;
    border-radius: 0;
    --hover-bg-color: #abc;
    --active-bg-color: #9ab;
  }
</style>

