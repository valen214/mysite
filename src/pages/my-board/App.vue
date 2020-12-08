
<script>
import TopBar from "./components/TopBar.vue";
import ContentPanel from "./components/TheContentPanel.vue";
import ExplorerPanel from "./components/TheExplorerPanel.vue";
import { MyBoard } from './model/index';

// vue serve src\pages\my-board\App.vue
// npx vue-cli-service serve src\pages\my-board\App.vue
// npx -p @vue/cli vue serve src\pages\my-board\App.vue

export default {
  components: {
    TopBar,
    ContentPanel,
    ExplorerPanel,
  },

  data(){
    return {
      app: new MyBoard(),
    }
  }
}
</script>


<template>
  <div class="root">
    say Hi
    <TopBar class="top-bar"/>
    <ExplorerPanel
        class="explorer-panel"
        v-bind:app="app" />
    <ContentPanel
        class="content-panel"
        v-bind:app="app" />
  </div>
</template>


<style scoped>
  .root {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-areas:
        "topbar     topbar"
        "explorer   content";
    grid-template-rows: 80px 1fr;
    grid-template-columns: 300px auto;
  }
  
  .top-bar { grid-area: topbar; }
  .explorer-panel { grid-area: explorer; }
  .content-panel { grid-area: content; }
</style>

<style>
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    border: 0;
    height: 100%;
    width: 100%;
  }
</style>