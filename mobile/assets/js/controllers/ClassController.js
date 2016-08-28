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
            owner: {
              id: firebase.auth().currentUser.id,
              name: firebase.auth().currentUser.displayName
            },
            description: '',
            isPublic: true
          });
        });
      });
  };
}
})();
