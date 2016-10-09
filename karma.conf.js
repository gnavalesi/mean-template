// Karma configuration
// Generated on Fri Oct 07 2016 22:45:59 GMT-0300 (ART)

const buildConfig = require('./config/config-build');
const _ = require('underscore');

module.exports = function (config) {
	let files = _.map(buildConfig.dev.js, (c) => {
		return 'bower_components/' + c;
	}).concat([
		'bower_components/angular-mocks/angular-mocks.js',
		'public/app.js',
		'public/**/*.js',
		'test/public/**/*.js'
	]);

	//files = files.concat();

	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: files,


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'public/**/*.js': 'coverage'
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/client',
			reporters: [{
				type: 'lcov'
			}, {
				type: 'text'
			}],
			check: {
				global: {
					statements: 30,
					branches: 30,
					functions: 30,
					lines: 30
				}
			}
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
		// config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		//autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
