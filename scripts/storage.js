(function () {
    angular
        .module('box.storage', [])
        .factory('store', store);

    function store() {
        var taskStorageId = 'ToDoBox_Tasks',
            service = {
                getTasks: getTasks,
                setTasks: setTasks
            };

        return service;

        function getTasks() {
            var json = localStorage.getItem(taskStorageId);
            if (!json) {
                return null;
            }

            return JSON.parse(json);
        }

        function setTasks(data) {
            localStorage.setItem(taskStorageId, JSON.stringify(data));
        }

    }
})();
