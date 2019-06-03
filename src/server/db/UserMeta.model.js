var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserMetaSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	metaName: {
		type: String,
		required: true
	},
	metaValue: {
		type: String,
		required: true
	},
	stringified: {
		type: String,
		default: false
	}
});

module.exports = mongoose.model('UserMeta', UserMetaSchema);
