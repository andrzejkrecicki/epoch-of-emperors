import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';
import { make_image, rand_choice, rect_intersection } from './utils.js';
import { Tree, LeafTree } from './engine/trees.js';
import { Villager } from './engine/units/villager.js';
import { Unit } from './engine/units/unit.js';
import { Entity } from './engine/entity.js';
import { MINIMAP_PIXEL_COLORS, TERRAIN_IMAGES } from './mapdrawable_assets.js';

class GameViewer {
    constructor(definition, navigator, layers) {
        this.navigator = navigator;
        this.stage = navigator.stage;
        this.layers = layers;

        this.engine = new Engine(this, definition);

        this.mouseX = this.stage.width() / 2;
        this.mouseY = this.stage.height() / 2;

        let size = Map.SIZES[this.engine.map.definition.size];
        this.viewPort = {
            x: Math.round(size * MapDrawable.TILE_SIZE.width / 2 - this.stage.width() / 2),
            y: Math.round(size * MapDrawable.TILE_SIZE.height / 2 - this.stage.height() / 2),
            w: this.stage.width(),
            h: this.stage.height(),
        }

        this.mapDrawable = new MapDrawable(this.engine.map, this.stage, this.viewPort);
        this.layers.terrain.add(this.mapDrawable);

        this.entitiesHolder = new Konva.Group({
            x: -this.viewPort.x,
            y: -this.viewPort.y
        });
        this.layers.entities.add(this.entitiesHolder);

        this.resetEntitiesCoords();
        this.setEntitiesVisibility();

        this.layers.terrain.on("click", this.handleClick.bind(this));
        this.layers.entities.on("click", this.handleClick.bind(this));
        this.stage.on("mousemove", this.handleMouseMove.bind(this));

        this.topbar = new TopBar();
        this.layers.interface.add(this.topbar);
        this.bottombar = new BottomBar(0, this.stage.height() - BottomBar.IMAGE.height);
        this.layers.interface.add(this.bottombar);

        this.engine.startLoop();
    }
    handleClick(e) {
        if (e.evt.button == 2 || e.evt.which == 3) this.handleRightClick(e);
        else this.handleLeftClick(e);
    }
    handleLeftClick(e) {
        // unselect selected entities
        // this.engine.unselect ??

        if (this.engine.selectedEntity) {
            this.engine.selectedEntity.setSelected(false);
            this.engine.selectedEntity = null;
            this.bottombar.hideDetails();
        }

        let entity = e.target.parent;
        if (entity instanceof Entity) {
            this.engine.selectedEntity = entity;
            entity.setSelected(true);
            this.bottombar.showDetails(entity);
        }
    }
    handleRightClick(e) {
        if (this.engine.selectedEntity) {
            let sx = (e.evt.layerX - this.mapDrawable.x());
            let sy = (e.evt.layerY - this.mapDrawable.y());
            this.engine.handleRightClick(this.mapDrawable.screenCoordsToSubtile(sx, sy));
        }
        e.evt.preventDefault();
        return false;
    }
    setEntityVisibility(entity) {
        if (!rect_intersection(entity.getBoundingBox(), this.viewPort)) {
            entity.hide();
        } else {
            entity.show();
        }
    }
    setEntitiesVisibility() {
        for (let entity, i = 0; entity = this.engine.map.entities[i++];) {
            this.setEntityVisibility(entity);
        }
    }
    resetEntitiesCoords() {
        for (let entity, i = 0; entity = this.engine.map.entities[i++];) {
            entity.position(this.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
            entity.resetBoundingBox();
            this.entitiesHolder.add(
                entity
            );
        }
    }
    handleMouseMove(e) {
        this.mouseX = e.evt.layerX;
        this.mouseY = e.evt.layerY;
    }
    handleScroll() {
        let moved = false;
        if (this.mouseX < 30) {
            this.viewPort.x -= 20;
            this.mapDrawable.x(-this.viewPort.x);
            this.entitiesHolder.x(-this.viewPort.x);
            moved = true;
        } else if (this.mouseX > this.stage.width() - 30) {
            this.viewPort.x += 20;
            this.mapDrawable.x(-this.viewPort.x);
            this.entitiesHolder.x(-this.viewPort.x);
            moved = true;
        }

        if (this.mouseY < 30) {
            this.viewPort.y -= 20;
            this.mapDrawable.y(-this.viewPort.y);
            this.entitiesHolder.y(-this.viewPort.y);
            moved = true;
        } else if (this.mouseY > this.stage.height() - 30) {
            this.viewPort.y += 20;
            this.mapDrawable.y(-this.viewPort.y);
            this.entitiesHolder.y(-this.viewPort.y);
            moved = true;
        }

        if (moved) this.setEntitiesVisibility();
    }
}


class MapDrawable extends Konva.Group {
    constructor(map, stage, viewPort) {
        super({
            x: -viewPort.x,
            y: -viewPort.y
        });
        this.map = map;
        this.insertTiles();
    }
    insertTiles() {
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.setAttribute("width", Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.width);
        tmpCanvas.setAttribute("height", Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.height);
        var tmpCtx = tmpCanvas.getContext('2d');

        var miniCanv = document.createElement("canvas");
        miniCanv.setAttribute("width", Map.SIZES[this.map.definition.size]);
        miniCanv.setAttribute("height", Map.SIZES[this.map.definition.size]);
        var miniCtx = miniCanv.getContext('2d');

        for (let y = 0; y < Map.SIZES[this.map.definition.size]; ++y) {
            let origin = {
                x: y * MapDrawable.TILE_COL_OFFSET.x,
                y: -(Map.SIZES[this.map.definition.size] * MapDrawable.TILE_ROW_OFFSET.y) + (y * MapDrawable.TILE_COL_OFFSET.y)
            };
            for (let x = 0; x < Map.SIZES[this.map.definition.size]; ++x) {
                tmpCtx.drawImage(rand_choice(MapDrawable.TERRAIN_IMAGES[this.map.terrain_tiles[x][y]]), origin.x, origin.y);

                miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS[this.map.terrain_tiles[x][y]];
                if (this.map.getEntityAtSubtile(x * 2, y * 2) instanceof Tree) miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS.TREE;

                miniCtx.fillRect(x, y, 1, 1);
                origin.x += MapDrawable.TILE_ROW_OFFSET.x;
                origin.y += MapDrawable.TILE_ROW_OFFSET.y;
            }
        }

        miniCanv.className = "tmpMiniMap";
        document.body.appendChild(miniCanv);
        this.add(new Konva.Image({
            x: 0,
            y: 0,
            image: tmpCanvas,
            width: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.width,
            height: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.height
        }));
        this.cache();
    }
    tileCoordsToScreen(tx, ty) {
        let H = MapDrawable.TILE_SIZE.height;
        let W = MapDrawable.TILE_SIZE.width;
        let UH = MapDrawable.TILE_SIZE.height * Map.SIZES[this.map.definition.size];

        let x = tx * W * 0.5 + ty * W * 0.5;
        let y = 0.5 * UH - tx * 0.5 * H + ty * 0.5 * H;
        return { x, y };
    }
    screenCoordsToTile(sx, sy) {
        // tiles coordinates, while drawing them, are bassed on upper left corner
        // of their bounding box but formula below uses left corner of
        // diamond-shaped tile which is located at half of its height
        // thus we take into account this difference
        sy -= MapDrawable.TILE_SIZE.height / 2;

        let H = MapDrawable.TILE_SIZE.height;
        let W = MapDrawable.TILE_SIZE.width;
        let UH = MapDrawable.TILE_SIZE.height * Map.SIZES[this.map.definition.size];

        let x = Math.floor((sx * H - W * sy + 0.5 * W * UH) / (W * H));
        let y = Math.floor((sy - 0.5 * UH) / (0.5 * H) + (sx * H - W * sy + 0.5 * UH * W) / (H * W));
        return { x, y };
    }
    screenCoordsToSubtile(sx, sy) {
        sy -= MapDrawable.TILE_SIZE.height / 2;

        let H = MapDrawable.TILE_SIZE.height / 2;
        let W = MapDrawable.TILE_SIZE.width / 2;
        let UH = MapDrawable.TILE_SIZE.height * Map.SIZES[this.map.definition.size];

        let x = Math.floor((sx * H - W * sy + 0.5 * W * UH) / (W * H));
        let y = Math.floor((sy - 0.5 * UH) / (0.5 * H) + (sx * H - W * sy + 0.5 * UH * W) / (H * W));
        return { x, y };
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
MapDrawable.TERRAIN_IMAGES = TERRAIN_IMAGES;
MapDrawable.MINIMAP_PIXEL_COLORS = MINIMAP_PIXEL_COLORS;


class TopBar extends Konva.Group {
    constructor() {
        super({ x: 0, y: 0 });
        this.image = new Konva.Image({
            x: 0,
            y: 0,
            image: TopBar.IMAGE,
            width: TopBar.IMAGE.width,
            height: TopBar.IMAGE.height
        });
        this.add(this.image);
    }
}
TopBar.IMAGE = make_image("img/interface/greek/topbar.png");


class BottomBar extends Konva.Group {
    constructor(x=0, y=0) {
        super({ x: x, y: y });
        this.image = new Konva.Image({
            x: 0,
            y: 0,
            image: BottomBar.IMAGE,
            width: BottomBar.IMAGE.width,
            height: BottomBar.IMAGE.height
        });
        this.add(this.image);

        this.entityDetails = new EntityDetails();
        this.entityDetails.hide();
        this.add(this.entityDetails);
        this.entityActions = new EntityActions({ x: 136, y: 5 });
        this.add(this.entityActions);
    }
    showDetails(entity) {
        this.entityDetails.setEntity(entity);
        this.entityDetails.show();
        this.entityActions.setEntity(entity);
        this.entityActions.show();
    }
    hideDetails() {
        this.entityDetails.hide();
        this.entityActions.hide();
    }
}
BottomBar.IMAGE = make_image("img/interface/greek/bottombar.png");


class EntityDetails extends Konva.Group {
    constructor() {
        super(...arguments);
        this.add(new Konva.Rect({
            x: 7, y: 8,
            fill: '#000',
            width: 123,
            height: 111
        }));
        this.name = new Konva.Text(Object.assign({
            x: 10, y: 16
        }, EntityDetails.TEXT_OPTIONS))
        this.add(this.name);

        this.avatar = new Konva.Image({ x: 10, y: 37 });
        this.add(this.avatar);

        this.healthBar = new HealthBarBig({ x: 10, y: 91 });
        this.add(this.healthBar);

        this.hp = new Konva.Text(Object.assign({
            x: 10, y: 102
        }, EntityDetails.TEXT_OPTIONS))
        this.add(this.hp);
    }
    setEntity(entity) {
        if (entity.AVATAR) {
            this.avatar.image(entity.AVATAR);
            this.avatar.width(entity.AVATAR.width);
            this.avatar.height(entity.AVATAR.height);
            this.avatar.show();
        } else {
            this.avatar.hide();
        }
        this.name.text(entity.NAME);
        this.healthBar.setValue(entity.hp / entity.max_hp);
        this.hp.text(`${entity.hp}/${entity.max_hp}`);
    }
}
EntityDetails.TEXT_OPTIONS = {
    fontSize: 12,
    fontFamily: 'helvetica',
    fill: '#ffffff',
};


class HealthBarBig extends Konva.Group {
    constructor() {
        super(...arguments);
        this.init();
    }
    init() {
        this.red = new Konva.Image({
            image: HealthBarBig.BAR_RED,
            width: HealthBarBig.BAR_RED.width,
            height: HealthBarBig.BAR_RED.height
        });
        this.add(this.red);

        var _bar = document.createElement("canvas");
        _bar.setAttribute("width", HealthBarBig.BAR_GREEN.width);
        _bar.setAttribute("height", HealthBarBig.BAR_GREEN.height);
        this._barCtx = _bar.getContext('2d');
        this.setValue(1);

        this.green = new Konva.Image({
            image: _bar,
            width: _bar.width,
            height: _bar.height
        });
        this.add(this.green);
    }
    setValue(value) {
        this._barCtx.clearRect(0, 0, HealthBarBig.BAR_GREEN.width, HealthBarBig.BAR_GREEN.height);
        this._barCtx.drawImage(
            HealthBarBig.BAR_GREEN,
            0, 0,
            Math.floor(HealthBarBig.BAR_GREEN.width * value), HealthBarBig.BAR_GREEN.height,
            0, 0,
            Math.floor(HealthBarBig.BAR_GREEN.width * value), HealthBarBig.BAR_GREEN.height
        );
    }
}
HealthBarBig.BAR_GREEN = make_image('img/interface/details/health_green_big.png');
HealthBarBig.BAR_RED = make_image('img/interface/details/health_red_big.png');


class EntityActions extends Konva.Group {
    constructor() {
        super(...arguments);
        this.states = [];
    }
    setEntity(entity) {
        if (this.states.length) {
            this.states = [];
            this.removeChildren();
        }
        if (entity.ACTIONS) this.pushActions(entity.ACTIONS);
    }
    pushActions(actions) {
        if (this.states.length) this.removeChildren();
        this.actions_set = new ActionsSet(actions);
        this.states.push(this.actions_set);

        this.add(this.actions_set);
    }
}
EntityActions.ACTION_SIZE = 50;
EntityActions.MARGIN = 2;


class ActionsSet extends Konva.Group {
    constructor(actions) {
        super();
        this.action_buttons = [];
        let x = EntityActions.MARGIN, y = 0;
        for (let i = 0, action; action = actions[i]; ++i) {
            let btn = new Konva.Image({
                image: action.prototype.IMAGE,
                x: x, y: y,
                width: action.prototype.IMAGE.width,
                height: action.prototype.IMAGE.height
            });
            this.add(btn);
            this.action_buttons.push(btn);
            x += EntityActions.ACTION_SIZE + EntityActions.MARGIN * 2;
            if (i % 5 == 4) {
                x = EntityActions.MARGIN;
                y += EntityActions.ACTION_SIZE + EntityActions.MARGIN * 2;
            }
        }
    }
}


export {
    GameViewer, MapDrawable
}