
/* FILE: mobile/assets/js/configs/appConfig.js */
(function () {

var app = angular.module("ClassPictures", ['angular-loading-bar', 'ngAnimate', "ngRoute", "ngMaterial"]);

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

app.factory('Class', ['$http', ClassFactory]);

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
		var user = {};

		this.getUserClasses = function(userId) {
			return firebase.database().ref("user/" + userId + "/classes");
		};

		this.removeClassById = function(classId, userId) {
			return firebase.database().ref('user/' + userId + "/classes/" + classId).remove().then(function() {
				console.log("Remove succeeded.");
			});
		};

		this.addClass = function(userClass, userId) {
			var classId = userClass.codigo_materia + userClass.turma;
			firebase.database().ref('user/'+ userId + "/classes").push().set({
				id: classId
			});
			firebase.database().ref('class/' + classId).update(userClass);
		};

	}

})();

/* FILE: mobile/assets/js/controllers/ClassController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('ClassController', ['$scope', '$routeParams', '$location', 'Class', 'Image', ClassController]);

function ClassController($scope, $routeParams, $location, Class, Image) {
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

  $scope.class = {};
  $scope.showDate = function(time){
    return moment(time).format("DD/MM/YYYY hh:mm");
  };
  Class.getById($routeParams.class).on('value', function(snapshot) {
    $scope.class = snapshot.val();
    Object.keys($scope.class.images || {}).forEach(function(imageKey) {
      var image = $scope.class.images[imageKey];
      image.key = imageKey;
      Image.getImage($routeParams.class, image.id)
        .getDownloadURL()
        .then(function(url) {
          image.url = url;
          $scope.safeApply();
        });
    });
    $scope.safeApply();
  });
  $scope.fileChanged = function(e) {
    var imageId = (new Date()).getTime()+'';
    processfile(e.files[0], imageId);
  };
  $scope.gotoImage = function(image) {
    $location.path('photo/' + $routeParams.class + '/' + image.key);
  };

  function processfile(file, imageId) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(event) {
      var blob = new Blob([event.target.result]);
      var blobURL = URL.createObjectURL(blob);
      var image = document.createElement('img');
      image.src = blobURL;
      image.onload = function() {
        Image.getImage($routeParams.class, imageId)
          .put(resize(image))
          .then(function(snapshot) {
            Class.getById($routeParams.class).child('images').push({
              id: imageId,
              owner: {
                id: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName
              },
              description: '',
              isPublic: true
            });
          });
      };
    };
  }

  function resize(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.className = 'ng-hide';
    document.body.appendChild(canvas);
    var quality = 0.10;
    var dataURI = canvas.toDataURL('image/jpeg', quality);
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++)
      array.push(binary.charCodeAt(i));
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpeg'
    });
  }
}
})();


/* FILE: mobile/assets/js/controllers/ClassesListController.js */
(function() {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', '$location', 'Image', 'Class', 'UserService', '$interval', ClassesListController]);

function ClassesListController($scope, $location, Image, Class, UserService, $interval) {
  var self = this;
  $scope.classes = [];
  $scope.shouldShow = {};
  $scope.safeApply = function(fn) {
    if ($scope.$root && !$scope.$root.$$phase) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }
  };

  UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
    var classes = snapshot.val();
    if (classes)
      Object.keys(classes).forEach(function(key) {
        Class.getById(classes[key].id).on('value', function(snapshot) {
          var classe = snapshot.val();
          if (classe) {
            if (checkDay(classe) && checkHoraInicial(classe) && checkHoraFinal(classe)) {
              $scope.actual = classe;
              var inicial = classe.hora_inicial.split(':');
              var inicialTime = new Date();
              inicialTime.setHours(+inicial[0]);
              inicialTime.setMinutes(+inicial[1]);
              var final = classe.hora_final.split(':');
              var finalTime = new Date();
              finalTime.setHours(+final[0]);
              finalTime.setMinutes(+final[1]);
              var now = new Date();
              $scope.percent = ((now - inicialTime) / (finalTime - inicialTime)) * 100;
            }
          }
        });
      });
  });

  function checkDay(classe) {
    var days = {
      Dom: 0,
      Seg: 1,
      Ter: 2,
      Qua: 3,
      Qui: 4,
      Sex: 5,
      Sab: 6
    };
    return classe.dia_semana.split('-').some(function(day) {
      return days[day] == (new Date()).getDay();
    });
  }
  function checkHoraInicial(classe) {
    var turn = classe.hora_inicial.split(':');
    var now = new Date();
    if (+turn[0] < now.getHours())
      return true;
    return +turn[0] == now.getHours() && +turn[1] < now.getMinutes();
  }
  function checkHoraFinal(classe) {
    var turn = classe.hora_final.split(':');
    var now = new Date();
    if (+turn[0] > now.getHours())
      return true;
    return +turn[0] == now.getHours() && +turn[1] > now.getMinutes();
  }

  $scope.$on('$destroy', function() {
    $interval.cancel(stop);
  });

  function findClasse(item) {
    return $scope.classes.find(function(classe) {
      return (classe.id == item.id);
    });
  }

  var setMessage = function() {
    var message;
    if ($scope.classes.length === 0) {
      message = "Adicionar novas disciplinas";
    } else {
      message = "Editar disciplinas cadastradas";
    }
    $scope.addClassButtonLabel = message;
  };


  $scope.uploadPhoto = function(e) {
    var imageId = (new Date()).getTime()+'';
    processfile(e.files[0], imageId);
  };

  function processfile(file, imageId) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(event) {
      var blob = new Blob([event.target.result]);
      var blobURL = URL.createObjectURL(blob);
      var image = document.createElement('img');
      image.src = blobURL;
      image.onload = function() {
        Image.getImage($scope.actual.id, imageId)
          .put(resize(image))
          .then(function(snapshot) {
            Class.getById($scope.actual.id).child('images').push({
              id: imageId,
              owner: {
                id: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName
              },
              description: '',
              isPublic: true
            });
          });
      };
    };
  }

  function resize(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.className = 'ng-hide';
    document.body.appendChild(canvas);
    var quality = 0.10;
    var dataURI = canvas.toDataURL('image/jpeg', quality);
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++)
      array.push(binary.charCodeAt(i));
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpeg'
    });
  }

  $scope.addNewClassClick = function() {
    $location.path("/selectClasses");
  };

  this.countMemberClass = function countMemberClass(group) {
    var groupCount = group.members ? group.members.length : 0;
    var message = groupCount + (groupCount > 1 ? ' members' : ' member');
    return message;
  };

  this.addClasses = function addClasses() {
    $location.path('/createGroup');
  };

  this.openClass = function openClass(group) {
    $location.path('class/' + group.id);
  };


  function buildSampleGroups() {
    UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
      var classIds = snapshot.val();
      $scope.classes = [];
      if (classIds) {
        Object.keys(classIds).forEach(function(key) {
          Class.getById(classIds[key].id).on('value', function(snapshot) {
            var classe = snapshot.val();
            if (classe) {
              classe.key = key;
              if (!findClasse(classe)) {
                $scope.classes.push(classe);
                setMessage();
              }
            }
            $scope.safeApply();
          });
        });
      }
    });
  }

  buildSampleGroups();
  setMessage();
}
})();


