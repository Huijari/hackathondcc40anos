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
	
	// firebase.auth().getRedirectResult().then(function(result){
	// 	if (result.user) {
	// 		$location.path(window.location.pathname +'classesList');
	// 	}
	// }); 
	

	$scope.loginWithGoogleClick = function(){
		firebase.auth().signInWithRedirect(provider);		
	};
	
}

})();

