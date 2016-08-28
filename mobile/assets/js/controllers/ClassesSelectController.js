(function() {

	var app = angular.module("ClassPictures");

	app.controller('ClassesSelectController', ['$scope','UserService', 'ClassService', '$location', ClassesSelectController]);

	function ClassesSelectController($scope, UserService, ClassService, $location) {
		var self = this;
		$scope.allClasse = [];
		ClassService.getAllClasses().then(function(requestData){
			$scope.allClasses = requestData.data.records.map(function(each){
				each.id = each.nome_materia + each.turma;
				return each;
			});

		});
		
		$scope.selectedClasses = UserService.getUserClasses();

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
			UserService.removeClassById(classe.codigo_materia + classe.turma, firebase.auth().currentUser);
			$scope.selectedClasses.splice($scope.selectedClasses.indexOf(classe), 1);
		};
		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function selectedItemChange(item) {
			if (item) {
				if (!$scope.selectedClasses.find(function(classe) {
						return (classe.codigo_materia == item.codigo_materia) && (classe.turma == item.turma);
					})) {
					UserService.addClass(item, firebase.auth().currentUser);
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
