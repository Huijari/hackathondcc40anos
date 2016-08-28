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
    var storage = null;

    Class.getById($routeParams.classId).on('value', function(snapshot) {
        $scope.class = snapshot.val();
        $scope.safeApply();
    });

    metaData.on('value', function(snapshot) {
        $scope.image = snapshot.val();
        $scope.image.date = new Date($scope.image.id).toLocaleString();
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
            storage.delete().catch(function(error) {
                console.log("Image deletion failed: " + error.message);
            });
        }).catch(function(error) {
            console.log("Metadata removal failed: " + error.message);
        });
    };
}
})();