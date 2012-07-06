define(function() {

    var Tile = Class.extend({
        init: function(name, tileset, row, column) {
            this.name = name;
            this.tileset = tileset;
            this.row = row;
            this.column = column;

            this.x = this.column * 24;
            this.y = this.row * 24;
        }
    });

    return Tile;

});
