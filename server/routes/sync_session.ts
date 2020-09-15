

import express from "express";
import svelte from "svelte";

import http from "http";

const router = express.Router();

console.log(svelte);

router.get("/sync-session", (req, res) => {
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

export default router;