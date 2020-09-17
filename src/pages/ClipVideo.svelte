
// @ts-ignore
<svelte:options tag="clip-video"/>

<script lang="ts">

  import FileUtil from "../lib/file_util";
  FileUtil.func();
  import VideoUtil from "../lib/video_util";

  
  let ffmpeg: any;
  importScript(
    "https://unpkg.com/@ffmpeg/ffmpeg@0.8.3/dist/ffmpeg.min.js",
    () => {
      // @ts-ignore
      let { createFFmpeg } = window["FFmpeg"];
      
      ffmpeg = createFFmpeg({ log: true });
    
    }
  )

  /*
https://github.com/Kagami/ffmpeg.js


  https://github.com/ffmpegwasm/FFmpeg

https://itnext.io/build-ffmpeg-
webassembly-version-ffmpeg-js-part-6-a-deep-dive-into-file-system-56eba10067ca

  */

  function importScript(src: string, onload: (e?: Event) => void){
    let script = document.createElement("script");
    script.src = src;
    script.onload = onload;
    document.body.appendChild(script);
  }

  function displayVideoAndLink(data: Uint8Array){
    let out = "video.webm";

    let video = document.createElement("video");
    video.style.width = "100%";
    video.controls = true;
    
    let source = document.createElement("source");
    source.src = URL.createObjectURL(new Blob([ data ]));
    source.type = "video/webm";

    video.appendChild(source);
    document.body.appendChild(video);

    
    var a = document.createElement('a');
    a.download = out;
    a.href = source.src;
    a.textContent = 'Click here to download ' + out + "!";
    document.body.appendChild(a);
  }

  async function start(e: Event){
    if(e.target instanceof HTMLInputElement){
      if(e.target.files?.length){
        let file = e.target.files[0];


        (async () => {
          if(!ffmpeg) return;
          await ffmpeg.load();
          await ffmpeg.write('test.mp4', file);
          await ffmpeg.transcode('test.mp4', 'test.webm', "-strict -2");
          let out = await ffmpeg.read('test.webm');
          displayVideoAndLink(out);
        })();


        if(false){
          // VideoUtil.clip(file, "00:00:10", "00:00:20", false);
          let data = await VideoUtil.toWebm(file);
          displayVideoAndLink(data);
        }


        
      }
    }
  }
</script>

<div on:click={start}>
  click me
</div>
<input type="file" on:input={start}/>