(function () {
  var tagModule = angular.module('box.tags', ['box.tasks']);

  tagModule.value('tagValue', {
    active: '' 
  });

  tagModule.controller('TagController', function tagController (tagValue, taskList) {
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

    this.tags = getTagList();

    this.setActiveTag = function (tag) {
      tagValue.active = tag;
    };

    this.isActiveTag = function (tag) {
      return tagValue.active === tag;
    };

  });
})();