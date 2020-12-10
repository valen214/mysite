
import fs from "fs";
import path from "path";

import alias from "@rollup/plugin-alias";
import svelte from 'rollup-plugin-svelte';
import svelte_preprocess from "svelte-preprocess";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
// import vue from 'rollup-plugin-vue'
import builtins from 'builtin-modules'



// const production = !process.env.ROLLUP_WATCH;
// use cross-env to set
const production = process.env.NODE_ENV === "production";

function serverConfig(){
  return {
    input: {
      "server": "server/server.ts",
      "temp": "server/temp.ts",
    },
    watch: {
      include: "server/server.ts",
      exclude: [
        "src/**/*"
      ]
    },
    output: {
      format: "cjs",
      dir: "public/",
    },
    external: builtins,
    plugins: [
      commonjs(),
      typescript({
        tsconfig: false,
        target: "es6",
        allowSyntheticDefaultImports: true
      }),
      json(),
      resolve({
        browser: false,
        rootDir: __dirname,
      }),
      terser(),
    ]
  }
}

function pagesConfig(){
  function getInput(){
    let obj = {
      "SyncRead": "src/pages/SyncRead.svelte",
      "MyClip": "src/pages/MyClip.svelte",
      "HttpRequest": "src/pages/HttpRequest.svelte",
    };

    fs.readdirSync(
      path.join("src/pages"), {
      withFileTypes: true
    }).forEach((dirent) => {
      // console.log("checking entry: ",dirent.name);
      if(dirent.isFile()){
        
      } else {
        let name = dirent.name;
        let pageEntryPath = path.join("src/pages", name, "index.svelte");
        if(fs.existsSync(pageEntryPath)){
          let chunkName = name.split(/[-_]/g).map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }).join("");
          obj[chunkName] = pageEntryPath;
        }
      }
    });

    return obj;
  }

  return {
    input: getInput(),
    watch: {
      clearScreen: false,
      include: [
        "src/**/*"
      ],
      exclude: [
        "server/**/*"
      ]
    },
    output: {
      format: "es",
      dir: "public/pages/",
      entryFileNames(chunkInfo){
        console.log("entryFileNames(): processing chunk:", chunkInfo.name);
        return chunkInfo.name + ".js";
      }, // "[name].js",
      chunkFileNames(chunkInfo){
        return "chunk-[name]-[format].js"; // -[hash]
      }
    },
    plugins: [
      svelte({
        dev: !production,
        preprocess: svelte_preprocess({}),
        emitCss: false,
      }),
      commonjs(),
      resolve({
        browser: true,
        dedupe: [ 'svelte' ]
      }),
      typescript({
        tsconfig: false,
        target: "es6",
        allowSyntheticDefaultImports: true
      }),
    ],
  };
}

export default function(args){
  console.log("rollup command line arguments:", args);

  if(args["vue"]){
    delete args["vue"];
    return {
      input: "src/pages/my-board/index.ts",
      output: {
        format: 'esm',
        file: 'dist/a.js'
      },
      external: ['vue'],
      plugins: [
        commonjs(),
        vue({
        }),
        alias({
          resolve: [ '.js', '.ts' ],
          entries: [
            {
              find: 'vue',
              replacement: 'node_modules/vue/dist/vue.runtime.esm-browser.js'
            }
          ]
        }),
      ]
    };
  } else if(args["server"]){
    delete args["server"];
    return serverConfig();
  } else if(args["both"]){
    delete args["both"];
    return [
      serverConfig(),
      pagesConfig(),
    ];
  }

  return pagesConfig();
};
