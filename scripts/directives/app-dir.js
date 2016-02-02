(function(){
  var aModule = angular.module('box');
  
  aModule.directive('topBar', function() {
    return {
      templateUrl: 'templates/top-bar.html',
      restrict: 'E'
    };
  });
  
})();
