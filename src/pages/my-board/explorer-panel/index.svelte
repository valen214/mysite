<script lang="ts">
  import type { Item, ItemStore } from "../index";

  import { createEventDispatcher } from "svelte";
  import Button from "../../components/Button.svelte";
  import MyBoard from "../model/MyBoard";
  
  const dispatch = createEventDispatcher();

  export let app: MyBoard;
  export let className = "";
  export let items: Item[] | ItemStore = [];



</script>


<div class={className + " explorer-panel"}>
  {#each Object.entries(items) as [key, item]}
    <Button
        nohover
        className="item-tile"
        on:click={() => {
          dispatch("item_click", {
            key
          });
        }}>
      { "title" in item ? item.title : "" }
    </Button>
    <hr />
  {/each}
  <div class="bottom-action-panel">
    <hr />
    <Button on:click={() => {
          console.log("HEY");
          app.createItem({
            "type": "text"
          });
        }}>
      Create Item
    </Button>
  </div>
</div>

<style>
  hr {
    color: rgba(0, 0, 0, 0.2);
    width: 80%;
    margin: 0 auto;
  }

  .explorer-panel {
    position: relative;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  .bottom-action-panel {
    position: absolute;
    bottom: 0;
    height: 80px;
    width: 100%;
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

