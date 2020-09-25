

import express from "express";

const https = require("https");
const ca = require('ssl-root-cas/latest').create();
https.globalAgent.options.ca = ca;

import axios from "axios";
axios.defaults.httpsAgent = new https.Agent({
  // ca,
  rejectUnauthorized: false
})


import path from "path";
import fs from "fs";


const router = express.Router();

async function respondsWith(
  res: express.Response,
  url: string = "http://localhost:8080",
  type: string = "text/html; charset=utf-8"
){
  try{
    let _res = await axios.get(url, {
      responseType: "arraybuffer"
    });
    res.type(_res.headers["content-type"]);
    res.end(_res.data);
  } catch(e){
    console.error(e.message);
  }
}


function redirectToWebpackDevServer(
    req: express.Request,
    res: express.Response<any>
){
  respondsWith(res,
      "http://localhost:8080" + req.path
  );
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

function fetchGoogle(res: express.Response<any>){
  respondsWith(res, "http://www.google.com");
}

router.get("/sync-session/service_worker.js", (req, res) => {
  res.type("application/javascript; charset=utf-8");
  res.end(fs.readFileSync(path.join(__dirname,
    "../../src/pages/sync-session/service_worker.js"
  )))
})
router.get(/^\/sync-session(\/[^\/]+)?\/bundle\.js$/, (req, res) => {
  respondsWith(res,
      "http://localhost:8080/bundle.js",
      "application/javascript; charset=utf-8"
  );
})
router.get(/^\/sync-session(\/[^\/]+)?\/bundle\.js\.map$/, (req, res) => {
  respondsWith(res,
      "http://localhost:8080/bundle.js.map",
      "application/json; charset=utf-8"
  );
})
router.get("/sync-session/ffmpeg-worker-mp4.js", (req, res) => {
  res.type("application/javascript");
  res.end();
});


let cache: {
  [key: string]: string
} = {

};

router.get("/sync-session/cache", (req, res) => {
  res.type("text/plain; charset=utf-8");
  res.end(JSON.stringify(cache, null, 4));
})

router.get("/sync-session/:session/setsrc", (req, res) => {
  console.log(`setsrc for session (${
        req.params.session
      }):`, req.query.setsrc
  );
  let session = req.params.session;
  let url = req.query.setsrc as string;
  if(url.startsWith("ORIGIN://")){
    url = new URL(cache[session]).origin + url.replace("ORIGIN://", "");
  } else if(!url.startsWith("http")){
    url = "http://" + url;
  }

  cache[session] = url;

  res.redirect("/sync-session/" + session);
});
router.get("/sync-session/:session/srcdoc", (req, res) => {
  let session = req.params.session;
  let url = cache[session];
  console.log("srcdoc: responding with:", url);
  respondsWith(res, url);
});
router.get("/sync-session/:session/get", (req, res) => {
  let session = req.params.session;
  let url = req.query.src as string;
  if(url.startsWith("ORIGIN://")){
    url = new URL(cache[session]).origin + url.replace("ORIGIN://", "");
  }
  respondsWith(res, url);
});
router.get("/sync-session/:session", (req, res) => {
  console.log(req.params.session);
  console.log("req.path:", req.path);
  respondsWith(res,
      "http://localhost:8080",
  );
});

router.get("/sync-session", (req, res) => {
  res.setHeader("Set-Cookie", "cookie_test=cokietest");
  respondsWith(res,
      "http://localhost:8080",
  );
  console.log("header:", req.header("set-cookie"));
  console.log("cookies:", JSON.stringify(req.cookies));
});

router.get("/clip-video", (req, res) => {
  redirectToWebpackDevServer(req, res);
});



export default router;