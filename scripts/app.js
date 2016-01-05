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

  tdb.controller('ItemController', function () {
    this.tasks = taskList;
  });

  tdb.controller('TagController', function () {
    this.tags = tagsList;
  });
})();