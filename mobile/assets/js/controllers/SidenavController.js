(function () {

var app = angular.module("ClassPictures");

app.controller("SidenavController", ["$scope", "$location", "$mdSidenav", function($scope, $location, $mdSidenav){
	
	var self = this;
	
	this.openSideMenu = function openSideMenu(){
		$mdSidenav('left').toggle();
	};

	this.setUserInfo = function setUserInfo(){
		var user = firebase.auth().currentUser || {};
		$scope.userName = user.displayName;
		$scope.userProfileImage = user.photoURL;
		$scope.userEmail = user.email;
	};

	this.logOut = function logOut(){
		firebase.auth().signOut().then(function(){
			$location.path("/");
		});
	};

	this.homeButtonClick = function(){
		$location.path("/classesList");
		$mdSidenav('left').toggle();
	};

	this.editButtonClick = function(){
		$location.path("/selectClasses");
		$mdSidenav('left').toggle();
	};

	function buildLeftNavSettings () {
		$scope.settings = [
			{
				settingName: "Início",
				iconPath: "assets/images/icons/ic_home_black_24px.svg",
				onClickMethod: self.homeButtonClick,
				isCheckbox : false,
				checked : true
			},
			{
				settingName: "Editar minhas disciplinas",
				iconPath: "assets/images/icons/ic_border_color_black_24px.svg",
				onClickMethod: self.editButtonClick,
				isCheckbox : false,
				checked : false
			},
			{
				settingName: "Logout",
				iconPath: "assets/images/icons/ic_exit_to_app_black_24px.svg",
				onClickMethod: self.logOut,
				isCheckbox : false,
				checked : false
			}

		];
	}

	buildLeftNavSettings();
	this.setUserInfo();
}]);

})();