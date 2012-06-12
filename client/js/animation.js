define(function() {

    var Animation = Class.extend({
        init: function(name, length, row, column, width, height, flipX) {
            this.name = name;
            this.length = length;
            this.row = row;
            this.column = column;
            this.width = width;
            this.height = height;
            this.flipX = flipX;

            this.reset();
        },

        tick: function() {
            var i = this.currentFrame.index;

            // Consider switching with mod
            i = (i < this.length - 1) ? i + 1 : 0;

            if (this.count > 0) {
                if (i === 0) {
                    this.count -= 1;
                    if (this.count === 0) { // All done animating
                        this.currentFrame.index = 0;
                        this.endcount_callback();
                        return;
                    }
                }
            }
            this.currentFrame.x = this.width * (i + this.column);
            this.currentFrame.y = this.height * (this.row);
            this.currentFrame.index = i;
        },

        setSpeed: function(speed) {
            this.speed = speed;
        },

        setCount: function(count, onEndCount) {
            this.count = count;
            this.endcount_callback = onEndCount;
        },

        update: function(time) {
            if (this.isTimeToAnimate(time)) {
                this.lastTime = time;
                this.tick();
                return true;
            } else {
                return false;
            }
        },

        isTimeToAnimate: function(time) {
            return (time - this.lastTime) > this.speed;
        },

        reset: function() {
            this.lastTime = 0;
            this.currentFrame = {
                index: 0,
                x: this.column * this.width,
                y: this.row * this.height
            };
        }
    });

    return Animation;

});
