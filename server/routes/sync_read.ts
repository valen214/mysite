

const oracledb = require("oracledb");
import express from "express";
import body_parser from "body-parser";
import path from "path";
import fs from "fs";
import axios from "axios";

import { execute } from "../dbconfig";

import { serveEs6 } from "../util/svelte";

import {
  randomstring,
  serverRoot
} from "../util";

const router = express.Router();




async function initTable(){
  try{
    let result = await execute(
      "CREATE TABLE test_table_2 ( id NUMBER, data VARCHAR2(20))"
    ).catch((e: any) => {
      if(e.errorNum === 955){

      } else{
        console.log("catch clause:", e);
      }
    });
    console.log("result:", result);
  } catch(e){
    console.log("error in creating table:", e);
  }
}
initTable();

router.use(body_parser.json());

router.get("/sync-read/*.js", (req, res) => {
  res.type("application/javascript; charset=utf-8");
  res.end(fs.readFileSync(serverRoot(`pages/${path.basename(req.path)}`)));
});

const session_storage: {
  [key: string]: {
    src: string
  }
} = {};

router.post("/sync-read/new-session", (req, res) => {
  console.log(req.body);
  let session = randomstring(10);
  session_storage[session] = {
    src: req.body.src
  };
  
  res.end(JSON.stringify({
    success: true,
    session
  }));
});

router.get("/sync-read/get", async (req, res) => {
  let url: string = req.query["src"].toString();
  let _res = await axios.get(url, {
    headers: {
      "Accept-Charset": "utf-8",
    },
    responseType: "arraybuffer"
  });
  res.end(_res.data);
})

router.get("/sync-read/:session/src", (req, res) => {
  let session = req.params["session"];
  res.type("text/plain; charset=utf-8");
  res.end(session_storage[session]?.src || "");
});
router.put("/sync-read/:session/src", (req, res) => {
  console.log("req.body:", req.body);
  res.end(false);
});

router.get("/sync-read/:session", (req, res) => {
  let session = req.params["session"];
  let setsrc = req.query["setsrc"];
  if(setsrc){
    session_storage[session].src = setsrc.toString();
    
    res.redirect("/sync-read/" + session);
  } else{
    serveEs6("/sync-read/SyncRead.js", res);
  }
})

router.get([
    "/sync-read",
], (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  serveEs6("/sync-read/SyncRead.js", res);
});

router.get("/[Ss]ync-?[Rr]ead", (req, res) => {
  res.redirect("/sync-read");
});







export default router;