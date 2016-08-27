(function () {

var app = angular.module("ClassPictures");

app.controller("SidenavController", ["$scope", "$mdSidenav", function($scope, $mdSidenav){
	this.openSideMenu = function(){
		$mdSidenav('left').toggle();
	};
}]);

})();