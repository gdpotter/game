define(function() {

    var Renderer = Class.extend({
        init: function(game, canvas) {
            this.game = game;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            this.initFPS();
            this.lastTime = new Date();
            this.realFPS = this.FPS;
        },

        initFPS: function() {
            this.FPS = 50;
        },

        renderFrame: function() {
            this.clearScreen(this.context);

            this.context.save();

            this.setCameraView(this.context);
            this.drawEntities();

            this.context.restore();

            this.calcFPS();
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
                    dx = entity.x - w/2 * scale,
                    dy = entity.y - h * scale,
                    dw = w,
                    dh = h;


                this.context.fillRect(-2, -100, 4, 200);
                this.context.fillRect(-100, -2, 200, 4);
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

        setCameraView: function(ctx) {
            // ctx.translate(this.canvas.width / 2 - this.game.player.x , this.canvas.height / 2 - this.game.player.y);
            ctx.translate(960/2, 540/2);
        },

        clearScreen: function(ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
