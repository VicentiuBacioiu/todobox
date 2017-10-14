(function () {
    angular
        .module('box.tasks', ['ngTouch', 'box.storage'])
        .factory('taskService', taskService);

    taskService.$inject = ['Task', 'Tag', 'store', '$filter'];

    /**
     * The Task and Tag Service
     */
    function taskService(Task, Tag, store, $filter) {
        var allTasks = [],
            allTags = {},
            service = {
                userTasks: [],
                userTags: [],
                filter: {
                    text: ''
                },
                defaultTag: {},
                activeTag: {},

                addTask: addTask,
                filterTasks: filterTasks,
                addTag: addTag,
                hasTag: hasTag,
                removeTag: removeTag,
                getTasks: getTasks
            },

            colors = ['indianred', 'mediumslateblue', 'darkkhaki',
                'tomato', 'cadetblue', 'burlywood', 'plum',
                'mediumseagreen', 'rosybrown', 'cornflowerblue',
                'palevioletred', 'olivedrab', 'mediumpurple',
                'sienna', 'mediumaquamarine', 'salmon'],
            colorIdx = 0;

        service.defaultTag = getTag('All tasks');
        service.activeTag.content = service.defaultTag.content;

        var dummyTask = {
            title: 'Get started',
            content: 'This is a sample task to get you started',
            tags: [service.defaultTag, getTag('Sample')]
        },
            dummyTask2 = {
                title: 'Just another one',
                content: 'This is another task used to showcase the filtering capability',
                tags: [service.defaultTag, getTag('Personal')]
            },
            dummyList = [dummyTask, dummyTask2];

        return service;

        function filterTasks() {
            service.userTasks = $filter('filter')(allTasks, service.filter.text);
            service.userTags.length = 0;
            angular.copy(computeTags(service.userTasks), service.userTags);
        }

        function generateGUID() {
            return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function getTasks() {
            var taskList = store.getTasks();

            if (!taskList) {
                taskList = dummyList;
            }

            for (var i = 0; i < taskList.length; i++) {
                taskList[i] = new Task({
                    id: generateGUID(),
                    title: taskList[i].title,
                    content: taskList[i].content,
                    tags: taskList[i].tags,
                    done: taskList[i].done
                });
            }

            allTasks = taskList;
            service.filterTasks();
            return taskList;
        }

        function addTask() {
            var newTask = new Task({
                title: 'New task',
                content: 'Task content goes here',
                tags: [service.defaultTag],
                isNew: true
            });

            if (service.activeTag.content !== service.defaultTag.content) {
                newTask.tags.push(getTag(service.activeTag.content));
            }

            allTasks.push(newTask);
            service.filterTasks();
            return newTask;
            //TODO: update tasks in storage
        }

        /**
         * Gets a new color
         */
        function getNextColor() {
            if (colorIdx >= colors.length) {
                colorIdx = 0;
            }
            return colors[colorIdx++];
        }

        /**
         * Gets or creates a new tag using the specified parameters
         * @param {string} tagName - The tag name
         * @param {string} [tagColor] - The tag color [optional]
         * @returns The tag object
         */
        function getTag(tagName, tagColor) {
            if (allTags[tagName]) {
                return allTags[tagName];
            }

            var newTag = new Tag({
                content: tagName,
                color: tagColor ? tagColor : getNextColor()
            });

            allTags[tagName] = newTag;
            return newTag;
        }



        function addTag(task, newTag) {
            if (service.hasTag(task, newTag)) {
                return false;
            }

            task.tags.push(getTag(newTag));

            return true;
        }

        /**
         * Checks if the Task has a specific tag
         * 
         * @param {object} task - The task to check
         * @param {object} tag - The tag to be found
         * @returns True if the tag is present, otherwise false
         */
        function hasTag(task, tag) {
            for (var i = 0; i < task.tags.length; i++) {
                if (task.tags[i].content === tag.content) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Removes a specific tag from the task
         * 
         * @param {object} task - The task
         * @param {object} tag - The tag to be removed
         */
        function removeTag(task, tag) {
            task.tags.splice(task.tags.indexOf(tag), 1);
            task.updateColor();
        };

        function computeTags(taskList) {
            var tagsList = {},
                tagsArray = [];

            taskList.forEach(function (task) {
                task.tags.forEach(function (tag) {
                    tagsList[tag.content] = true;
                })
            });

            Object.keys(tagsList).forEach(function (tag) {
                tagsArray.push(getTag(tag));
            });

            return tagsArray;
        }
    }
})();