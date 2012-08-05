define(['lib/alea', 'noise/module/generator/simplex', 'noise/module/generator/gradient',
        'noise/module/transformer/turbulence', 'noise/module/generator/ridgedmulti',
        'noise/module/selector/select', 'noise/module/modifier/invert',
        'noise/module/combiner/multiply', 'noise/module/generator/const'],
        function(Alea, Simplex, Gradient, Turbulence, RidgedMulti, Select,
            Invert, Multiply, Const) {

    var compressChunk = function(chunkArr) {
        var ret = [];
        for (var i=0; i < c.length; i = i + 3) {
            var o = (((c[i] << 8) + (c[i + 1] || 0)) << 8) + (c[i + 2] || 0);
            ret.push(o >> 18 & 0x3f);
            ret.push(o >> 12 & 0x3f);
            ret.push(o >> 6 & 0x3f || 64);
            ret.push(o & 0x3f || 64);
        }
    };

    var baseTerrain = function(x, y) {
        return y > 0 ? 1 : 0;
    };

    var turbulence = function(x, y, mainSource, turbulenceSource, power) {
        var x0 = parseFloat(x + (12414.0 / 65536.0));
        var y0 = parseFloat(y + (65124.0 / 65536.0));
        return mainSource(x, y + (turbulenceSource(x0, y0) * power));
    };

    var WorldGenerator = Class.extend({
        init: function(seed) {
            this.seed = seed;

            this.random = [];
            for (var i = 0; i < 5; i++) {
                this.random[i] = {
                    random: new Alea(this.seed + i)
                };
            }

            var self = this;

            // CONSTANTS
            var constant1 = new Const(1);
            var constant0 = new Const(0);
            var constantNeg1 = new Const(-1);

            // BASE TERRAIN
            var groundGradient = new Gradient({ y1: 1, y2: 0});
            var groundShape = new Simplex(this.random[0]);
            var groundTurb = new Turbulence({
                sourceModule: groundGradient,
                yDistortModule: groundShape,
                power: 0.25
            });

            // CAVES
            var caveShape1 = new RidgedMulti([new Simplex(this.random[1])], 0.55, null, 1);
            var caveBase1 = new Select([constant0, constant1], caveShape1, 0, -0.75, 1);
            var caveShape2 = new RidgedMulti([new Simplex(this.random[2])], 0.55, null, 1);
            var caveBase2 = new Select([constant0, constant1], caveShape1, 0, -0.75, 1);
            var caveMult = new Multiply([caveBase1, caveBase2]);

            var caveTurbX = new Simplex(this.random[3]);
            var caveTurbY = new Simplex(this.random[4]);
            var caveTurb = new Turbulence({
                sourceModule: caveMult,
                xDistortModule: caveTurbX,
                yDistortModule: caveTurbY,
                power: 0.25
            });

            var caveInvert = new Invert(caveTurb);
            var finalTerrain = new Multiply([groundTurb, caveInvert]);

            this.generateTerrain = finalTerrain.getValue.bind(finalTerrain);

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
            if (this.generateTerrain(x, y, 0)) {
                return 1; // Dirt
            } else {
                return 0; // Air
            }

        }
    });

    return WorldGenerator;

});
