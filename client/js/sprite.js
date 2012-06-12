define(['animation'], function(Animation) {

    var Sprite = Class.extend({
        init: function(name) {
            this.name = name;
            this.isLoaded = false;
        },

        loadJSON: function(data) {
            this.id = data.id;
            this.filepath = "player.png";
            this.animationData = data.animations;
            this.width = data.width;
            this.height = data.height;

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
        },

        createAnimations: function() {
            var animations = {};

            for (var name in this.animationData) {
                var a = this.animationData[name];
                animations[name] = new Animation(name, a.length, a.row, a.column, this.width, this.height, a.flipX);
            }

            return animations;
        }
    });

    return Sprite;

});
