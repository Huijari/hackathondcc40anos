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