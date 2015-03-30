'use strict';

var express = require('express');
var router = express.Router();
var User = require('../lib/models/User');
var _ = require('lodash');

router.get('/', function(req, res, next) {
	if (!req.user) {
		return res.render('login', {
			title: 'Webs Coffee'
		});
	}
	User.find({}, function(err, docs) {
		if (err) return next(err);
		var otherUsers = _.reduce(docs, function(others, doc) {
			var name = doc.github.displayName;
			if (name !== req.user.github.displayName) others.push(name);
			return others;
		}, []);
		res.render('index', {
			title: 'Webs Coffee',
			user: req.user,
			otherUsers: otherUsers
		});

	});
});

module.exports = router;
