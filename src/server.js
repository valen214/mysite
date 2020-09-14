
const path = require("path")

const express = require('express')
const app = express()
const port = 3000



const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(require("../webpack.config.js"));

app.use(middleware(compiler, {
  noInfo: true
}));

app.get('/', (req, res) => {
  res.send("ASDASDASDASDAS");
});


app.get('/test', (req, res) => {
  res.send('Hello World!d');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
