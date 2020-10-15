


import https from "https";
import path from "path";

import axios from "axios";
axios.defaults.httpsAgent = new https.Agent({
  // ca,
  rejectUnauthorized: false
});

import express from "express";
const router = express.Router();

import { serverRoot } from "../util";
import { serveEs6 } from "../util/svelte";

router.get("/http-request/*.js", (req, res) => {
  res.type("application/javascript; charset=utf-8");
  res.sendFile(serverRoot(`pages/${path.basename(req.path)}`));
});

router.get("/http-request", (req, res) => {
  serveEs6("/http-request/HttpRequest.js", res);
});






let token = "";

(async function(
  url: string = "http://localhost:8080",
  type: string = "text/html; charset=utf-8"
){
  try {
    let res = await axios.post(url, {
      responseType: "arraybuffer",
      data: {
        type: "query_user",
        token,
        fields: [
          "user_nicename",
          "display_name",
          "usertype",
          "shop_ID",
          "avatar",
        ]
      }
    });
    console.log(res.headers["content-type"]);
    console.log(res.data);
  } catch(e){
    console.error(e.message);
  }

})(
  "http://18.163.56.65/wp-json/api/v1/info"
);

export default router;