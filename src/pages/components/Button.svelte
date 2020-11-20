


<script>
  // https://svelte.dev/tutorial/actions

  export let id = "";
  export let href = undefined;
  export let nohover = false;
  export let background = "white";
  export let hoverbgcolor = "#ccc";
  export let activebgcolor = "#aaa";
  export let style = "";
  export let className = "";

  $: console.log("nohover:", nohover);

  $: parsed_style = [
      background && `--background: ${background}`,
      !nohover && hoverbgcolor && `--hover-bg-color: ${hoverbgcolor}`,
      !nohover && activebgcolor && `--active-bg-color: ${activebgcolor}`,
      (() => {
        if(typeof style === "string"){
          return style;
        } else if(style){
          return Object.entries(
            style
          ).map(( [k, v] ) => `${k}:${v}`
          ).join(";");
        }
      })(),
  ].filter(Boolean).join(";");

  export let clientHeight = 0;
</script>



<a { id } { href } on:click
    class={["button-class", className].join(" ")}
    bind:clientHeight
    on:mouseover
    on:mouseleave
    style={parsed_style}>
  <slot></slot>
</a>


<style>
  .button-class {
    background: var(--background);
    border: none;
    box-shadow: none;
    padding: 0.75em;
    /* font-size: 20px; */
    cursor: pointer;
    border-radius: 5px;
    white-space: nowrap;
    user-select: none;

    text-decoration: none;
    color: inherit;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .button-class:hover {
    background: var(--hover-bg-color);
  }
  .button-class:active {
    background: var(--active-bg-color);
  }
</style>