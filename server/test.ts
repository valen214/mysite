


import https from "https";
import path from "path";

import express from "express";
const router = express.Router();

import { serverRoot } from "./util";


router.get('/test', (req, res, next) => {
  res.type('text/plain; charset=utf-8');
  res.write('Hello World!d');
  next();
});
router.get("/test", (req, res) => {
  res.write("OAKAKSKSK");
  res.end();
});


router.get("/multi", (req, res) => {
  res.type('text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../server/pages', 'multi.html'));
});

const multer = require("multer");
const upload = multer();
router.post("/multi", upload.single("f"), (req, res) => {
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


export default router;