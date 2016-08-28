(function () {

var app = angular.module('ClassPictures');

app.service('UserService', [UserService]);

function UserService() {

	var userClasses = [];

	this.getUserClasses = function(){
		return userClasses; 
	};

	this.addUserClass = function(userClass){
		userClasses.concat(userClass);
	};
}

})();