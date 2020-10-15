




import { injectScript } from "../util/index";


export function init(){
  injectScript("https://unpkg.com/axios/dist/axios.min.js");
}


export function submit(
  url: string
){
  let socket = new WebSocket(url);
  socket.addEventListener("open", e => {
    console.log(e);
    socket.send(
`GET / HTTP/1.1


`.replace("\n", "\r\n"));
  });

  socket.addEventListener('message', (e) => {
    console.log('Message from server ', e.data);
  });

}