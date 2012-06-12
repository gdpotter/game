define(function() {

    var friction = 0.146875 * 10000;

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

        },

        updateCharacters: function() {
            var self = this;

            this.updateCharacter(this.game.player);
        },

        updateCharacter: function(c) {
            var self = this;

            var tick = 1/this.game.renderer.realFPS;

            if (c.movementX == 'left') {

                // If we are currently moving right
                if (c.velocityX > 0) {
                    c.velocityX = c.velocityX - (c.deceleration * tick);
                } else {
                    c.velocityX = Math.max(c.maxVelocity * -1, (c.velocityX - (c.acceleration * tick)));
                }

                c.setAnimation('run_left');
            } else if (c.movementX == 'right') {

                // If we are currently moving left
                if (c.velocityX < 0) {
                    c.velocityX = c.velocityX + (c.deceleration * tick);
                } else {
                    c.velocityX = Math.min(c.maxVelocity, (c.velocityX + (c.acceleration * tick)));
                }

                c.setAnimation('run_right');
            } else {
                if (c.velocityX < 0) {
                    c.velocityX = Math.min(c.velocityX + (friction * tick), 0);

                    c.setAnimation('idle_left');
                } else {
                    c.velocityX = Math.max(c.velocityX - (friction * tick), 0);
                }

                if (c.velocityX > 0) {
                    c.setAnimation('idle_right');
                }
            }

            c.x = c.x + c.velocityX * tick;

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
