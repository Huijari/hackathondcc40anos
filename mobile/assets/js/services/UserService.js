(function () {

var app = angular.module('ClassPictures');

app.service('UserService', [UserService]);

function UserService() {

	var openedGroup;

	this.setOpenedGroup= function(group){
		openedGroup = group;
	};

	this.getOpenedGroup = function(){
		return openedGroup; 
	};
}

})();