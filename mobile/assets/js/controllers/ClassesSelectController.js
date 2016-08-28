(function() {

	var app = angular.module("ClassPictures");

	app.controller('ClassesSelectController', ['$scope', 'UserService', 'Class', '$location', ClassesSelectController]);

	function ClassesSelectController($scope, UserService, Class, $location) {
		var self = this;
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
		$scope.allClasse = [];
		Class.getAllClasses().then(function(requestData) {
			$scope.allClasses = requestData.data.records.map(function(each) {
				each.id = each.codigo_materia + each.turma;
				return each;
			});

		});

		UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
			var classIds = snapshot.val();
			$scope.selectedClasses = [];
			if (classIds) {
				Object.keys(classIds).forEach(function(key) {
					Class.getById(classIds[key].id).on('value', function(snapshot) {
						var classe = snapshot.val();
						if (classe) {
							classe.key = key;
							if (!findClasse(classe)) {
								$scope.selectedClasses.push(classe);
							}
						}
						$scope.safeApply();
					});
				});
			}
		});

		function uniqBy(a) {
			var seen = {};
			return a.filter(function(item) {
				var k = item.id;
				return seen.hasOwnProperty(k) ? false : (seen[k] = true);
			})
		}

		$scope.$watch(function() {
			$scope.selectedClasses = uniqBy($scope.selectedClasses);
			return false;
		});
		// "nome_materia": "PROBABILIDADE",
		// "codigo_materia": "EST032",
		// "turma": "TM2",
		// "hora_inicial": "13:00",
		// "hora_final": "14:40",
		// "dia_semana": "Ter-Qui",
		// "nome_sala": "1014"

		self.backToClassesList = function() {
			$location.path('/classesList');
		};

		$scope.selectedClasses = [];

		self.simulateQuery = false;
		self.isDisabled = false;

		self.querySearch = querySearch;
		self.selectedItemChange = selectedItemChange;
		self.removeSelection = function(classe) {
			UserService.removeClassById(classe.key, firebase.auth().currentUser.uid);
			$scope.selectedClasses = $scope.selectedClasses.filter(function(each) {
				return each.id != classe.id;
			});
			//$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe), 1);
		};

		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function findClasse(item) {
			return $scope.selectedClasses.find(function(classe) {
				return (classe.id == item.id);
			});
		}

		function selectedItemChange(item) {
			if (item) {
				if (!findClasse(item)) {
					UserService.addClass(item, firebase.auth().currentUser.uid);
					$scope.selectedClasses.push(item);
				}
			}
		}

		/**
		 * Create filter function for a query string
		 */
		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			var words = lowercaseQuery.split(" ");
			return function filterFn(classe) {
				var a = words.every(function(word) {
					var b = Object.keys(classe).some(function(prop) {
						return ~angular.lowercase(classe[prop]).indexOf(word);
					});
					return b;
				});
				return a;
			};
		}
	}


})();