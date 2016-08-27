
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
			// .when(initialPath, {
			// 	templateUrl : 'assets/templates/login.html'
			// })
			.otherwise({
				redirectTo: initialPath
			});
});

})();


