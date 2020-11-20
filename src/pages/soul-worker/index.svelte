
<script lang="ts">
  import Button from "../components/Button.svelte";

  import SoulStoneCalculator from "./page_soulstone.svelte";

  $: routedComponent = (() => {
    switch(location.pathname){
    case "/soul-worker/soul-stone-calculator":
      return SoulStoneCalculator;
    }
    return null;
  })();
</script>

<div>
  <Button href="/soul-worker">靈魂行者</Button>
  <Button href="/soul-worker/soul-stone-calculator">靈魂石計算器</Button>
</div>
{#if routedComponent}
  <svelte:component this={routedComponent} />
{:else}
  <div>
    <h2>Home</h2>
  </div>
{/if}




<style>

</style>