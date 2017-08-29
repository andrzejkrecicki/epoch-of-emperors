import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';


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
                if (this.map.terrain_tiles[x][y] == 0) {
                    tmpCtx.drawImage(images.water_00, origin.x, origin.y);
                } else if (this.map.terrain_tiles[x][y] == 1) {
                    tmpCtx.drawImage(images.grass_00, origin.x, origin.y);
                } else if (this.map.terrain_tiles[x][y] == 2) {
                    tmpCtx.drawImage(images.sand_00, origin.x, origin.y);
                }
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
    width: 62, height: 34
}
MapDrawable.TILE_ROW_OFFSET = {
    x: 31,
    y: -16
}
MapDrawable.TILE_COL_OFFSET = {
    x: MapDrawable.TILE_SIZE.width - MapDrawable.TILE_ROW_OFFSET.x,
    y: MapDrawable.TILE_SIZE.height + MapDrawable.TILE_ROW_OFFSET.y
}

var images = {};
images.grass_00 = new Image();
images.grass_00.src = "img/grass_00.png";

images.sand_00 = new Image();
images.sand_00.src = "img/sand_00.png";

images.water_00 = new Image();
images.water_00.src = "img/water_00.png";

export {
    GameViewer
}