

<script>
  console.log("HI");

  function func(){
    console.log("click");
  }
</script>

<div on:click={func}>
  clip-video
</div>

<div on:click={func}>
  none
</div>

<style>
  div {
    user-select: none;
  }
</style>