import Konva from 'konva';
import { BFSWalker, MultiSlotQueue } from './algorithms.js';
import { to_binary } from '../utils.js';

class Map {
    constructor(definition) {
        this.definition = definition;
    }
}
Map.SIZES = [128, 256, 512];
Map.TERRAIN_TILES = {
    WATER: 0,
    GRASS: 1,
    SAND: 2,
    SANDWATER_4: 3,
    SANDWATER_6: 4,
    SANDWATER_8: 5,
    SANDWATER_3: 6,
    SANDWATER_2: 7,
    SANDWATER_9: 8,
    SANDWATER_1: 9,
    SANDWATER_7: 10,
    WATERSAND_7: 11,
    WATERSAND_1: 12,
    WATERSAND_3: 13,
    WATERSAND_9: 14,
}
Map.ALL_NEIGHBOURS_DELTA = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 },
    { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
];


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
    getNeighboursIdentityVector(x, y, synonyms=[]) {
        let neighbours_vector = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0, delta; delta = Map.ALL_NEIGHBOURS_DELTA[i]; ++i) {
            let nx = x + delta.x;
            let ny = y + delta.y;
            nx = Math.max(Math.min(Map.SIZES[this.definition.size] - 1, nx), 0);
            ny = Math.max(Math.min(Map.SIZES[this.definition.size] - 1, ny), 0);
            neighbours_vector[i] = +(synonyms.indexOf(this.initial_tiles[nx][ny]) != -1);
        }
        return neighbours_vector
    }
    normalizeNeighbouringTiles() {
        let size = Map.SIZES[this.definition.size];
        this.initial_tiles = (new Array(size)).fill(null).map(() => (new Array(size).fill(0)));

        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                this.initial_tiles[x][y] = this.terrain_tiles[x][y];
            }
        }


        let changes_pending = true;
        while (changes_pending) {
            changes_pending = false;
            for (let y = 1; y < size - 1; ++y) {
                for (let x = 1; x < size - 1; ++x) {
                    if (this.initial_tiles[x][y] != Map.TERRAIN_TILES.WATER) {
                        let neighbours_vector = this.getNeighboursIdentityVector(x, y, [Map.TERRAIN_TILES.SAND, Map.TERRAIN_TILES.GRASS]);

                        let bitmask = Number.parseInt(neighbours_vector.join(""), 2);

                        if (!(bitmask in RandomMap.SAND_TRANSFORMATIONS)) {
                            changes_pending = true;
                            for (let i = 0, vec; vec = Map.ALL_NEIGHBOURS_DELTA[i++];) {
                                let nx = x + vec.x;
                                let ny = y + vec.y;
                                this.terrain_tiles[nx][ny] = Map.TERRAIN_TILES.WATER;
                                this.initial_tiles[nx][ny] = Map.TERRAIN_TILES.WATER;
                            }
                            this.terrain_tiles[x][y] = Map.TERRAIN_TILES.WATER;
                            this.initial_tiles[x][y] = Map.TERRAIN_TILES.WATER;
                        }
                    }
                }
            }
        }

        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                if (this.initial_tiles[x][y] !== Map.TERRAIN_TILES.WATER) {
                    let neighbours_vector = this.getNeighboursIdentityVector(x, y, [Map.TERRAIN_TILES.SAND, Map.TERRAIN_TILES.GRASS]);

                    let bitmask = Number.parseInt(neighbours_vector.join(""), 2);

                    if (bitmask !== 255 && bitmask in RandomMap.SAND_TRANSFORMATIONS) {
                        this.terrain_tiles[x][y] = RandomMap.SAND_TRANSFORMATIONS[bitmask];
                    }
                }
            }
        }
    }
}
RandomMap.SAND_TRANSFORMATIONS = {
    254: Map.TERRAIN_TILES.SANDWATER_3,
    253: Map.TERRAIN_TILES.SANDWATER_8,
    252: Map.TERRAIN_TILES.SANDWATER_8,
    251: Map.TERRAIN_TILES.SANDWATER_1,
    249: Map.TERRAIN_TILES.SANDWATER_8,
    248: Map.TERRAIN_TILES.SANDWATER_8,
    247: Map.TERRAIN_TILES.SANDWATER_4,
    246: Map.TERRAIN_TILES.SANDWATER_4,
    244: Map.TERRAIN_TILES.WATERSAND_7,
    240: Map.TERRAIN_TILES.WATERSAND_7,
    239: Map.TERRAIN_TILES.SANDWATER_6,
    235: Map.TERRAIN_TILES.SANDWATER_6,
    233: Map.TERRAIN_TILES.WATERSAND_9,
    232: Map.TERRAIN_TILES.WATERSAND_9,
    223: Map.TERRAIN_TILES.SANDWATER_9,
    215: Map.TERRAIN_TILES.SANDWATER_4,
    214: Map.TERRAIN_TILES.SANDWATER_4,
    212: Map.TERRAIN_TILES.WATERSAND_7,
    208: Map.TERRAIN_TILES.WATERSAND_7,
    191: Map.TERRAIN_TILES.SANDWATER_2,
    159: Map.TERRAIN_TILES.SANDWATER_2,
    151: Map.TERRAIN_TILES.WATERSAND_1,
    150: Map.TERRAIN_TILES.WATERSAND_1,
    127: Map.TERRAIN_TILES.SANDWATER_7,
    111: Map.TERRAIN_TILES.SANDWATER_6,
    107: Map.TERRAIN_TILES.SANDWATER_6,
    105: Map.TERRAIN_TILES.WATERSAND_9,
    104: Map.TERRAIN_TILES.WATERSAND_9,
    63: Map.TERRAIN_TILES.SANDWATER_2,
    47: Map.TERRAIN_TILES.WATERSAND_3,
    43: Map.TERRAIN_TILES.WATERSAND_3,
    31: Map.TERRAIN_TILES.SANDWATER_2,
    23: Map.TERRAIN_TILES.WATERSAND_1,
    22: Map.TERRAIN_TILES.WATERSAND_1,
    15: Map.TERRAIN_TILES.WATERSAND_3,
    11: Map.TERRAIN_TILES.WATERSAND_3,
};
RandomMap.LEGAL_MASKS = Object.keys(RandomMap.SAND_TRANSFORMATIONS);



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