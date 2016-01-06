(function () {
  var tModule = angular.module('box.tasks', ['boxtags']);

  tModule.value('taskList', [{
    title: 'Task 1',
    content: 'Task Content 1',
    tags: ['Personal']
  }, {
    title: 'Task 2',
    content: 'Task Content 2',
    tags: ['Personal', 'Important']
  }, {
    title: 'Task 3',
    content: 'Task Content 3',
    tags: ['Work']
  }]);

  tModule.controller('TaskController', function taskController($scope, taskList, tagValue) {
    $scope.tasks = taskList;
    this.hasTag = function (task) {
      return !tagValue.active || task.tags.indexOf(tagValue.active) !== -1;
    };
  });
})();