/* FILE: mobile/assets/js/controllers/ClassesSelectController.js */
(function() {

	var app = angular.module("ClassPictures");

	app.controller('ClassesSelectController', ['$scope', 'UserService', 'Class', '$location', ClassesSelectController]);

	function ClassesSelectController($scope, UserService, Class, $location) {
		var self = this;
		$scope.safeApply = function(fn) {
			if ($scope.$root && !$scope.$root.$$phase) {
			var phase = this.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		}
		};
		$scope.allClasses = window.allClasses;
		$scope.safeApply();
		$scope.selectedClasses = [];
		

		UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
			var classIds = snapshot.val();
			$scope.selectedClasses = [];
			if (classIds) {
				Object.keys(classIds).forEach(function(key) {
					Class.getById(classIds[key].id).on('value', function(snapshot) {
						var classe = snapshot.val();
						if (classe) {
							classe.key = key;
							if (!findClasse(classe)) {
								$scope.selectedClasses.push(classe);
							}
						}
						$scope.safeApply();
					});
				});
			}
		});

		function uniqBy(a) {
			var seen = {};
			return a.filter(function(item) {
				var k = item.id;
				return seen.hasOwnProperty(k) ? false : (seen[k] = true);
			});
		}

		$scope.$watch(function() {
			$scope.selectedClasses = uniqBy($scope.selectedClasses);
			return false;
		});
		// "name": "PROBABILIDADE",
		// "codigo_materia": "EST032",
		// "turma": "TM2",
		// "hora_inicial": "13:00",
		// "hora_final": "14:40",
		// "dia_semana": "Ter-Qui",
		// "nome_sala": "1014"

		self.backToClassesList = function() {
			$location.path('/classesList');
		};


		self.simulateQuery = false;
		self.isDisabled = false;
		self.redirect = function(classe){
			if(classe){
				$location.path('class/'+classe.id);
			}
		}
		self.querySearch = querySearch;
		self.selectedItemChange = selectedItemChange;
		self.removeSelection = function(classe) {
			UserService.removeClassById(classe.key, firebase.auth().currentUser.uid);
			$scope.selectedClasses = $scope.selectedClasses.filter(function(each) {
				return each.id != classe.id;
			});
			//$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe), 1);
		};

		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function findClasse(item) {
			return $scope.selectedClasses.find(function(classe) {
				return (classe.id == item.id);
			});
		}

		function selectedItemChange(item) {
			if (item) {
				if (!findClasse(item)) {
					UserService.addClass(item, firebase.auth().currentUser.uid);
					$scope.selectedClasses.push(item);
				}
        	var el = document.querySelector('#input-5');
        		if(el){

        			el.blur();
        		}
				$scope.searchText = "";
				$scope.safeApply();
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
(function() {

	var app = angular.module('ClassPictures');

	app.controller('LoginController', ['$scope', '$location', 'Class', LoginController]);

	function LoginController($scope, $location, Class) {

		var user;
		var isToLogin = true;
		var userToken;
		var self = this;
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');

		Class.getAllClasses().then(function(requestData) {
			window.allClasses = requestData.data.records.map(function(each) {
				each.id = each.codigo_materia + each.turma;
				return each;
			});
		});

		$scope.loginWithGoogleClick = function() {
			if (!firebase.auth().currentUser) {
				firebase.auth().signInWithRedirect(provider);
			} else {
				$location.path('/classesList');
			}
			if ($scope.$root && !$scope.$root.$$phase) {
				var phase = $scope.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					$scope.$apply(fn);
				}
			}
		};
	}

})();

/* FILE: mobile/assets/js/controllers/PhotoController.js */
(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', '$location', '$routeParams', 'Image', 'Class', PhotoController]);

function PhotoController($scope, $location, $routeParams, Image, Class) {
    $scope.image = {};

    //FOR NARNIA
    $scope.safeApply = function(fn) {
            if ($scope.$root && !$scope.$root.$$phase) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        }
        };

    var metaData = Image.getImageMetadata($routeParams.classId, $routeParams.imageId);
    var storage = null;

    Class.getById($routeParams.classId).on('value', function(snapshot) {
        $scope.class = snapshot.val();
        $scope.safeApply();
    });

    metaData.on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date(+$scope.image.id).toLocaleString();
        $scope.image.title = $scope.image.owner.name + ': ' + $scope.image.date;
        $scope.safeApply();
	    storage = Image.getImage($routeParams.classId, $scope.image.id);
        storage.getDownloadURL().then(function(URL) {
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

    $scope.delete = function () {
        metaData.remove().then(function() {
            storage.delete().then(function() {
                $location.path('class/' + $routeParams.classId);
                $scope.safeApply();
            }).catch(function(error) {
                console.log("Image deletion failed: " + error.message);
            });
        }).catch(function(error) {
            console.log("Metadata removal failed: " + error.message);
        });
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

	this.homeButtonClick = function(){
		$location.path("/classesList");
		$mdSidenav('left').toggle();
	};

	this.editButtonClick = function(){
		$location.path("/selectClasses");
		$mdSidenav('left').toggle();
	};

	function buildLeftNavSettings () {
		$scope.settings = [
			{
				settingName: "Início",
				iconPath: "assets/images/icons/ic_home_black_24px.svg",
				onClickMethod: self.homeButtonClick,
				isCheckbox : false,
				checked : true
			},
			{
				settingName: "Editar minhas disciplinas",
				iconPath: "assets/images/icons/ic_border_color_black_24px.svg",
				onClickMethod: self.editButtonClick,
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