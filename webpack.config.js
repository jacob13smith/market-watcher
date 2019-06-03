const path = require('path');;
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
require('dotenv').config();

// This is client-side webpack.
let config = {
	entry: [
		'babel-polyfill',
		'./src/client/js/public.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/dist',
		chunkFilename: '[id].client.js',
		filename: 'client.js'
	},
	mode: process.env.NODE_ENV,
	target: 'web',
	devtool: 'source-map',
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	},
	module: {
		rules: [{
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-proposal-object-rest-spread']
				}
			}
		}, {
			test: /\.css$/,
			use: [ { loader: 'style-loader' }, { loader: 'css-loader' } ]
		}, {
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
		}, {
			test: /\.vue$/,
			exclude: /node_modules/,
			loader: 'vue-loader',
			options: {
				loaders: {
					// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
					// the "scss" and "sass" values for the lang attribute to the right configs here.
					// other preprocessors should work out of the box, no loader config like this necessary.
					scss: [
						'vue-style-loader',
						'css-loader',
						'sass-loader'
					],
					sass: [
						'vue-style-loader',
						'css-loader',
						'sass-loader?indentedSyntax'
					]
				}
				// other vue-loader options go here
			}
		}, {
			// Loads the javacript into html template provided.
			// Entry point is set below in HtmlWebPackPlugin in Plugins 
			test: /\.html$/,
			use: [{
				loader: "html-loader"
			}]
		}]
	}
};

if (process.env.NODE_ENV === 'production') {

	// Uglify code on production.
	config.optimization = {
		minimizer: [
			new UglifyJSPlugin({
				cache: true,
				parallel: true
			})
		]
	};
	config.plugins = [
		new HtmlWebPackPlugin({
			template: './src/client/html/index.html',
			filename: './index.html'
		}),
		new VueLoaderPlugin()
	];
} else {

	// Middleware webpack watcher, add hot module plugins.
	config.entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
	config.plugins = [
		new HtmlWebPackPlugin({
			template: './src/client/html/index.html',
			filename: './index.html',
			excludeChunks: ['server'] // This is if we decide to compile server later on in webpack.
		}),
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	];
}
module.exports = config;