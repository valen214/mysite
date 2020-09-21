const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SveltePreprocess = require("svelte-preprocess");

const webpack = require("webpack");

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

console.log("webpack.config.js: prod:", prod);

let genConfig = ({
  entry,
  customElement = false,
  path: _path,
} = {}) => {
  console.log("customElement:", customElement);
  return {
    entry: entry || {
      bundle: [ './src/index.js' ],
    },
    mode,
    // watch: !prod,
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: [ '.mjs', '.js', '.svelte', ".ts" ],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: _path || (__dirname + '/dist'),
      filename: '[name].js',
      chunkFilename: '[name].[id].js'
    },
    
    devtool: prod ? false : 'source-map',
    devServer: {
      writeToDisk: true,
      contentBase: [
        path.join(__dirname, 'dist'),
        path.join(__dirname, 'src/lib'),
      ],
      historyApiFallback: {
        index: 'index.html'
      },
      liveReload: true,
      mimeTypes: {},
    },
    
    module: {
      rules: [
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev: !prod,
              emitCss: true,
              hotReload: !prod,
              customElement,
              preprocess: SveltePreprocess({
                typescript: {
                  tsconfigFile: "tsconfig.json",
                },
                babel: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        loose: true,
                        modules: false,
                        targets: {
                          esmodules: true,
                        },
                      },
                    ],
                  ],
                },
              }),
            },
          }
        }, {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        }, {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          loader: "string-replace-loader",
          options: customElement ? {} : {
            search: /^\s*\<svelte\:options tag\=[^>]+\>/,
            replace: ""
          }
        }
      ]
    },
    plugins: [
      customElement && function SvelteCustomElementTag(compiler){
      },
      prod && new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html",
      }),

    ].filter(Boolean),
  };
};



module.exports = (env, argv) => {
  console.log("env:", env);
  console.log("argv:", argv);


  let config = [
    genConfig(),
    genConfig({
      entry: {
        sync_session: [ "./src/pages/SyncSession.svelte" ],
        clip_video: [ "./src/pages/ClipVideo.svelte" ],
      },
      customElement: true,
      path: __dirname + '/dist/pages'
    })
  ];

  return config;
};

/*

https://svelte.dev/repl/ff94ad9fbb18495099f2e6e31b86bc9e?version=3.9.2

*/