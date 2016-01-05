(function () {
  var tdb = angular.module('box', []);

  var taskList = [{
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
  }];

  var tagsList = [
    'Personal',
    'Work',
    'Important'
  ];

  tdb.controller('TaskController', function () {
    var activeTag = '';
    this.tasks = taskList;
    this.tags = tagsList;

    this.setActiveTag = function (tag) {
      activeTag = tag;
    };

   this.isActiveTag = function (tag) {
      return activeTag === tag;
    };

    this.hasTag = function (task) {
      return !activeTag || task.tags.indexOf(activeTag) !== -1;
    };

  });

})();