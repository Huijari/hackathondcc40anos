
/* FILE: mobile/assets/js/configs/appConfig.js */
(function () {

var app = angular.module("ClassPictures", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider, $locationProvider){
		var initialPath = window.location.pathname;

    // Install Service Worker
    navigator.serviceWorker
      .register('/service-worker.js')
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
			enabled: true,
			requireBase: false
		});

		$routeProvider
			.when(initialPath, {
				templateUrl : 'assets/templates/login.html',
				controller: 'LoginController'
			})
			.when('selectClasses', {
				templateUrl : 'assets/templates/classesSelection.html'
			})
			.otherwise({
				redirectTo: initialPath
			});
});

})();




/* FILE: mobile/assets/js/directives/classesSelectList.js */
(function () {

var app = angular.module("ClassPictures");

app.directive('classesSelect', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {},
		templateUrl: 'assets/templates/classesSelect.html'
	};
});

})();

/* FILE: mobile/assets/js/controllers/ClassesSelectController.js */
(function() {

	var app = angular.module("ClassPictures");
	app.controller('ClassesSelectController', ['$scope', ClassesSelectController]);

	function ClassesSelectController($scope) {

		$scope.allClasses = [
			{
				"nome_materia": "PROBABILIDADE",
				"codigo_materia": "EST032",
				"turma": "TM2",
				"hora_inicial": "13:00",
				"hora_final": "14:40",
				"dia_semana": "Ter-Qui",
				"nome_sala": "1014"
			},
			{
				"nome_materia": "ESTATISTICA E PROBABILIDADES",
				"codigo_materia": "EST031",
				"turma": "TB1",
				"hora_inicial": "09:25",
				"hora_final": "11:05",
				"dia_semana": "Ter-Qui",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "ESTATISTICA E PROBABILIDADES",
				"codigo_materia": "EST031",
				"turma": "TE",
				"hora_inicial": "19:00",
				"hora_final": "20:40",
				"dia_semana": "Ter",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "ESTATISTICA E PROBABILIDADES",
				"codigo_materia": "EST031",
				"turma": "TE",
				"hora_inicial": "20:55",
				"hora_final": "22:35",
				"dia_semana": "Qui",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "ESTATISTICA E PROBABILIDADES",
				"codigo_materia": "EST031",
				"turma": "TW",
				"hora_inicial": "19:00",
				"hora_final": "20:40",
				"dia_semana": "Seg-Qua",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "PROBABILIDADE",
				"codigo_materia": "EST032",
				"turma": "TE",
				"hora_inicial": "20:55",
				"hora_final": "22:35",
				"dia_semana": "Ter",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "PROBABILIDADE",
				"codigo_materia": "EST032",
				"turma": "TE",
				"hora_inicial": "19:00",
				"hora_final": "20:40",
				"dia_semana": "Qui",
				"nome_sala": "1015"
			},
			{
				"nome_materia": "PROBABILIDADE",
				"codigo_materia": "EST032",
				"turma": "TM1",
				"hora_inicial": "13:00",
				"hora_final": "14:40",
				"dia_semana": "Ter-Qui",
				"nome_sala": "1015"
			}
		];

	}

})();

/* FILE: mobile/assets/js/controllers/LoginController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('LoginController', ['$scope', '$location', LoginController]);

function LoginController($scope, $location) {
	//$location.path(window.location.pathname + "classesSelect");
	$scope.loginWithGoogleClick = function(){
		var provider = new firebase.auth.GoogleAuthProvider();
	    firebase.auth().signInWithRedirect(provider).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  // ...
		}).catch(function(error) {	
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	};
	
}

})();

