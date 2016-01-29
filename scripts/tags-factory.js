(function () {
  var tagCreatorModule = angular.module('box.tags.factory', ['box.storage']),
  colorStoragePrefix = 'ToDoBox_Color_',
  colors = ['cyan', 'magenta', 'green', 'crimson', 'emerald', 'darkblue', 'purple', 'brown'],
  colorIdx = 0,
  getNextColor = function(){
    if(colorIdx >= colors.length){
      colorIdx = 0;
    }
    return colors[colorIdx++];
  },
  getColor = function (id){
    var colorId = colorStoragePrefix + id,
    color = localStorage.getItem(colorId);
    if (!color) {
      color = getNextColor();
    }
    localStorage.setItem(colorId, color); //todo move to storage
    return color;
  };
  
  var Tag = function(tagContent){
    this.content = tagContent;
    this.color = getColor(tagContent);
  }
  
  tagCreatorModule.factory('createTag', function(){
    return function(tagContent){
      return new Tag(tagContent);
    }
  });
})();