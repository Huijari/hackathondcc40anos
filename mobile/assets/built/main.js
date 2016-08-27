
/* FILE: mobile/assets/js/configs/appConfig.js */
(function () {

var app = angular.module("ClassPictures", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider, $locationProvider){
		var initialPath = window.location.pathname;
		window.initialPath = initialPath;

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
				templateUrl: 'assets/templates/login.html',
				controller: 'LoginController'
			})
			.when('selectClasses', {
				templateUrl : 'assets/templates/classesSelection.html'
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

/* FILE: mobile/assets/js/services/ClassService.js */
(function () {

var app = angular.module('ClassPictures');

app.factory('Class', [ClassFactory]);

function ClassFactory() {
  var service = {};

  service.getById = function(id) {
    return firebase.database().ref('class/' + id);
  };

  return service;
}
})();


/* FILE: mobile/assets/js/controllers/ClassController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassController', ['$scope', '$routeParams', 'Class', ClassController]);

function ClassController($scope, $routeParams, Class) {
  $scope.class = {};
  Class.getById($routeParams.class).on('value', function(snapshot) {
    $scope.class = snapshot.val();
    $scope.$apply();
  });
}
})();


/* FILE: mobile/assets/js/controllers/ClassesListController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', ClassesListController]);

function ClassesListController($scope) {

	
}

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

	var user;
	var isToLogin = true;
	var userToken;
	var self = this;
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/plus.login');

	$scope.loginWithGoogleClick = function(){
		firebase.auth().signInWithRedirect(provider);
	};
	
}

})();



/* FILE: mobile/assets/js/controllers/SidenavController.js */
(function () {

var app = angular.module("ClassPictures");

app.controller("SidenavController", ["$scope", "$location", "$mdSidenav", function($scope, $location, $mdSidenav){
	
	var self = this;
	
	this.openSideMenu = function openSideMenu(){
		$mdSidenav('left').toggle();
	};

	this.setUserInfo = function setUserInfo(){
		var user = firebase.auth().currentUser;
		$scope.userName = user.displayName;
		$scope.userProfileImage = user.photoURL;
		$scope.userStatus = "Yesterday u said tomorrow!";
	};

	this.logOut = function logOut(){
		firebase.auth().signOut().then(function(){
			$location.path(window.initialPath);
			$scope.$apply();
		});
	};

	function buildLeftNavSettings () {
		$scope.settings = [
			{
				settingName: "Visibilidade",
				iconPath: "assets/images/icons/ic_visibility_black_24px.svg",
				onClickMethod: self.oi,
				isCheckbox : true,
				checked : true
			},
			{
				settingName: "Perfil",
				iconPath: "assets/images/icons/ic_person_black_24px.svg",
				onClickMethod: self.oi,
				isCheckbox : false,
				checked : false
			},
			{
				settingName: "Conta",
				iconPath: "assets/images/icons/ic_vpn_key_black_24px.svg",
				onClickMethod: self.oi,
				isCheckbox : false,
				checked : false
			},
			{
				settingName: "Logout",
				iconPath: "assets/images/icons/ic_exit_to_app_black_24px.svg",
				onClickMethod: self.logOut,
				isCheckbox : false,
				checked : false
			}

		];
	}

	buildLeftNavSettings();
	this.setUserInfo();
}]);

})();