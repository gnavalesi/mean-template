'use strict';

const packageJson = require('../package.json');

const configEnv = require('./config-env');

const config = {
	routes: 'routes/**/*.js',
	healthTimeOut: 5000,

	logging: {
		express: false,
		files: false,
		pathDir: 'logs'
	},
	server: {
		port: process.env.PORT || configEnv.port
	},
	livereload: {
		port: 30000
	},
	token: {
		secretToken: 'development'
	},
	corsConfig: {
		origin: '*',
		methods: [
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'HEAD',
			'OPTIONS'
		],
		allowedHeaders: [
			'Origin',
			'X-Requested-With',
			'Content-Type',
			'Accept',
			'Type',
			'Authorization'
		],
		credentials: true,
		preflightContinue: true
	},
	swagger: {
		options: {
			swaggerDefinition: {
				info: {
					title: 'MEAN Template API',
					version: packageJson.version,
					description: packageJson.description
				},
				basePath: '/'
			},
			apis: ['./routes/**/*.js', './models/**/*.js']
		},
		routes: {
			documentation: '/documentation',
			ui: '/docs-ui'
		},
		enabled: true
	}
};

module.exports = config;