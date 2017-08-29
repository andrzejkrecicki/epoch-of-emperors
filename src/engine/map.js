import Konva from 'konva';

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
        var default_tile;
        if (this.definition.type == 3) {
            // inland
            default_tile = Map.TERRAIN_TILES.GRASS;
        } else {
            default_tile = Map.TERRAIN_TILES.WATER;
        }
        this.terrain_tiles = new Array(RandomMap.SIZES[this.definition.size]);
        this.terrain_tiles.fill(null);
        this.terrain_tiles = this.terrain_tiles.map(() => {
            let arr = new Array(RandomMap.SIZES[this.definition.size]);
            arr.fill(default_tile);
            return arr;
        });

        // Coastal
        if (this.definition.type == 2) {
            this.initializeCoastal();
        }
        this.normalizeNeighbouringTiles();

    }
    initializeCoastal() {
        let total_surface = RandomMap.SIZES[this.definition.size] * RandomMap.SIZES[this.definition.size];
        // 60% - 80% of land
        let desired_land_surface = Math.floor(total_surface * (Math.random() * 2 + 6) / 10);
        let flood_fill_seed = {
            x: Math.floor(RandomMap.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            y: Math.floor(RandomMap.SIZES[this.definition.size] / 2),// + Math.random() * 30 - 60),
            terrain: Map.TERRAIN_TILES.GRASS
        }

        let queue = new MultiSlotQueue();
        queue.push(flood_fill_seed);

        var that = this;
        let visited = {
            get: function(x, y) {
                if (this[x + ";" + y]) return true;
                if (
                    x >= RandomMap.SIZES[that.definition.size] - 2 || 
                    x < 2 ||
                    y >= RandomMap.SIZES[that.definition.size] - 2 ||
                    y < 2
                ) return true;
                return false;
            },
            set: function(x, y) {
                this[x + ";" + y] = true;
            }
        };
        visited.set(flood_fill_seed);


        let current_surface = 1;
        while (!(queue.empty() || current_surface > desired_land_surface)) {
            let tile = queue.pop();

            for (let x = tile.x - 2; x <= tile.x + 2; ++x)
                for (let y = tile.y - 2; y <= tile.y + 2; ++y) {
                    if (Math.abs(x - tile.x) + Math.abs(y - tile.y) != 4) this.terrain_tiles[x][y] = tile.terrain;
                }

            if (!visited.get(tile.x - 1, tile.y)) {
                visited.set(tile.x - 1, tile.y);
                queue.push({ x: tile.x - 1, y: tile.y, terrain: this.randomizedTileTerrain(tile.terrain) });
                ++current_surface;
            }
            if (!visited.get(tile.x + 1, tile.y)) {
                visited.set(tile.x + 1, tile.y);
                queue.push({ x: tile.x + 1, y: tile.y, terrain: this.randomizedTileTerrain(tile.terrain) });
                ++current_surface;
            }
            if (!visited.get(tile.x, tile.y - 1)) {
                visited.set(tile.x, tile.y - 1);
                queue.push({ x: tile.x, y: tile.y - 1, terrain: this.randomizedTileTerrain(tile.terrain) });
                ++current_surface;
            }
            if (!visited.get(tile.x, tile.y + 1)) {
                visited.set(tile.x, tile.y + 1);
                queue.push({ x: tile.x, y: tile.y + 1, terrain: this.randomizedTileTerrain(tile.terrain) });
                ++current_surface;
            }
        }
    }
    randomizedTileTerrain(terrain, prob = .0275) {
        if (Math.random() < prob) {
            if (terrain == Map.TERRAIN_TILES.GRASS) return Map.TERRAIN_TILES.SAND;
            else return Map.TERRAIN_TILES.GRASS;
        } else {
            return terrain;
        }
    }
    normalizeNeighbouringTiles() {
        let size = RandomMap.SIZES[this.definition.size];
        for (let x = 0; x < size; ++x) {
            let prev = this.terrain_tiles[x][0];
            for (let y = 1; y < size; ++y) {
                if (prev == RandomMap.TERRAIN_TILES.WATER && false);
            }
        }
    }
};

class MultiSlotQueue {
    constructor(numOfSlots=5) {
        this.numOfSlots = numOfSlots;
        this.slots = [];
        for (let i = 0; i < this.numOfSlots; ++i) {
            this.slots.push({
               head: 0,
               values: []
            });
        }
    }
    empty() {
        for (let i = 0; i < this.numOfSlots; ++i) {
            if (this.slots[i].values.length > this.slots[i].head) return false;
        }
        return true;
    }
    push(value) {
        var num = Math.floor(Math.random() * this.numOfSlots);
        this.slots[num].values.push(value);
    }
    pop() {
        for (let i = 0; i < this.numOfSlots; ++i) {
            if (this.slots[i].values.length > this.slots[i].head) {
                return this.slots[i].values[this.slots[i].head++];
            }
        }
        throw new Error();
    }

}


export {
    Map, RandomMap
}