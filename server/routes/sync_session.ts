

import express from "express";
import svelte from "svelte";

import http from "http";

const router = express.Router();

console.log(svelte);

router.get(["/sync-session", "/clip-video"], (req, res) => {
  console.log(Object.entries(req).filter(([key, value]) => {
    return ["query", "params"].includes(key);
  }).map(([key, value]) => `${key}: ${value}`).join("\n"));

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
});

router.get("/google", (req, res) => {
  // res.type("text/html; charset=utf-8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  let buf: Buffer;
  http.get("http://www.google.com", _res => {
    
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
});

export default router;