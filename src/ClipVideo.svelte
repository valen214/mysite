

<script lang="ts">
  /*
https://github.com/Kagami/ffmpeg.js


  https://github.com/ffmpegwasm/FFmpeg

https://itnext.io/build-ffmpeg-
webassembly-version-ffmpeg-js-part-6-a-deep-dive-into-file-system-56eba10067ca

  */
  let workerReady: boolean = false;
  let worker = new Worker("ffmpeg-worker-mp4.js");


  function getDownloadLink(fileData: any, fileName: string) {
    var a = document.createElement('a');
    a.download = fileName;
    var blob = new Blob([ fileData ]);
    var src = window.URL.createObjectURL(blob);
    a.href = src;
    a.textContent = 'Click here to download ' + fileName + "!";
    document.body.appendChild(a);
  }

  async function start(e: Event){
    console.log(e);
    if(!workerReady){
      console.log("worker not ready");
      return;
    }
    if(e.target instanceof HTMLInputElement){
      if(e.target.files?.length){
        let file = e.target.files[0];
        let buffer = await file.arrayBuffer();
        
        worker.postMessage({
          type: "run",
          MEMFS: [{
            name: "input.mp4",
            data: new Uint8Array(buffer)
          }],
          arguments: "-ss 00:00:10 -i input.mp4 -to 00:00:20 -c copy -y output.mp4".split(" ")
        });
      }
    }
  }

  worker.onmessage = function(e) {
    const msg = e.data;
    switch (msg.type) {
    case "ready":
      workerReady = true;
      break;
    case "stdout":
      console.log("stdout", msg.data);
      break;
    case "stderr":
      console.log("stderr", msg.data);
      break;
    case "done":
      console.log("done", msg.data);
      break;
    }
  };
</script>

<div on:click={start}>
  click me
</div>
<input type="file" on:input={start}/>