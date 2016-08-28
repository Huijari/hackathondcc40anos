(function () {

var app = angular.module('ClassPictures');

app.controller('ClassController', ['$scope', '$routeParams', 'Class', 'Image', ClassController]);

function ClassController($scope, $routeParams, Class, Image) {
  $scope.class = {};
  Class.getById($routeParams.class).on('value', function(snapshot) {
    $scope.class = snapshot.val();
    Object.keys($scope.class.images).forEach(function(imageKey) {
      var image = $scope.class.images[imageKey];
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
      .put(e.files[0]);
    Class.getById($routeParams.class).child('images').push({
      id: imageId,
      owner: {
        id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName
      },
      description: '',
      isPublic: true
    });
  };
}
})();
