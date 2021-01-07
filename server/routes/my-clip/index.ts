


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

import { createItem, getItem, saveItem } from "./dbhelper";
import { getItemList } from "./user_actions";
import {
  createItemTable,
  createUserTable
} from "./table_definitions";
import { toString } from "../../util/obj_util";

const wss = new WebSocket.Server({ noServer: true });

const jsonParser = express.json();

export { wss as MyClipWebSocketServer };

wss.on("connection", (ws, request) => {
  console.log("new websocket connection, request:", request);
  ws.on("message", (msg) => {
    console.log("SAY:", msg);
  })
});
createItemTable().then(result => {
  console.log("createItemTable result:", result);
});
createUserTable().then(result => {
  console.log("createUserTable result:", result);
});
getItem(1).then(result => {
  console.log("getItem result:", result);
})
getItemList().then(result => {
  console.log("getItemList result:", result);
})
import { execute } from "../../dbconfig";
execute("SELECT * FROM my_clip_item").then(result => {
  console.log("query result:", result);
})

// router.use("/my-clip", );

router.get(/\/my-clip\/.*\.js/i, (req, res) => {
  let strippedPath = req.path.replace(/^\/my-clip\//, "");
  
  res.type("application/javascript; charset=utf-8");
  res.sendFile(serverRoot(`pages/${strippedPath}`));
});

router.get([
  "/my-clip",
], (req, res) => {
  serveEs6("/pages/MyBoard.js", res);
});

router.get(
  "/my-clip/active",
  (req, res) => {

  }
);


router.post(
  "/my-clip/create",
  jsonParser,
  async (req, res) => {
    console.log("my clip create req.body", req.body);
    let result = await createItem(req.body);
    res.end(toString(result));
  }
);

router.post(
  "/my-clip/save",
  jsonParser,
  async (req, res) => {
    console.log("/my-clip/save req.body:", req.body);
    let result = await saveItem(req.body);
    res.end(toString(result));
  }
);


export default router;