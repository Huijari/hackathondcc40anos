(function () {

var app = angular.module('ClassPictures');

app.controller('PhotoController', ['$scope', PhotoController]);

function PhotoController($scope) {
    $scope.image = {};
    $scope.image.path = 'http://lorempixel.com/420/420/';
    $scope.image.timestamp = "1472322628";
    $scope.image.owner = "Faboiola";
    $scope.image.isPublic = false;
    $scope.image.alt = "TESTE";
    $scope.image.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}
})();