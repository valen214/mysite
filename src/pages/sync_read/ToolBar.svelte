

<script>
  import Button from "../components/Button.svelte";
  export let url = "";

</script>

<style>
  .toolbar {
    height: 80px;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial;

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

  .logo {
    padding-left: 15px;
    margin: 0;
    user-select: none;
    cursor: pointer;
  }
  
  input {
    border: solid 1px rgba(0, 0, 0, 0.2);
    height: 2em;
    line-height: 2em;
    font-size: 20px;
    padding-left: 5px;
    width: 50vw;
  }

  .right-group {
    padding-right: 15px;
  }
</style>

<div class="toolbar">
  <div class="left-group">
    <h2 class="logo">
      Sync Read
    </h2>
  </div>
  <div class="center-group">
    <input bind:value={url} placeholder="Enter URL..."/>
  </div>
  <div class="right-group">
    <Button on:click>Submit</Button>
  </div>
</div>