
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
(function () {

var app = angular.module('ClassPictures');

app.service('UserService', [UserService]);

function UserService() {

	var userClasses = [];

	this.getUserClasses = function(){
		return userClasses; 
	};

	this.addUserClass = function(userClass){
		userClasses.concat(userClass);
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
      Image.getImage($routeParams.class, image.id)
        .getDownloadURL()
        .then(function(url) {
          image.url = url;
          $scope.$apply();
        });
    });
    $scope.$apply();
  });
  $scope.fileChanged = function(e) {
    var imageId = (new Date()).getTime()+'';
    Image.getImage($routeParams.class, imageId)
      .put(e.files[0])
      .then(function(uploadTask) {
        uploadTask.on('complete', function() {
          Class.getById($routeParams.class).ref('images').push({
            id: imageId,
            owner: firebase.auth().currentUser.displayName,
            description: '',
            isPublic: false
          });
        });
      });
  };
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
    $location.path(window.location.pathname + 'class/' + group.id);
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
	app.controller('ClassesSelectController', ['$scope', ClassesSelectController]);

	function ClassesSelectController($scope, $timeout, $q, $log) {
		var self = this;
		$scope.allClasses = [{
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TM2",
			"hora_inicial": "13:00",
			"hora_final": "14:40",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1014"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TB1",
			"hora_inicial": "09:25",
			"hora_final": "11:05",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TE",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Ter",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TE",
			"hora_inicial": "20:55",
			"hora_final": "22:35",
			"dia_semana": "Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TW",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Seg-Qua",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TE",
			"hora_inicial": "20:55",
			"hora_final": "22:35",
			"dia_semana": "Ter",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TE",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TM1",
			"hora_inicial": "13:00",
			"hora_final": "14:40",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1015"
		}];

		$scope.selectedClasses = [];

		self.simulateQuery = false;
		self.isDisabled = false;

		self.querySearch = querySearch;
		self.selectedItemChange = selectedItemChange;
		self.removeSelection = function(classe){
			$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe),1);
		};
		
		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function selectedItemChange(item) {
			if (item) {
				if (! $scope.selectedClasses.find(function(classe) {
						return (classe.codigo_materia == item.codigo_materia) && (classe.turma == item.turma);
					})) {
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

app.controller('PhotoController', ['$scope', '$routeParams', 'Image', 'Class', PhotoController]);

function PhotoController($scope, $routeParams, Image, Class) {
    $scope.image = {};

    //FOR NARNIA
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    var metaData = Image.getImageMetadata($routeParams.classId, $routeParams.imageId);

    Class.getById($routeParams.classId).on('value', function(snapshot) {
        $scope.class = snapshot.val();
        $scope.safeApply();
    });

    metaData.on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date($scope.image.id).toLocaleString();
        $scope.image.title = $scope.image.owner.name + ': ' + $scope.image.date;
        $scope.safeApply();
	    Image.getImage($routeParams.classId, $scope.image.id).getDownloadURL().then(function(URL) {
	        $scope.image.path = URL;
            $scope.safeApply();
	    }.bind(this));

    });

    $scope.onChange = function(key) {
        var payload = {};
        payload[key] = $scope.image[key];

        metaData.update(payload);
    };

    $scope.checkEdit = function() {
        return ($scope.image.owner)? $scope.image.owner.id !== firebase.auth().currentUser.uid : true;
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