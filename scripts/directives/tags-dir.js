(function(){
  var tagModule = angular.module('box.tasks');
  
  tagModule.directive('tags', function() {
    return {
      templateUrl: 'templates/tags.html',
      restrict: 'E'
    };
  });
  
})();
