


import https from "https";

import axios from "axios";
axios.defaults.httpsAgent = new https.Agent({
  // ca,
  rejectUnauthorized: false
});

import express from "express";
const router = express.Router();

import WebSocket from "ws";

import { serverRoot } from "../../util";
import { serveEs6 } from "../../util/svelte";

import { createItem } from "./dbhelper";

const wss = new WebSocket.Server({ noServer: true });

const jsonParser = express.json();

export { wss as MyClipWebSocketServer };

wss.on("connection", (ws, request) => {
  console.log("new connection");
  ws.on("message", (msg) => {
    console.log("SAY:", msg);
  })
})


router.get(/\/my-clip\/.*\.js/i, (req, res) => {
  let strippedPath = req.path.replace(/^\/my-clip\//, "");
  
  res.type("application/javascript; charset=utf-8");
  res.sendFile(serverRoot(`pages/${strippedPath}`));
});

// client side routing
router.get([
  "/my-clip",
], (req, res) => {
  serveEs6("/pages/MyBoard.js", res);
});


router.post(
  "/my-clip/create",
  jsonParser,
  (req, res) => {
    console.log("my clip create req.body", req.body);
    res.end();
  }
);

router.post("/my-clip/save", (req, res) => {
  console.log(req.socket.read(1024));
  res.end("OK");
});


export default router;