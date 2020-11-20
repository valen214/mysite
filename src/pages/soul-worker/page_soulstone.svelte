

<script lang="ts">
  import { addComma } from "../util";
  import Button from "../components/Button.svelte";
  import StylizedInput from "../components/StylizedInput.svelte";
  import type { FragmentsEntry } from "./algorithm";
  import {
    COST_DATA,
    calculateTotalCost
  } from "./algorithm";

  $: [
    fragment_cost, conversion_cost,
    crafting_cost, remaining_fragments,
    fragment_used
  ] = calculateTotalCost(fragment_entries);
  
  
  let fragment_entries: FragmentsEntry[] = [
    0, 0, 1, 1, 2, 2
  ].map((i, j) => {
    return {
      level: i,
      matching_element: j % 2 == 0
    }
  });
  $: total_cost = fragment_cost + conversion_cost + crafting_cost;

  let [ addLow, addMid, addHigh ] = [
    0, 1, 2
  ].map((level) => (e: Event) => {
    fragment_entries = [...fragment_entries, ({
      level
    })];
  });
</script>

<svelte:head>
  <title>Soul Worker Util</title>
</svelte:head>

<div class="root">
  <h2>靈魂石計算器</h2>
  <div>
    <h3>靈魂石素材表</h3>
    <table>

    </table>
  </div>
  <div>
    <h3 class="inline">費用計算器</h3>
    <Button on:click={addLow}>新增低級碎片</Button>
    <Button on:click={addMid}>新增中級碎片</Button>
    <Button on:click={addHigh}>新增高級碎片</Button>
  </div>
  <div class="fragment-entries-container">
    {#each fragment_entries as entry, i}
      <div class="fragment-entry">
        <span>
          { ["低級碎片", "中級碎片", "高級碎片"][entry.level] }
        </span>
        <span>
          數量
        </span>
        <StylizedInput type="number"
            bind:value={entry.quantity}
            add="100 1000"
            set="100 1000" />
        <span>價格</span>
        <StylizedInput type="number"
            bind:value={entry.price}
            list="2200 2600 2700" />
        
        <Button
            background={entry.matching_element ? "rgba(60, 255, 60, 0.2)" : null}
            hoverbgcolor={entry.matching_element ? "rgba(30, 200, 30, 0.2)" : null}
            on:click={() => {
              entry.matching_element = !entry.matching_element;
            }}>
          <input
              bind:checked={entry.matching_element}
              type="checkbox"/> 同屬
        </Button>
        <span>合成使用了: { fragment_used[i] }</span>
      </div>
    {/each}
  </div>
  <div class="crafting-cost">
    Total Cost: {
      addComma(total_cost)
    } ( 尚缺碎片 { remaining_fragments.join(",") } )
  </div>

  
  <div class="w50 i-b">
    <div>
      碎片市價
      買入: 
      賣出: 
    </div>
    <div>

      直接出售碎片可獲得: { addComma(
          COST_DATA[8].low * 1200 +
          COST_DATA[8].mid * 24000 +
          COST_DATA[8].high * 260000
      )}
    </div>
  </div>
</div>


<style>
  * {
    box-sizing: border-box;
  }
  .w50 {
    width: 50%;
  }
  .i-b {
    display: inline-block;
  }

  .root {
    font-size: 16px;
  }
  .inline {
    display: inline-block;
  }

  .fragment-entries-container {
    width: 50%;
    display: inline-block;
  }

  .fragment-entry {
    margin-bottom: 8px;
    display: grid;
    justify-content: left;
    align-items: center;
    grid-template-columns: auto auto 120px auto 120px auto;
    column-gap: 10px;
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
</style>