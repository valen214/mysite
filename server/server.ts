

console.log(
    '\n'.repeat(2),
    "\nrunning", __filename,
    "\n__dirname:", __dirname
);

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

import path from "path";
import express from "express";

const app: express.Application = express()
const port = 3000;

/*
rsync -z -r -e 'ssh -i /mnt/c/Users/User/.ssh/oci_main_instance_priv.openssh.key' \
/mnt/d/workspace/mysite/public/* ubuntu@150.136.251.80:/home/ubuntu/mysite/public/
*/

// @ts-ignore
import cookieParser from "cookie-parser";
app.use(cookieParser());

/*// logger in use ----- code block switch
const morgan = require('morgan'); app.use(morgan(':method :url :response-time'));
/*/
import logger from "./util/logger";
app.use("/", logger);
//*/

app.get('/', (req, res) => {
  console.log("root path");
  res.type("text/plain; charset=utf-8");
  res.end("HEY THERE!");
});

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../src/lib")));

const server = app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})

import test from "./test";
app.use(test);

import { init } from "./routes";
init(app, server);
