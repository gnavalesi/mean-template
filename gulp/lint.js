'use strict';

const gulp = require('gulp-help')(require('gulp'));
const eslint = require('gulp-eslint');
const notify = require('gulp-notify');
const util = require('gulp-util');

const eslintFiles = [
	'./**/*.js',
	'!gulpfile.js',
	'.karma.conf.js',
	'!bower_components/**',
	'!build/**',
	'!build_public/**',
	'!coverage/**',
	'!dist/**',
	'!node_modules/**',
	'!swagger-ui/**',
	'!test/**'
];

gulp.task('lint:core', false, () => {
	return gulp.src(eslintFiles)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on('error', notify.onError(error => {
			return error.message;
		}))
		.on('error', error => {
			util.log(error.message);
			process.exit(1);
		});
});