(function () {
  var sModule = angular.module('box.storage', ['box.tasks.factory', 'box.tags.factory']);
  
  sModule.factory('store', ['createTask', 'createTag', function (createTask, createTag) {
    var taskStorageId = 'ToDoBox_Tasks',
    dummyTask = createTask({ //todo remove this logic, leave only get/set
      title : 'Get started',
      content : 'This is a sample task to get you started',
      tags : [createTag('Sample')]
    }),
    dummyTask2 = createTask({
      title : 'Just another one',
      content : 'This is another task used to showcase the filtering capability',
      tags : [createTag('Personal')]
    }),
    dummyList = [dummyTask, dummyTask2];
    
    return {
      getTasks : function () {
        var json = localStorage.getItem(taskStorageId);
        if (!json) {
          return dummyList;
        }
        
        var taskList = JSON.parse(json);
        for (var i = 0; i < taskList.length; i++) {
          taskList[i] = createTask({
            title : taskList[i].title,
            content : taskList[i].content,
            tags : taskList[i].tags,
            done : taskList[i].done
          });
        }
        
        return taskList;
      },
      setTasks : function (data) {
        localStorage.setItem(taskStorageId, JSON.stringify(data));
      }
    };
  }
  ]);
  
})();
