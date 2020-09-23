

import express from "express";

import http from "http";
import path from "path";
import fs from "fs";

const router = express.Router();

function redirectToWebpackDevServer(res: express.Response<any>){
  res.type("text/html; charset=utf-8");
  http.get("http://localhost:8080", _res => {
    _res.on("data", chunk => {
      res.send(chunk);
    });
    _res.on("end", () => {
      res.end();
    });
  }).on("error", e => {
    console.log(e.message);
    res.end();
  })
}

function useCopmiledHTML(res: express.Response<any>){
  res.type("text/html; charset=utf-8");
  let buf = fs.readFileSync(path.join(
    __dirname,
    "../../src/index.html"
  ));
  let src = buf.toString("utf-8").replace("<body>",
      `<body><script src='/pages/sync_session.js'></script>
      <sync-session />`);
  res.end(src);
}

router.get("/sync-session/service_worker.js", (req, res) => {
  res.type("application/javascript; charset=utf-8");
  res.end(fs.readFileSync(path.join(__dirname,
    "../../src/pages/sync-session/service_worker.js"
  )))
})

router.get([
    "/sync-session",
    "/clip-video",
], (req, res) => {
  console.log(Object.entries(req).filter(([key, value]) => {
    return ["query", "params"].includes(key);
  }).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n"));

  redirectToWebpackDevServer(res);
});

function fetchGoogle(res: express.Response<any>){
  let buf: Buffer;
  return http.get("http://www.google.com", _res => {
    
    _res.on("data", chunk => {
      if(buf){
        buf = Buffer.concat([buf, chunk]);
      } else{
        buf = chunk;
      }
    });

    _res.on("end", () => {
      console.log("google get end");
      res.end(buf);
    });
  }).on("error", e => {
    // console.log(e.message);
    // res.end();
  })
  
}

router.get("/google", (req, res) => {
  // res.type("text/html; charset=utf-8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(fs.readFileSync(path.join(
    __dirname,
    "../../google.html"
  )));
});



export default router;