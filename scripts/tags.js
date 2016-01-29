(function () {
  var tagModule = angular.module('box.tags', ['box.tags.factory']),
  allTag = {
    content: 'All tasks',
    color: 'primary'
  };
  
  tagModule.factory('activeTag', function () {
    var aTag = allTag.content;
    return {
      get: function () {
        return aTag;
      },
      set: function (val) {
        aTag = val;
      },
      equals: function (val) {
        return aTag === val;
      },
      isDefault: function () {
        return aTag === allTag.content;
      },
      reset: function(){
        aTag = allTag.content;
      }
    };
  });
  
  tagModule.directive('tags', function() {
    return {
      templateUrl: 'templates/tags.html',
      restrict: 'E'
    };
  });
  
  tagModule.controller('TagController', ['$scope', '$rootScope', '$filter', 'store', 'activeTag', 'createTag', function ($scope, $rootScope, $filter, $store, $activeTag, createTag) {
    var getTags = function (tasks, filterText) {
      var i,
      tagsList = [],
      allTags = [],
      seen = {};
      
      tasks = $filter('filter')(tasks, filterText);
      
      for (i = 0; i < tasks.length; i++) {
        allTags = allTags.concat(tasks[i].tags);
      }
      
      for (i = 0; i < allTags.length; i++) {
        if (seen[allTags[i].content] !== 1) {
          seen[allTags[i].content] = 1;
          tagsList.push(createTag(allTags[i].content));
        }
      }
      
      if(!tagsList.length){
        $scope.activeTag.reset();
      }
      
      return [allTag].concat(tagsList);
    };
    
    $scope.activeTag = $activeTag;
    $scope.tags = getTags($store.getTasks());
    
    $rootScope.$on('update', function (event, taskList) {
      $scope.tags = getTags(taskList);
    });
    
    $scope.$on('filterUpdate', function(event, filterText){
      $scope.tags = getTags($store.getTasks(), filterText);
    });
  }]);
})();