'use strict';

const gulp = require('gulp-help')(require('gulp'));
const server = require('gulp-develop-server');
const livereload = require('gulp-livereload');

const _ = require('underscore');

const config = require('../config/config');

const options = {
	path: 'bin/www'
};

gulp.task('run:core', false, ['build'], () => {
	server.listen(options, () => {
		livereload.listen(_.extend(config.livereload, {basePath: 'build_public'}));
	});
});