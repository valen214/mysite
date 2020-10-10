
console.log(
    '\n'.repeat(2),
    "\nrunning", __filename,
    "\n__dirname:", __dirname
);

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

import path from "path";
import fs from "fs";
import yargs from 'yargs';

import express from "express";
// @ts-ignore
import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser");

import sync_session from "./routes/sync_session";
import sync_read from "./routes/sync_read";

const app: express.Application = express()
const port = yargs.argv?.port || yargs.argv?._?.[0] || 3000;

/*

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(require("../webpack.config.js"));

app.use(middleware(compiler, {
  noInfo: true
}));

rsync -z -r -e 'ssh -i /mnt/c/Users/User/.ssh/oci_main_instance_priv.openssh.key' \
/mnt/d/workspace/mysite/public/* ubuntu@150.136.251.80:/home/ubuntu/mysite/public/
    

*/


app.use(cookieParser());

// log request
app.all(/.*/, (req, res, next) => {
  let req_line = `${req.method} ${req.path} HTTP/${req.httpVersion}`;
  let out = Array.from(req_line).map((v, i) => ( `\x1B\x5B38;5;${
    Math.floor((232 - 17) * Math.random()) + 17
  }m` + v )).join("");
  // console.log(out);

  res.on("finish", () => {});
  res.on("close", () => {
    let { statusCode: code, statusMessage: msg } = res;
    console.log(`${req_line.padEnd(60, " ")} => ${code} ${msg}`);
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
  res.end(fs.readFileSync(path.join(__dirname,
      `pages/${path.basename(req.path)}`)));
});
app.get([
  "/ClipVideo",
  "/MyClip",
  "/SyncSession"
], (req, res) => {
  res.type("text/html; charset=utf-8");
  res.end(`<!DOCTYPE html><html>
<head>
  <script
      src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"
      integrity="sha512-c3Nl8+7g4LMSTdrm621y7kf9v3SDPnhxLNhcjFJbKECVnmZHTdo+IRO05sNLTH/D3vA6u1X32ehoLC7WFVdheg=="
      crossorigin="anonymous">
  </script>
  <script>
    require.config({
      paths: {
          "${req.path}": "/pages${req.path}",
          'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min'
      },
      waitSeconds: 40
    });
  </script>
  <link type="modulepreload" href="${req.path}.js" />
  </head>
  <body>
  <script src="/pages${req.path}.js"></script>
</body>
</html>
  `);
});


app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../src/lib")));

app.use(sync_session);
app.use(sync_read);


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
  console.log(`Example app listening at http://localhost:${port}`)
})


/*


https://itnext.io/4-solutions-
to-run-multiple-node-js-or-npm-commands-simultaneously-9edaa6215a93

https://www.coreycleary.me/separating-logic-from-express-routes-for-easier-testing/



http://ascii-table.com/ansi-escape-sequences.php



*/