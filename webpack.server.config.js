const path = require('path');

module.exports = (env, argv) => {

  const IS_PROD = argv.mode === "production";

  return {
    entry: IS_PROD ? "./src/server.prod.js" : './src/server.dev.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};