'use strict';

const request = require('supertest');

const app = require('../../app.js');
const pkg = require('../../package.json');

describe('Version', () => {
	describe('#get api/version', () => {
		it('Should return the same version declared in package.json', done => {
			request(app)
				.get('/api/version')
				.expect(200, {
					version: pkg.version
				}, done);
		});
	});
});