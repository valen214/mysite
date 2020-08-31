
/**
 * 
 * https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
 */

import App from "./App.svelte";

const app = new App({
  target: document.body,
  
})

export default app;