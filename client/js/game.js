define(['renderer', 'updater', 'player', 'sprite', 'map'], function(Renderer, Updater, Player, Sprite, Map) {

    var Game = Class.extend({
        init: function(canvas) {
            this.started = false;

            this.renderer = new Renderer(this, canvas);
            this.updater = new Updater(this);

            this.player = new Player();

            this.loadedChunks = {};

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
            this.loadMap();
            this.loadChunks();
            // END REMOVE

            this.keysDown = {};
            this.keyCount = 1;

            this.entities = {};
        },

        loadMap: function() {
            this.map = new Map(this);

            this.map.loadMap('world.json');
        },

        loadChunks: function() {
            var playerChunkX = Math.floor(this.player.x / (24 * 16));
            var playerChunkY = Math.floor(this.player.y / (24 * 16));

            // Load 25 chunks
            this.loadedChunks = {};
            var currentTime = new Date().getTime();
            for (var x = playerChunkX - 2; x <= playerChunkX + 2; x++) {
                for (var y = playerChunkY - 2; y <= playerChunkY + 2; y++) {
                    this.loadedChunks[x + ',' + y] = currentTime;
                }
            }

            /*// Kill off old chunks if neccessary
            var chunkArray = [];
            for (var chunk in this.loadedChunks) {
                chunkArray.push([chunk, this.loadedChunks[chunk]]);
            }*/
        },

        tick: function() {

            this.renderer.renderFrame();

            if (this.started) {
                requestAnimationFrame(this.tick.bind(this), this.canvas);
            }
        },

        startPhysics: function() {
            var self = this;
            this.physicsLoop = setInterval(function() {
                self.currentTime = new Date().getTime();
                self.updater.update();
            }, 15);
        },

        start: function() {
            this.started = true;
            this.startPhysics();
            this.tick();
        },

        keyDown: function(event) {
            if (this.started && this.keysDown[event.which] != -1) {
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

        forEachEntity: function(callback) {
            callback(this.player);
        },

        getKey: function(key, remove) {
            if (this.keysDown[key]) {
                var keyNum = this.keysDown[key];
                if (remove) {
                    this.keysDown[key] = -1;
                }
                return keyNum;
            } else {
                return -1;
            }
        }

    });

    return Game;

});
