import Konva from 'konva';
import { BFSWalker, MultiSlotQueue } from './algorithms.js';
import { rand_choice, to_binary } from '../utils.js';
import { PineTree, LeafTree, PalmTree } from './trees.js';
import { MapDrawable } from '../viewer.js';

class Map {
    constructor(definition) {
        this.definition = definition;
        this.entities = [];
    }
    isShore(x, y) {
        return (
            this.initial_tiles[x][y] == Map.TERRAIN_TYPES.SAND ||
            this.initial_tiles[x][y] == Map.TERRAIN_TYPES.WATER
        ) && (
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_4 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_6 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_8 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_3 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_2 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_9 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_1 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.SANDWATER_7 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.WATERSAND_7 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.WATERSAND_1 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.WATERSAND_3 ||
            this.terrain_tiles[x][y] == Map.TERRAIN_TYPES.WATERSAND_9
        )
    }
}
Map.SIZES = [128, 256, 512];
Map.TERRAIN_TYPES = {
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
    GRASSSAND_4: 15,
    GRASSSAND_6: 16,
    GRASSSAND_8: 17,
    GRASSSAND_3: 18,
    GRASSSAND_2: 19,
    GRASSSAND_9: 20,
    GRASSSAND_1: 21,
    GRASSSAND_7: 22,
    SANDGRASS_0: 23,
    SANDGRASS_2: 24,
    SANDGRASS_2_8: 25,
    SANDGRASS_4: 26,
    SANDGRASS_4_6: 27,
    SANDGRASS_6: 28,
    SANDGRASS_8: 29,
    SANDGRASS_0: 30
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
        let size = Map.SIZES[this.definition.size];
        this.terrain_tiles = new Array(size).fill(null).map(() => {
            return new Array(size).fill(this.constructor.DEFAULT_TILE);
        });

        // subtiles represent map tiles divided into 4 subtiles to allow
        // support for objects smaller than whole tile.
        this.subtiles_map = new Array(size * 2).fill(null).map(() => {
            return new Array(size * 2).fill(null);
        }); 

        this.randomizeTerrain();
        this.normalizeNeighbouringTiles();
        this.plantTrees();

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
    areSubtilesEmpty(subtile_x, subtile_y, width) {
        for (let x = subtile_x; x < subtile_x + width; ++x)
            for (let y = subtile_y; y < subtile_y + width; ++y)
                if (this.subtiles_map[x][y] != null) return false;
        return true;
    }
    fillSubtilesWith(x, y, width, obj) {
        for (let _x = x; _x < x + width; ++_x)
            for (let _y = y; _y < y + width; ++_y) {
                if (obj instanceof Villager) console.log(_x, _y);
                this.subtiles_map[_x][_y] = obj;
            }
    }
    getEntityAtSubtile(x, y) {
        return this.subtiles_map[x][y];
    }
    isSuitableForTree(x, y) {
        // values are multiplied by 2 to get recalculated to subtiles coordinates
        if (x < 200 && x > 160 && y < 200 && y > 160) return false;
        return this.areSubtilesEmpty(x * 2, y * 2, 2) && this.terrain_tiles[x][y] !== Map.TERRAIN_TYPES.WATER && !this.isShore(x, y);
    }
    }
    plantTrees() {
        let size = Map.SIZES[this.definition.size];
        let that = this;

        let desired_total_forest_surface = Math.floor(.3 * this.land_surface);
        let total_forest_surface = 0;

        let forest_surface_id = new Array(size).fill(null).map(() => new Array(size).fill(1e9));
        let forest_id = 0;

        while (total_forest_surface < desired_total_forest_surface) {
            let seed = {
                x: Math.floor(Math.random() * size),
                y: Math.floor(Math.random() * size)
            }
            while (!this.isSuitableForTree(seed.x, seed.y)) {
                seed = {
                    x: Math.floor(Math.random() * size),
                    y: Math.floor(Math.random() * size)
                }
            }
            let current_forest_surface = 0;
            let desired_current_forest_surface = Math.floor((Math.random() * .1 + .025) * desired_total_forest_surface);

            let ForestType = rand_choice([LeafTree, PalmTree, PineTree]);

            let walker = new BFSWalker(seed, new MultiSlotQueue(2), function(node) {
                    if (Math.random() > .8) return;
                    if (forest_surface_id[node.x][node.y] < forest_id) return;
                    if (!that.isSuitableForTree(node.x, node.y)) return;

                    let tree = new ForestType(node.x * 2, node.y * 2);
                    that.fillSubtilesWith(node.x * 2, node.y * 2, ForestType.SUBTILE_WIDTH, tree);
                    that.entities.push(tree);

                    for (let x = node.x - 2; x <= node.x + 2; ++x) {
                        for (let y = node.y - 2; y <= node.y + 2; ++y) {
                            if (x >= 0 && x < size && y >= 0 && y < size && forest_surface_id[x][y] >= forest_id)
                                forest_surface_id[x][y] = forest_id;
                        }
                    }

                    ++current_forest_surface;
                    ++total_forest_surface;
                }, function(x, y, node) {
                    return { x: x, y: y }
                }, function() {
                    return current_forest_surface > desired_current_forest_surface ||
                        total_forest_surface > desired_total_forest_surface
                }, 0, size - 1
            );
            walker.run();
            ++forest_id;
        }

    }
    normalizeNeighbouringTiles() {
        let size = Map.SIZES[this.definition.size];

        this.initial_tiles = new Array(size).fill(null).map(() => new Array(size).fill(0));
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
                    if (this.initial_tiles[x][y] != Map.TERRAIN_TYPES.WATER) {
                        let neighbours_vector = this.getNeighboursIdentityVector(x, y, [Map.TERRAIN_TYPES.SAND, Map.TERRAIN_TYPES.GRASS]);

                        let bitmask = Number.parseInt(neighbours_vector.join(""), 2);

                        if (!(bitmask in RandomMap.SAND_TRANSFORMATIONS)) {
                            changes_pending = true;
                            for (let i = 0, vec; vec = Map.ALL_NEIGHBOURS_DELTA[i++];) {
                                let nx = x + vec.x;
                                let ny = y + vec.y;
                                this.terrain_tiles[nx][ny] = Map.TERRAIN_TYPES.WATER;
                                this.initial_tiles[nx][ny] = Map.TERRAIN_TYPES.WATER;
                            }
                            this.terrain_tiles[x][y] = Map.TERRAIN_TYPES.WATER;
                            this.initial_tiles[x][y] = Map.TERRAIN_TYPES.WATER;
                        }
                    }
                }
            }
        }

        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                if (this.initial_tiles[x][y] !== Map.TERRAIN_TYPES.WATER) {
                    let neighbours_vector = this.getNeighboursIdentityVector(x, y, [Map.TERRAIN_TYPES.SAND, Map.TERRAIN_TYPES.GRASS]);

                    let bitmask = Number.parseInt(neighbours_vector.join(""), 2);

                    if (bitmask !== 255 && bitmask in RandomMap.SAND_TRANSFORMATIONS) {
                        this.terrain_tiles[x][y] = RandomMap.SAND_TRANSFORMATIONS[bitmask];
                        if (this.initial_tiles[x][y] == Map.TERRAIN_TYPES.GRASS) {
                            this.initial_tiles[x][y] = Map.TERRAIN_TYPES.SAND;
                        }
                    }
                }
            }
        }

        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                if (this.initial_tiles[x][y] == Map.TERRAIN_TYPES.GRASS) {
                    let neighbours_vector = this.getNeighboursIdentityVector(x, y, [Map.TERRAIN_TYPES.GRASS]);

                    let bitmask = Number.parseInt(neighbours_vector.join(""), 2);

                    if (bitmask in RandomMap.GRASS_TRANSFORMATIONS) {
                        this.terrain_tiles[x][y] = RandomMap.GRASS_TRANSFORMATIONS[bitmask];
                    } else {
                        this.terrain_tiles[x][y] = Map.TERRAIN_TYPES.SANDGRASS_0;
                    }
                }
            }
        }
    }
}
RandomMap.SAND_TRANSFORMATIONS = {
    255: Map.TERRAIN_TYPES.SAND,
    254: Map.TERRAIN_TYPES.SANDWATER_3,
    253: Map.TERRAIN_TYPES.SANDWATER_8,
    252: Map.TERRAIN_TYPES.SANDWATER_8,
    251: Map.TERRAIN_TYPES.SANDWATER_1,
    249: Map.TERRAIN_TYPES.SANDWATER_8,
    248: Map.TERRAIN_TYPES.SANDWATER_8,
    247: Map.TERRAIN_TYPES.SANDWATER_4,
    246: Map.TERRAIN_TYPES.SANDWATER_4,
    244: Map.TERRAIN_TYPES.WATERSAND_7,
    240: Map.TERRAIN_TYPES.WATERSAND_7,
    239: Map.TERRAIN_TYPES.SANDWATER_6,
    235: Map.TERRAIN_TYPES.SANDWATER_6,
    233: Map.TERRAIN_TYPES.WATERSAND_9,
    232: Map.TERRAIN_TYPES.WATERSAND_9,
    223: Map.TERRAIN_TYPES.SANDWATER_9,
    215: Map.TERRAIN_TYPES.SANDWATER_4,
    214: Map.TERRAIN_TYPES.SANDWATER_4,
    212: Map.TERRAIN_TYPES.WATERSAND_7,
    208: Map.TERRAIN_TYPES.WATERSAND_7,
    191: Map.TERRAIN_TYPES.SANDWATER_2,
    159: Map.TERRAIN_TYPES.SANDWATER_2,
    151: Map.TERRAIN_TYPES.WATERSAND_1,
    150: Map.TERRAIN_TYPES.WATERSAND_1,
    127: Map.TERRAIN_TYPES.SANDWATER_7,
    111: Map.TERRAIN_TYPES.SANDWATER_6,
    107: Map.TERRAIN_TYPES.SANDWATER_6,
    105: Map.TERRAIN_TYPES.WATERSAND_9,
    104: Map.TERRAIN_TYPES.WATERSAND_9,
    63: Map.TERRAIN_TYPES.SANDWATER_2,
    47: Map.TERRAIN_TYPES.WATERSAND_3,
    43: Map.TERRAIN_TYPES.WATERSAND_3,
    31: Map.TERRAIN_TYPES.SANDWATER_2,
    23: Map.TERRAIN_TYPES.WATERSAND_1,
    22: Map.TERRAIN_TYPES.WATERSAND_1,
    15: Map.TERRAIN_TYPES.WATERSAND_3,
    11: Map.TERRAIN_TYPES.WATERSAND_3,
};
RandomMap.LEGAL_MASKS = Object.keys(RandomMap.SAND_TRANSFORMATIONS);

