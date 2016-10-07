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
const batch = require('gulp-batch');
const prompt = require('gulp-prompt');
const util = require('gulp-util');

const series = require('stream-series');

const pkg = require('./package.json');
const bower = require('./bower.json');
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
	'!config/config-build.js',
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

function newFile(name, contents) {
	//uses the node stream object
	var readableStream = require('stream').Readable({ objectMode: true });
	//reads in our contents string
	readableStream._read = () => {
		readableStream.push(new util.File({ cwd: "", base: "", path: name, contents: new Buffer(contents) }));
		readableStream.push(null);
	};

	return readableStream;
}

/*
 * Main Tasks
 */

gulp.task('default', ['dev']);

gulp.task('init', 'Reinitializes the package.json and bower.json files', () => {
	gulp.src(['package.json', 'bower.json'])
		.pipe(prompt.prompt([{
			type: 'input',
			name: 'name',
			message: 'name',
			validate: (v) => typeof v === 'string' && v.length > 0
		}, {
			type: 'input',
			name: 'version',
			message: 'version',
			validate: (v) => typeof v === 'string' && v.length > 0
		}, {
			type: 'input',
			name: 'description',
			message: 'description',
			validate: (v) => typeof v === 'string'
		}], function(res) {
			const newPkg = _.clone(pkg);
			newPkg.name = res.name;
			newPkg.version = res.version;
			newPkg.description = res.description;

			newFile('package.json', JSON.stringify(newPkg, null, '\t'))
				.pipe(gulp.dest('./'));

			const newBower = _.clone(bower);
			newBower.name = res.name;
			newBower.version = res.version;
			newBower.description = res.description;

			newFile('bower.json', JSON.stringify(newBower, null, '\t'))
				.pipe(gulp.dest('./'));
		}));
});

gulp.task('run', 'Starts the application', ['build'], () => {
	server.listen(options, () => {
		livereload.listen(_.extend(config.livereload, {basePath: 'build_public'}));
	});
});

gulp.task('dev', 'Starts the application with livereload', seq('run', 'dev:watch'));

gulp.task('build', 'Makes a development build of the client', seq('eslint', 'test', 'clean', ['build:copy',
	'build:bower', 'build:angular'], 'build:inject'));

gulp.task('dist', 'Creates a build folder with the files of the built application', seq('eslint', 'test', 'clean', ['dist:copy',
	'dist:bower', 'dist:angular'], 'dist:inject'));

gulp.task('package', 'Creates a zip with the full project in the dist folder', ['dist'], () => {
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
	require('./modules/logger').removeConsoleTransport();

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
	return watch(['public/index.html'], () => {
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

gulp.task('build:bower:js', () => {
	return gulp.src(_.map(configBuild.dev.js, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/javascripts/'));
});

gulp.task('build:bower:css', () => {
	return gulp.src(_.map(configBuild.dev.css, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build_public/stylesheets/'));
});

gulp.task('build:angular', () => {
	return gulp.src(angularFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./build_public/'));
});

function injectFn() {
	// Different streams to keep the dependency order
	const vendorJsSources = _.map(configBuild.dev.js, js => {
		return './build_public/javascripts/' + js;
	});

	const customJsSources = ['./build_public/javascripts/**/*.js'].concat(_.map(vendorJsSources, js => {
		return '!' + js;
	}));

	const vendorCssSources = _.map(configBuild.dev.css, css => {
		return './build_public/stylesheets/' + css;
	});

	const customCssSources = ['./build_public/stylesheets/**/*.css'].concat(_.map(vendorCssSources, css => {
		return '!' + css;
	}));

	const appSource = ['./build_public/app.js'];

	const streams = _.map([vendorJsSources, customJsSources, vendorCssSources, customCssSources, appSource], s => {
		return gulp.src(s, {read: false})
	});

	return gulp.src('./public/index.html')
		.pipe(inject(series(streams), {
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


gulp.task('dist:bower:js', () => {
	return gulp.src(_.map(configBuild.dist.js, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build/public/javascripts/'));
});

gulp.task('dist:bower:css', () => {
	return gulp.src(_.map(configBuild.dist.css, c => {
		return './bower_components/' + c;
	}), {base: './bower_components/'})
		.pipe(gulp.dest('./build/public/stylesheets/'));
});

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
	// Different streams to keep the dependency order
	const vendorJsSources = _.map(configBuild.dist.js, js => {
		return './build/public/javascripts/' + js;
	});
	const customJsSources = ['./build/public/javascripts/**/*.js'].concat(_.map(vendorJsSources, js => {
		return '!' + js;
	}));

	const vendorCssSources = _.map(configBuild.dist.css, css => {
		return './build/public/stylesheets/' + css;
	});
	const customCssSources = ['./build/public/stylesheets/**/*.css'].concat(_.map(vendorCssSources, css => {
		return '!' + css;
	}));

	const appSource = ['./build/public/app.js'];

	const streams = _.map([vendorJsSources, customJsSources, vendorCssSources, customCssSources, appSource], s => {
		return gulp.src(s, {read: false})
	});

	return gulp.src('./public/index.html')
		.pipe(inject(series(streams), {
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

