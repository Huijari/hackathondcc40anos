(function () {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', '$location', ClassesListController]);

function ClassesListController($scope, $location) {

	$scope.addClassButtonLabel = "Editar disciplinas cadastradas";

	$scope.addNewClassClick = function(){
		$location.path("/selectClasses");
	};

	this.countMemberClass = function countMemberClass(group) {
		var groupCount = group.members? group.members.length : 0;
		var message = groupCount + (groupCount > 1 ? ' members' : ' member');
		return message;
	};

	this.addClasses = function addClasses() {
		$location.path('/createGroup');
	};

	this.openClass = function openClass(group){
    	$location.path('class/' + group.id);
	};

	function buildSampleGroups() {
		$scope.classes = [
			{
				id: 'EST032TM2',
				name: 'Calculo Diferencial Integral III',
				imagePath: 'https://unsplash.it/80/80/'
			},
			{
				id: 2,
				name: 'Fundamentos de Mecânia dos sólidos e Fluidos',
				imagePath: 'https://unsplash.it/70/70/'
			},
			{
				id: 3,
				name: 'Equaçoes Diferencias A',
				lastPosition: 'Favelinha loka',
				members: [1, 2],
				imagePath: 'https://unsplash.it/90/90/'
			},
			{
				id: 5,
				name: 'Análise de circuitos elétricos II',
				lastPosition: 'Teknisa Service',
				members: [1, 2],
				imagePath: 'assets/images/icons/ic_view_headline_white_24px.svg'
			},
			{
				id: 4,
				name: 'Laboratório de Sistemas Digitais',
				lastPosition: 'There is no last position to show',
				members: [1, 2],
				imagePath: 'https://unsplash.it/100/100/'
			}
		];
	}
	buildSampleGroups();

}

})();

