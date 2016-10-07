'use strict';

const glob = require('glob');

function getModulesPaths(pattern) {
	return glob.sync(pattern);
}

module.exports.getModulesPaths = getModulesPaths;
