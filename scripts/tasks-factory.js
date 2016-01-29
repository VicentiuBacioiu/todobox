(function () {
  var tCreatorModule = angular.module('box.tasks.factory', ['box.tags', 'box.tags.factory']);
  
  var getNewId = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
  
  var oldTask;
  
  var Task = function (options, activeTag, createTag) {
    this.id = getNewId();
    this.title = options.title;
    this.content = options.content;
    this.tags = options.tags;
    this.editable = options.isNew;
    this.done = options.done;
    this.isNew = options.isNew;
    
    this.hasTag = function(tag) {
      for(var i=0; i < this.tags.length; i++) {
        if(this.tags[i].content === tag){
          return true;
        }
      }
      return false;
    };
    
    this.hasActiveTag = function () {
      return activeTag.isDefault() || this.hasTag(activeTag.get())
    };
    
    this.removeTag = function (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    };
    
    this.addTag = function (newTag) {
      if (this.hasTag(newTag)) {
        return false;
      }
      
      this.tags.push(createTag(newTag));
      return true;
    };
    
    this.getColor = function(colorType) {
      var colorSuffix = 'primary';
      if(this.tags.length){
        colorSuffix = this.tags[0].color ;
      }
      return colorType + '-' + colorSuffix + '-color';
    }
    
    this.edit = function () {
      oldTask = angular.copy(this);
      this.editable = true;
      $('#' + this.id + ' .list-group-item-header').focus();
    };
    
    this.saveChanges = function () {
      this.editable = false;
      this.isNew = false;
    };
    
    this.discardChanges = function () {
      this.title = oldTask.title;
      this.content = oldTask.content;
      this.tags = oldTask.tags;
      this.editable = false;
    };
  };
  
  tCreatorModule.factory('createTask', ['activeTag', 'createTag', function (activeTag, createTag) {
    return function (options) {
    return new Task(options, activeTag, createTag);
  };
  }]);
})();          