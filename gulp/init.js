'use strict';

const gulp = require('gulp-help')(require('gulp'));
const util = require('gulp-util');
const prompt = require('gulp-prompt');

const _ = require('underscore');

const pkg = require('../package.json');
const bower = require('../bower.json');

function newFile(name, contents) {
	//uses the node stream object
	var readableStream = require('stream').Readable({objectMode: true});
	//reads in our contents string
	readableStream._read = () => {
		readableStream.push(new util.File({cwd: '', base: '', path: name, contents: new Buffer(contents)}));
		readableStream.push(null);
	};

	return readableStream;
}

function initFile(file, values, replacement) {
	const newValues = _.clone(values);
	newValues.name = replacement.name;
	newValues.version = replacement.version;
	newValues.description = replacement.description;

	return newFile(file, JSON.stringify(newValues, null, '  '))
		.pipe(gulp.dest('./'));
}

const promptConfig = [{
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
}];

gulp.task('init:core', false, () => {
	return gulp.src(['package.json', 'bower.json'])
		.pipe(prompt.prompt(promptConfig, res => {
			initFile('package.json', pkg, res);
			initFile('bower.json', bower, res);
		}));
});