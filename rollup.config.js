

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
    input: "server/server.ts",
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
  return {
    input: "src/pages/SyncRead.svelte",
    output: {
      format: "es",
      dir: "public/pages/",
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

export default (args) => {
  console.log("rollup command line arguments:", args);

  if(args["server"]){
    delete args["server"];
    return serverConfig();
  }

  return pagesConfig();
};





let template = {
	input: {
    MyClip: 'src/pages/MyClip.svelte',
    SyncSession: "src/pages/SyncSession.svelte",
  },
	output: [
    {
      name: 'app',
      sourcemap: true,
      format: 'es',
      dir: 'public/pages/',
    }, {
      format: "cjs",
      dir: "temp/cjs",
    }
  ],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
      },
      preprocess: svelte_preprocess(),
    }),
    commonjs(),
    // probably only need when input has .ts file directly
    // typescript({
    //   tsconfig: "node_modules/@tsconfig/svelte/tsconfig.json",
    //   include: [ "src/**/*", "src/node_modules" ],
    //   exclude: [ "node_modules/*", "__sapper__/*", "public/*" ],
    //   sourceMap: !production,
    // }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};