'use strict';

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('config');
var User = require('./models/User');

passport.serializeUser(function(user, done) {
	done(null, user.github.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({'github.id': id}, function(err, user) {
		if (!user) { err = new Error('user not found'); }
		if (err) { return done(err); }
		done(err, user);
	});
});

passport.use(new GitHubStrategy({
		clientID: config.get('github.CLIENT_ID'),
		clientSecret: config.get('github.CLIENT_SECRET'),
		callbackURL: config.get('HOMEPAGE_URL') + '/auth/github/callback'
	}, function(accessToken, refreshToken, profile, done) {
		User.findOrCreateViaGithub(profile, function(err, user) {
			return done(err, user);
		});
	}
));

module.exports = passport;
