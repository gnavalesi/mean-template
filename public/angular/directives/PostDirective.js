/* global app */

app.directive('post', function () {
	return {
		restrict: 'E',
		scope: {
			postInfo: '=info'
		},
		templateUrl: 'views/directives/post.html'
	};
});