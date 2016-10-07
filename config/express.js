'use strict';

const path = require('path');
const express = require('express');
const morganLogger = require('morgan');
const compress = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('.' + path.sep + 'config');
const logger = require(path.join('..', 'modules', 'logger'));
const envConfig = require('.' + path.sep + 'config-env');

function createExpressApp() {
	const app = express();

	logger.info('Configuring middlewares');

	// compress all requests
	app.use(compress());

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Use helmet to secure Express headers
	app.use(helmet());

	if (config.logging.express) {
		app.use(morganLogger('combined', {stream: logger.stream}));
	}

	// MongoClient
	logger.info('Configuring mongo');
	const mongoose = require('mongoose');
	mongoose.Promise = require('q').Promise;

	logger.debug('MongoDB: Conecting to', envConfig.mongo.db, 'in', envConfig.mongo.host + ':' + envConfig.mongo.port);
	mongoose.connect(envConfig.mongo.host, envConfig.mongo.db, envConfig.mongo.port, {
		user: envConfig.mongo.user,
		pass: envConfig.mongo.pass
	});

	// Swagger
	if (config.swagger.enabled) {
		logger.info('Configuring swagger');

		logger.debug('Swagger: Using', config.swagger.routes.documentation, 'route for documentation');
		app.get(config.swagger.routes.documentation, (req, res) => {
			res.jsonp(require('swagger-jsdoc')(config.swagger.options));
		});

		logger.debug('Swagger: Using', config.swagger.routes.ui, 'route for ui');
		app.use(config.swagger.routes.ui, require('swaggerize-ui')({
			docs: config.swagger.routes.documentation,
			swaggerUiPath: path.join('swagger-ui', 'dist')
		}));
	}

	// Auto-routing
	if (config.autorouting) {
		logger.info('Configuring auto-routing');

		const files = require('glob').sync(config.routes);

		files.forEach((file) => {
			const route = '/' + file.replace(/(^(\.\/|)routes\/|((\/|)index|)\.js$)/g, '');
			logger.debug('Auto-routing: Using', file, 'router for route', route);
			app.use(route, require(path.join('..', file)));
		});
	}

	// Static folder
	logger.info('Configuring static folder');
	let staticRoute = 'public';
	if (app.get('env') === 'development') {
		staticRoute = 'build_public';
	}
	logger.debug('Static folder: Using', staticRoute);
	app.use(express.static(path.join('..', staticRoute)));


	logger.info('Configuring port', config.server.port);
	app.set('port', config.server.port);

	return app;
}

module.exports = createExpressApp();

