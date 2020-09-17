

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
/*


*/

const fs = require("fs");
const path = require("path");

const ts = require("typescript");
const svelte_compiler = require("svelte/compiler");
const svelte_preprocess = require("svelte-preprocess");


// https://svelte.dev/repl/ff94ad9fbb18495099f2e6e31b86bc9e?version=3.9.2

(async () => {

let filepath = path.join(
  __dirname,
  './src/pages/SyncSession.svelte'
);
console.log(filepath);

let src = fs.readFileSync(filepath, {
    encoding: 'utf-8'
});

let { code } = await svelte_compiler.preprocess(src, [
  {
    async markup({ content, attributes, filename }){
      console.log("markup: attributes:", attributes);
      console.log("markup: filename:", filename);
      return {
        code: content
      }
    },
    
    async script({ content, attributes, filename }){
      console.log("script: attributes:", attributes);
      console.log("script: filename:", filename);
      console.log("script: content:", content);
      let code = content;

      if(attributes.lang === "ts"){
        code = ts.transpileModule(code, {
          compilerOptions: {
            module: ts.ModuleKind.ES2015
          }
        }).outputText;
        console.log(code);
      }
      return {
        code
      }
    }
  }
]);

let out = svelte_compiler.compile(code);

console.log("final output:", out);

svelte_preprocess({
  typescript: {
    tsconfigFile: "tsconfig.json",
  },
})



})().catch(e => {
  console.log(e);
});