define(function() {

    var Updater = Class.extend({
        init: function(game) {
            this.game = game;
        },

        update: function() {
            this.processControlInput();
            this.updateCharacters();
            this.updateAnimations();
        },

        processControlInput: function() {

            // Left/Right
            if (this.game.getKey('65') > this.game.getKey('68')) { // Left Arrow
                this.game.player.movementX = 'left';
            } else if (this.game.getKey('68') > this.game.getKey('65')) { // Right Arrow
                this.game.player.movementX = 'right';
            } else {
                this.game.player.movementX = null;
            }

            // Jump
            if (this.game.getKey('32', true) > 0) {
                this.game.player.jumping = true;
            }

        },

        updateCharacters: function() {
            var self = this;

            this.game.player.update(this.game.renderer.realFPS);
            this.detectCollisions(this.game.player);
        },

        detectCollisions: function(c) {
            var bb = {
                x: c.x - 10,
                y: c.y - 48,
                h: 48,
                w: 20
            };


            var b1x = Math.floor(bb.x / 24); // First below block position
            var b2x = Math.floor((bb.x + bb.w - 1) / 24); // Second below block position
            var by = Math.floor((bb.y + bb.h) / 24);

            if (this.game.player.velocityY >= 0) {
                if (this.game.map.isSolid(b1x, by) || this.game.map.isSolid(b2x, by)) {
                    this.game.player.velocityY = 0;
                    this.game.player.jumping = false;
                    this.game.player.y = Math.floor(this.game.player.y / 24) * 24;
                }
            }

        },

        updateAnimations: function() {

            var t = this.game.currentTime;

            var entity = this.game.player;

            var anim = entity.currentAnimation;

            if (anim) {
                anim.update(t);
            }
        }
    });

    return Updater;

});
