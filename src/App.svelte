

<script>
  import ClipVideo from "./pages/ClipVideo.svelte";
  import SyncSession from "./pages/SyncSession";

  const pathnames = location.pathname.split("/");
  console.log(pathnames);
  console.log("HI");

  let current_page = SyncSession;
  if(/^clip-?video$/.test(pathnames[1])){
    current_page = ClipVide;
  } else if(/^sync-?sessions?$/.test(pathnames[1])){
    current_page = SyncSession;
  } else{

  }
</script>

<svelte:component this={current_page} />