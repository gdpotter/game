define(['camera'], function(Camera) {

    var Renderer = Class.extend({
        init: function(game, canvas) {
            this.game = game;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            this.camera = new Camera(this);

            this.initFPS();
            this.lastTime = new Date();
            this.realFPS = this.FPS;
        },

        initFPS: function() {
            this.FPS = 50;
        },

        renderFrame: function() {
            this.clearScreen();

            this.context.save();

            this.setCameraView();
            this.drawWorld();
            this.drawEntities();

            // this.game.updater.update();

            this.context.restore();

            this.calcFPS();
        },

        drawWorld: function() {
            var self = this;
            var cam = this.camera;
            var map = this.game.map;

            this.context.fillRect(0, 100, 0, 100);

            cam.forEachVisibleTilePosition(function(x, y) {
                var tile = self.game.map.getTile(x, y);

                if (tile) {
                    var scale = 1,
                        tileX = tile.x * scale,
                        tileY = tile.y * scale,
                        w = 24 * scale,
                        h = 24 * scale,
                        image = tile.tileset.image,
                        dx = x * 24 * scale,
                        dy = y * 24 * scale;

                    self.context.drawImage(image, tileX, tileY, w, h, dx, dy, w, w);
                    //self.context.fillStyle = color;
                    //self.context.fillRect(x * cam.tileW, y * cam.tileH, cam.tileW, cam.tileH);
                }
            });
        },

        drawEntities: function() {
            var self = this;

            this.game.forEachVisibleEntity(function(entity) {
                self.drawEntity(entity);
            });
        },

        drawEntity: function(entity) {

            var sprite = entity.sprite;
            var anim = entity.currentAnimation;

            if (anim && sprite && entity.isVisible()) {

                var frame = anim.currentFrame,
                    scale = 1,
                    x = frame.x * scale,
                    y = frame.y * scale,
                    w = sprite.width * scale,
                    h = sprite.height * scale,
                    dx = (entity.x - sprite.width/2) * scale,
                    dy = (entity.y - sprite.height) * scale,
                    dw = w,
                    dh = h;

                // this.context.fillRect(-2, -100, 4, 200);
                // this.context.fillRect(-100, -2, 200, 4);
                this.context.save();

                if (anim.flipX) {
                    this.context.translate(dx + w, dy);
                    this.context.scale(-1, 1);
                } else {
                    this.context.translate(dx, dy);
                }

                this.context.drawImage(sprite.image, x, y, w, h, 0, 0, dw, dh);

                this.context.restore();
            }
        },

        setCameraView: function() {
            this.camera.lookAt(this.game.player);
            this.context.translate(-1 * this.camera.x, -1 * this.camera.y);
            // this.context.translate(this.canvas.width / 2 - this.game.player.x , this.canvas.height / 2 - this.game.player.y);
            // ctx.translate(960/2, 540/2);
        },

        clearScreen: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        calcFPS: function() {
            var nowTime = new Date(),
                diffTime = nowTime.getTime() - this.lastTime.getTime();

            this.realFPS = 1000 / diffTime;
            this.lastTime = nowTime;
        }
    });

    return Renderer;

});
