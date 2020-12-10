<script lang="ts">
  import type { Item } from "../index";
  import Button from "../../components/Button.svelte";

  export let className: string;
  
  import app from "../index";

  export let item: Item & { type?: "text" };

  let mode: "edit" | "view" = "view";

  $: {
    item?.title;
    item?.content;
    app.dispatch("activeitemmodified", item);
  }

  app.on("saveactiveitem", () => {
    app.saveItem(item);
  });
</script>



<div class={[className, "text-item"].join(" ")}>
  {#if mode === "edit"}
    <div class="title-row">
      <input type="text" bind:value={item.title} />
    </div>
    <div class="content-row">
      <textarea type="text" bind:value={item.content} />
    </div>
    

  {:else}
    <div class="title-row">
      { item?.title || "" }
    </div>
    <div class="content-row">
      { item?.content || "" }
    </div>

    <Button className="edit-button"
        on:click={() => {
          app.dispatch("activeitemmodified", item);
          mode = "edit";
        }}>edit</Button>
  {/if}
</div>


<style>
  input {
    border: rgba(0, 0, 0, 0.2);
  }

  .text-item {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title-row {
    height: 80px;
  }
  .title-row input {
    height: 100%;
    width: 100%;
    font-size: 40px;
    padding: 0 0 0 15px;
  }

  .content-row {
    flex-grow: 1;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
  .content-row textarea {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 5px;
    resize: none;
    border: none;
  }

  .text-item :global(.edit-button) {
    position: absolute;
    bottom: 50px;
    right: 50px;
    height: 50px;
    width: 50px;
    background: #aaa;
    border-radius: 50%;
  }
</style>