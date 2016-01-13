(function () {
  var tdb = angular.module('box', ['box.tasks']);

  tdb.controller('AppController', function appController($scope) {
    $scope.panelActive = true;
    
    this.togglePanel = function () {
      $scope.panelActive = !$scope.panelActive;
      $scope.mobileHidden = false;
    };
  });
})();