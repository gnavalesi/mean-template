'use strict';

const gulp = require('gulp-help')(require('gulp'));
const seq = require('gulp-sequence');
const transform = require('gulp-json-transform');
const zip = require('gulp-zip');

const pkg = require('../package.json');

const serverFiles = [
	'./**/*.js',
	'bin/www',
	'!bower_components/**',
	'!build/**',
	'!build_public/**',
	'!config/config-build.js',
	'!coverage/**',
	'!dist/**',
	'!gulp/**',
	'!node_modules/**',
	'!public/**',
	'!swagger-ui/**',
	'!test/**',
	'!gulpfile.js'
];

gulp.task('package:core', false, seq('build:minified', 'package:core:copy', 'package:core:zip'));

gulp.task('package:core:copy', false, seq(['package:core:copy:client', 'package:core:copy:server',
	'package:core:copy:package.json']));

gulp.task('package:core:copy:client', false, () => {
	return gulp.src('./build_public')
		.pipe(gulp.dest('./build/public'));
});

gulp.task('package:core:copy:server', false, () => {
	return gulp.src(serverFiles, {base: './'})
		.pipe(gulp.dest('./build'));
});

gulp.task('package:core:copy:package.json', false, () => {
	return gulp.src('./package.json')
		.pipe(transform(data => {
			delete data.devDependencies;

			return data;
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('package:core:zip', false, () => {
	return gulp.src('build/**/*')
		.pipe(zip(pkg.name + '-' + pkg.version + '.zip'))
		.pipe(gulp.dest('dist'));
});
