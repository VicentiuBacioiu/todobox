(function () {
    angular
        .module('box.tasks')
        .factory('Task', taskFactory);

    /**
     * The Task factory
     * 
     * @returns The factory
     */
    function taskFactory() {
        return Task;
        
        /**
         * Creates a new Task given the options
         * 
         * @param {object} options - The options {id, title, content, tags, isNew, done}
         */
        function Task(options) {
            //properties
            this.id = options.id
            this.title = options.title;
            this.content = options.content;
            this.tags = options.tags;
            this.editable = options.isNew;
            this.done = options.done;
            this.isNew = options.isNew;

            //methods
            this.undoDelete = undoDelete;
            this.updateColor = updateColor;

            this.updateColor();

            function updateColor(){
                this.color = this.tags[0].color;
            }

            function undoDelete() {
                this.deleted = false;
            }

            
        };
    }
})();          