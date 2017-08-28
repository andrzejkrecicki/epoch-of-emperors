import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';


class GameViewer {
    constructor(definition, navigator, layers) {
        this.navigator = navigator;
        this.stage = navigator.stage;
        this.layers = layers;

        this.engine = new Engine(definition);

        this.mapDrawable = new MapDrawable(this.engine.map);
        this.layers.terrain_layer.add(this.mapDrawable);
        this.stage.draw();
    }
}


class MapDrawable extends Konva.Group {
    constructor(map) {
        super({
            x: -(Map.SIZES[map.definition.size] * MapDrawable.TILE_SIZE.width / 3),
            y: -(Map.SIZES[map.definition.size] * MapDrawable.TILE_SIZE.height / 3)
        });
        this.map = map;
        this.insertTiles();
    }
    insertTiles() {
        for (let y = 0; y < Map.SIZES[this.map.definition.size]; ++y) {
            let origin = {
                x: y * MapDrawable.TILE_COL_OFFSET.x,
                y: -(Map.SIZES[this.map.definition.size] * MapDrawable.TILE_ROW_OFFSET.y) + (y * MapDrawable.TILE_COL_OFFSET.y)
            };
            for (let x = 0; x < Map.SIZES[this.map.definition.size]; ++x) {
                var tile;
                if (this.map.terrain_tiles[x][y] == 1) {
                    tile = new Konva.Image({
                        x: origin.x,
                        y: origin.y,
                        image: images.grass_00,
                        width: MapDrawable.TILE_SIZE.width,
                        height: MapDrawable.TILE_SIZE.height,
                    });
                } else if (this.map.terrain_tiles[x][y] == 2) {
                    tile = new Konva.Image({
                        x: origin.x,
                        y: origin.y,
                        image: images.sand_00,
                        width: MapDrawable.TILE_SIZE.width,
                        height: MapDrawable.TILE_SIZE.height,
                    });
                }
                tile.transformsEnabled('position');
                tile.listening(false);
                this.add(tile);
                origin.x += MapDrawable.TILE_ROW_OFFSET.x;
                origin.y += MapDrawable.TILE_ROW_OFFSET.y;
            }
        }
        this.cache();
    }
}
MapDrawable.TILE_SIZE = {
    width: 52, height: 32
}
MapDrawable.TILE_ROW_OFFSET = {
    x: 23,
    y: -13
}
MapDrawable.TILE_COL_OFFSET = {
    x: 26,
    y: 17
}

var images = {};
images.grass_00 = new Image();
images.grass_00.src = "img/grass_00.png";

images.sand_00 = new Image();
images.sand_00.src = "img/sand_00.png";


export {
    GameViewer
}