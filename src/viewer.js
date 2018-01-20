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

        this.entitiesHolder = new Graphics.Group({
            x: -this.viewPort.x,
            y: -this.viewPort.y
        });
        this.layers.entities.add(this.entitiesHolder);

        this.resetEntitiesCoords();
        this.setEntitiesVisibility();

        this.layers.terrain.on("click", this.handleClick.bind(this));
        this.layers.entities.on("click", this.handleClick.bind(this));
        this.stage.on("mousemove", this.handleMouseMove.bind(this));

        this.indicator = new ConstructionIndicator(this);
        this.indicator.hide();
        this.layers.interface.add(this.indicator);
        this.stage.on("mousemove", this.indicator.move.bind(this.indicator));
        this.isPlanningConstruction = false;

        this.orderIndicator = new MoverOrderIndicator(this);
        this.layers.interface.add(this.orderIndicator);

        this.topbar = new TopBar();
        this.layers.interface.add(this.topbar);
        this.bottombar = new BottomBar(this, 0, this.stage.height() - BottomBar.IMAGE.height);
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
            let sy = (e.evt.layerY - this.mapDrawable.y() + MapDrawable.TILE_SIZE.height / 2);
            let subtile = this.mapDrawable.screenCoordsToSubtile(sx, sy);
            if (!this.isPlanningConstruction && !this.engine.map.getEntityAtSubtile(subtile.x, subtile.y)) {
                this.orderIndicator.show(e.evt.layerX, e.evt.layerY);
            }
            this.engine.handleRightClick(subtile);
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
            this.addEntity(entity);
        }
    }
    addEntity(entity) {
        entity.position(this.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
        entity.resetBoundingBox();
        this.entitiesHolder.add(entity);
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
    process() {
        this.handleScroll();
        if (this.bottombar.entityDetails.entity) {
            this.bottombar.entityDetails.setEntity(this.bottombar.entityDetails.entity);
        }
        this.indicator.opacityPulse();
        this.orderIndicator.process();
    }
}


class MapDrawable extends Graphics.Group {
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
        this.add(new Graphics.Image({
            x: 0,
            y: 0,
            image: tmpCanvas,
            width: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.width,
            height: Map.SIZES[this.map.definition.size] * MapDrawable.TILE_SIZE.height
        }));
        // this.cache();
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


class TopBar extends Graphics.Group {
    constructor() {
        super({ x: 0, y: 0 });
        this.image = new Graphics.Image({
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


class BottomBar extends Graphics.Group {
    constructor(viewer, x=0, y=0) {
        super({ x: x, y: y });
        this.image = new Graphics.Image({
            x: 0,
            y: 0,
            image: BottomBar.IMAGE,
            width: BottomBar.IMAGE.width,
            height: BottomBar.IMAGE.height
        });
        this.add(this.image);

        this.viewer = viewer;
        this.entityDetails = new EntityDetails();
        this.entityDetails.hide();
        this.add(this.entityDetails);
        this.entityActions = new EntityActions(this.viewer, { x: 136, y: 5 });
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


class EntityDetails extends Graphics.Group {
    constructor() {
        super(...arguments);
        this.add(new Graphics.Rect({
            x: 7, y: 8,
            fill: '#000',
            width: 123,
            height: 111
        }));
        this.name = new Graphics.Text(Object.assign({
            x: 10, y: 16
        }, EntityDetails.TEXT_OPTIONS))
        this.add(this.name);

        this.avatar = new Graphics.Image({ x: 10, y: 37 });
        this.add(this.avatar);

        this.healthBar = new HealthBarBig({ x: 10, y: 91 });
        this.add(this.healthBar);

        this.hp = new Graphics.Text(Object.assign({
            x: 10, y: 102
        }, EntityDetails.TEXT_OPTIONS))
        this.add(this.hp);

        this.attributes = new EntityAttributes({ x: 65, y: 35 });
        this.add(this.attributes);

    }
    setEntity(entity) {
        this.entity = entity;
        if (this.entity.AVATAR) {
            this.avatar.image(this.entity.AVATAR);
            this.avatar.width(this.entity.AVATAR.width);
            this.avatar.height(this.entity.AVATAR.height);
            this.avatar.show();
        } else {
            this.avatar.hide();
        }
        this.name.text(this.entity.NAME);
        this.healthBar.setValue(this.entity.hp / this.entity.max_hp);
        this.hp.text(`${this.entity.hp}/${this.entity.max_hp}`);

        this.attributes.setEntity(entity);
    }
}
EntityDetails.TEXT_OPTIONS = {
    fontSize: 12,
    fontFamily: 'helvetica',
    fill: '#ffffff',
};

class EntityAttributes extends Graphics.Group {
    constructor() {
        super(...arguments);
        for (let attr, i = 0; attr = EntityAttributes.ALL_ATTRIBUTES[i]; ++i) {
            this[attr] = new EntityAttribute(EntityAttributes.ATTRIBUTES[attr]);
            this.add(this[attr]);
        }
    }
    setEntity(entity) {
        this.entity = entity;
        let offset_y = 0;
        for (let attr, i = 0; attr = EntityAttributes.ALL_ATTRIBUTES[i]; ++i) {
            if (this.entity.attributes[attr]) {
                this[attr].text(this.entity.attributes[attr]);
                this[attr].position({ x: 0, y: offset_y });
                this[attr].show();
                offset_y += EntityAttributes.ATTRIBUTES[attr].height + 1;
            } else this[attr].hide();
        }

    }
}
EntityAttributes.ALL_ATTRIBUTES = ["attack", "food"];
EntityAttributes.ATTRIBUTES = {
    attack: make_image("img/interface/details/attack.png"),
    food: make_image("img/interface/details/food.png")
}

class EntityAttribute extends Graphics.Group {
    constructor(image) {
        super();
        this.hide();
        this.value = new Graphics.Text(Object.assign({
            x: 3 + image.width, y: 5
        }, EntityDetails.TEXT_OPTIONS));
        this.add(this.value);
        this.image = new Graphics.Image({
            image: image,
            height: image.height,
            width: image.width
        });
        this.add(this.image);
    }
    text() {
        this.value.text(...arguments);
    }
}

class HealthBarBig extends Graphics.Group {
    constructor() {
        super(...arguments);
        this.init();
    }
    init() {
        this.red = new Graphics.Image({
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

        this.green = new Graphics.Image({
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


class EntityActions extends Graphics.Group {
    constructor(viewer, options) {
        super(options);
        this.viewer = viewer;
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
        this.actions_set = new ActionsSet(this.viewer, actions);
        this.states.push(this.actions_set);

        this.add(this.actions_set);
    }
    popActions() {
        if (this.states.length) {
            this.states.pop();
            this.removeChildren();
            if (this.states.length) {
                this.actions_set = this.states[this.states.length - 1];
                this.add(this.actions_set);
            }
        }
    }
    goToFirst() {
        if (this.states.length) {
            this.states = [this.states[0]];
            this.actions_set = this.states[0];
            this.removeChildren();
            this.add(this.actions_set);
        }
    }
}


class ActionsSet extends Graphics.Group {
    constructor(viewer, actions) {
        super();
        this.viewer = viewer;
        this.action_buttons = [];
        let x = actions[0].prototype.MARGIN, y = 0;
        for (let i = 0, Action; Action = actions[i]; ++i) {
            let pos = Action.prototype.POS || { x: x, y: y };
            let btn = new Graphics.Image({
                image: Action.prototype.IMAGE,
                x: pos.x, y: pos.y,
                width: Action.prototype.IMAGE.width,
                height: Action.prototype.IMAGE.height
            });
            btn.action = new Action(this, viewer);
            btn.on("click", function(e) {
                this.action.execute();
            });
            this.add(btn);
            this.action_buttons.push(btn);
            x += Action.prototype.SIZE + Action.prototype.MARGIN * 2;
            if (i % 5 == 4) {
                x = Action.prototype.MARGIN;
                y += Action.prototype.SIZE + Action.prototype.MARGIN * 2;
            }
        }
    }
}


class ConstructionIndicator extends Graphics.Group {
    constructor(viewer, options) {
        super(options);
        this.viewer = viewer;
        this.current_opacity = .65;
        this.opacity_delta = .01;
    }
    move() {
        if (!this.viewer.isPlanningConstruction) return;
        // construction preview coordinates must be adjisted to subtile size
        // therefore we compute position of subtile under cursor and use it
        // to compute screen coordinates of its corner
        let sub = this.viewer.mapDrawable.screenCoordsToSubtile(
            this.viewer.mouseX + this.viewer.viewPort.x + MapDrawable.TILE_SIZE.width / 2,
            this.viewer.mouseY + this.viewer.viewPort.y + MapDrawable.TILE_SIZE.height / 2
        );
        let screen = this.viewer.mapDrawable.tileCoordsToScreen(
            (sub.x / 2),
            (sub.y / 2)
        );
        this.position({
            x: screen.x - this.viewer.viewPort.x,
            y: screen.y - this.viewer.viewPort.y
        });

        if (
            this.viewer.mouseY > this.viewer.stage.height() - this.viewer.bottombar.image.height() ||
            this.viewer.mouseY < this.viewer.topbar.image.height()
        ) this.hide();
        else this.show();
    }
    setBuilding(building) {
        this.move();
        this.add(new Graphics.Image({
            x: (
                - Math.round(building.SUBTILE_WIDTH / 4 * MapDrawable.TILE_SIZE.width)
                - building.prototype.IMAGE_OFFSETS[building.prototype.STATE.DONE].x
            ),
            y: -building.prototype.IMAGE_OFFSETS[building.prototype.STATE.DONE].y,
            image: building.prototype.IMAGES[building.prototype.STATE.DONE][0],
            width: building.prototype.IMAGES[building.prototype.STATE.DONE][0].width,
            height: building.prototype.IMAGES[building.prototype.STATE.DONE][0].height,
        }));
    }
    opacityPulse() {
        if (this.current_opacity > this.MAX_OPACITY || this.current_opacity < this.MIN_OPACITY) this.opacity_delta *= -1;
        this.current_opacity += this.opacity_delta;
        this.opacity(this.current_opacity);
    }
}
ConstructionIndicator.prototype.MAX_OPACITY = .75;
ConstructionIndicator.prototype.MIN_OPACITY = .55;


class MoverOrderIndicator extends Graphics.Group {
    constructor() {
        super(...arguments);
        this.counter = 0;
        this.frame = 0;
        this.hide();
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            image: this.FRAMES[0],
            width: this.FRAMES[0].width,
            height: this.FRAMES[0].height
        });
        this.add(this.image);
    }
    show(x, y) {
        this.position({ x: x, y: y });
        super.show();
        this.frame = this.counter = 0;
        this.image.image(this.FRAMES[this.frame]);
    }
    process() {
        if (!this.isVisible()) return;
        ++this.counter;
        if (this.counter % 2 == 0) {
            ++this.frame;
            if (this.frame > this.FRAMES.length) {
                this.hide();
            } else {
                this.image.image(this.FRAMES[this.frame]);
            }
        }
    }
}
MoverOrderIndicator.prototype.IMAGE_OFFSET = { x: 24, y: 10 };
MoverOrderIndicator.prototype.FRAMES = [];
for (let i = 0; i < 6; ++i) MoverOrderIndicator.prototype.FRAMES.push(make_image(`img/interface/misc/move_order_${i}.png`));

export {
    GameViewer, MapDrawable
}