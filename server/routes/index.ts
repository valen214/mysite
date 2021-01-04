

import path from "path";
import fs from "fs";
import url from "url";
import { Server } from "http";

import express from "express";



import sync_session from "./sync_session";
import sync_read from "./sync_read";
import http_request from "./http_request";
import soul_worker from "./soul_worker";
import my_clip, { MyClipWebSocketServer } from "./my-clip";

import { serveEs6 } from "../util/svelte";


export function init(
    app: express.Application,
    server: Server
){

  app.use(my_clip);
  app.use(sync_session);
  app.use(sync_read);
  app.use(http_request);
  app.use(soul_worker);
  
  app.get([
    "/ClipVideo",
    "/MyClip",
    "/SyncSession",
    "/SoulWorker",
    /^\/\w*$/
  ], (req, res) => {
    serveEs6(`./pages${req.path}.js`, res);
  });

  

  app.get("/pages/*.js", (req, res) => {
    res.type("application/javascript; charset=utf-8");
    res.end(fs.readFileSync(path.join(
        __dirname,
        `pages/${path.basename(req.path)}`
    )));
  });

  
  server.on("upgrade", (request, socket, head) => {

    const pathname = url.parse(request.url).pathname;

    if(pathname === '/my-clip/websocket'){
      MyClipWebSocketServer.handleUpgrade(
        request, socket, head,
        function done(ws){
          MyClipWebSocketServer.emit('connection', ws, request);
        }
      );
    } else{
      socket.destroy();
    }
  });
}