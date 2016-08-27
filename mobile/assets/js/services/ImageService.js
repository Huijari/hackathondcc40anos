(function () {

var app = angular.module('ClassPictures');

app.factory('Image', [ImageFactory]);

function ImageFactory() {
  var service = {};

  service.getByClass = function(id) {
    return firebase.storage().ref(id);
  };

  service.getImage = function(classId, imageId) {
    return service.getByClass(classId).child(imageId).getDownloadURL();
  };

  service.getImageMetadata = function(classId, imageId) {
    return firebase.database().ref(classId+'/images/'+imageId-1);
  };

  return service;
}
})();
