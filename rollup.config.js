
import fs from "fs";
import path from "path";

import svelte from 'rollup-plugin-svelte';
import svelte_preprocess from "svelte-preprocess";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
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
    output: {
      format: "cjs",
      dir: "public/",
    },
    external: builtins,
    plugins: [
      commonjs(),
      typescript({
        tsconfig: false,
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
      include: [
        "src/**/*"
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
      }),
      commonjs(),
      typescript({
        tsconfig: false,
        allowSyntheticDefaultImports: true
      }),
      resolve({
        browser: true,
        dedupe: [ 'svelte' ]
      }),
    ],
    watch: {
      clearScreen: false
    }
  };
}

export default function(args){
  console.log("rollup command line arguments:", args);

  if(args["server"]){
    return serverConfig();
  }

  return pagesConfig();
};
