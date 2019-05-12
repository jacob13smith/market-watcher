const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./Routes');

class RouteHandler {
	constructor(app, port) {
		this.app = app;
		this.port = port;
	}

	init(db) {
		// Allow CORS
		this.app.use(cors({
			origin: 'http://localhost:' + this.port
		}));

		// Static Routes
		this.app.use('/assets', express.static(path.join(__dirname, '../public'), {
			dotfiles: 'ignore',
			extensions: ['htm', 'html'],
			index: false
		}));
		this.app.use(bodyParser.urlencoded({
			extended: true
		}));

		// Cookie Parser creates req.session in express-session
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());
		this.app.use(session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: false,
				maxAge: 2 * 60 * 60 * 1000
			},
			store: new MongoStore({
				mongooseConnection: db
			})
		}));

		this.app.use((req, res, next) => {
			if ('user' in req.session) {
				req.user = req.session.user.username;
			}
			// res.status(200);
			next();
		});

		// Handle all endpoints from routes file
		routes.forEach(route => {
			this.app.use(route.endpoint, route.router);
		});

		// Handle error routes
		this.app.use((err, req, res, next) => {
			console.log('Error: ' + err.message);
			next();
		});

		// Every other non-mapped route
		this.app.use((req, res) => {
			res.sendFile(path.join(__dirname, '../index.html'));
		});
	}
}

module.exports = RouteHandler;
