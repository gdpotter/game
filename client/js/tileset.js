define(function() {

    var Tileset = Class.extend({
        init: function(name) {
            this.name = name;
            this.isLoaded = false;
        },

        loadJSON: function(data) {
            this.filePath = 'forest.png';
            this.load();
        },

        load: function() {
            var self = this;

            this.image = new Image();
            this.image.src = this.filepath;

            this.image.onload = function() {
                self.isLoaded = true;

                if (self.onload_func) {
                    self.onload_func();
                }
            };

        }
    });

    return Tileset;
});
