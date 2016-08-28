
/* FILE: mobile/assets/js/configs/appConfig.js */
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

app.factory('ClassService', ['$http', ClassFactory]);

function ClassFactory($http) {
  var service = {};
  service.getAllClasses = function(){
  	return $http.get("https://crossorigin.me/http://www.icex.ufmg.br/minhasala/recupera_salas.php");
  };
  
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

  service.getImage = function(classId, imageId) {
    return service.getByClass(classId).child(imageId+'');
  };

  service.getImageMetadata = function(classId, imageId) {
    return firebase.database().ref('class/'+classId+'/images/'+imageId);
  };

  return service;
}
})();


/* FILE: mobile/assets/js/services/UserService.js */
(function() {

	var app = angular.module('ClassPictures');

	app.service('UserService', [UserService]);

	function UserService() {

		var userClasses = [];

<<<<<<< HEAD
		this.getUserClasses = function(userId) {
			return firebase.database().ref("user/" + userId + "/classes");
		};
=======
	this.getUserClasses = function(){
		return userClasses; 
	};
>>>>>>> 96dde700d67ca609f95659f77e7064c1e793d8d4

		this.removeClassById = function(classId, userId) {
			return firebase.database().ref('user/' + userId + "/classes" + classId).remove().then(function() {
				console.log("Remove succeeded.");
			});
		};

		this.addClass = function(userClass, userId) {
			firebase.database().ref('user/'+ userId + "/classes").push().set(userClass);
		};
	}

})();

/* FILE: mobile/assets/js/controllers/ClassController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassController', ['$scope', '$routeParams', 'Class', 'Image', ClassController]);

function ClassController($scope, $routeParams, Class, Image) {
  $scope.class = {};
  Class.getById($routeParams.class).on('value', function(snapshot) {
    $scope.class = snapshot.val();
    $scope.class.images.forEach(function(image) {
      Image.getByClass($routeParams.class).child(''+image.id)
        .getDownloadURL().then(function(url) {
          image.url = url;
          $scope.$apply();
        });
    });
    $scope.$apply();
  });
  console.log(Image.getByClass($routeParams.class));
}
})();


/* FILE: mobile/assets/js/controllers/ClassesListController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', '$location', ClassesListController]);

function ClassesListController($scope, $location) {

	$scope.addClassButtonLabel = "Editar disciplinas cadastradas";

	$scope.addNewClassClick = function(){
		console.log("Adicionar nova disciplina");
	};

	this.countMemberClass = function countMemberClass(group) {
		var groupCount = group.members? group.members.length : 0;
		var message = groupCount + (groupCount > 1 ? ' members' : ' member');
		return message;
	};

	this.addClasses = function addClasses() {
		$location.path('/createGroup');
	};

	this.openGroup = function openGroup(group){
		$location.path('/group');
		GroupService.setOpenedGroup(group);
	};
	
	function buildSampleGroups() {
		$scope.classes = [
			{
				id: 'EST032TM2',
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
				id: 5,
				name: 'Análise de circuitos elétricos II',
				lastPosition: 'Teknisa Service',
				members: [1, 2],
				imagePath: 'assets/images/icons/ic_view_headline_white_24px.svg'
			},
			{
				id: 4,
				name: 'Laboratório de Sistemas Digitais',
				lastPosition: 'There is no last position to show',
				members: [1, 2],
				imagePath: 'https://unsplash.it/100/100/'
			}
		];
	}
	buildSampleGroups();

}

})();



/* FILE: mobile/assets/js/controllers/ClassesSelectController.js */
(function() {

	var app = angular.module("ClassPictures");
	app.controller('ClassesSelectController', ['$scope','UserService', 'ClassService', ClassesSelectController]);

	function ClassesSelectController($scope, UserService, ClassService) {
		var self = this;
		$scope.allClasse = [];
		ClassService.getAllClasses().then(function(requestData){
			$scope.allClasses = requestData.data.records;
		});
		
		$scope.selectedClasses = UserService.getUserClasses();

			// "nome_materia": "PROBABILIDADE",
			// "codigo_materia": "EST032",
			// "turma": "TM2",
			// "hora_inicial": "13:00",
			// "hora_final": "14:40",
			// "dia_semana": "Ter-Qui",
			// "nome_sala": "1014"

		$scope.selectedClasses = [];

		self.simulateQuery = false;
		self.isDisabled = false;

		self.querySearch = querySearch;
		self.selectedItemChange = selectedItemChange;
<<<<<<< HEAD
		self.removeSelection = function(classe) {
			UserService.removeClassById(classe.codigo_materia + classe.turma, firebase.auth().currentUser);
			$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe), 1);
		};

=======
		self.removeSelection = function(classe){
			$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe),1);
		};
		
>>>>>>> 96dde700d67ca609f95659f77e7064c1e793d8d4
		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function selectedItemChange(item) {
			if (item) {
				if (!$scope.selectedClasses.find(function(classe) {
						return (classe.codigo_materia == item.codigo_materia) && (classe.turma == item.turma);
					})) {
					UserService.addClass(item, firebase.auth().currentUser);
					$scope.selectedClasses.push(item);
				}
			}
		}

		/**
		 * Create filter function for a query string
		 */
		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			var words = lowercaseQuery.split(" ");
			return function filterFn(classe) {
				var a = words.every(function(word) {
					var b = Object.keys(classe).some(function(prop) {
						return ~angular.lowercase(classe[prop]).indexOf(word);
					});
					return b;
				});
				return a;
			};
		}
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
	    if (!firebase.auth().currentUser) {
	      firebase.auth().signInWithRedirect(provider);
	    } else {
	      $location.path('/classesList');
	    }
	};

}

})();



/* FILE: mobile/assets/js/controllers/PhotoController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', '$routeParams', 'Image', PhotoController]);

function PhotoController($scope, $routeParams, Image) {
    $scope.image = {};

    var metaData = Image.getImageMetadata($routeParams.classId, $routeParams.imageId);
    metaData.on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date($scope.image.id).toLocaleString();
        $scope.image.title = $scope.image.owner + ': ' + $scope.image.date;
        $scope.$apply();
	    Image.getImage($routeParams.classId, $scope.image.id).getDownloadURL().then(function(URL) {
	        $scope.image.path = URL;
	    });
    });

    metaData.set({
        id: $scope.image.id,
        owner: $scope.image.owner,
        description: $scope.image.description,
        isPublic: $scope.image.isPublic
    }).then(function() {
        console.log('Synchronization succeeded');
    }).catch(function(error) {
        console.log('Synchronization failed: ' + error);
    });
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
		var user = firebase.auth().currentUser || {};
		$scope.userName = user.displayName;
		$scope.userProfileImage = user.photoURL;
		$scope.userEmail = user.email;
	};

	this.logOut = function logOut(){
		firebase.auth().signOut().then(function(){
			$location.path("/");
		});
	};

	this.chama = function() {
		$location.path("/selectClasses");
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
				settingName: "Tela do Fabio",
				iconPath: "assets/images/icons/ic_exit_to_app_black_24px.svg",
				onClickMethod: self.chama ,
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