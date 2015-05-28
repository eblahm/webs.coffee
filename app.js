'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var session = require('express-session');
var auth = require('./lib/authentication');
var mongoose = require('mongoose');
var routes = require('./routes/index');
var debug = require('debug')('coffee');

var mongoUrl = config.get('MONGO_URL');
mongoose.connect(mongoUrl);
mongoose.connection.on('error', console.error.bind(console, 'error connecting to ' + mongoUrl));
mongoose.connection.once('open', console.error.bind(console, 'successfully connected to ' + mongoUrl));

var app = express();

app.engine('.html', require('hbs').__express);
app.set('view engine', '.html');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
	var RedisStore = require('connect-redis')(session);
	var r = require('redis-url').parse(config.get('REDIS_URL'));
	app.use(session({
		store: new RedisStore({
			host: r.hostname,
			port: r.port,
			pass: r.password
		}),
		secret: 'oatmeal',
		rolling: true,
		cookie: {expires: new Date(2020, 0, 1)}
	}));
} else {
	app.use(session({secret: '<:O)'}));
}

app.use(auth.initialize());
app.use(auth.session());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.get('/auth/github', auth.authenticate('github'));
app.get('/auth/github/callback',
	auth.authenticate('github', {failureRedirect: '/'}),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	}
);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	debug(err.stack);
	res.render('error', {
		message: err.message,
		error: config.get('STACKTRACES') ? err : {}
	});
});

module.exports = app;
