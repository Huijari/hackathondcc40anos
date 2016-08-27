(function () {

var app = angular.module('ClassPictures');

app.factory('Class', [ClassFactory]);

function ClassFactory() {
  var service = {};

  service.getById = function(id) {
    return firebase.database().ref('class/' + id);
  };

  return service;
}
})();
