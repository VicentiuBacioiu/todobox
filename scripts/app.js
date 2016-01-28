(function () {
  var tdb = angular.module('box', ['box.tasks', 'box.tags']);
  
  tdb.directive('topBar', function() {
    return {
      templateUrl: '../templates/top-bar.html',
      restrict: 'E'
    };
  });
  
  tdb.controller('AppController', function appController($scope) {
    $scope.panelActive = true;
    
    this.filterUpdate = function(text) {
      if(event.keyCode==8){
        //clear search box on ESC
      }
      $scope.$broadcast('filterUpdate', text);
    };
    
    this.togglePanel = function () {
      $scope.panelActive = !$scope.panelActive;
      $scope.mobileHidden = false;
    };
  });
})();