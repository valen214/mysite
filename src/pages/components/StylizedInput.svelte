

<script lang="ts" context="module">
  export type STYLIZED_INPUT_CONFIG = {
    add?: number[] | string
    list?: number[] | string
  };
</script>
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  // import { writable } from "svelte/store";
  import Button from './Button.svelte';
  
  const dispatch = createEventDispatcher();

  const hash = Math.random().toString(16).slice(2);
  let root: HTMLDivElement;
  let active: boolean = false;

  export let type: string;
  export let value = 0;
  export let config: STYLIZED_INPUT_CONFIG = {};
  export let add: number[] | string = "";
  export let set: number[] | string = "";
  export let list: number[] | string = ""

  $: {
    let input = root?.querySelector("input");
    if(input) input.value = value.toString();
  }


  $: [ add_buttons, set_buttons, list_values ] = [
    config?.add || add,
    set,
    config?.list || list
  ].map((obj) => {
    if(!obj) return [];
    if(typeof obj === "string"){
      return obj.split(" ").map(s => Number(s));
    } else if(Array.isArray(obj)){
      return obj;
    }
  });

  function onInput(e: any){
    value = e.target.value;
    dispatch("input", e);;
  }
  function onChange(e: any){
    value = e.target.value;
    dispatch("change", e);
  }

  onMount(() => {
    let onClick = (e: MouseEvent) => {
      if(root.contains(e.target as Node)){

      } else{
        active = false;
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  })
</script>


<span class="stylized-input" bind:this={root}>
  <input
      class="stylized-input-element"
      type={type}
      on:change={onChange}
      on:input={onInput}
      on:focus={() => {
        active = true;
      }}
      { ...( list_values && { list: hash } ) }/>
  {#if list_values && list_values.length}
    <datalist id={hash}>
      {#each list_values as value}
        <option { value } />
      {/each}
    </datalist>
  {:else if (add_buttons && add_buttons.length) ||
      (set_buttons && set_buttons.length)}
    <div class="button-panel"
        class:show={active}>
      {#each add_buttons as add }
        <Button on:click={() => {
          value += add;
        }}>
          + { add }
        </Button>
      {/each}
      {#each set_buttons as set }
        <Button on:click={() => {
          value = set;
        }}>
          = { set }
        </Button>
      {/each}
    </div>
  {/if}
</span>

<style>
  .stylized-input {
    display: inline-grid;
    position: relative;
  }
  .stylized-input-element {
    border: 1px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 1.2em;
    font-size: 1.5em;

  }

  .button-panel {
    display: none;
    position: absolute;
    top: 100%;
    z-index: 1000;
    width: 100%;
    height: auto;
    background: white;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0 , 0.2);
    border-radius: 5px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  }

  .button-panel.show {
    display: inline-grid;
    grid-auto-flow: column;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
  }

  input[type="number"] {
    -webkit-appearance: textfield;
       -moz-appearance: textfield;
            appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>