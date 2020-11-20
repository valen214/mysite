
<script lang="ts">
  // https://svelte.dev/repl/c2dfeb2f38214e25a3857e3f714c76f9?version=3.29.4
  import { SvelteComponent, SvelteComponentDev, SvelteElement } from "svelte/internal";

  import Button from "../components/Button.svelte";

  class Panel {
    ["$$prop_def"]: { [propertyName: string]: string };
    ["$$"]: { [propertyName: string]: any };
    
    constructor(){
      this.$$ = {
        context: new Map([]),
        ctx: ["HI"],
        after_update: [
            function(...args: any[]){
            console.log(args);
          }
        ],
        on_mount: [
          function(...args: any[]){
            console.log(args);
          }
        ],
        update(){
          console.log("UPDATE");
        }
      };
      this.$$prop_def = {

      };
    }
  }


  console.log(Button, SvelteElement, SvelteComponent);

  

</script>



<div>
  <Panel>HEY</Panel>
</div>



<style>

</style>