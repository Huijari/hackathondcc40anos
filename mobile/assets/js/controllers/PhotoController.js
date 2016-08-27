(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', '$routeParams', 'Image', PhotoController]);

function PhotoController($scope, $routeParams, Image) {
    $scope.image = {};

    Image.getImage($routeParams.classId, $routeParams.imageId).then(function(URL) {
      $scope.image.path = URL;
      Image.getImageMetadata($routeParams.classId, $routeParams.imageId).on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date($scope.image.timestamp*1000).toLocaleString();
        $scope.$apply();
      });
    });
}
})();