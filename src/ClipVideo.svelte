

<script lang="ts">

  import FileUtil from "./lib/file_util";
  FileUtil.func();
  import VideoUtil from "./lib/video_util";

  /*
https://github.com/Kagami/ffmpeg.js


  https://github.com/ffmpegwasm/FFmpeg

https://itnext.io/build-ffmpeg-
webassembly-version-ffmpeg-js-part-6-a-deep-dive-into-file-system-56eba10067ca

  */


  async function start(e: Event){
    if(e.target instanceof HTMLInputElement){
      if(e.target.files?.length){
        let file = e.target.files[0];
        VideoUtil.clip(file, "00:00:10", "00:00:20");
      }
    }
  }
</script>

<div on:click={start}>
  click me
</div>
<input type="file" on:input={start}/>