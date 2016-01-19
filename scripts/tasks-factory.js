(function () {
  var tCreatorModule = angular.module('box.tasks.factory', ['box.tags']);

  var getNewId = function () {
    return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  var oldTask;

  var Task = function (options, activeTag) {
    this.id = getNewId();
    this.title = options.title;
    this.content = options.content;
    this.tags = options.tags;
    this.editable = options.isNew;
    this.done = options.done;
    this.isNew = options.isNew;

    this.hasActiveTag = function () {
      return activeTag.isDefault() || this.tags.indexOf(activeTag.get()) !== -1;
    };

    this.removeTag = function (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    };

    this.addTag = function (newTag) {
      if (this.tags.indexOf(newTag) !== -1) {
        return false;
      }

      this.tags.push(newTag);
      return true;
    };

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

  tCreatorModule.factory('createTask', ['activeTag', function (activeTag) {
    return function (options) {
      return new Task(options, activeTag);
    };
  }]);
})();