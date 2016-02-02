(function () {  
  var tModule = angular.module('box.tasks', ['box.storage', 'box.tasks.factory', 'box.tags', 'ngTouch']);
  
  tModule.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });
  
  tModule.controller('TaskController', ['$scope', '$rootScope', '$filter', '$timeout', 'store', 'createTask', 'activeTag',  function taskController($scope, $rootScope, $filter, $timeout, store, createTask, activeTag) {
    var separatorKeys = [9, 13, 186, 188]; //Tab, Enter, Semicolumn, Column
    
    $scope.tasks = store.getTasks();
    this.newTag = '';
    
    this.isTouchEnabled = function() {
      var result = 'ontouchstart' in window || navigator.maxTouchPoints;
      if(result){
        $('body').addClass('supports-touch');
      }
      return result;
    };
    
    this.findTaskPosition = function(taskId) {
      for(var i=0; i < $scope.tasks.length; i++){
        if($scope.tasks[i].id === taskId) {
          return i;
        }
      }
      return -1;
    }; 
    
    this.addTag = function (event, task) {
      if ((event && (separatorKeys.indexOf(event.which) === -1 || event.shiftKey)) || !this.newTag.length) {
        return;
      }
      
      var newTagEl = $('#' + task.id + " .tdb-newtag");
      if (task.addTag($filter('capitalize')(this.newTag))) {
        this.newTag = '';
        } else {
        newTagEl.addClass('shake');
        $timeout(function () {
          newTagEl.removeClass('shake');
        }, 500);
      }
      
      if(event){
        event.preventDefault();
      }
    };
    
    this.remove = function(task){
      task.deleted = true;
      $timeout(this.purge.bind(this, task), 5000);
    }
    
    this.purge = function (task) {
      if(!task.deleted){
        return;
      }
      for (var i = $scope.tasks.length - 1; i >= 0; i--) {
        if ($scope.tasks[i].id === task.id) {
          $scope.tasks.splice(i, 1);
          $rootScope.$broadcast('update', $scope.tasks);
          return;
        }
      }
    };
    
    this.discardChanges = function (task) {
      if (task.isNew) {
        this.remove(task);
        } else {
        task.discardChanges();
      }
    };
    
    this.saveChanges = function (task) {
      this.addTag(null, task);
      task.saveChanges();
      $rootScope.$broadcast('update', $scope.tasks);
    };
    
    this.updateTasks = function () {
      store.setTasks($scope.tasks);
    };
    
    this.updateOrder = function(event, ui){
      if($scope.searchText) {
        $('.tasks>ul').sortable('cancel');
        return;
      }
      var taskId = ui.item.attr('id'),
      taskPos = this.findTaskPosition(taskId),
      task = $scope.tasks.splice(taskPos, 1);
      
      $scope.tasks.splice(ui.item.index(), 0, task[0]);
      this.updateTasks();
    };
    
    this.addTask = function () {
      var newTask = createTask({
        title : 'New task',
        content : 'Task content goes here',
        tags : activeTag.isDefault() ? [] : [activeTag.get()],
        isNew : true
      }),
      sEdit = this.startEdit;
      
      $scope.tasks.push(newTask);
      $rootScope.$broadcast('update', $scope.tasks);
      setTimeout(function () {
        $('#' + newTask.id + ' .list-group-item-header').select();
      }, 0);
    };
    
    this.swipeRemove = function(task){
      if(this.isTouchEnabled()){
        $('.swipe-background').hide();
        this.remove(task);
      }
    };
    
    this.addGeneralDragEvents = function() {
      var cancel,
      initX = 0,
      initY = 0,
      touchEnabled = this.isTouchEnabled();
      
      if(!touchEnabled) { 
        cancel = '.tdb-control, .checkbox, input';
      }
      
      $('.tasks>ul').sortable({
        update: this.updateOrder.bind(this),
        cancel: cancel,
        axis: 'y',
        handle: '.order-handle'
      })
      .disableSelection();
      
      if(!touchEnabled) {
        return;
      }
      
      $('body').on('touchstart', function(e) {
        initX = e.originalEvent.touches[0].clientX;
        initY = e.originalEvent.touches[0].clientY;
      });
      $('body').on('touchmove', function(e){
        var cx = e.originalEvent.touches[0].clientX,
        cy = e.originalEvent.touches[0].clientY;
        if(Math.abs(cx - initX) < Math.abs(cy - initY)){
          $('body').scrollTop($('body').scrollTop() - (cy - initY));
          $scope.swipeEnabled = false;
        }
        
        initY = cy;
        initX = cx;
      });
      $('body').on('touchend', function(e) {
        $scope.swipeEnabled = true;
      });
    };
    
    this.addIndividualDragEvents = function(id){
      var initX = 0,
      touchEnabled = this.isTouchEnabled();
      
      if(!touchEnabled) {
        return;
      };
      
      $('.tdb-box').draggable({
        revert: true,
        revertDuration: 0,
        axis: 'x',
        distance: 20,
        handle: '.swipe-handle',
        start: function(event, ui) {
          var bg = $('.swipe-background');
          bg.height(ui.helper.outerHeight(true));
          bg.insertBefore(ui.helper);
          bg.show();
          initX = event.pageX;
        },
        drag: function(event, ui) {
          if(!$scope.swipeEnabled){
            return false;
          }
          var bg = $('.swipe-background');
          
          if(event.pageX < initX) {
            //drag left
            bg.removeClass('control-bg-edit');
            bg.addClass('control-bg-cancel');
          }
          else {
            //drag right
            bg.removeClass('control-bg-cancel');
            bg.addClass('control-bg-edit');
          }
          
        }
      });
    };
    
    $rootScope.$on('update', this.updateTasks);
    $scope.swipeEnabled = true;
  }
  ]);
})();
