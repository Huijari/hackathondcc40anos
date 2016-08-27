
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
                templateUrl : 'assets/templates/login.html',
                controller: 'LoginController'
            })
            .when('/photo', {
                templateUrl : 'assets/templates/photo.html',
                controller: 'PhotoController'
            })
			.when('selectClasses', {
				templateUrl : 'assets/templates/classesSelection.html'
			})
			.when(initialPath + "classesList", {
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


/* FILE: mobile/assets/js/services/ImageService.js */
(function () {

var app = angular.module('ClassPictures');

app.factory('Image', [ImageFactory]);

function ImageFactory() {
  var service = {};

  service.getByClass = function(id) {
    return firebase.storage().ref(id);
  };

  return service;
}
})();


/* FILE: mobile/assets/js/services/UserService.js */
(function () {

var app = angular.module('ClassPictures');

app.service('UserService', [UserService]);

function UserService() {

	var openedGroup;

	this.setOpenedGroup= function(group){
		openedGroup = group;
	};

	this.getOpenedGroup = function(){
		return openedGroup; 
	};
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

	this.countMemberClass = function countMemberClass(group) {
		var groupCount = group.members? group.members.length : 0;
		var message = groupCount + (groupCount > 1 ? ' members' : ' member');
		return message;
	};

	this.addClasses = function addClasses() {
		$location.path(window.location.pathname +'createGroup');
	};

	this.openGroup = function openGroup(group){
		$location.path(window.location.pathname +'group');
		GroupService.setOpenedGroup(group);
	};
	
	function buildSampleGroups() {
		$scope.groups = [
			{
				id: 1,
				name: 'Calculo Diferencial Integral III',
				imagePath: 'https://unsplash.it/80/80/'
			},
			{
				id: 2,
				name: 'Fundamentos de Mecânia dos sólidos e Fluidos',
				imagePath: 'https://unsplash.it/70/70/'
			},
			{
				id: 3,
				name: 'Equaçoes Diferencias A',
				lastPosition: 'Favelinha loka',
				members: [1, 2],
				imagePath: 'https://unsplash.it/90/90/'
			},
			{
				id: 4,
				name: 'Laboratório de Sistemas Digitais',
				lastPosition: 'There is no last position to show',
				members: [1, 2],
				imagePath: 'https://unsplash.it/100/100/'
			},
			{
				id: 5,
				name: 'Análise de circuitos elétricos II',
				lastPosition: 'Teknisa Service',
				members: [1, 2],
				imagePath: 'https://unsplash.it/110/110/'
			}
		];
	}

	buildSampleGroups();
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



/* FILE: mobile/assets/js/controllers/PhotoController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', PhotoController]);

function PhotoController($scope) {
    $scope.image = {};
    $scope.image.path = 'http://lorempixel.com/420/420/';
    $scope.image.timestamp = "1472322628";
    $scope.image.owner = "Faboiola";
    $scope.image.isPublic = false;
    $scope.image.alt = "TESTE";
    $scope.image.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
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
		$scope.userEmail = user.email;
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