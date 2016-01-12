(function () {
  var tModule = angular.module('box.tasks', ['box.tags']);

  tModule.value('taskList', [{
    id: 'task1',
    title: 'Task 1',
    content: 'Task Content 1',
    tags: ['Personal']
  }, {
    id: 'task2',
    title: 'Task 2',
    content: 'Task Content 2',
    tags: ['Personal', 'Important']
  }, {
    id: 'task3',
    title: 'Task 3',
    content: 'Task Content 3',
    tags: ['Work']
  }]);

  tModule.controller('TaskController', function taskController($scope, taskList, tagValue) {
    $scope.tasks = taskList;

    this.hasTag = function (task) {
      return !tagValue.active || task.tags.indexOf(tagValue.active) !== -1;
    };

    this.remove = function (taskId) {
      for (var i = taskList.length - 1; i >= 0; i--) {
        if (taskList[i].id === taskId) {
          taskList.splice(i, 1);
          return;
        }
      }
    };

    this.toggleEdit = function (taskId) {
      var taskItem = $('#' + taskId),
        editableItems = taskItem.find('.list-group-item-header,.list-group-item-text'),
        header = $(editableItems[0]);

      if (taskItem.hasClass('editable')) {
        editableItems.removeAttr('contenteditable');
      } else {
        editableItems.attr('contenteditable', '');
        header.focus();
      }
      taskItem.toggleClass('editable');
    };
  });
})();