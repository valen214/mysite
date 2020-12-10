

/*
import { createApp } from 'vue';
import App from "./App.vue";

createApp(App).mount("body");
*/

import MyBoard from "./model/MyBoard";

export const app = new MyBoard();

export default app;

export * from "./model";