define(function() {

    var getIntersectionDepth = function(tileX, tileY, bb) {

        // Calculate half sizes
        var halfWidthA = 12;
        var halfHeightA = 12;
        var halfWidthB = bb.w / 2;
        var halfHeightB = bb.h / 2;

        // Calculate current and minimum-non-intersecting distances between centers
        var distanceX = (tileX * 24 + halfWidthA) - (bb.x + halfWidthB);
        var distanceY = (tileY * 24 + halfHeightA) - (bb.y + halfHeightB);
        var minDistanceX = halfWidthA + halfWidthB;
        var minDistanceY = halfHeightA + halfHeightB;

        // If we are not intersecting at all, return 0,0
        if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY) {
            return [0, 0];
        }

        // Calculate and return intersection depths.
        var depthX = distanceX > 0 ? minDistanceX - distanceX : -1 * minDistanceX - distanceX;
        var depthY = distanceY > 0 ? minDistanceY - distanceY : -1 * minDistanceY - distanceY;
        return [depthX, depthY];
    };

    var Updater = Class.extend({
        init: function(game) {
            this.game = game;
        },

        update: function() {
            this.processControlInput();
            this.updateCharacters();
            this.game.loadChunks();
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

            var leftTile = Math.floor(bb.x / 24);
            var rightTile = Math.ceil((bb.x + bb.w) / 24) - 1;
            var topTile = Math.floor(bb.y / 24);
            var bottomTile = Math.ceil((bb.y + bb.h) / 24) - 1;

            for (var y = topTile; y <= bottomTile; y++) {
                for (var x = leftTile; x <= rightTile; x++) {
                    if (this.game.map.isSolid(x, y)) {
                        if (c.velocityY >= 0) { // If we are falling
                            var depth = getIntersectionDepth(x, y, bb);
                            if (depth[0] !== 0 && depth[1] !== 0) {
                                var absDepthX = Math.abs(depth[0]);
                                var absDepthY = Math.abs(depth[1]);

                                // Resolve the collision along the shallow axis
                                if (absDepthY < absDepthX) {
                                    c.y = c.y - depth[1];
                                    c.jumping = false;
                                    c.velocityY = 0;
                                } else if (absDepthX >= 1) {
                                    c.x = c.x - depth[0];
                                    c.velocityX = 0;
                                }

                                bb.x = c.x - 10;
                                bb.y = c.y - 48;
                            }
                        }
                    }
                }
            }


            // var b1x = Math.floor(bb.x / 24); // First below block position
            // var b2x = Math.floor((bb.x + bb.w - 1) / 24); // Second below block position
            // var by = Math.floor((bb.y + bb.h) / 24);

            // if (this.game.player.velocityY >= 0) {
            //     if (this.game.map.isSolid(b1x, by) || this.game.map.isSolid(b2x, by)) {
            //         this.game.player.velocityY = 0;
            //         this.game.player.jumping = false;
            //         this.game.player.y = Math.floor(this.game.player.y / 24) * 24;
            //     }
            // }

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
