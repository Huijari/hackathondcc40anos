(function() {

	var app = angular.module('ClassPictures');

	app.controller('LoginController', ['$scope', '$location', 'Class', LoginController]);

	function LoginController($scope, $location, Class) {

		var user;
		var isToLogin = true;
		var userToken;
		var self = this;
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');

		$scope.loginWithGoogleClick = function() {
			if (!firebase.auth().currentUser) {
				firebase.auth().signInWithRedirect(provider);
			} else {
				$location.path('/classesList');
			}
			$scope.$apply();
		};
		Class.getAllClasses().then(function(requestData) {
			window.allClasses = requestData.data.records.map(function(each) {
				each.id = each.codigo_materia + each.turma;
				return each;
			});
		});


	}

})();