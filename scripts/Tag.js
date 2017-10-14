(function () {
    angular
        .module('box.tasks')
        .factory('Tag', tagFactory);
    
    /**
     * The Tag factory
     */
    function tagFactory() {
        return Tag;
        
        /**
         * Creates a new Tag
         * @param {object} options - The options {content, color}
         */
        function Tag(options) {
            this.content = options.content;
            this.color = options.color;
        }
    }
})();