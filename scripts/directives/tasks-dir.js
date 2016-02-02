(function(){
  var tModule = angular.module('box.tasks');
  
  tModule.directive('inlineTags', function() {
    return {
      templateUrl: 'templates/inline-tags.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('tasks', function() {
    return {
      templateUrl: 'templates/tasks.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('controls', function() {
    return {
      templateUrl: 'templates/controls.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('newButton', function() {
    return {
      templateUrl: 'templates/new-button.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('undo', function() {
    return {
      templateUrl: 'templates/undo.html',
      restrict: 'E'
    };
  });
})();
