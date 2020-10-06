


<script>
  // https://svelte.dev/tutorial/actions

  export let id = "";
  export let background = "";
  export let hoverbgcolor = "";
  export let style = "", _style = "";

  let classCarrier;
  $: carriedClass = (
    classCarrier &&
    classCarrier.children[0] &&
    classCarrier.children[0].className
  );
</script>


<button {id} on:click
    class={carriedClass}
    style={[
      background && `--background: ${background}`,
      hoverbgcolor && `--hover-bg-color: ${hoverbgcolor}`,
      style,
      _style,
    ].filter(Boolean).join(";")}>
  <slot></slot>
</button>

<div class="class-carrier"
    style={"display: none"}
    bind:this={classCarrier}>
  <slot name="class" />
</div>

<style>
  button {
    background: var(--background, white);
    border: none;
    box-shadow: none;
    padding: 15px;
    font-size: 20px;
    cursor: pointer;
    border-radius: 5px;
  }
  button:hover {
    background: var(--hover-bg-color, #ccc);
  }
  button:active {
    background: var(--active-bg-color, #aaa);
  }

</style>