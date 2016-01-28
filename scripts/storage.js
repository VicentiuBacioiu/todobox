(function () {
  var sModule = angular.module('box.storage', ['box.tasks.factory']);
  
  sModule.factory('store', ['createTask', function (createTask) {
    var storageId = 'ToDoBox_Storage',
    dummyTask = createTask({
      title : 'Get started',
      content : 'This is a sample task to get you started',
      tags : ['Sample']
    }),
    dummyTask2 = createTask({
      title : 'Just another one',
      content : 'This is another task used to showcase the filtering capability',
      tags : ['Personal']
    }),
    dummyList = [dummyTask, dummyTask2];
    
    return {
      getTasks : function () {
        var json = localStorage.getItem(storageId);
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
        localStorage.setItem(storageId, JSON.stringify(data));
      }
    };
  }
  ]);
  
})();
