'use strict';

/**
 * Logger module
 */
const winston = require('winston');
const mkdirp = require('mkdirp');
const time = require('./time');
const config = require('../config/config');

const LOG_DIR = config.logging.pathDir;
const FORMAT_TIME = 'DD/MM/YYYY HH:mm:ss:SSS';
const transports = [];

const console = new winston.transports.Console({
	level: 'debug',
	colorize: true,
	prettyPrint: true,
	handleExceptions: true,
	timestamp: () => {
		return time.getMoment(FORMAT_TIME);
	}
});

const allFile = new winston.transports.File({
	name: 'file.info',
	level: 'info',
	filename: `${LOG_DIR}/all.log`,
	maxFiles: 10,
	maxsize: 10485760,
	json: false,
	colorize: true,
	prettyPrint: true,
	handleExceptions: true,
	timestamp: () => {
		return time.getMoment(FORMAT_TIME);
	}
});

const errorFile = new winston.transports.File({
	name: 'file.error',
	level: 'error',
	filename: `${LOG_DIR}/errors.log`,
	maxFiles: 10,
	maxsize: 10485760,
	json: false,
	colorize: true,
	prettyPrint: true,
	handleExceptions: true,
	timestamp: () => {
		return time.getMoment(FORMAT_TIME);
	}
});

if (config.logging.files) {
	mkdirp.sync(LOG_DIR);
	transports.push(console, allFile, errorFile);
} else {
	transports.push(console);
}

const log = new winston.Logger({transports});

function removeConsoleTransport() {
	log.remove(winston.transports.Console);
}

module.exports = log;
module.exports.removeConsoleTransport = removeConsoleTransport;
module.exports.stream = {
	write: (message) => {
		log.info(message);
	}
};
