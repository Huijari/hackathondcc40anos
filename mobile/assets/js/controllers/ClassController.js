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
    var quality = 0.2;
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