RandomMap.GRASS_TRANSFORMATIONS = {
    2: Map.TERRAIN_TYPES.SANDGRASS_8,
    8: Map.TERRAIN_TYPES.SANDGRASS_4,
    11: Map.TERRAIN_TYPES.GRASSSAND_7,
    12: Map.TERRAIN_TYPES.SANDGRASS_4,
    15: Map.TERRAIN_TYPES.GRASSSAND_7,
    16: Map.TERRAIN_TYPES.SANDGRASS_6,
    17: Map.TERRAIN_TYPES.SANDGRASS_6,
    20: Map.TERRAIN_TYPES.SANDGRASS_6,
    21: Map.TERRAIN_TYPES.SANDGRASS_6,
    22: Map.TERRAIN_TYPES.GRASSSAND_9,
    23: Map.TERRAIN_TYPES.GRASSSAND_9,
    24: Map.TERRAIN_TYPES.SANDGRASS_4_6,
    25: Map.TERRAIN_TYPES.SANDGRASS_4_6,
    26: Map.TERRAIN_TYPES.SANDGRASS_0,
    27: Map.TERRAIN_TYPES.GRASSSAND_7,
    30: Map.TERRAIN_TYPES.GRASSSAND_9,
    31: Map.TERRAIN_TYPES.GRASSSAND_2,
    34: Map.TERRAIN_TYPES.SANDGRASS_8,
    41: Map.TERRAIN_TYPES.SANDGRASS_4,
    43: Map.TERRAIN_TYPES.GRASSSAND_7,
    47: Map.TERRAIN_TYPES.GRASSSAND_7,
    48: Map.TERRAIN_TYPES.SANDGRASS_6,
    49: Map.TERRAIN_TYPES.SANDGRASS_6,
    54: Map.TERRAIN_TYPES.GRASSSAND_9,
    55: Map.TERRAIN_TYPES.GRASSSAND_9,
    57: Map.TERRAIN_TYPES.SANDGRASS_4_6,
    59: Map.TERRAIN_TYPES.GRASSSAND_7,
    61: Map.TERRAIN_TYPES.SANDGRASS_4_6,
    62: Map.TERRAIN_TYPES.GRASSSAND_9,
    63: Map.TERRAIN_TYPES.GRASSSAND_2,
    64: Map.TERRAIN_TYPES.SANDGRASS_2,
    65: Map.TERRAIN_TYPES.SANDGRASS_2,
    66: Map.TERRAIN_TYPES.SANDGRASS_2_8,
    68: Map.TERRAIN_TYPES.SANDGRASS_2,
    69: Map.TERRAIN_TYPES.SANDGRASS_2,
    71: Map.TERRAIN_TYPES.SANDGRASS_2_8,
    75: Map.TERRAIN_TYPES.GRASSSAND_7,
    79: Map.TERRAIN_TYPES.GRASSSAND_7,
    86: Map.TERRAIN_TYPES.GRASSSAND_9,
    87: Map.TERRAIN_TYPES.GRASSSAND_9,
    90: Map.TERRAIN_TYPES.GRASS,
    91: Map.TERRAIN_TYPES.GRASSSAND_7,
    94: Map.TERRAIN_TYPES.GRASSSAND_9,
    95: Map.TERRAIN_TYPES.GRASSSAND_2,
    104: Map.TERRAIN_TYPES.GRASSSAND_1,
    105: Map.TERRAIN_TYPES.GRASSSAND_1,
    106: Map.TERRAIN_TYPES.GRASSSAND_1,
    107: Map.TERRAIN_TYPES.GRASSSAND_6,
    108: Map.TERRAIN_TYPES.GRASSSAND_1,
    109: Map.TERRAIN_TYPES.GRASSSAND_1,
    110: Map.TERRAIN_TYPES.GRASSSAND_1,
    111: Map.TERRAIN_TYPES.GRASSSAND_6,
    118: Map.TERRAIN_TYPES.GRASSSAND_9,
    119: Map.TERRAIN_TYPES.GRASSSAND_9,
    120: Map.TERRAIN_TYPES.GRASSSAND_1,
    121: Map.TERRAIN_TYPES.GRASSSAND_1,
    122: Map.TERRAIN_TYPES.GRASSSAND_1,
    123: Map.TERRAIN_TYPES.GRASSSAND_6,
    124: Map.TERRAIN_TYPES.GRASSSAND_1,
    125: Map.TERRAIN_TYPES.GRASSSAND_1,
    126: Map.TERRAIN_TYPES.GRASS,
    127: Map.TERRAIN_TYPES.GRASS,
    130: Map.TERRAIN_TYPES.SANDGRASS_8,
    136: Map.TERRAIN_TYPES.SANDGRASS_4,
    139: Map.TERRAIN_TYPES.GRASSSAND_7,
    140: Map.TERRAIN_TYPES.SANDGRASS_4,
    143: Map.TERRAIN_TYPES.GRASSSAND_7,
    150: Map.TERRAIN_TYPES.GRASSSAND_9,
    151: Map.TERRAIN_TYPES.GRASSSAND_9,
    155: Map.TERRAIN_TYPES.GRASSSAND_7,
    158: Map.TERRAIN_TYPES.GRASSSAND_9,
    159: Map.TERRAIN_TYPES.GRASSSAND_2,
    171: Map.TERRAIN_TYPES.GRASSSAND_7,
    175: Map.TERRAIN_TYPES.GRASSSAND_7,
    182: Map.TERRAIN_TYPES.GRASSSAND_9,
    183: Map.TERRAIN_TYPES.GRASSSAND_9,
    187: Map.TERRAIN_TYPES.GRASSSAND_7,
    190: Map.TERRAIN_TYPES.GRASSSAND_9,
    191: Map.TERRAIN_TYPES.GRASSSAND_2,
    203: Map.TERRAIN_TYPES.GRASSSAND_7,
    207: Map.TERRAIN_TYPES.GRASSSAND_7,
    208: Map.TERRAIN_TYPES.GRASSSAND_3,
    209: Map.TERRAIN_TYPES.GRASSSAND_3,
    210: Map.TERRAIN_TYPES.GRASSSAND_3,
    211: Map.TERRAIN_TYPES.GRASSSAND_3,
    212: Map.TERRAIN_TYPES.GRASSSAND_3,
    213: Map.TERRAIN_TYPES.GRASSSAND_3,
    214: Map.TERRAIN_TYPES.GRASSSAND_4,
    215: Map.TERRAIN_TYPES.GRASSSAND_4,
    216: Map.TERRAIN_TYPES.GRASSSAND_3,
    217: Map.TERRAIN_TYPES.GRASSSAND_3,
    218: Map.TERRAIN_TYPES.GRASSSAND_3,
    219: Map.TERRAIN_TYPES.GRASS,
    220: Map.TERRAIN_TYPES.GRASSSAND_3,
    221: Map.TERRAIN_TYPES.GRASSSAND_3,
    222: Map.TERRAIN_TYPES.GRASSSAND_4,
    223: Map.TERRAIN_TYPES.GRASS,
    232: Map.TERRAIN_TYPES.GRASSSAND_1,
    233: Map.TERRAIN_TYPES.GRASSSAND_1,
    234: Map.TERRAIN_TYPES.GRASSSAND_1,
    235: Map.TERRAIN_TYPES.GRASSSAND_6,
    236: Map.TERRAIN_TYPES.GRASSSAND_1,
    237: Map.TERRAIN_TYPES.GRASSSAND_1,
    238: Map.TERRAIN_TYPES.GRASSSAND_1,
    239: Map.TERRAIN_TYPES.GRASSSAND_6,
    240: Map.TERRAIN_TYPES.GRASSSAND_3,
    241: Map.TERRAIN_TYPES.GRASSSAND_3,
    242: Map.TERRAIN_TYPES.GRASSSAND_3,
    243: Map.TERRAIN_TYPES.GRASSSAND_3,
    244: Map.TERRAIN_TYPES.GRASSSAND_3,
    245: Map.TERRAIN_TYPES.GRASSSAND_3,
    246: Map.TERRAIN_TYPES.GRASSSAND_4,
    247: Map.TERRAIN_TYPES.GRASSSAND_4,
    248: Map.TERRAIN_TYPES.GRASSSAND_8,
    249: Map.TERRAIN_TYPES.GRASSSAND_8,
    250: Map.TERRAIN_TYPES.GRASSSAND_8,
    251: Map.TERRAIN_TYPES.GRASS,
    252: Map.TERRAIN_TYPES.GRASSSAND_8,
    253: Map.TERRAIN_TYPES.GRASSSAND_8,
    254: Map.TERRAIN_TYPES.GRASS,
    255: Map.TERRAIN_TYPES.GRASS
}



