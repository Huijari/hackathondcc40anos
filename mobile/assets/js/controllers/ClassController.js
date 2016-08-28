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
