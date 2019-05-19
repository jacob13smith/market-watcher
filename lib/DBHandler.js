const collections = require('./DBCollections');

/**
 * Static Class For Making DB Calls
 */
class DBHandler {
	/**
	 * Grab all documents corresponding to the collection and find params.
	 *
	 * @param {string} collection 	collection name matching the constants above.
	 * @param {object} find  	Criteria object to filter documents fetched.
	 */
	static getDocuments(collection, find, fields = {}) {
		return new Promise(resolve => {
			collections[collection].find(find, fields, (err, documents) => {
				let response = DBHandler.getResponse(err, documents);
				resolve(response);
			});
		});
	}

	/**
	 * Grab single / first document corresponding to the collection and find params.
	 *
	 * @param {string} collection 	collection name matching the constants above.
	 * @param {object} find  	Criteria object to filter documents fetched.
	 */
	static getDocument(collection, find) {
		return new Promise(resolve => {
			collections[collection].findOne(find, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Updates all matching documents with the set key values.
	 *
	 * @param {string} collection 	collection name matching the constants above.
	 * @param {object} find		Criteria object to filter documents being updated.
	 * @param {object} set		Object with the key and new values being updated.
	 */
	static updateDocument(collection, find, set) {
		return new Promise(resolve => {
			collections[collection].findOneAndUpdate(find, { $set: set }, { upsert: true }, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Deletes documents from collection based on find criteria.
	 *
	 * @param {string} collection 	collection name matching the constants above
	 * @param {object} find 	Criteria object to filter documents being deleted.
	 */
	static deleteDocument(collection, find) {
		return new Promise(resolve => {
			collections[collection].deleteOne(find, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Deletes multiple documents from collection based on the find criteria.
	 *
	 * @param {string} collection 	collection name matching the constants above
	 * @param {object} find 	Criteria object to filter documents being deleted.
	 */
	static deleteDocuments(collection, find) {
		return new Promise(resolve => {
			collections[collection].deleteMany(find, (err, doc) => {
				let response = DBHandler.getResponse(err, doc);
				resolve(response);
			});
		});
	}

	/**
	 * Creates document on the collection specified based on values passed.
	 *
	 * @param {string} collection 	collection name matching the constants above.
	 * @param {object} values 	The values to insert for the newly created document.
	 */
	static createDocument(collection, values) {
		return new Promise((resolve, reject) => {
			let Document = collections[collection];
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
