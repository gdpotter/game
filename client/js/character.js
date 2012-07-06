define(['entity'], function(Entity) {

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
        }
    });

    return Characer;

});
