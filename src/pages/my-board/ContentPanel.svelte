<script lang="ts">
  import type { Item } from "./index";
  import TextItem from "./content-panel/TextItem.svelte";

  export let className = "";
  export let item: Item = null;
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