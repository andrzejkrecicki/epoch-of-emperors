import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';
import { make_image } from './utils.js';


class GameViewer {
    constructor(definition, navigator, layers) {
        this.navigator = navigator;
        this.stage = navigator.stage;
        this.layers = layers;

        this.engine = new Engine(definition);

        this.mapDrawable = new MapDrawable(this.engine.map, this.stage);
        this.layers.terrain_layer.add(this.mapDrawable);
        this.stage.draw();

        this.initializeTemporaryScrolling();
    }
    initializeTemporaryScrolling() {
        this.layers.terrain_layer.on("mousemove", (e) => {
            if (e.evt.layerX < 30) {
                this.mapDrawable.x(this.mapDrawable.x() + 20);
                this.stage.draw();
            } else if (e.evt.layerX > this.stage.width() - 30) {
                this.mapDrawable.x(this.mapDrawable.x() - 20);
                this.stage.draw();
            }

            if (e.evt.layerY < 30) {
                this.mapDrawable.y(this.mapDrawable.y() + 20);
                this.stage.draw();
            } else if (e.evt.layerY > this.stage.height() - 30) {
                this.mapDrawable.y(this.mapDrawable.y() - 20);
                this.stage.draw();
            }
        });
    }
}


class MapDrawable extends Konva.Group {
    constructor(map, stage) {
        super({
            x: -Math.round(Map.SIZES[map.definition.size] * MapDrawable.TILE_SIZE.width / 2 - stage.width() / 2),
            y: -Math.round(Map.SIZES[map.definition.size] * MapDrawable.TILE_SIZE.height / 2 - stage.height() / 2)
        });
        this.map = map;
        this.insertTiles();
    }
    insertTiles() {
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.setAttribute("width", Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.width);
        tmpCanvas.setAttribute("height", Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.height);
        var tmpCtx = tmpCanvas.getContext('2d');

        for (let y = 0; y < Map.SIZES[this.map.definition.size]; ++y) {
            let origin = {
                x: y * MapDrawable.TILE_COL_OFFSET.x,
                y: -(Map.SIZES[this.map.definition.size] * MapDrawable.TILE_ROW_OFFSET.y) + (y * MapDrawable.TILE_COL_OFFSET.y)
            };
            for (let x = 0; x < Map.SIZES[this.map.definition.size]; ++x) {
                tmpCtx.drawImage(images[this.map.terrain_tiles[x][y]], origin.x, origin.y);

                origin.x += MapDrawable.TILE_ROW_OFFSET.x;
                origin.y += MapDrawable.TILE_ROW_OFFSET.y;
            }
        }
        this.add(new Konva.Image({
            x: 0,
            y: 0,
            image: tmpCanvas,
            width: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.width,
            height: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.height
        }));
        this.cache();
    }
}
MapDrawable.TILE_SIZE = {
    width: 64, height: 32
}
MapDrawable.TILE_ROW_OFFSET = {
    x: 32,
    y: -16
}
MapDrawable.TILE_COL_OFFSET = {
    x: MapDrawable.TILE_SIZE.width - MapDrawable.TILE_ROW_OFFSET.x,
    y: MapDrawable.TILE_SIZE.height + MapDrawable.TILE_ROW_OFFSET.y
}

let images = {};
images[Map.TERRAIN_TYPES.WATER] = make_image("img/tiles/water_00.png");
images[Map.TERRAIN_TYPES.GRASS] = make_image("img/tiles/grass_00.png");
images[Map.TERRAIN_TYPES.SAND] = make_image("img/tiles/sand_00.png");
images[Map.TERRAIN_TYPES.SANDWATER_4] = make_image("img/tiles/sandwater_4.png");
images[Map.TERRAIN_TYPES.SANDWATER_6] = make_image("img/tiles/sandwater_6.png");
images[Map.TERRAIN_TYPES.SANDWATER_8] = make_image("img/tiles/sandwater_8.png");
images[Map.TERRAIN_TYPES.SANDWATER_3] = make_image("img/tiles/sandwater_3.png");
images[Map.TERRAIN_TYPES.SANDWATER_2] = make_image("img/tiles/sandwater_2.png");
images[Map.TERRAIN_TYPES.SANDWATER_9] = make_image("img/tiles/sandwater_9.png");
images[Map.TERRAIN_TYPES.SANDWATER_1] = make_image("img/tiles/sandwater_1.png");
images[Map.TERRAIN_TYPES.SANDWATER_7] = make_image("img/tiles/sandwater_7.png");
images[Map.TERRAIN_TYPES.WATERSAND_7] = make_image("img/tiles/watersand_7.png");
images[Map.TERRAIN_TYPES.WATERSAND_1] = make_image("img/tiles/watersand_1.png");
images[Map.TERRAIN_TYPES.WATERSAND_3] = make_image("img/tiles/watersand_3.png");
images[Map.TERRAIN_TYPES.WATERSAND_9] = make_image("img/tiles/watersand_9.png");


images[Map.TERRAIN_TYPES.GRASSSAND_1] = make_image("img/tiles/grasssand_1.png");
images[Map.TERRAIN_TYPES.GRASSSAND_2] = make_image("img/tiles/grasssand_2.png");
images[Map.TERRAIN_TYPES.GRASSSAND_3] = make_image("img/tiles/grasssand_3.png");
images[Map.TERRAIN_TYPES.GRASSSAND_4] = make_image("img/tiles/grasssand_4.png");
images[Map.TERRAIN_TYPES.GRASSSAND_6] = make_image("img/tiles/grasssand_6.png");
images[Map.TERRAIN_TYPES.GRASSSAND_7] = make_image("img/tiles/grasssand_7.png");
images[Map.TERRAIN_TYPES.GRASSSAND_8] = make_image("img/tiles/grasssand_8.png");
images[Map.TERRAIN_TYPES.GRASSSAND_9] = make_image("img/tiles/grasssand_9.png");


images[Map.TERRAIN_TYPES.SANDGRASS_0] = make_image("img/tiles/sandgrass_0.png");
images[Map.TERRAIN_TYPES.SANDGRASS_2] = make_image("img/tiles/sandgrass_2.png");
images[Map.TERRAIN_TYPES.SANDGRASS_2_8] = make_image("img/tiles/sandgrass_2_8.png");
images[Map.TERRAIN_TYPES.SANDGRASS_4] = make_image("img/tiles/sandgrass_4.png");
images[Map.TERRAIN_TYPES.SANDGRASS_4_6] = make_image("img/tiles/sandgrass_4_6.png");
images[Map.TERRAIN_TYPES.SANDGRASS_6] = make_image("img/tiles/sandgrass_6.png");
images[Map.TERRAIN_TYPES.SANDGRASS_8] = make_image("img/tiles/sandgrass_8.png");







export {
    GameViewer
}