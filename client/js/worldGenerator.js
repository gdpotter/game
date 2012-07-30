define(['lib/alea', 'lib/simplexNoise'], function(Alea, SimplexNoise) {

    var WorldGenerator = Class.extend({
        init: function(seed) {
            this.seed = seed;

            this.noise = [];
            for (var i = 0; i < 2; i++) {
                this.noise[i] = new SimplexNoise({
                    random: new Alea(this.seed)
                });
            }
        },

        generateChunk: function(chunkX, chunkY) {
            console.log('Generating ' + chunkX + ', ' + chunkY);
            var i = 0;
            var chunk = [];

            var x;
            var y = chunkY * 16;
            for (i = 0; i < 256; i++) {
                x = i % 16;
                if (x === 0) {
                    y++;
                }
                chunk[i] = this.generateTile(x/16 + chunkX, y/16);
                if (chunk[i] == 1 && i >= 16 && chunk[i - 16] === 0) {
                    chunk[i] = 2; // Grass
                }
            }

            return chunk;
        },

        generateTile: function(x, y) {
            if (this.generateTerrain(x, y)) {
                return 1; // Dirt
            } else {
                return 0; // Air
            }

        },
        getGradientValue: function(x, y) {
            return y > 0 ? 1 : 0;
        },
        generateTerrain: function(x, y) {
            var x0 = parseFloat(x + (12414.0 / 65536.0));
            var y0 = parseFloat(y + (65124.0 / 65536.0));
            return this.getGradientValue(x, y + ((this.noise[0].noise(x0, y0) * 0.25)));
        }
    });

    return WorldGenerator;

});
