
<script lang="ts">
  import Button from "../../components/Button.svelte";
  import type MyBoard from "../model/MyBoard";
  import app from "../index";

  let showSaveButton: boolean = false;

  app.on("activeitemmodified", item => {
    if(app.active_item.type === "text"){
      showSaveButton = true;
    }
  }).on("saveactiveitem", () => {
    showSaveButton = false;
  })
</script>

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
  {#if showSaveButton}
    <Button on:click={() => {
          console.log("save");
          app.dispatch("saveactiveitem");
        }}>
      Save
    </Button>
  {/if}
</div>