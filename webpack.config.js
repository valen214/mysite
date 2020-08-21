const path = require('path');

module.exports = (env, argv) => {

  const IS_PROD = argv.mode === "production";

  return {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};