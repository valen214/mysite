
console.log(
    '\n'.repeat(2),
    "\nrunning", __filename,
    "\n__dirname:", __dirname
);

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

import path from "path";
import fs from "fs";
import express from "express";
// @ts-ignore
import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser");

import { serveEs6 } from "./util/svelte";

import sync_session from "./routes/sync_session";
import sync_read from "./routes/sync_read";
import http_request from "./routes/http_request";
import soul_worker from "./routes/soul_worker";

const app: express.Application = express()
const port = 3000;

/*

rsync -z -r -e 'ssh -i /mnt/c/Users/User/.ssh/oci_main_instance_priv.openssh.key' \
/mnt/d/workspace/mysite/public/* ubuntu@150.136.251.80:/home/ubuntu/mysite/public/
    

*/


app.use(cookieParser());

// log request
app.all(/.*/, function log_request(req, res, next){
  let req_line = `${req.method} ${req.path} HTTP/${req.httpVersion}`;
  let out = Array.from(req_line).map((v, i) => ( `\x1B\x5B38;5;${
    Math.floor((232 - 17) * Math.random()) + 17
  }m` + v )).join("");
  // console.log(out);

  res.on("finish", () => {});
  res.on("close", () => {
    let { statusCode: code, statusMessage: msg } = res;
    console.log(`${req_line.padEnd(60, " ")} => \x1B\x5B38;2;0;255;0m${code} ${msg}`);
    if(Object.keys(req.query).length){
      // console.log("query:", JSON.stringify(req.query));
    }
  });


  next();
});

app.get('/', (req, res) => {
  console.log("root path");
  res.type("text/plain; charset=utf-8");
  res.end("HEY THERE!");
});

app.get("/pages/*.js", (req, res) => {
  res.type("application/javascript; charset=utf-8");
  res.end(fs.readFileSync(path.join(
      __dirname,
      `pages/${path.basename(req.path)}`
  )));
});
app.get([
  "/ClipVideo",
  "/MyClip",
  "/SyncSession",
  "/SoulWorker",
  /^\/\w*$/
], (req, res) => {
  serveEs6(`./pages${req.path}.js`, res);
});


app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../src/lib")));

app.use(sync_session);
app.use(sync_read);
app.use(http_request);
app.use(soul_worker);



app.get('/test', (req, res, next) => {
  res.type('text/plain; charset=utf-8');
  res.write('Hello World!d');
  next();
});
app.get("/test", (req, res) => {
  res.write("OAKAKSKSK");
  res.end();
});


app.get("/multi", (req, res) => {
  res.type('text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../server/pages', 'multi.html'));
});

const multer = require("multer");
const upload = multer();
app.post("/multi", upload.single("f"), (req, res) => {
  console.log("req.headers:", req.headers);
  console.log(Object.keys(req));
  // @ts-ignore
  // console.log(req.file, req.client);
  req.client.on("data", (chunk) => {
    console.log("chunk:", chunk);
  });
  // @ts-ignore
  fs.writeFile(path.join(__dirname, "temp", req.file.originalname || "img.webp"), req.file.buffer, null, () => {});
  res.send(JSON.stringify(req.body));
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})


/*


https://itnext.io/4-solutions-
to-run-multiple-node-js-or-npm-commands-simultaneously-9edaa6215a93

https://www.coreycleary.me/separating-logic-from-express-routes-for-easier-testing/



http://ascii-table.com/ansi-escape-sequences.php



*/