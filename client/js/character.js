define(['entity'], function(Entity) {

    var friction = 0.146875 * 10000;

    var Characer = Entity.extend({
        init: function() {
            this._super();

            this.movementX = null;

            this.velocityX = 0;
            this.velocityY = 0;
            this.velocityZ = 0;

            this.deceleration = 0.5 * 10000;
            this.acceleration = 0.046875 * 10000;
            this.gravity = 0.21875 * 10000;
            this.maxVelocity = 300;

            this.hitPoints = 0;
            this.maxHitPoints = 0;
        },

        update: function(dt) {
            dt = 50;
            var tick = 1/dt;

            if (this.movementX == 'left') {

                // If we are currently moving right
                if (this.velocityX > 0) {
                    this.velocityX = this.velocityX - (this.deceleration * tick);
                } else {
                    this.velocityX = Math.max(this.maxVelocity * -1, (this.velocityX - (this.acceleration * tick)));
                }
                this.state = 'run';

                this.direction = 'left';

            } else if (this.movementX == 'right') {

                // If we are currently moving left
                if (this.velocityX < 0) {
                    this.velocityX = this.velocityX + (this.deceleration * tick);
                } else {
                    this.velocityX = Math.min(this.maxVelocity, (this.velocityX + (this.acceleration * tick)));
                }

                this.state = 'run';

                this.direction = 'right';

            } else {
                if (this.velocityX < 0) {
                    this.velocityX = Math.min(this.velocityX + (friction * tick), 0);

                } else if (this.velocityX > 0) {
                    this.velocityX = Math.max(this.velocityX - (friction * tick), 0);
                } else {
                    this.state = 'idle';
                }
            }

            if (this.jumping && this.velocityY === 0) {
                this.velocityY = -750;
            }

            if (this.jumping) {
                this.state = 'jump';
            }

            // Gravity
            this.velocityY = Math.min(1000, this.velocityY + (this.gravity * tick));

            this.setAnimation(this.state + '_' + (this.direction || 'right'));

            this.x = this.x + this.velocityX * tick;
            this.y = this.y + this.velocityY * tick;
        }
    });

    return Characer;

});
