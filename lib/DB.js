const mongoose = require('mongoose');
// mongoose.set('debug', true); // turn on debug

class DB {
	constructor() {
		this.db = mongoose.connection;
		this.url = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DATABASE}`;
		this.tables = {};
	}

	/**
	 * Initialize the mongoose connection and enable for Promises.
	 */
	init() {
		mongoose.connect(this.url, {
			useNewUrlParser: true
		});
		mongoose.Promise = global.Promise;
		this.db.on('error', err => {
			console.log(`\nCould not connect to DB as user: ${process.env.MONGODB_USERNAME}\n`);
		});
		this.db.on('open', () => {
			console.log(`\nSuccessfully connected to DB as user: ${process.env.MONGODB_USERNAME}\n`);
		});
	}
}

module.exports = DB;
