
import path from "path";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import builtins from 'builtin-modules'

console.log("__dirname:", __dirname);

export default function(){
  return {
    input: {
      "server": "server.ts",
      "temp": "temp.ts",
    },
    watch: {
      clearScreen: false
    },
    output: {
      format: "cjs",
      dir: path.join(__dirname, "..", "public/"),
    },
    external: builtins,
    plugins: [
      commonjs({
        exclude: "../src/**/*",
        dynamicRequireTargets: [
          "node_modules/oracledb/**/*"
        ]
      }),
      typescript({
        tsconfig: false,
        target: "es6",
        allowSyntheticDefaultImports: true,
        exclude: "../src/**/*"
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