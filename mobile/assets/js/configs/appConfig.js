(function () {

var app = angular.module("ClassPictures", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider, $locationProvider){
		var initialPath = window.location.pathname;
		window.initialPath = initialPath;

    // Install Service Worker
    navigator.serviceWorker
      .register('service-worker.js')
      .then(function() {
        console.log('SW Install');
      });

		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyBDcoldmE8SFUwXf5fxjj4Bzf9lijazHps",
			authDomain: "classpictures-5313f.firebaseapp.com",
			databaseURL: "https://classpictures-5313f.firebaseio.com",
			storageBucket: "classpictures-5313f.appspot.com",
		};
		firebase.initializeApp(config);

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});

		$routeProvider
            .when("/", {
                templateUrl : 'assets/templates/login.html',
                controller: 'LoginController'
            })
            .when('/photo/:classId/:imageId', {
                templateUrl : 'assets/templates/photo.html',
                controller: 'PhotoController'
            })
			.when('/selectClasses', {
				templateUrl : 'assets/templates/classSelection.html'
			})
			.when("/classesList", {
				templateUrl: 'assets/templates/classes-list.html',
				controller: 'ClassesListController'
			})
            .when('/class/:class', {
              templateUrl: 'assets/templates/gallery.html',
              controller: 'ClassController'
            })
			.otherwise({
				redirectTo: initialPath
			});
});

app.run(function($location){
	firebase.auth().getRedirectResult().then(function(result){
		if (result.user) {
			$location.path('/classesList');
		}
	});
});

})();


