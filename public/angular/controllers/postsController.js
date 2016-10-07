/* global app */

app.controller({
	'PostController': function ($scope, PostService) {
		$scope.posts = [];
		$scope.newPost = {};
		$scope.error = null;

		PostService.list().$promise.then(function (posts) {
			$scope.posts = posts;
		});

		$scope.create = function() {
			PostService.create($scope.newPost).$promise.then(function(post) {
				$scope.posts.push(post);
				$scope.newPost = {};
			}).catch(function(e) {
				$scope.error = e.data;
			});
		};
	}
});

app.config(function ($routeProvider) {
	$routeProvider
		.when('/post', {
			controller: 'PostController',
			templateUrl: 'views/posts.html'
		})
		.otherwise('/post');
});