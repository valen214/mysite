
import type express from "express";

export function redirectPage(res: express.Response){
  res.type('text/html; charset=utf-8');
  res.end(`
<html><head>
<meta http-equiv="refresh"
    content="0; url=http://localhost:3000/sync-session">
</head></html>
  `);
}