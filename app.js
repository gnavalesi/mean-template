const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const glob = require('glob');

const config = require('./config/config');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('connect-livereload')(config.livereload));


/**
 * Set static folder for development
 */
if (app.get('env') === 'development') {
	app.use(express.static(path.join(__dirname, 'build_public')));
} else {
	app.use(express.static(path.join(__dirname, 'public')));
}

/**
 * Load routes
 */
glob(config.routes, function (err, files) {
	if (err) {
		throw err;
	}

	files.forEach((file) => {
		const route = '/' + file.replace(/(^routes\/|(\/index|)\.js)/g, '');
		app.use(route, require('./' + file));
	});
});

/**
 * Configure Swagger routes
 */
if (config.swagger.enabled) {
	app.get(config.swagger.routes.documentation, (req, res) => {
		res.jsonp(require('swagger-jsdoc')(config.swagger.options));
	});

	app.use(config.swagger.routes.ui, require('swaggerize-ui')({
		docs: config.swagger.routes.documentation,
		swaggerUiPath: './swagger-ui/dist'
	}));
}


// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
