console.log('\n'.repeat(5) + "running server.ts");


import path from "path";
import fs from "fs";

import express from "express";
// @ts-ignore
// import cookieParser from "cookie-parser";
const cookieParser = require("cookie-parser");
import svelte from "svelte";


import sync_session from "./routes/sync_session";

const app: express.Application = express()
const port = 3000

/*

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(require("../webpack.config.js"));

app.use(middleware(compiler, {
  noInfo: true
}));


*/

console.log('svelte:', svelte);
console.log("__dirname:", __dirname);

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
      console.log("query:", JSON.stringify(req.query));
    }
  });


  next();
});

app.get('/', (req, res) => {
  console.log("root path");
  res.type('text/html; charset=utf-8');
  res.end(`
<html><head>
<meta http-equiv="refresh"
    content="0; url=http://localhost:3000/sync-session">
</head></html>
  `);
});

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../src/lib")));

app.use(sync_session);


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