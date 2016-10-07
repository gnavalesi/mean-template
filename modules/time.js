'use strict';

const moment = require('moment-timezone');

const config = require('../config/config');

function getMoment(format) {
	return moment().tz(config.timezone).format(format);
}

module.exports.getMoment = getMoment;

