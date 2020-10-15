

import type express from "express";



export function serveEs6(
    path: string,
    res: express.Response
){
  res.type("text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html>
  <head>
    <link type="modulepreload" href="${path}" />
  </head>
  <body>
    <script type="module">
      import App from "${path}";
      new App({
        target: document.body
      });
    </script>
  </body>
</html>`
  );
}