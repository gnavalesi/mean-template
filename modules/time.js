'use strict';

const moment = require('moment-timezone');

const BUENOS_AIRES_TIME_ZONE = 'America/Argentina/Buenos_Aires';

function getBAMoment(format) {
	return moment().tz(BUENOS_AIRES_TIME_ZONE).format(format);
}


module.exports.getBAMoment = getBAMoment;

