'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var worksAtWebs = require('../worksAtWebs');
var bluebird = require('bluebird');
var User;

var userSchema = new Schema({
	github: Schema.Types.Mixed
});

userSchema.statics.findOrCreateViaGithub = function(profile, cb) {
	return this.findOne({'github.id': profile.id}, function(err, doc) {
		var user;

		if (err) {
			return cb(err);
		}
		if (!doc) {
			doc = {github: profile};
			user = new User(doc);
			user.save();
		}

		worksAtWebs(doc.github.username).then(function(userWorksAtWebs) {
			if (userWorksAtWebs) {
				return doc;
			} else {
				return bluebird.reject(new Error('user doesn\'t work at webs'));
			}
		}).nodeify(cb);

	});
};

User = mongoose.model('User', userSchema);

module.exports = User;
