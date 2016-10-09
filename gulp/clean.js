'use strict';

const gulp = require('gulp-help')(require('gulp'));
const clean = require('gulp-clean');

gulp.task('clean:core', false, () => {
	return gulp.src(['./build', './build_public'], {read: false})
		.pipe(clean({force: true}));
});