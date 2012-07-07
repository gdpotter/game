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

            // Jump
            if (this.game.getKey('32', true) > 0) {
                this.game.player.jumping = true;
            }

        },

        updateCharacters: function() {
            var self = this;

            this.updateCharacter(this.game.player);
            this.detectCollisions(this.game.player);
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
                c.state = 'run';
                // c.setAnimation('run_left');
            } else if (c.movementX == 'right') {

                // If we are currently moving left
                if (c.velocityX < 0) {
                    c.velocityX = c.velocityX + (c.deceleration * tick);
                } else {
                    c.velocityX = Math.min(c.maxVelocity, (c.velocityX + (c.acceleration * tick)));
                }

                c.state = 'run';
                // c.setAnimation('run_right');
            } else {
                if (c.velocityX < 0) {
                    c.velocityX = Math.min(c.velocityX + (friction * tick), 0);

                    // c.setAnimation('idle_left');
                } else if (c.velocityX > 0) {
                    c.velocityX = Math.max(c.velocityX - (friction * tick), 0);
                } else {
                    c.state = 'idle';
                }

                if (c.velocityX > 0) {
                    // c.setAnimation('idle_right');
                }
            }

            if (c.jumping && c.velocityY === 0) {
                c.velocityY = -750;
            }

            if (c.jumping) {
                c.state = 'jump';
            }

            c.setAnimation(c.state + '_' + (c.movementX || 'right'));

            // if (c.jumping) {
                c.velocityY = c.velocityY + (c.gravity * tick);
            // }

            c.x = c.x + c.velocityX * tick;
            c.y = c.y + c.velocityY * tick;

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

            // this.game.renderer.context.fillStyle = "blue";
            // this.game.renderer.context.fillRect(b1x * 24, by * 24, 24, 24);
            // this.game.renderer.context.fillRect(b2x * 24, by * 24, 24, 24);
            // console.log(this.game.map.getTile(b1x, by));

            if (this.game.player.velocityY >= 0) {
                if (this.game.map.isSolid(b1x, by) || this.game.map.isSolid(b2x, by)) {
                    this.game.player.velocityY = 0;
                    this.game.player.jumping = false;
                    this.game.player.y = Math.floor(this.game.player.y / 24) * 24;
                }
            }

            /*if (this.checkCollision(bb.x, bb.y, bb.w, bb.h, b1x, by, 24, 24)) {
                this.game.player.velocityY = 0;
                this.game.player.jumping = false;
            }*/
        },

        /*checkCollision: function(ax1, ay1, aw, ah, bx1, by1, bw, bh) {
            var ax2 = ax1 + aw,
                ay2 = ay1 + ah,
                bx2 = bx1 + bw,
                by2 = by1 + bh;

                // console.log(ax1 < bx2, ax2 > bx1 , ay1 < by2 , ay2 > by1)

              return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
        },*/

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
