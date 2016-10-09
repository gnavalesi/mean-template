'use strict';

const gulp = require('gulp-help')(require('gulp'));
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const seq = require('gulp-sequence');
const uglify = require('gulp-uglify');

const _ = require('underscore');
const series = require('stream-series');

const buildConfig = require('../config/config-build');

const clientFiles = [
	'public/**/*',
	'!public/index.html',
	'!public/app.js',
	'!public/angular/**/*',
	'!public/angular'
];

const angularFiles = [
	'./public/app.js',
	'./public/angular/**/*.js'
];

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

gulp.task('build:core', false, seq('lint', 'clean', 'build:core:client', 'test'));

gulp.task('build:core:client', false, seq(['build:core:client:copy', 'build:core:client:bower', 'build:core:client:angular'], 'build:core:client:inject'));

gulp.task('build:core:client:copy', false, () => {
	return gulp.src(clientFiles)
		.pipe(gulp.dest('./build_public'));
});

gulp.task('build:core:client:bower', false, ['build:core:client:bower:js', 'build:core:client:bower:css']);

gulp.task('build:core:client:bower:js', false, () => {
	return gulp.src(_.map(buildConfig.dev.js, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/javascripts/'));
});

gulp.task('build:core:client:bower:css', false, () => {
	return gulp.src(_.map(buildConfig.dev.css, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/stylesheets/'));
});

gulp.task('build:core:client:angular', false, () => {
	return gulp.src(angularFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./build_public/'));
});

gulp.task('build:core:client:inject', false, () => {
	const sources = getSources(buildConfig.dev);
	const streams = _.map(sources, s => {
		return gulp.src(s, {read: false});
	});

	return gulp.src('./public/index.html')
		.pipe(inject(series(streams), {
			ignorePath: '/build_public/',
			addRootSlash: false
		}))
		.pipe(gulp.dest('./build_public'));
});

gulp.task('build:minified', false, seq('lint', 'clean', 'build:minified:client', 'test'));

gulp.task('build:minified:client', false, seq(['build:core:client:copy', 'build:minified:client:bower', 'build:minified:client:angular'], 'build:minified:client:inject'));

gulp.task('build:minified:client:bower', false, ['build:minified:client:bower:js', 'build:minified:client:bower:css']);

gulp.task('build:minified:client:bower:js', false, () => {
	return gulp.src(_.map(buildConfig.dist.js, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/javascripts/'));
});

gulp.task('build:minified:client:bower:css', false, () => {
	return gulp.src(_.map(buildConfig.dist.css, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/stylesheets/'));
});

gulp.task('build:minified:client:angular', false, () => {
	return gulp.src(angularFiles)
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build_public/'));
});

gulp.task('build:minified:client:inject', false, () => {
	const sources = getSources(buildConfig.dist);
	const streams = _.map(sources, s => {
		return gulp.src(s, {read: false});
	});

	return gulp.src('./public/index.html')
		.pipe(inject(series(streams), {
			ignorePath: '/build_public/',
			addRootSlash: false
		}))
		.pipe(gulp.dest('./build_public'));
});