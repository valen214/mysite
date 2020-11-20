
console.log(
  '\n'.repeat(2),
  "\nrunning", __filename,
  "\n__dirname:", __dirname
);

import path from "path";
import fs from "fs";

import express from "express";
import { serveEs6 } from "./util/svelte";

const app: express.Application = express()
const port = 3000;


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
    console.log(`${req_line.padEnd(60, " ")} => \x1B\x5B38;2;0;255;0m${code} ${msg}`);
    if(Object.keys(req.query).length){
      // console.log("query:", JSON.stringify(req.query));
    }
  });
});

app.get("/pages/SoulWorker.js", (req, res) => {
  res.header("Content-Type: application/javascript");
  res.sendFile("/pages/SoulWorker.js");
});
app.get(/.*/, (req, res) => {
  serveEs6("/pages/SoulWorker.js", res);
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