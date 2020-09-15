console.log('\n'.repeat(5) + "running server.ts");


import path from "path";

import express from "express";

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

console.log("__dirname:", __dirname);

app.use(express.static(path.join(__dirname, "../dist")));

app.use(sync_session);

app.get(/.*/, (req, res, next) => {
  console.log(req.method, req.path, "HTTP/" + req.httpVersion);
  next();
});

app.get('/', (req, res) => {
  res.type('text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


app.get('/test', (req, res, next) => {
  res.type('text/plain; charset=utf-8');
  res.write('Hello World!d');
  next();
});
app.get("/test", (req, res) => {
  res.write("OAKAKSKSK");
  res.end();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


/*


https://itnext.io/4-solutions-
to-run-multiple-node-js-or-npm-commands-simultaneously-9edaa6215a93

https://www.coreycleary.me/separating-logic-from-express-routes-for-easier-testing/







*/