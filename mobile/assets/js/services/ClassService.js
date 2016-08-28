(function () {

var app = angular.module('ClassPictures');

app.factory('ClassService', ['$http', ClassFactory]);

function ClassFactory($http) {
  var service = {};
  service.getAllClasses = function(){
  	return $http.get("https://crossorigin.me/http://www.icex.ufmg.br/minhasala/recupera_salas.php");
  };
  
  service.getById = function(id) {
    return firebase.database().ref('class/' + id);
  };

  return service;
}
})();
