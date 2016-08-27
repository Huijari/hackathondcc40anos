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


