import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import svelte_preprocess from "svelte-preprocess";
import typescript from '@rollup/plugin-typescript';


const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/pages/MyClip.svelte',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		file: 'public/build/bundle.js'
	},
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