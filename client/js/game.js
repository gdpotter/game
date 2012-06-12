define(['renderer', 'updater', 'player', 'sprite'], function(Renderer, Updater, Player, Sprite) {

    var Game = Class.extend({
        init: function(canvas) {
            this.started = false;

            this.renderer = new Renderer(this, canvas);
            this.updater = new Updater(this);

            this.player = new Player();

            // TODO: REMOVE
            var playerSprite = new Sprite("player");
            playerSprite.loadJSON({
                "id": "player",
                "width": 48,
                "height": 48,
                "animations": {
                    "idle_right": {
                        "length": 1,
                        "row": 0,
                        "column": 0
                    },
                    "run_right": {
                        "length": 3,
                        "row": 0,
                        "column": 1
                    },
                    "jump_right": {
                        "length": 3,
                        "row": 0,
                        "column": 4
                    },
                    "idle_left": {
                        "length": 1,
                        "row": 0,
                        "column": 0,
                        "flipX": true
                    },
                    "run_left": {
                        "length": 3,
                        "row": 0,
                        "column": 1,
                        "flipX": true
                    },
                    "jump_left": {
                        "length": 3,
                        "row": 0,
                        "column": 4,
                        "flipX": true
                    }
                }
            });
            this.player.setSprite(playerSprite);
            this.player.setAnimation('idle_right');
            // END REMOVE

            this.keysDown = {};
            this.keyCount = 1;

            this.entities = {};
        },

        tick: function() {

            this.currentTime = new Date().getTime();

            if (this.started) {
                this.updater.update();
                this.renderer.renderFrame();
            }

            if (this.started) {
                requestAnimFrame(this.tick.bind(this));
            }
        },

        start: function() {
            this.started = true;
            this.tick();
        },

        keyDown: function(event) {
            if (this.started) {
                this.keysDown[event.which] = this.keyCount++;
            }
        },

        keyUp: function(event) {
            if (this.started) {
                delete this.keysDown[event.which];
            }
        },

        forEachVisibleEntity: function(callback) {
            callback(this.player);
        },

        getKey: function(key) {
            if (this.keysDown[key]) {
                return this.keysDown[key];
            } else {
                return -1;
            }
        }

    });

    return Game;

});
