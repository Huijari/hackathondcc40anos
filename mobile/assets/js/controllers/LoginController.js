(function () {

var app = angular.module('ClassPictures');

app.controller('LoginController', ['$scope', '$location', LoginController]);

function LoginController($scope, $location) {

	var user;
	var isToLogin = true;
	var userToken;
	var self = this;
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/plus.login');

	$scope.loginWithGoogleClick = function(){
    if (!firebase.auth().currentUser) {
      firebase.auth().signInWithRedirect(provider);
    }
    else {
      $location.path('classesList');
    }
	};

}

})();

