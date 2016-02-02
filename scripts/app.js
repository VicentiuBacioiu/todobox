(function () {
  var tdb = angular.module('box', ['box.tasks', 'box.tags']);
  
  tdb.controller('AppController', function appController($scope) {
    $scope.panelActive = true;
    
    this.filterUpdate = function(event) {
      if(event.which === 27){
        $scope.searchText = '';
      }
      $scope.$broadcast('filterUpdate', $scope.searchText);
    };
    
    this.togglePanel = function () {
      $scope.panelActive = !$scope.panelActive;
      $scope.mobileHidden = false;
    };
  });
})();