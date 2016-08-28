(function() {

	var app = angular.module('ClassPictures');

	app.controller('ClassesListController', ['$scope', 'UserService', 'Class', '$location', ClassesListController]);

	function ClassesListController($scope, UserService, Class, $location) {
		var self = this;
		$scope.classes = [];
		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

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