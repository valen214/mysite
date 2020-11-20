

<script>
  import Button from "../components/Button.svelte";

</script>

<div class="toolbar">
  <div class="left-group">
    <Button nohover>MyBoard</Button>
  </div>
  <div class="center-group">

  </div>
  <div class="right-group">

  </div>
</div>

<style>
  .toolbar {
    height: 80px;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .toolbar .left-group {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .toolbar .center-group {
    margin: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .toolbar .right-group {
    margin-right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>