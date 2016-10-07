'use strict';

const request = require('supertest');
const app = require('../app.js');
const config = require('../config/config');

if(config.swagger.enabled) {
	describe('Swagger', () => {
		describe('#get ' + config.swagger.routes.documentation, () => {
			it('Should return a json object', done => {
				request(app)
					.get(config.swagger.routes.documentation)
					.expect('Content-Type', /json/)
					.expect(200, done);
			});
		});

		describe('#get ' + config.swagger.routes.ui + '/?url=' + encodeURIComponent(config.swagger.routes.documentation), () => {
			it('Should return a json object', done => {
				request(app)
					.get(config.swagger.routes.ui + '/?url=' + encodeURIComponent(config.swagger.routes.documentation))
					.expect('Content-Type', 'text/html; charset=UTF-8')
					.expect(200, done);
			});
		});
	});
}
