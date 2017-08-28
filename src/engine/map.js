import Konva from 'konva';

class Map {
    constructor(definition) {
        this.definition = definition;
    }
}
Map.SIZES = [128, 256, 512];
Map.TERRAIN_TILES = {
    GRASS: 1,
    SAND: 2
}

class RandomMap extends Map {
    constructor(definition) {
        super(...arguments);
        this.generate();
    }
    generate() {
        this.terrain_tiles = new Array(RandomMap.SIZES[this.definition.size]);
        this.terrain_tiles.fill(null);
        this.terrain_tiles = this.terrain_tiles.map(() => {
            let arr = new Array(RandomMap.SIZES[this.definition.size]);
            arr.fill(1);
            arr = arr.map(function() {
                if (Math.random() > .8) return Map.TERRAIN_TILES.SAND;
                else return Map.TERRAIN_TILES.GRASS;
            });
            return arr;
        });
    }
};


export {
    Map, RandomMap
}