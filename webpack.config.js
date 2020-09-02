const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SveltePreprocess = require("svelte-preprocess");

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: [ './src/index.js' ]
  },
  mode,
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: [ '.mjs', '.js', '.svelte', ".ts" ],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
  },
  
	devtool: prod ? false : 'source-map',
  devServer: {
    contentBase: [
      path.join(__dirname, 'dist'),
      path.join(__dirname, 'src/lib'),
    ],
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
			},
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
			{
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
			}
		]
	},
	mode,
	plugins: [
		prod && new MiniCssExtractPlugin({
			filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
	].filter(Boolean),
};
