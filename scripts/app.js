(function () {
    angular
        .module('box', ['box.tasks', 'box.storage'])
        .controller('AppController', AppController);

AppController.$inject=['$scope', 'taskService']

    function AppController($scope, taskService) {
        var vm = {
            panelActive: true,
            filter: taskService.filter,
            filterUpdate: filterUpdate,
            togglePanel: togglePanel
        };
        return vm;

        function filterUpdate(event) {
            if (event.which === 27) {
                vm.filter.text = '';
            }
            taskService.filterTasks(vm.filter.text);
        };

        function togglePanel() {
            vm.panelActive = !vm.panelActive;
        };
    }
})();