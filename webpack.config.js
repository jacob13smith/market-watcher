const path = require('path');

module.exports = {
	mode: 'development',
	entry: ["babel-polyfill",'./public/js/public.js'],
	output: {
		path: path.join(__dirname, '/public/dist'),
		publicPath: '/assets/',
		chunkFilename: '[id].bundle.js',
		filename: 'bundle.js'
	},
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
		},{
			test: /\.scss$/,
			exclude: /node_modules/,
			loader: 'style-loader!css-loader!sass-loader'
		},{
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
		}
		]
	}
};
