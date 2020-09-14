var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var node_modules = {};

// note the path.resolve(__dirname, ...) part
// without it, eslint-import-resolver-webpack fails
// since eslint might be invoked with different cwd
fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { node_modules[mod] = `commonjs ${mod}`; });

// es5 style alternative
// fs.readdirSync(path.resolve(__dirname, 'node_modules'))
//     .filter(function(x) {
//         return ['.bin'].indexOf(x) === -1;
//     })
//     .forEach(function(mod) {
//         nodeModules[mod] = 'commonjs ' + mod;    
//     });

module.exports =

{
    // The configuration for the server-side rendering
    name: 'server',
    target: 'node',
    entry: './src/server.js',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: 'server.js'
    },
    externals: node_modules,
    module: {
        rules: [
          {
            test: /\.js$/,
            loaders: [
              'babel-loader'
            ]
          },
        ]
    },
    plugins: [
    // new webpack.NormalModuleReplacementPlugin("^(react-bootstrap-modal)$", "^(react)$")
    // new webpack.IgnorePlugin(new RegExp("^(react-bootstrap-modal)$"))
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};