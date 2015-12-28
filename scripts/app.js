(function(){
  var tdb = angular.module('box', []);

  var taskList = [{
    title: 'Task 1',
    content: 'Task Content 1'
  }, 
  {
    title: 'Task 2',
    content: 'Task Content 2'
  }];

  tdb.controller('ItemController', function(){
    this.tasks = taskList;
  });
})();