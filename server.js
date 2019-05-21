require('dotenv').config();
const express = require('express');
const path = require('path');
const webpack = require('webpack');

let RouteHandler = require('./lib/RouteHandler');
let DBHandler = require('./lib/DBHandler');

let port = process.env.PORT || 80;
let app = express();

let config = require('./webpack.config');
let compiler = webpack(config);
if ( process.env.NODE_ENV !== 'production' ) {
	console.log('Starting hot reload middleware.');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	app.use(webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
}

// Connect database.
DBHandler.connect();

// Route by reference.
let router = RouteHandler.getRoutes(app.get('port'), compiler);
app.use( (req, res, next ) => {
	router(req, res, next);
});

// Chokidar watcher.
let serverWatch = null;
if (process.env.NODE_ENV !== 'production') {
	let chokidar = require('chokidar');
	let invalidate = require('invalidate-module');
	
	// Rule of thumb, use require() when wanting to hot-reload while debuging/testing.
	console.log( 'Chokidar Watcher Running.' );
	serverWatch = chokidar.watch(['./routes', './lib', './db'], { ignoreInitial: true });
	serverWatch.on('all', (event, filename) => {
		let folder = filename.split('\\')[0];
		invalidate(path.resolve(filename));
		console.log(`Removed ${filename} from cache.`);

		// Updates routes and sub-modules.
		if ( 'lib\\RouteHandler.js' === filename || 'lib\\Routes.js' === filename || folder === 'routes' ) {
			RouteHandler = require('./lib/RouteHandler');
			router = RouteHandler.getRoutes(app.get('port'), compiler);
		}
	});
}

// Catches ctrl+c event.
process.on( 'SIGINT', close );

// Closing server.
function close() {

	// Close chokidar watcher.
    if ( 'production' !== process.env.NODE_ENV ) {
        serverWatch.close();
        console.log( 'Closing Chokidar Watcher' );
	}
	
    server.shutdown( () => {
        console.log( 'Server Closed Gracefully' );
    });
    process.exit();
}

// Blocks header from containing server information ( security reasons ).
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('port', port);
let server = require( 'http-shutdown' )( app.listen( port, () => {
	console.log('Started server on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
}));
