'use strict';

const logger = require('./logger');
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

const config = require('../config/config-env');

let connectionInstance;

function connect() {
	if (connectionInstance) {
		return connectionInstance;
	}

	logger.debug('MongoDB: Conecting to', config.mongo.db, 'in host', config.mongo.host + ':' + config.mongo.port);
	connectionInstance = mongoose.connect(config.mongo.host, config.mongo.db, config.mongo.port, {
		user: config.mongo.user,
		pass: config.mongo.pass
	});
}

module.exports = {
	connect: connect
};
