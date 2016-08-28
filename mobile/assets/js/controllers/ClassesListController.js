(function() {

	var app = angular.module('ClassPictures');

	app.controller('ClassesListController', ['$scope', '$location', 'Image', 'Class', 'UserService', '$interval', ClassesListController]);

	function ClassesListController($scope, $location, Image, Class, UserService, $interval) {
		var self = this;
		$scope.classes = [];
		$scope.shouldShow = {};
		$scope.safeApply = function(fn) {
			if ($scope.$root && !$scope.$root.$$phase) {
				var phase = this.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					this.$apply(fn);
				}
			}
		};
		var dias = {
			Dom: 0,
			Seg: 1,
			Ter: 2,
			Qua: 3,
			Qui: 4,
			Sex: 5,
			Sab: 6
		};

		$scope.percent = 0;
		var stop = $interval(function() {
			$scope.classes.forEach(function(classe) {
				var now = new Date();
				var dia_semana = (classe.dia_semana.indexOf('-') == -1) ? [classe.dia_semana] : classe.dia_semana.split('-');
				dia_semana.forEach(function(dia) {
					if (dias[dia] == moment().day() && moment({
						hour: classe.hora_inicial.split(':')[0],
						minute: classe.hora_inicial.split(':')[1]
					}) <= moment() && moment() <= moment({
						hour: classe.hora_final.split(':')[0],
						minute: classe.hora_final.split(':')[1]
					})) {
						var inicial = classe.hora_inicial.substring(0, 2) * 60 + parseInt(classe.hora_inicial.substring(3, 5), 10);
						var final = classe.hora_final.substring(0, 2) * 60 + parseInt(classe.hora_final.substring(3, 5), 10);
				var hNow = now.getHours() * 60 + now.getMinutes();
				var diff = final - inicial;
				if (hNow <= final && hNow >= inicial) {
					$scope.shouldShow = classe.id;
					$scope.percent = hNow / diff * 100;
				}
			}
		});
		});
	},
	500);

$scope.$on('$destroy', function() {
	$interval.cancel(stop);
});

function findClasse(item) {
	return $scope.classes.find(function(classe) {
		return (classe.id == item.id);
	});
}

var setMessage = function() {
	var message;
	if ($scope.classes.length === 0) {
		message = "Adicionar novas disciplinas";
	} else {
		message = "Editar disciplinas cadastradas";
	}
	$scope.addClassButtonLabel = message;
};

$scope.checkUploadByDate = function() {
	UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
		var classes = snapshot.val();
		if (classes) {
			Object.keys(classes).forEach(function(key) {
				Class.getById(classes[key].id).on('value', function(snapshot) {
					var classe = snapshot.val();
					if (classe) {
						var dia_semana = (classe.dia_semana.indexOf('-') == -1) ? [classe.dia_semana] : classe.dia_semana.split('-');
						dia_semana.forEach(function(dia) {
							if (dias[dia] == moment().day() && moment({
								hour: hora_inicial.split(':')[0],
								minute: hora_inicial.split(':')[1]
							}) <= moment() && moment() <= moment({
								hour: hora_final.split(':')[0],
								minute: hora_final.split(':')[1]
							})) {
								$scope.currentClass = classe.id;
								return true;
							}
						});
					}
				});
			});
		}
		return false;
	});
};

$scope.uploadPhoto = function(e) {
	var imageId = (new Date()).getTime() + '';
	Image.getImage($scope.currentClass, imageId).put(e.files[0]);
	Class.getById($scope.currentClass).child('images').push({
		id: imageId,
		owner: {
			id: firebase.auth().currentUser.uid,
			name: firebase.auth().currentUser.displayName
		},
		description: '',
		isPublic: true
	});
};

$scope.addNewClassClick = function() {
	$location.path("/selectClasses");
};

this.countMemberClass = function countMemberClass(group) {
	var groupCount = group.members ? group.members.length : 0;
	var message = groupCount + (groupCount > 1 ? ' members' : ' member');
	return message;
};

this.addClasses = function addClasses() {
	$location.path('/createGroup');
};

this.openClass = function openClass(group) {
	$location.path('class/' + group.id);
};


function buildSampleGroups() {
	UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
		var classIds = snapshot.val();
		$scope.classes = [];
		if (classIds) {
			Object.keys(classIds).forEach(function(key) {
				Class.getById(classIds[key].id).on('value', function(snapshot) {
					var classe = snapshot.val();
					if (classe) {
						classe.key = key;
						if (!findClasse(classe)) {
							$scope.classes.push(classe);
							setMessage();
						}
					}
					$scope.safeApply();
				});
			});
		}
	});
}

buildSampleGroups();
setMessage();

}

})();
