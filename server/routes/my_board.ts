


import https from "https";

import axios from "axios";
axios.defaults.httpsAgent = new https.Agent({
  // ca,
  rejectUnauthorized: false
});

import express from "express";
const router = express.Router();

import { serverRoot } from "../util";
import { serveEs6 } from "../util/svelte";

router.get(/\/soul-worker\/.*\.js/i, (req, res) => {
  let strippedPath = req.path.replace(/^\/soul-worker\//, "");
  
  res.type("application/javascript; charset=utf-8");
  res.sendFile(serverRoot(`pages/${strippedPath}`));
});

// client side routing
router.get([
  "/soul-worker",
  "/soul-worker/soul-stone-calculator",
], (req, res) => {
  serveEs6("/soul-worker/SoulWorker.js", res);
});





export default router;