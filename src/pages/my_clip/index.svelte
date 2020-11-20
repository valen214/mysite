

<script lang="ts">
  let s: string = "HI";
  console.log(s); 
</script>

<div on:click={() => {
      s = "Hello World"[Math.floor(Math.random() * 12)]
    }}>
  { s } =&gt; Hello World I Guess?
</div>