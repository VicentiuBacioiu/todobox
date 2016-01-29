(function () {
  var tModule = angular.module('box.tasks', ['box.storage', 'box.tasks.factory', 'box.tags']);
  
  var toggleClassWithDelay = function (elem, clsName, timeout) {
    elem.addClass(clsName);
    setTimeout(function () {
      elem.removeClass(clsName);
    }, timeout);
  };
  
  tModule.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });
  
  tModule.directive('inlineTags', function() {
    return {
      templateUrl: '../templates/inline-tags.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('tasks', function() {
    return {
      templateUrl: '../templates/tasks.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('controls', function() {
    return {
      templateUrl: '../templates/controls.html',
      restrict: 'E'
    };
  });
  
  tModule.directive('newButton', function() {
    return {
      templateUrl: '../templates/new-button.html',
      restrict: 'E'
    };
  });
  
  tModule.controller('TaskController', ['$scope', '$rootScope', '$filter', 'store', 'createTask', 'activeTag', function taskController($scope, $rootScope, $filter, store, createTask, activeTag) {
    var separatorKeys = [9, 13, 186, 188]; //Tab, Enter, Semicolumn, Column
    $scope.tasks = store.getTasks();
    this.newTag = '';
    
    this.addTag = function (event, task) {
      if ((event && (separatorKeys.indexOf(event.which) === -1 || event.shiftKey)) || !this.newTag.length) {
        return;
      }
      
      var newTagEl = $('#' + task.id + " .tdb-newtag");
      if (task.addTag($filter('capitalize')(this.newTag))) {
        this.newTag = '';
        } else {
        toggleClassWithDelay(newTagEl, 'shake', 500);
      }
      
      if(event){
        event.preventDefault();
      }
    };
    
    this.remove = function (task) {
      for (var i = $scope.tasks.length - 1; i >= 0; i--) {
        if ($scope.tasks[i].id === task.id) {
          $scope.tasks.splice(i, 1);
          $rootScope.$broadcast('update', $scope.tasks);
          return;
        }
      }
    };
    
    this.discardChanges = function (task) {
      if (task.isNew) {
        this.remove(task);
        } else {
        task.discardChanges();
      }
    };
    
    this.saveChanges = function (task) {
      this.addTag(null, task);
      task.saveChanges();
      $rootScope.$broadcast('update', $scope.tasks);
    };
    
    this.updateTasks = function () {
      store.setTasks($scope.tasks);
    };
    
    this.addTask = function () {
      var newTask = createTask({
        title : 'New task',
        content : 'Task content goes here',
        tags : activeTag.isDefault() ? [] : [activeTag.get()],
        isNew : true
      }),
      sEdit = this.startEdit;
      
      $scope.tasks.push(newTask);
      $rootScope.$broadcast('update', $scope.tasks);
      setTimeout(function () {
        $('#' + newTask.id + ' .list-group-item-header').select();
      }, 0);
    };
    
    $rootScope.$on('update', this.updateTasks);
  }
  ]);
})();
