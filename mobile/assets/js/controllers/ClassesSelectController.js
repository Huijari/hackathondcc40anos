(function() {

	var app = angular.module("ClassPictures");
	app.controller('ClassesSelectController', ['$scope', ClassesSelectController]);

	function ClassesSelectController($scope, $timeout, $q, $log) {
		var self = this;
		$scope.allClasses = [{
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TM2",
			"hora_inicial": "13:00",
			"hora_final": "14:40",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1014"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TB1",
			"hora_inicial": "09:25",
			"hora_final": "11:05",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TE",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Ter",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TE",
			"hora_inicial": "20:55",
			"hora_final": "22:35",
			"dia_semana": "Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "ESTATISTICA E PROBABILIDADES",
			"codigo_materia": "EST031",
			"turma": "TW",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Seg-Qua",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TE",
			"hora_inicial": "20:55",
			"hora_final": "22:35",
			"dia_semana": "Ter",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TE",
			"hora_inicial": "19:00",
			"hora_final": "20:40",
			"dia_semana": "Qui",
			"nome_sala": "1015"
		}, {
			"nome_materia": "PROBABILIDADE",
			"codigo_materia": "EST032",
			"turma": "TM1",
			"hora_inicial": "13:00",
			"hora_final": "14:40",
			"dia_semana": "Ter-Qui",
			"nome_sala": "1015"
		}];

		$scope.selectedClasses = [];

		self.simulateQuery = false;
		self.isDisabled = false;

		self.querySearch = querySearch;
		self.selectedItemChange = selectedItemChange;
		function querySearch(query) {
			var results = query ? $scope.allClasses.filter(createFilterFor(query)) : $scope.allClasses;
			return results;
		}

		function selectedItemChange(item) {
			if (item) {
				if (! $scope.selectedClasses.find(function(classe) {
						return (classe.codigo_materia == item.codigo_materia) && (classe.turma == item.turma);
					})) {
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
