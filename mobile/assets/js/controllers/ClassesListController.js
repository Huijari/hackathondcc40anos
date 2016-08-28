(function() {

	var app = angular.module('ClassPictures');

	app.controller('ClassesListController', ['$scope', 'UserService', 'Class', '$location','$interval', ClassesListController]);

	function ClassesListController($scope, UserService, Class, $location, $intervaç) {
		moment.updateLocale("pt-br");
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
		$scope.percent;
		var stop = $interval(function(){
			$scope.classes.forEach(function(classe){
				var now = moment(new Date();
				//var today = now.format("dddd").toLowerCase();
				//var dias = classe.dia_semana.toLowerCase().split('-');
				var inicial = classe.hora_inicial.substring(0,2) * 60 + parseInt(classe.hora_inicial.substring(3,5),10);
				var final = classe.hora_final.substring(0,2)) * 60 + parseInt(classe.hora_final.substring(3,5),10);
				var hNow = now.getHours() * 60 + now.getMinutes();
				var diff = final - inicial;
				if(hNow <= final && hNow >= inicial){
					$scope.percent = hNow/diff *100;
				}
				//if(){
				//	if()$scope.shouldShow[classe]= should;
				//}
			});
		},500);

		$scope.on('$destroy', function() {
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