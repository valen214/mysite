

declare type WorkerTaskMessage = {
  name: string
  data: any
};

function randomstring(length: number,
    dict="abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
  return crypto.getRandomValues(
      new Uint8Array(length)
    ).reduce((l, r) => (
      l + dict[ Math.trunc(r * dict.length / 256) ]
    ), ""
  );
};


namespace VideoUtil
{
  console.log("initialize namespace VideoUtil");

  const worker = new Worker("ffmpeg-worker-mp4.js");
  async function addToQueue(name: string, data: any): Promise<Uint8Array>{
    return new Promise(res => {
      let onmessage = (e: MessageEvent) => {
        const msg = e.data;
        console.log("MessageEvent: ", e.data.data);
        switch(msg.type){
        case "done":
          let data = msg.data;
          if(data?.MEMFS?.length){
            let file = data.MEMFS[0];
            if(file.name === name){
              worker.removeEventListener("message", onmessage);

              res(file.data);
            }
          }
        }
      };

      worker.addEventListener("message", onmessage);
      worker.postMessage(data);
    })
  }


  export async function clip(
      file: Blob,
      from: string | number = 0,
      to: string | number = null){
    
    let data: Uint8Array = new Uint8Array(await file.arrayBuffer());
    let _in = "input.mp4";
    let out = randomstring(6) + ".mp4";

    data = await addToQueue(out, {
      type: "run",
      MEMFS: [{
        name: _in,
        data,
      }],
      // https://trac.ffmpeg.org/wiki/Seeking
      arguments: `-y -accurate_seek -i ${_in} -ss ${from} -to ${to} -codec copy ${out}`.split(" ").filter(Boolean)
          /*
          `-i ${_in} -force_key_frames ${from},${to} 
          -ss ${from} -to ${to} -codec copy 
          -avoid_negative_ts 1 -copyts
          -map 0 -y ${out}`.split(" ").filter(Boolean)
          (`-accurate_seek -ss ${from} ` +
          ( to ? `-to ${to} `: "" ) + `-i ${_in} ` +
          `-c copy -map 0 -y ${out}`).split(" ").filter(Boolean)
          */
    })

    let video = document.createElement("video");
    video.style.width = "100%";
    video.controls = true;
    
    let source = document.createElement("source");
    source.src = URL.createObjectURL(new Blob([ data ]));
    source.type = "video/mp4";

    video.appendChild(source);
    document.body.appendChild(video);

    
    var a = document.createElement('a');
    a.download = out;
    a.href = source.src;
    a.textContent = 'Click here to download ' + out + "!";
    document.body.appendChild(a);
  }

}

export default VideoUtil;