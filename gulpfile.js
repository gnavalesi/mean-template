'use strict';

const gulp = require('gulp-help')(require('gulp'));
const notify = require('gulp-notify');
const seq = require('gulp-sequence');

require('./gulp');

// Disable log notifier
notify.logLevel(0);

gulp.task('default', 'Same as gulp dev', seq('dev'));

gulp.task('init', 'Reinitializes the package.json and bower.json files', seq('init:core'));

gulp.task('run', 'Starts the application', seq('run:core'));

gulp.task('dev', 'Starts the application with livereload', seq('dev:core'));

gulp.task('build', 'Makes a development build of the client', seq('build:core'));

gulp.task('package', 'Creates a zip with the full project in the dist folder', seq('package:core'));

gulp.task('clean', 'Cleans the build and build_public directories', seq('clean:core'));

gulp.task('lint', 'Verifies good practices in code', seq('lint:core'));

gulp.task('test', 'Executes the tests and creates a coverage report', seq('test:core'));