class CoastalMap extends RandomMap {
    randomizeTerrain() {
        let total_surface = Map.SIZES[this.definition.size] * Map.SIZES[this.definition.size];
        // 60% - 80% of land
        let desired_land_surface = Math.floor(total_surface * (Math.random() * 2 + 6) / 10);
        this.land_surface = 1;

        let seed = {
            x: Math.floor(Map.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            y: Math.floor(Map.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            terrain: Map.TERRAIN_TYPES.GRASS
        }

        let that = this;
        let walker = new BFSWalker(seed, new MultiSlotQueue(), function(tile) {
                tile.terrain = that.mutateTerrain(tile.terrain);
                for (let x = tile.x - 2; x <= tile.x + 2; ++x)
                    for (let y = tile.y - 2; y <= tile.y + 2; ++y) {
                        if (Math.abs(x - tile.x) + Math.abs(y - tile.y) != 4) that.terrain_tiles[x][y] = tile.terrain;
                    }
            }, function(x, y, tile) {
                ++that.land_surface;
                return {
                    x: x,
                    y: y,
                    terrain: tile.terrain
                }
            }, function() {
                return that.land_surface > desired_land_surface
            }, 2, Map.SIZES[this.definition.size] - 2 - 1
        );
        walker.run();
    }
    mutateTerrain(terrain, prob = .0275) {
        if (Math.random() < prob) {
            if (terrain == Map.TERRAIN_TYPES.GRASS) return Map.TERRAIN_TYPES.SAND;
            else return Map.TERRAIN_TYPES.GRASS;
        } else {
            return terrain;
        }
    }
}
CoastalMap.DEFAULT_TILE = Map.TERRAIN_TYPES.WATER;


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