'use strict';

const express = require('express');
const morganLogger = require('morgan');
const compress = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');
const logger = require('../middlewares/logger');
const glob = require('glob');
//const mongoClient = require('./../middlewares/mongodb-client');

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

	logger.info('Configuring mongo');

	// MongoClient
	//mongoClient.connect();

	if (config.swagger.enabled) {
		logger.info('Configuring swagger');

		app.get(config.swagger.routes.documentation, (req, res) => {
			res.jsonp(require('swagger-jsdoc')(config.swagger.options));
		});

		app.use(config.swagger.routes.ui, require('swaggerize-ui')({
			docs: config.swagger.routes.documentation,
			swaggerUiPath: './swagger-ui/dist'
		}));
	}

	if (config.autorouting) {
		logger.info('Configuring routing');

		glob(config.routes, function (err, files) {
			if (err) {
				throw err;
			}

			files.forEach((file) => {
				const route = '/' + file.replace(/(^routes\/|(\/index|)\.js)/g, '');
				app.use(route, require('../' + file));
			});
		});
	}

	logger.info('Configuring port', config.server.port);

	app.set('port', config.server.port);

	return app;
}

module.exports = createExpressApp();

