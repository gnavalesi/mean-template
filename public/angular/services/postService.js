/* global app */

app.factory('PostService', ['$resource', function ($resource) {
	var target = 'http://localhost:3000/api/post';
	return $resource(target, {
		id: '@id'
	}, {
		get: {
			method: 'GET',
			isArray: false,
			url: target + '/:id'
		},
		list: {
			method: 'GET',
			isArray: true
		},
		update: {
			method: 'PUT',
			isArray: false
		},
		create: {
			method: 'POST',
			isArray: false
		},
		delete: {
			method: 'DELETE',
			isArray: false,
			url: target + '/:id'
		},
	});
}]);