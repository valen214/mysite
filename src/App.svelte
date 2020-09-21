

<script>
  import ClipVideo from "./pages/ClipVideo.svelte";
  import SyncSession from "./pages/SyncSession";

  const pathnames = location.pathname.split("/");

  let current_page = SyncSession;
  if(/^clip-?video$/.test(pathnames[1])){
    current_page = ClipVideo;
  } else if(/^sync-?sessions?\/?$/.test(pathnames[1])){
    current_page = SyncSession;
  } else{

  }
</script>

<svelte:component this={current_page} />