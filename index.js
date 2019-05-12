require('dotenv').config();
const express = require('express');
const webpack = require('webpack');

const DB = require('./lib/DB');
const RouteHandler = require('./lib/RouteHandler');

let config = require('./webpack.config');
let port = process.env.PORT || 80;
let app = express();

const rh = new RouteHandler(app, port);
const db = new DB();

// Wepback API
if (process.env.NODE_ENV !== 'production') {
	webpack(config).watch({}, (err, stats) => {
		if (err) {
			console.log(err);
		} else {
			console.log(stats.toString({
				colors: true,
				children: false,
				chunks: false,
				modules: false
			}));
		}
	});
}

app.set('trust proxy', 1);
app.disable('x-powered-by'); // Blocks header from containing server information ( security reasons )

// Setup DB
db.init();

// Setup Routes
rh.init(db.db);

// Start Server
app.set('port', port);
app.listen(port, () => {
	console.log('Started server on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
