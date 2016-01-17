(function () {
  var tModule = angular.module('box.tasks', []);
  var editingTasks = [];
  var activeTag = '';

  tModule.value('taskList', [{
    id: 'task1',
    title: 'Task 1',
    content: 'Task Content 1',
    tags: ['Personal'],
    editable: false,
    done: false
  }, {
    id: 'task2',
    title: 'Task 2',
    content: 'Task Content 2',
    tags: ['Personal', 'Important'],
    editable: false,
    done: false
  }, {
    id: 'task3',
    title: 'Task 3',
    content: 'Task Content 3',
    tags: ['Work'],
    editable: false,
    done: false
  }]);

  var toggleClassWithDelay = function (elem, clsName, timeout) {
    elem.addClass(clsName);
    setTimeout(function () {
      elem.removeClass(clsName);
    }, timeout);
  };

  tModule.controller('TaskController', function taskController($scope, taskList) {
    var getTagList = function () {
      var i,
        tagsList = [],
        allTags = [],
        seen = {};

      for (i = 0; i < taskList.length; i++) {
        allTags = allTags.concat(taskList[i].tags);
      }

      for (i = 0; i < allTags.length; i++) {
        if (seen[allTags[i]] !== 1) {
          seen[allTags[i]] = 1;
          tagsList.push(allTags[i]);
        }
      }

      return tagsList;
    };

    $scope.tasks = taskList;
    $scope.tags = getTagList();
    this.newTag = '';

    this.setActiveTag = function (tag) {
      activeTag = tag;
    };

    this.isActiveTag = function (tag) {
      return activeTag === tag;
    };

    this.hasTag = function (task) {
      return !activeTag || task.tags.indexOf(activeTag) !== -1;
    };

    this.remove = function (taskId) {
      for (var i = taskList.length - 1; i >= 0; i--) {
        if (taskList[i].id === taskId) {
          taskList.splice(i, 1);
          $scope.tags = getTagList();
          return;
        }
      }
    };

    this.startEdit = function (task) {
      editingTasks[task.id] = angular.copy(task);
      task.editable = true;
      $('#' + task.id + ' .list-group-item-header').focus();
    };

    this.saveChanges = function (task) {
      task.editable = false;
      if (task.isNew) {
        delete task.isNew;
      }
      $scope.tags = getTagList();
    };

    this.cancelEdit = function (task) {
      if (task.isNew) {
        this.remove(task.id);
        return;
      }

      var oldTask = editingTasks[task.id];
      task.title = oldTask.title;
      task.content = oldTask.content;
      task.tags = oldTask.tags;
      task.editable = false;
    };

    this.removeTag = function (task, tag) {
      task.tags.splice(task.tags.indexOf(tag), 1);
    };

    this.addTag = function (task) {
      var newTagEl = $('#' + task.id + " .tdb-newtag");
      if (event.keyCode === 13) {
        if (task.tags.indexOf(this.newTag) === -1) {
          task.tags.push(this.newTag);
          this.newTag = '';
        } else {
          toggleClassWithDelay(newTagEl, 'shake', 500);
        }
      }
    };

    this.addTask = function () {
      var newTask = {
        id: 'task4',
        title: 'New task',
        content: 'Task Content',
        tags: [],
        editable: true,
        done: false,
        isNew: true
      };

      activeTag = '';

      var sEdit = this.startEdit;

      taskList.push(newTask);
      setTimeout(function () {
        $('#' + newTask.id + ' .list-group-item-header').select();
      }, 0);
    };
  });
})();