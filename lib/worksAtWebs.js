'use strict';

var bluebird = require('bluebird');
var request = bluebird.promisify(require('request'));
var _ = require('lodash');

module.exports = function(username) {
	return request({
		url: 'https://api.github.com/users/' + username + '/orgs',
		method: 'GET',
		headers: {
			'User-Agent': 'Webs Coffee'
		},
		json: true
	}).spread(function(resp, body) {
		return !!_.find(body, function(org) {
			return org && org.login === 'websdev';
		});
	});
};
