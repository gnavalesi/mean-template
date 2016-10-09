'use strict';

const gulp = require('gulp-help')(require('gulp'));
const mocha = require('gulp-spawn-mocha');
const seq = require('gulp-sequence');

const karma = require('karma').Server;
const path = require('path');

const testServerFiles = [
	'./test/server/**/*.js'
];

gulp.task('test:core', false, seq(['test:core:client', 'test:core:server']));

gulp.task('test:core:client', false, (done) => {
	new karma({
		configFile: path.resolve('karma.conf.js')
	}, done).start();
});

gulp.task('test:core:server', false, () => {
	// Hide logs from console
	require('../modules/logger').removeConsoleTransport();

	return gulp.src(testServerFiles)
		.pipe(mocha({
			istanbul: {
				dir: 'coverage/server'
			}
		}));
});