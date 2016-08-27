
/* FILE: mobile/assets/js/configs/appConfig.js */
(function () {

var app = angular.module("ClassPictures", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider, $locationProvider){
		var initialPath = window.location.pathname;

		

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$routeProvider
			.when(initialPath, {
				templateUrl: 'assets/templates/login.html',
				controller: 'LoginController'
			})
			.when(initialPath + "classesList", {
				templateUrl: 'assets/templates/classes-list.html',
				controller: 'ClassesListController'
			})
			.otherwise({
				redirectTo: initialPath
			});
});

app.run(function($location){
		

	// Initialize Firebase
		var config = {
			apiKey: "AIzaSyBDcoldmE8SFUwXf5fxjj4Bzf9lijazHps",
			authDomain: "classpictures-5313f.firebaseapp.com",
			databaseURL: "https://classpictures-5313f.firebaseio.com",
			storageBucket: "classpictures-5313f.appspot.com",
		};
		firebase.initializeApp(config);

		firebase.auth().getRedirectResult().then(function(result){
			if (result.user) {
				$location.path(window.location.pathname +'classesList');
			}
		}); 

		
});

})();




/* FILE: mobile/assets/js/directives/Sidenav.js */
(function () {

var app = angular.module("ClassPictures");

app.directive('ppSidenav', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {},
		templateUrl: 'assets/templates/sidenav.html'
	};
});

})();



/* FILE: mobile/assets/js/controllers/ClassesListController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', ClassesListController]);

function ClassesListController($scope) {

	
}

})();



/* FILE: mobile/assets/js/controllers/LoginController.js */
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



/* FILE: mobile/assets/js/controllers/SidenavController.js */
(function () {

var app = angular.module("ClassPictures");

app.controller("SidenavController", ["$scope", "$mdSidenav", function($scope, $mdSidenav){
	this.openSideMenu = function(){
		$mdSidenav('left').toggle();
	};
}]);

})();