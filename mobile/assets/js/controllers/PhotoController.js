(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', '$routeParams', 'Image', PhotoController]);

function PhotoController($scope, $routeParams, Image) {
    $scope.image = {};

    Image.getImageMetadata($routeParams.classId, $routeParams.imageId).on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date($scope.image.id).toLocaleString();
        $scope.image.title = $scope.image.owner + ': ' + $scope.image.date;
        $scope.$apply();
	    Image.getImage($routeParams.classId, $scope.image.id).getDownloadURL().then(function(URL) {
	        $scope.image.path = URL;
	    });
    });
}
})();