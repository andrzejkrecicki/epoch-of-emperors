import Konva from 'konva';
import { BFSWalker, MultiSlotQueue } from './algorithms.js';

class Map {
    constructor(definition) {
        this.definition = definition;
    }
}
Map.SIZES = [128, 256, 512];
Map.TERRAIN_TILES = {
    WATER: 0,
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
            arr.fill(this.constructor.DEFAULT_TILE);
            return arr;
        });

        this.randomizeTerrain();
        this.normalizeNeighbouringTiles();

    }

class CoastalMap extends RandomMap {
    randomizeTerrain() {
        let total_surface = RandomMap.SIZES[this.definition.size] * RandomMap.SIZES[this.definition.size];
        // 60% - 80% of land
        let desired_land_surface = Math.floor(total_surface * (Math.random() * 2 + 6) / 10);
        let current_surface = 1;

        let seed = {
            x: Math.floor(RandomMap.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            y: Math.floor(RandomMap.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            terrain: Map.TERRAIN_TILES.GRASS
        }

        let that = this;
        let walker = new BFSWalker(seed, new MultiSlotQueue(), function(tile) {
                tile.terrain = that.mutateTerrain(tile.terrain);
                for (let x = tile.x - 2; x <= tile.x + 2; ++x)
                    for (let y = tile.y - 2; y <= tile.y + 2; ++y) {
                        if (Math.abs(x - tile.x) + Math.abs(y - tile.y) != 4) that.terrain_tiles[x][y] = tile.terrain;
                    }
            }, function(x, y, tile) {
                ++current_surface;
                return {
                    x: x,
                    y: y,
                    terrain: tile.terrain
                }
            }, function() {
                return current_surface > desired_land_surface
            }, 2, RandomMap.SIZES[this.definition.size] - 2 - 1
        );
        walker.run();
    }
    mutateTerrain(terrain, prob = .0275) {
        if (Math.random() < prob) {
            if (terrain == Map.TERRAIN_TILES.GRASS) return Map.TERRAIN_TILES.SAND;
            else return Map.TERRAIN_TILES.GRASS;
        } else {
            return terrain;
        }
    }
}
CoastalMap.DEFAULT_TILE = Map.TERRAIN_TILES.WATER;


function MapFactory(definition) {
    if (definition.random) {
        return new (MapFactory.TYPES_CONSTRUCTOR[definition.type])(definition);
    } else {
        //
    }
}
MapFactory.TYPES_CONSTRUCTOR = {
    // 0: SmallIslandsMap,
    // 1: LargeIslandsMap,
    2: CoastalMap,
    // 3: InlandMap
}

export {
    Map, RandomMap, MapFactory
}