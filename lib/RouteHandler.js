const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

/**
 * Static class for updating different routing components.
 */
class RouteHandler {

	/**
	 * Grab all middleware route configs.
	 */
	static getMiddlewareRoutes(port) {
		var router = express.Router();

		// Allow CORS.
		router.use(cors({
			origin: `http://localhost:${port}`
		}));

		// Static Routes.
		router.use('/assets', express.static(path.join(__dirname, '../public')));
		router.use('/dist', express.static(path.join(__dirname, '../dist')));
		router.use(bodyParser.urlencoded({
			extended: true
		}));

		// Cookie Parser creates req.session in express-session.
		let secure = process.env.URL.includes('https') ? true : false;
		router.use(bodyParser.json());
		router.use(cookieParser());
		if (mongoose.connection !== undefined) {
			router.use(session({
				secret: process.env.SESSION_SECRET,
				resave: false,
				saveUninitialized: false,
				cookie: {
					secure,
					maxAge: 2 * 60 * 60 * 1000
				},
				store: new MongoStore({
					mongooseConnection: mongoose.connection
				})
			}));
		}
		return router;
	}

	/**
	 * Grab all api routes in /routes.
	 */
	static getApiRoutes() {
		var router = express.Router();
		var DBHandler = require('./DBHandler');

		var dir = fs.readdirSync(path.join(__dirname, '../routes'));
		var routes = {};
		dir.forEach(r => {
			var endpoint = r.replace('.js', '');
			router.use(`/${endpoint}`, require(`../routes/${r}`));
		});
		
		router.use((req, res, next) => {
			if ( req.session && 'user' in req.session ) {
				req.user = req.session.user.username;
			}
			// res.status(200);
			next();
		});

		return router;
	}

	/**
	 * Grab all front-end / error middleware.
	 */
	static getOtherRoutes(compiler) {
		var router = express.Router();

		// Every other non-mapped route.
		router.use((req, res, next) => {

			// No watcher for production.
			if ( process.env.NODE_ENV === 'production' ) {
				res.sendFile(path.join(__dirname, '../dist/index.html'));
			} else {
				compiler.outputFileSystem.readFile(path.join(__dirname, '../dist/index.html'), (err, result) => {
					if (err) {
						return next(err);
					}
					res.set('content-type', 'text/html');
					res.send(result);
					res.end();
				});
			}
		});

		// Handle error routes
		router.use((err, req, res, next) => {
			console.log('Error: ' + err.message);
			next();
		});

		return router;
	}
}

module.exports = RouteHandler;
