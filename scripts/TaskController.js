(function () {
    angular
        .module('box.tasks')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['$scope', '$filter', '$timeout', 'taskService', 'store']

    function TaskController($scope, $filter, $timeout, taskService, store) {
        var vm = this,
            separatorKeys = [9, 13, 186, 188], //Tab, Enter, Semicolumn, Column
            oldTask;

        //properties
        vm.tasks = taskService.getTasks();
        vm.tags = taskService.userTags;
        vm.newTag = '';
        vm.activeTag = taskService.activeTag;
        vm.swipeEnabled = true;

        //methods
        vm.edit = edit;
        vm.isTouchEnabled = isTouchEnabled;
        vm.findTaskPosition = findTaskPosition;
        vm.addTag = addTag;
        vm.hasTag = taskService.hasTag;
        vm.remove = remove;
        vm.removeTag = taskService.removeTag;
        vm.purge = purge;
        vm.setActiveTag = setActiveTag;
        vm.updateTasks = updateTasks;
        vm.updateOrder = updateOrder;
        vm.isActiveTag = isActiveTag;
        vm.saveChanges = saveChanges;
        vm.discardChanges = discardChanges;
        vm.addTask = addTask;
        vm.swipeRemove = swipeRemove;
        vm.swipeEdit = swipeEdit;
        vm.addGeneralDragEvents = addGeneralDragEvents;
        vm.addIndividualDragEvents = addIndividualDragEvents;

        function isActiveTag(tag) {
            return vm.activeTag.content === tag.content;
        }

        function edit(task) {
            oldTask = angular.copy(task);
            task.editable = true;
            $('#' + task.id + ' .list-group-item-header').focus();
        }

        function isTouchEnabled() {
            var result = 'ontouchstart' in window || navigator.maxTouchPoints;
            if (result) {
                $('body').addClass('supports-touch');
            }
            return result;
        }

        function findTaskPosition(taskId) {
            for (var i = 0; i < vm.tasks.length; i++) {
                if (vm.tasks[i].id === taskId) {
                    return i;
                }
            }
            return -1;
        }

        function addTag(event, task) {
            if ((event && (separatorKeys.indexOf(event.which) === -1 || event.shiftKey)) || !vm.newTag.length) {
                return;
            }

            var newTagEl = $('#' + task.id + " .tdb-newtag");
            if (taskService.addTag(task, $filter('capitalize')(vm.newTag))) {
                vm.newTag = '';
            } else {
                newTagEl.addClass('shake');
                $timeout(function () {
                    newTagEl.removeClass('shake');
                }, 500);
            }

            if (event) {
                event.preventDefault();
            }
        }

        function remove(task) {
            task.deleted = true;
            $timeout(vm.purge.bind(vm, task), 5000);
        }

        function purge(task) {
            if (!task.deleted) {
                return;
            }
            for (var i = vm.tasks.length - 1; i >= 0; i--) {
                if (vm.tasks[i].id === task.id) {
                    vm.tasks.splice(i, 1);
                    taskService.filterTasks();
                    vm.updateTasks();
                    return;
                }
            }
        }

        function discardChanges(task) {
            if (task.isNew) {
                vm.remove(task);
            } else {
                task.title = oldTask.title;
                task.content = oldTask.content;
                task.tags = oldTask.tags;
                task.editable = false;
            }
        }

        function saveChanges(task) {
            vm.addTag(null, task);
            task.editable = false;
            task.isNew = false;
            task.updateColor();
            taskService.filterTasks();
            vm.updateTasks();
        }

        function setActiveTag(tag) {
            vm.activeTag.content = tag.content;
        }

        function updateTasks() {
            store.setTasks(vm.tasks);
        }

        function updateOrder(event, ui) {
            if (vm.searchText) {
                $('.tasks>ul').sortable('cancel');
                return;
            }
            var taskId = ui.item.attr('id'),
                taskPos = this.findTaskPosition(taskId),
                task = vm.tasks.splice(taskPos, 1);

            vm.tasks.splice(ui.item.index(), 0, task[0]);
            vm.updateTasks();
        }

        function addTask() {
            var newTask = taskService.addTask();
            vm.edit(newTask);
            setTimeout(function () {
                $('#' + newTask.id + ' .list-group-item-header').select();
            }, 0);
        }

        function swipeRemove(task) {
            if (this.isTouchEnabled()) {
                $('.swipe-background').hide();
                this.remove(task);
            }
        }

        function swipeEdit(task) {
            if (this.isTouchEnabled()) {
                $('.swipe-background').hide();
                this.edit(task);
            }
        }

        function addGeneralDragEvents() {
            var cancel,
                initX = 0,
                initY = 0,
                touchEnabled = this.isTouchEnabled();

            if (!touchEnabled) {
                cancel = '.tdb-control, .checkbox, input';
            }

            $('.tasks>ul').sortable({
                update: this.updateOrder.bind(this),
                cancel: cancel,
                axis: 'y',
                handle: '.order-handle'
            })
                .disableSelection();

            if (!touchEnabled) {
                return;
            }

            $('body').on('touchstart', function (e) {
                initX = e.originalEvent.touches[0].clientX;
                initY = e.originalEvent.touches[0].clientY;
            });
            $('body').on('touchmove', function (e) {
                var cx = e.originalEvent.touches[0].clientX,
                    cy = e.originalEvent.touches[0].clientY;
                if (Math.abs(cx - initX) < Math.abs(cy - initY)) {
                    $('body').scrollTop($('body').scrollTop() - (cy - initY));
                    vm.swipeEnabled = false;
                }

                initY = cy;
                initX = cx;
            });
            $('body').on('touchend', function (e) {
                vm.swipeEnabled = true;
            });
        }

        function addIndividualDragEvents(id) {
            var initX = 0,
                touchEnabled = this.isTouchEnabled();

            if (!touchEnabled) {
                return;
            };

            $('.tdb-box').draggable({
                revert: true,
                revertDuration: 0,
                axis: 'x',
                distance: 20,
                handle: '.swipe-handle',
                start: function (event, ui) {
                    var bg = $('.swipe-background');
                    bg.height(ui.helper.outerHeight(true));
                    bg.insertBefore(ui.helper);
                    bg.show();
                    initX = event.pageX;
                },
                drag: function (event, ui) {
                    if (!vm.swipeEnabled) {
                        return false;
                    }
                    var bg = $('.swipe-background');

                    if (event.pageX < initX) {
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
        }

    }
})();
