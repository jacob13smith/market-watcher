const mongoose = require('mongoose');
// mongoose.set('debug', true); // turn on debug
const fs = require('fs');
const path = require('path');

var dir = fs.readdirSync(path.join(__dirname, '../db'));
var Collections = {};
dir.forEach(c => {
	Collections[c.replace('.model.js', '')] = require(`../db/${c}`);
});

module.exports = Collections;

/**
 * Static Class For Making DB Calls
 */
class DBHandler {

	/**
	 * Initialize the mongoose connection and enable for Promises.
	 */
	static connect() {
		let url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DATABASE}`;
		mongoose.connect(url, {
			useNewUrlParser: true
		});
		mongoose.Promise = global.Promise;
		mongoose.connection.on('error', err => {
			console.log(`\nCould not connect to DB as user: ${process.env.MONGODB_USERNAME}\n`);
		});
		mongoose.connection.on('open', () => {
			console.log(`\nSuccessfully connected to DB as user: ${process.env.MONGODB_USERNAME}\n`);
		});
	}

	/**
	 * Run a mongo query on the desired collection.
	 *
	 * @param {string} 	table The collection name to join pipeline with.
	 * @param {object} 	query Object to filter documents by.
	 */
	static async query(table, query) {
		return new Promise( resolve => {
			mongoose.connection.db.collection(table, (err, collection) => {
				if (err) {
					throw error;
				}
				collection.find(query).toArray((err, data) => {
					if (err) {
						throw err;
					}
					resolve(data);
				});
			});
		});
	}

	/**
	 * Grab all documents corresponding to the table and find params.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} find  	Criteria object to filter documents fetched.
	 */
	static getDocuments(table, find, fields = {}, sort = {}) {
		return new Promise(async resolve => {
			await Collections[table].find(find, fields).sort(sort).exec( (err, documents) => {
				let response = DBHandler.getResponse(err, documents);
				resolve(response);
			});
		});
	}

	/**
	 * Grab single / first document corresponding to the table and find params.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} find  	Criteria object to filter documents fetched.
	 */
	static getDocument(table, find, filter = {}) {
		return new Promise(resolve => {
			Collections[table].findOne(find, filter, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Updates all matching documents with the set key values.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} find		Criteria object to filter documents being updated.
	 * @param {object} set		Object with the key and new values being updated.
	 */
	static updateDocument(table, find, set) {
		return new Promise(resolve => {
			Collections[table].findOneAndUpdate(find, { $set: set }, { upsert: true }, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Deletes documents from table based on find criteria.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} find 	Criteria object to filter documents being deleted.
	 */
	static deleteDocument(table, find) {
		return new Promise(resolve => {
			Collections[table].deleteOne(find, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Deletes multiple documents from table based on the find criteria.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} find 	Criteria object to filter documents being deleted.
	 */
	static deleteDocuments(table, find) {
		return new Promise(resolve => {
			Collections[table].deleteMany(find, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Creates document on the table specified based on values passed.
	 *
	 * @param {string} table 	Table name matching the constants above.
	 * @param {object} values 	The values to insert for the newly created document.
	 */
	static createDocument(table, values) {
		return new Promise((resolve, reject) => {
			let Document = Collections[table];
			let doc = new Document(values);
			doc.save((err, updated) => {
				let response = DBHandler.getResponse(err, updated);
				resolve(response);
			});
		});
	}

	/**
	 * Handles mongodb response(s) appropriately.
	 *
	 * @param {object} err	Not null if an error was caught and passed into this function.
	 * @param {object} doc 	The document returned if an error was not passed.
	 *
	 * @return {object}		An standardized response object indicating if the document call pased, already exists, and a response message / object.
	 */
	static getResponse(err, doc) {
		if (err) {
			// error caught
			return {
				pass: false,
				exist: false,
				data: DBHandler.getError(err)
			};
		}
		if (doc) {
			// item exist
			return {
				pass: true,
				exist: true,
				data: doc
			};
		}
		// document does not exist, upsert creates it, might have to change this later**
		return {
			pass: true,
			exist: false,
			data: 'Item did not exist, created if using updateDocument'
		};
	}

	/**
	 * Grabs an english readable error based on the response object of what went wrong.
	 *
	 * @param {object} err	The error objecct caught.
	 * @return {string}		The response string.
	 */
	static getError(err) {
		switch (err.code) {
		case 11000:
			return 'Duplicated Key';

		default:
			console.log(err);
			return 'Unknown Error, check mongohandler and handle code' + err.code + ' appropriately.';
		}
	}
}

module.exports = DBHandler;
