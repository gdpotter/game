define(function() {

    var Entity = Class.extend({
        init: function() {
            this.sprite = null;
            this.currentAnimation = null;
            this.animations = null;

            this.setPosition(0, 0);

            this.isLoaded = false;
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
        },

        isVisible: function() {
            return true;
        },

        setSprite: function(sprite) {
            if (!sprite) {
                log.error(this.id + " : sprite is null", true);
                throw "Error";
            }

            if (this.sprite && this.sprite.name === sprite.name) {
                // This is the currently loaded sprite--we don't need to anything
                return;
            }

            this.sprite = sprite;
            this.normalSprite = this.sprite;

            this.animations = sprite.createAnimations();

            this.isLoaded = true;
            if (this.ready_func) {
                this.ready_func();
            }
        },

        getSprite: function() {
            return this.sprite;
        },

        getAnimationByName: function(name) {
            var animation = null;

            if (name in this.animations) {
                animation = this.animations[name];
            } else {
                log.error("No animation called " + name);
            }
            return animation;
        },

        setAnimation: function(name, speed, count, onEndCount) {

            if (this.isLoaded) {
                if (this.currentAnimation && this.currentAnimation.name === name) {
                    return;
                }

                var s = this.sprite;
                var a = this.getAnimationByName(name);

                if (a) {
                    this.currentAnimation = a;

                    this.currentAnimation.setSpeed(speed || 100);
                    this.currentAnimation.setCount(count ? count : 0, onEndCount);
                }
            } else {
                log.error('Not ready for animation');
            }
        }


    });

    return Entity;
});
