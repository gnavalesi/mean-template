'use strict';

const gulp = require('gulp-help')(require('gulp'));
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const inject = require('gulp-inject');
const livereload = require('gulp-livereload');
const notify = require('gulp-notify');
const seq = require('gulp-sequence');
const server = require('gulp-develop-server');
const watch = require('gulp-watch');

const _ = require('underscore');
const series = require('stream-series');

const buildConfig = require('../config/config-build');

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

const clientFiles = [
	'public/**/*',
	'!public/index.html',
	'!public/app.js',
	'!public/angular/**/*',
	'!public/angular'
];

const angularFiles = ['./public/app.js', './public/angular/**/*.js'];

function getSources(obj) {
	// Different streams to keep the dependency order
	const vendorJsSources = _.map(obj.js, js => {
		return './build_public/javascripts/' + js;
	});

	const customJsSources = ['./build_public/javascripts/**/*.js'].concat(_.map(vendorJsSources, js => {
		return '!' + js;
	}));

	const vendorCssSources = _.map(obj.css, css => {
		return './build_public/stylesheets/' + css;
	});

	const customCssSources = ['./build_public/stylesheets/**/*.css'].concat(_.map(vendorCssSources, css => {
		return '!' + css;
	}));

	const appSource = ['./build_public/app.js'];

	return [vendorJsSources, customJsSources, vendorCssSources, customCssSources, appSource];
}

gulp.task('dev:core', false, seq('run', 'dev:core:watch'));

gulp.task('dev:core:watch', false, seq(['dev:core:watch:server', 'dev:core:watch:client', 'dev:core:watch:angular', 'dev:core:watch:index']));

gulp.task('dev:core:watch:server', false, () => {
	return watch(serverFiles, vinyl => {
		return gulp.src(vinyl.path)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(server())
			.pipe(notify('Reload file: <%= file.relative %>'));
	});
});

gulp.task('dev:core:watch:client', false, () => {
	return watch(clientFiles)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulp.dest('build_public'))
		.pipe(livereload())
		.pipe(notify('Reload file: <%= file.relative %>'));
});

gulp.task('dev:core:watch:angular', false, () => {
	return watch(angularFiles, () => {
		return gulp.src(angularFiles)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(concat('app.js'))
			.pipe(gulp.dest('./build_public/'))
			.pipe(livereload())
			.pipe(notify('Reload file: <%= file.relative %>'));
	});
});

gulp.task('dev:core:watch:index', false, () => {
	return watch(['public/index.html'], () => {
		const sources = getSources(buildConfig.dev);
		const streams = _.map(sources, s => {
			return gulp.src(s, {read: false});
		});

		return gulp.src('./public/index.html')
			.pipe(inject(series(streams), {
				ignorePath: '/build_public/',
				addRootSlash: false
			}))
			.pipe(gulp.dest('./build_public'))
			.pipe(livereload())
			.pipe(notify('Reload file: <%= file.relative %>'));
	});
});