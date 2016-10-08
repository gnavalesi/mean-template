'use strict';

// Use this line before any other require in every test file
//process.env.NODE_ENV = 'test';

//const request = require('supertest');

//const server = require('../../app.js');

describe('PostsController', function () {
	beforeEach(module('myApp'));

	var $controller;

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.error', function () {
		it('Tests empty $scope.error', () => {
			var scope = {};
			$controller('PostsController', {$scope: scope});

			expect(scope.error).toEqual(null);
		});
	});
});