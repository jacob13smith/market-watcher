require('dotenv').config();
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var app = express();

var RouteHandler = require('./RouteHandler');
var DBHandler = require('./DBHandler');
var port = process.env.PORT || 80;

var config = require('../../webpack.config');
var compiler = webpack(config);
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
//DBHandler.connect();

// Config router.
app.use(RouteHandler.getMiddlewareRoutes(app.get('port')));
var apiRoutes = RouteHandler.getApiRoutes(); // Api router by reference.
app.use( apiRoutes );
app.use( RouteHandler.getOtherRoutes(compiler) );

// Chokidar watcher.
let serverWatch = null;
if (process.env.NODE_ENV !== 'production') {
	let chokidar = require('chokidar');
	let invalidate = require('invalidate-module');
	
	// Rule of thumb, use require() when wanting to hot-reload while debuging/testing.
	console.log( 'Chokidar Watcher Running.' );
	serverWatch = chokidar.watch(['./routes', './RouteHandler', './db'], { ignoreInitial: true });
	serverWatch.on('all', (event, filename) => {
		let folder = filename.split('\\')[0];
		invalidate(path.resolve(filename));
		console.log(`Removed ${filename} from cache.`);

		// Updates routes and sub-modules.
		if ( '\\RouteHandler.js' === filename || '\\Routes.js' === filename || folder === 'routes' ) {
			RouteHandler = require('./RouteHandler');
			apiRoutes = RouteHandler.getApiRoutes();
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
