'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
	optionname: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	optionvalue: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Option', OptionSchema);
