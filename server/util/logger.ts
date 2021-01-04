

import type { Request, Response, NextFunction } from "express";
import { FOREGROUND_WINDOWS_DEFAULT, FOREGROUND_GREEN } from "./ANSI_COLOR";


let randomize = (
  req_line: string
) => Array.from(req_line
).map((v, i) => ( `\x1B\x5B38;5;${
  Math.floor((232 - 17) * Math.random()) + 17
}m` + v )).join("");
// console.log(out);

export default function logger(
    req: Request,
    res: Response,
    next: NextFunction){
  let req_line = `${req.method} ${req.path} HTTP/${req.httpVersion}`;

  res.on("finish", () => {});
  res.on("close", () => {
    let { statusCode: code, statusMessage: msg } = res;
    ((a, b) => {
      console.log(`${req_line.padEnd(60, " ")} => ${a}${code} ${msg}${b}`);
    })(FOREGROUND_GREEN, FOREGROUND_WINDOWS_DEFAULT)
    if(Object.keys(req.query).length){
      // console.log("query:", JSON.stringify(req.query));
    }
  });


  next();
}