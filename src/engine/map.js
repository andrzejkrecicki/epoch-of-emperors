import Konva from 'konva';
import { BFSWalker, MultiSlotQueue } from './algorithms.js';
import { rand_choice, to_binary } from '../utils.js';
import { PineTree, LeafTree, PalmTree } from './trees.js';
import { MapDrawable } from '../viewer.js';
import { TERRAIN_TYPES, SAND_TRANSFORMATIONS, GRASS_TRANSFORMATIONS } from './terrain.js'

class Map {
    constructor(definition) {
        this.definition = definition;
        this.entities = [];
        this.edge_size = Map.SIZES[this.definition.size];
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
Map.TERRAIN_TYPES = TERRAIN_TYPES;
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
        // this.plantTrees();
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
                    if (node.x == 128 && node.y == 128) return;

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
RandomMap.SAND_TRANSFORMATIONS = SAND_TRANSFORMATIONS;
RandomMap.LEGAL_MASKS = Object.keys(RandomMap.SAND_TRANSFORMATIONS);
RandomMap.GRASS_TRANSFORMATIONS = GRASS_TRANSFORMATIONS;



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