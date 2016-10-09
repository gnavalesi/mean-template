'use strict';

process.env.NODE_ENV = 'test';

const glob = require('glob');

const app = require('../../app');

const tests = glob.sync('./**/!(index).js', {
	cwd: __dirname
});

tests.forEach(t => {
	require('./' + t);
});

after(done => {
	require('mongoose').disconnect(done);
});