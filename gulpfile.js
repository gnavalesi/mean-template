'use strict';

const gulp = require('gulp-help')(require('gulp'));
const server = require('gulp-develop-server');
const livereload = require('gulp-livereload');
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const watch = require('gulp-watch');
const notify = require('gulp-notify');
const clean = require('gulp-clean');
const _ = require('underscore');
const zip = require('gulp-zip');
const seq = require('gulp-sequence');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const transform = require('gulp-json-transform');
const uglify = require('gulp-uglify');

const series = require('stream-series');

const pkg = require('./package.json');
const config = require('./config/config');
const configBuild = require('./config/config-build');

// Disable log notifier
notify.logLevel(0);

const options = {
	path: 'bin/www'
};

const testFiles = [
	'test/**/*.js'
];

const eslintFiles = [
	'./**/*.js',
	'!gulpfile.js',
	'!bower_components/**',
	'!build/**',
	'!build_public/**',
	'!coverage/**',
	'!dist/**',
	'!node_modules/**',
	'!swagger-ui/**'
];

const serverFiles = [
	'./**/*.js',
	'bin/www',
	'!bower_components/**',
	'!build/**',
	'!build_public/**',
	'!coverage/**',
	'!dist/**',
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

/*
 * Main Tasks
 */

gulp.task('default', ['dev']);

gulp.task('run', 'Starts the application', ['build'], () => {
	server.listen(options, () => {
		livereload.listen(_.extend(config.livereload, {basePath: 'build_public'}));
	});
});

gulp.task('dev', 'Starts the application with livereload', seq('run', 'dev:watch'));

gulp.task('build', 'Makes a development build of the client', seq('eslint', 'test', 'clean', ['build:copy',
	'build:bower', 'build:angular'], 'build:inject'));

gulp.task('dist', 'Creates a dist folder with the files of the built application', seq('eslint', 'test', 'clean', ['dist:copy',
	'dist:bower', 'dist:angular'], 'dist:inject'));

gulp.task('package', 'Creates a zip with the full project', ['dist'], () => {
	return gulp.src('build/**/*')
		.pipe(zip(pkg.name + '-' + pkg.version + '.zip'))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', 'Cleans the build and build_public directories', () => {
	return gulp.src(['./build', './build_public'], {read: false})
		.pipe(clean({force: true}));
});

gulp.task('eslint', 'Verifies good practices in code', () => {
	return gulp.src(eslintFiles)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on('error', notify.onError(error => {
			return error.message;
		}))
		.on('error', error => {
			gutil.log(error.message);
			process.exit(1);
		});
});

gulp.task('test', 'Executes the tests and creates a coverage report', ['test:pre'], () => {

	// Hide logs from console
	require('./middlewares/logger').removeConsoleTransport();

	return gulp.src(testFiles)
		.pipe(mocha())
		.once('error', notify.onError(error => {
			return error.message;
		}))
		// Creating the reports after tests ran
		.pipe(istanbul.writeReports())
		// Enforce a coverage of at least 80%
		.pipe(istanbul.enforceThresholds({thresholds: {global: 10}}))
		.once('error', error => {
			gutil.log(gutil.colors.red(error.message));
		})
		.once('error', notify.onError(error => {
			return error.message;
		}));
});

/*
 * Helper tasks
 */

gulp.task('dev:watch', ['dev:watch:server', 'dev:watch:client', 'dev:watch:angular', 'dev:watch:index']);

gulp.task('dev:watch:server', () => {
	return watch(serverFiles, vinyl => {
		return gulp.src(vinyl.path)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(server())
			.pipe(notify('Reload file: <%= file.relative %>'));
	});
});

gulp.task('dev:watch:client', () => {
	return watch(clientFiles)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulp.dest('build_public'))
		.pipe(livereload())
		.pipe(notify('Reload file: <%= file.relative %>'));
});

