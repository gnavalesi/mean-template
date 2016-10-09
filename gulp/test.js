'use strict';

const gulp = require('gulp-help')(require('gulp'));
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const notify = require('gulp-notify');
const seq = require('gulp-sequence');
const util = require('gulp-util');

const karma = require('karma').Server;
const path = require('path');

const testServerFiles = [
	'./test/server/index.js'
];

const customServerFiles = [
	'./routes/**/*.js',
	'./controllers/**/*.js',
	'./models/**/*.js'
];

gulp.task('test:core', false, seq('test:core:client', 'test:core:server'));

gulp.task('test:core:client', false, (done) => {
	new karma({
		configFile: path.resolve('karma.conf.js')
	}, exitCode => {
		if (exitCode !== 0) {
			process.exit(exitCode);
		}
		done();
	}).start();
});

gulp.task('test:core:server', false, seq('test:core:server:before', 'test:core:server:main'));

gulp.task('test:core:server:before', false, () => {
	return gulp.src(customServerFiles)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('test:core:server:main', false, () => {
	// Hide logs from console
	require('../modules/logger').removeConsoleTransport();

	return gulp.src(testServerFiles)
		.pipe(mocha())
		.once('error', notify.onError(error => {
			return error.message;
		}))
		// Creating the reports after tests ran
		.pipe(istanbul.writeReports())
		// Enforce a coverage of at least 80%
		.pipe(istanbul.enforceThresholds({thresholds: {global: 20}}))
		.once('error', error => {
			util.log(util.colors.red(error.message));
			process.exit(1);
		})
		.once('error', notify.onError(error => {
			return error.message;
		}));
});