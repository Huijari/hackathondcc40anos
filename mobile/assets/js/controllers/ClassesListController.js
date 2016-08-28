(function () {

var app = angular.module('ClassPictures');

app.controller('ClassesListController', ['$scope', '$location', 'Image', 'Class', 'UserService', ClassesListController]);

function ClassesListController($scope, $location, Image, Class, UserService) {
	
	var setMessage = function(){
		var message;
		if($scope.classes.length === 0){
			message = "Adicionar novas disciplinas";
		} else {
			message = "Editar disciplinas cadastradas";
		}
		$scope.addClassButtonLabel = message;
	};

	$scope.addNewClassClick = function(){
		$location.path("/selectClasses");
	};

	$scope.checkUploadByDate = function() {
		UserService.getUserClasses(firebase.auth().currentUser.uid).on('value', function(snapshot) {
			var classes = snapshot.val();
			var dias = {Dom: 0, Seg: 1, Ter: 2, Qua: 3, Qui: 4, Sex: 5, Sab: 6};
			if (classes) {
				Object.keys(classes).forEach(function(key) {
					Class.getById(classes[key].id).on('value', function(snapshot) {
						var classe = snapshot.val();
						if(classe) {
							classe.dia_semana = (classe.dia_semana.indexOf('-') == -1)? [classe.dia_semana] : classe.dia_semana.split('-');
							classe.dia_semana.forEach(function(dia) {
								if(dias[dia] == moment().day() && moment({hour: hora_inicial.split(':')[0], minute: hora_inicial.split(':')[1]}) <= moment() && moment() <= moment({hour: hora_final.split(':')[0], minute: hora_final.split(':')[1]})) {
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
	    var imageId = (new Date()).getTime()+'';
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
	setMessage();

}

})();

