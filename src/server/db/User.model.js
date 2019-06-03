'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		default: 'user'
	},
	parent: {
		type: String,
		required: true,
		default: false
	}
});

UserSchema.pre('save', function hashPassword(next) {
	let user = this;

	// Only hash password if it has been modified
	if (user.isModified('password')) {
		let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR); // Generate salt

		// Override the latest password with the hashed one
		// Hash the password using generated salt
		user.password = bcrypt.hashSync(user.password, salt);
	}
	return next();
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
	let pass = bcrypt.compareSync(candidatePassword, this.password);
	cb(null, pass);
};

module.exports = mongoose.model('User', UserSchema);
