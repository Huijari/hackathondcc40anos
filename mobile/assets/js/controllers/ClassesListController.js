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
