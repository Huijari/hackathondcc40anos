(function() {

	var app = angular.module('ClassPictures');

	app.service('UserService', [UserService]);

	function UserService() {

		var userClasses = [];
		var user = {};

		this.getUserClasses = function(userId) {
			return firebase.database().ref("user/" + userId + "/classes");
		};

		this.removeClassById = function(classId, userId) {
			return firebase.database().ref('user/' + userId + "/classes/" + classId).remove().then(function() {
				console.log("Remove succeeded.");
			});
		};

		this.addClass = function(userClass, userId) {
			var classId = userClass.codigo_materia + userClass.turma;
			firebase.database().ref('user/'+ userId + "/classes").push().set({
				id: classId
			});
			firebase.database().ref('class/' + classId).update(userClass);
		};

	}

})();