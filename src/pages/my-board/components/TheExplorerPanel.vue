
<script>
// import { Item } from "../index";

export default {
  data(){
    return {};
  },
  props: {
    app: {
      // type: Item
    }
  }
}
</script>


<template>
  <div class="explorer-panel">
    explorer panel {{ app }}
  </div>
</template>


<style>
  .explorer-panel {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

</style>