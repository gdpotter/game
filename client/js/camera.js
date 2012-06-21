define(function() {

    var Camera = Class.extend({
        init: function(renderer) {
            this.renderer = renderer;
            this.x = 0;
            this.y = 0;
            this.tileX = 0;
            this.tileY = 0;
            this.rescale();
        },

        rescale: function() {
            var scale = 1;
            this.tileW = 24 * scale;
            this.tileH = 24 * scale;
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;

            this.tileX = Math.floor( x / this.tileW);
            this.tileY = Math.floor( y / this.tileH);
        },

        lookAt: function(entity) {
            var canvasWidth = this.renderer.canvas.width;
            var canvasHeight = this.renderer.canvas.height;

            var x = Math.round(entity.x - canvasWidth / 2);
            var y = Math.round(entity.y - canvasHeight / 2);

            this.setPosition(x, y);
        },

        forEachVisibleTilePosition: function(callback) {
            for (var y = this.tileY, maxY = y + 1 + (this.renderer.canvas.height / this.tileH); y < maxY; y++) {
                for (var x = this.tileX, maxX = x + 1 + (this.renderer.canvas.width / this.tileW); x < maxX; x++) {
                    callback(x, y);
                }
            }
        }
    });

    return Camera;
});
