(function(){
  var tagModule = angular.module('box.tags');
  
  tagModule.directive('tags', function() {
    return {
      templateUrl: 'templates/tags.html',
      restrict: 'E'
    };
  });
  
})();
