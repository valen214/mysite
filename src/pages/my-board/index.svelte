
<script lang="ts">
  import type { Item } from "./index";

  import TopBar from "./TopBar.svelte";
  import ExplorerPanel from "./explorer-panel/index.svelte";
  import SideActionPanel from "./components/SideActionPanel.svelte";
  import ContentPanel from "./ContentPanel.svelte";

  import app from "./index";


</script>


<div class="root">
  <TopBar />
  <div class="page-content">
    <div class="side-panel-container">
      <ExplorerPanel className="" />
      <SideActionPanel />
    </div>
    <ContentPanel className=""/>
  </div>
</div>


<svelte:head>
  <title>My Board</title>
</svelte:head>
<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
  }

  .root {
    height: 100vh;
    width: 100vw;
    position: relative;
    top: 0;
    left: 0;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto;
  }

  .page-content {
    display: grid;
    grid-template-columns: 350px 1fr;
    height: 100%;
    background: #99aab5;
  }

  .side-panel-container {
    display: grid;
    grid-template-rows: auto 80px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }
</style>