gulp.task('dev:watch:angular', () => {
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

gulp.task('dev:watch:index', () => {
	return watch('public/index.html', () => {
		return injectFn()
			.pipe(livereload())
			.pipe(notify('Reload file: <%= file.relative %>'));
	});
});

gulp.task('build:copy', () => {
	return gulp.src(clientFiles)
		.pipe(gulp.dest('./build_public'));
});

gulp.task('build:bower', ['build:bower:js', 'build:bower:css']);

gulp.task('build:bower:js', _.map(configBuild.dev.js, c => {
	const taskName = 'build:bower:js:' + c;

	gulp.task(taskName, () => {
		return gulp.src('./bower_components/' + c, {base: './bower_components/'})
			.pipe(gulp.dest('./build_public/javascripts/'));
	});

	return taskName;
}));

gulp.task('build:bower:css', _.map(configBuild.dev.css, c => {
	const taskName = 'build:bower:css:' + c;

	gulp.task(taskName, () => {
		return gulp.src('./bower_components/' + c, {base: './bower_components/'})
			.pipe(gulp.dest('./build_public/stylesheets/'));
	});

	return taskName;
}));

gulp.task('build:angular', () => {
	return gulp.src(angularFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./build_public/'));
});

function injectFn() {
	// Different streams to keep the dependency order
	const vendorJsSources = gulp.src(['./build_public/javascripts/angular/**/*.js',
		'./build_public/javascripts/*/**/*.js'], {read: false});
	const vendorCssSources = gulp.src(['./build_public/stylesheets/*/**/*.css'], {read: false});

	const customJsSources = gulp.src(['./build_public/javascripts/*.js'], {read: false});
	const customCssSources = gulp.src(['./build_public/stylesheets/*.css'], {read: false});

	const appSource = gulp.src(['./build_public/app.js'], {read: false});

	return gulp.src('./public/index.html')
		.pipe(inject(series(vendorJsSources, vendorCssSources, customJsSources, customCssSources, appSource), {
			ignorePath: '/build_public/',
			addRootSlash: false
		}))
		.pipe(gulp.dest('./build_public'));
}

gulp.task('build:inject', injectFn);

gulp.task('dist:copy', ['dist:copy:client', 'dist:copy:server', 'dist:copy:package.json']);

gulp.task('dist:copy:client', () => {
	return gulp.src(clientFiles)
		.pipe(gulp.dest('./build/public'));
});

gulp.task('dist:copy:server', () => {
	return gulp.src(serverFiles, {base: './'})
		.pipe(gulp.dest('./build'));
});

gulp.task('dist:copy:package.json', () => {
	return gulp.src('./package.json')
		.pipe(transform(data => {
			delete data.devDependencies;

			return data;
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('dist:bower', ['dist:bower:js', 'dist:bower:css']);

gulp.task('dist:bower:js', _.map(configBuild.dist.js, c => {
	const taskName = 'build:bower:js:' + c;

	gulp.task(taskName, () => {
		return gulp.src('./bower_components/' + c, {base: './bower_components/'})
			.pipe(gulp.dest('./build/public/javascripts/'));
	});

	return taskName;
}));

gulp.task('dist:bower:css', _.map(configBuild.dist.css, c => {
	const taskName = 'build:bower:css:' + c;

	gulp.task(taskName, () => {
		return gulp.src('./bower_components/' + c, {base: './bower_components/'})
			.pipe(gulp.dest('./build/public/stylesheets/'));
	});

	return taskName;
}));

gulp.task('dist:angular', () => {
	gulp.src(angularFiles)
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/public/'));
});

gulp.task('dist:inject', () => {
	const vendorJsSources = gulp.src(['./build/public/javascripts/*/**/*.js'], {read: false});
	const vendorCssSources = gulp.src(['./build/public/css/*/**/*.css'], {read: false});

	const customJsSources = gulp.src(['./build/public/javascripts/*.js'], {read: false});
	const customCssSources = gulp.src(['./build/public/css/*.css'], {read: false});

	const appSource = gulp.src(['./build/public/app.js'], {read: false});

	return gulp.src('./public/index.html')
		.pipe(inject(series(vendorJsSources, vendorCssSources, customJsSources, customCssSources, appSource), {
			ignorePath: '/build/public/',
			addRootSlash: false
		}))
		.pipe(gulp.dest('./build/public'));
});

gulp.task('test:pre', 'Pre tests', () => {
	return gulp.src(serverFiles)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

