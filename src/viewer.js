import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';
import { rand_choice, rect_intersection } from './utils.js';
import { Sprites } from './sprites.js';
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

        this.mapDrawable = new MapDrawable(
            this.engine.map, this.stage,
            this.viewPort, { top: TopBar.IMAGE.height, bottom: BottomBar.IMAGE.height }
        );

        this.layers.terrain.add(this.mapDrawable);

        this.resetEntitiesCoords();

        this.entitiesHolder = new Graphics.EntitiesHolder({
            x: -this.viewPort.x,
            y: -this.viewPort.y
        }, {
            mapSize: size,
            width: Map.SIZES[this.engine.map.definition.size] * MapDrawable.TILE_SIZE.width,
            height: Map.SIZES[this.engine.map.definition.size] * MapDrawable.TILE_SIZE.height,
            viewPortWidth: this.stage.width(),
            viewPortHeight: this.stage.height() - BottomBar.IMAGE.height
        });
        this.layers.entities.add(this.entitiesHolder);

        this.addEntities();

        this.layers.terrain.on("click", this.handleClick.bind(this));
        this.layers.entities.on("click", this.handleClick.bind(this));
        this.layers.entities.on("mouseover", this.handleMouseOver.bind(this));
        this.layers.entities.on("mouseout", this.handleMouseOut.bind(this));
        this.stage.on("mousemove", this.handleMouseMove.bind(this));

        this.constructionIndicator = new ConstructionIndicator(this);
        this.constructionIndicator.hide();
        this.layers.interface.add(this.constructionIndicator);
        this.stage.on("mousemove", this.constructionIndicator.move.bind(this.constructionIndicator));
        this.isPlanningConstruction = false;

        this.orderIndicator = new MoverOrderIndicator(this);
        this.layers.interface.add(this.orderIndicator);

        this.topbar = new TopBar();
        this.layers.interface.add(this.topbar);
        this.bottombar = new BottomBar(this, 0, this.stage.height() - BottomBar.IMAGE.height);
        this.layers.interface.add(this.bottombar);

        this.tooltip = new Graphics.StrokedText({
            ...this.TOOLTIP_OPTIONS,
            fill: 'white',
            x: 7,
            y: this.stage.height() - BottomBar.IMAGE.height - 7
        });
        this.tooltip.hide();
        this.layers.interface.add(this.tooltip);

        this.errorMessageTimeout = 0;
        this.errorMessage = new Graphics.StrokedText({
            ...this.TOOLTIP_OPTIONS,
            fill: '#cf4300',
            align: "center",
            x: Math.round(this.stage.width() / 2),
            y: this.stage.height() - BottomBar.IMAGE.height - 42
        });
        this.errorMessage.hide();
        this.layers.interface.add(this.errorMessage);

        // this.layers.grid.init(this.mapDrawable);

        this.engine.startLoop();
    }
    deselectEntity() {
        if (this.engine.selectedEntity) this.engine.selectedEntity.setSelected(false);
        this.engine.selectedEntity = null;
        this.bottombar.hideDetails();
    }
    handleClick(e) {
        if (e.evt.button == 2 || e.evt.which == 3) this.handleRightClick(e);
        else this.handleLeftClick(e);
    }
    handleLeftClick(e) {
        this.deselectEntity();

        let entity = e.target.parent;
        if (entity instanceof Entity) {
            this.engine.selectedEntity = entity;
            entity.setSelected(true);
            this.bottombar.showDetails(entity);
        }
    }
    handleRightClick(e) {
        if (this.engine.selectedEntity instanceof Unit) {
            let sx = (e.evt.layerX - this.mapDrawable.x());
            let sy = (e.evt.layerY - this.mapDrawable.y());
            let subtile = this.mapDrawable.screenCoordsToSubtile(sx, sy);
            if (!this.isPlanningConstruction && !this.engine.map.getEntityAtSubtile(subtile.x, subtile.y)) {
                this.orderIndicator.show(e.evt.layerX, e.evt.layerY);
            }
            this.engine.handleRightClick(subtile);
        }
        e.evt.preventDefault();
        return false;
    }
    handleMouseOver(e) {
        if (e.target.parent instanceof Entity) {
            this.tooltip.text(e.target.parent.TOOLTIP);
            this.tooltip.show();
        }
    }
    handleMouseOut(e) {
        this.tooltip.hide();
    }
    setErrorMessage(text) {
        this.errorMessage.text(text);
        this.errorMessage.show();
        this.errorMessageTimeout = GameViewer.prototype.ERROR_MESSAGE_TIMEOUT;
    }
    addEntities() {
        for (let entity, i = 0; entity = this.engine.map.entities[i++];) {
            this.entitiesHolder.add(entity);
        }
    }
    addEntity(entity, skip_reposition=false) {
        if (!skip_reposition) {
            entity.position(this.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
        }
        entity.resetBoundingBox();
        this.entitiesHolder.add(entity);
    }
    resetEntitiesCoords(entity) {
        for (let entity, i = 0; entity = this.engine.map.entities[i++];) {
            entity.position(this.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
            entity.resetBoundingBox();
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

    }
    process() {
        this.handleScroll();
        this.topbar.process(this.engine.current_player);
        if (this.engine.selectedEntity != null) {
            this.bottombar.entityDetails.setEntity(this.engine.selectedEntity);

            if (this.engine.selectedEntity.actions_changed) {
                this.engine.selectedEntity.actions_changed = false;
                this.bottombar.entityActions.setEntity(this.engine.selectedEntity);
            }
        }
        if (this.errorMessageTimeout > 0) if (--this.errorMessageTimeout == 0) this.errorMessage.hide();
        this.constructionIndicator.process();
        this.orderIndicator.process();
    }
}
GameViewer.prototype.ERROR_MESSAGE_TIMEOUT = 35 * 6;
GameViewer.prototype.TOOLTIP_OPTIONS = {
    fontSize: 15,
    fontFamily: 'helvetica',
    fontWeight: "bold",
    textBaseline: "bottom",
    strokeStyle: 'black',
    lineWidth: 3
}


class MapDrawable extends Graphics.Group {
    constructor(map, stage, viewPort, offset) {
        super({
            x: -viewPort.x,
            y: -viewPort.y
        });
        this.offset = offset;
        this.map = map;
        this.stage = stage;
        this.insertTiles();
        this.frame = 0;
    }
    draw() {
        let corner_tile = this.screenCoordsToTile(
            -this.attrs.x,
            -this.attrs.y + this.offset.top - MapDrawable.TILE_SIZE.height / 2
        );
        let corner_pix = this.tileCoordsToScreen(corner_tile.x, corner_tile.y);
        corner_pix.x = corner_pix.x + this.attrs.x;
        corner_pix.y = corner_pix.y + this.attrs.y - MapDrawable.TILE_SIZE.height / 2;

        let cur_tile = { x: corner_tile.x, y: corner_tile.y };
        let cur_pix = { x: corner_pix.x, y: corner_pix.y };
        let row = 0;
        while (cur_pix.y < this.stage.height() - this.offset.bottom) {
            while (cur_pix.x < this.stage.width()) {
                if (cur_tile.x > -1 && cur_tile.x < this.map.edge_size && cur_tile.y > -1 && cur_tile.y < this.map.edge_size) {
                    if (this.map.initial_tiles[cur_tile.x][cur_tile.y] == Map.TERRAIN_TYPES.WATER) {
                        let idx = cur_tile.x % 2 + (cur_tile.y % 2) * 2;
                        var tileset = MapDrawable.TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATER][idx];
                        var choice = this.frame % tileset.length;
                    } else {
                        var tileset = MapDrawable.TERRAIN_IMAGES[this.map.terrain_tiles[cur_tile.x][cur_tile.y]];
                        var choice = tileset.length > 1 ? this.rand_tile(cur_tile.x, cur_tile.y) % tileset.length : 0;
                    }
                    this.layer.ctx.drawImage(tileset[choice], cur_pix.x, cur_pix.y);
                }
                cur_pix.x += MapDrawable.TILE_SIZE.width;
                ++cur_tile.x;
                ++cur_tile.y;
            }
            cur_pix.x = corner_pix.x + (row % 2 ? 0 : -1) * MapDrawable.TILE_SIZE.width / 2;
            cur_pix.y = cur_pix.y + MapDrawable.TILE_SIZE.height / 2;
            ++row;

            cur_tile.x = corner_tile.x - Math.ceil(row / 2);
            cur_tile.y = corner_tile.y + Math.floor(row / 2);
        }
        ++this.frame;
    }
    rand_tile(x, y) {
        let rnd = x * 7883 + y * 317;
        rnd ^= rnd >> 13;
        rnd ^= rnd << 17;
        rnd ^= rnd >> 5;
        return rnd;
    }
    insertTiles() {
        var miniCanv = document.createElement("canvas");
        miniCanv.setAttribute("width", Map.SIZES[this.map.definition.size]);
        miniCanv.setAttribute("height", Map.SIZES[this.map.definition.size]);
        var miniCtx = miniCanv.getContext('2d');

        for (let y = 0; y < Map.SIZES[this.map.definition.size]; ++y) {
            for (let x = 0; x < Map.SIZES[this.map.definition.size]; ++x) {

                miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS[this.map.terrain_tiles[x][y]];
                if (this.map.getEntityAtSubtile(x * 2, y * 2) instanceof Tree) miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS.TREE;

                miniCtx.fillRect(x, y, 1, 1);
            }
        }

        miniCanv.className = "tmpMiniMap";
        document.body.appendChild(miniCanv);
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
        let H = MapDrawable.TILE_SIZE.height;
        let W = MapDrawable.TILE_SIZE.width;
        let UH = MapDrawable.TILE_SIZE.height * Map.SIZES[this.map.definition.size];

        let x = Math.floor((sx * H - W * sy + 0.5 * W * UH) / (W * H));
        let y = Math.floor((sy - 0.5 * UH) / (0.5 * H) + (sx * H - W * sy + 0.5 * UH * W) / (H * W));
        return { x, y };
    }
    screenCoordsToSubtile(sx, sy) {
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
        super();
        this.image = new Graphics.Image({
            image: TopBar.IMAGE,
        });
        this.add(this.image);
        this.wood = new Graphics.StrokedText({ x: 34, y: 2, ...TopBar.TEXT_OPTIONS });
        this.add(this.wood);

        this.food = new Graphics.StrokedText({ x: 101, y: 2, ...TopBar.TEXT_OPTIONS });
        this.add(this.food);

        this.gold = new Graphics.StrokedText({ x: 168, y: 2, ...TopBar.TEXT_OPTIONS });
        this.add(this.gold);

        this.stone = new Graphics.StrokedText({ x: 235, y: 2, ...TopBar.TEXT_OPTIONS });
        this.add(this.stone);

        this.population = new Graphics.StrokedText({ x: 302, y: 2, ...TopBar.TEXT_OPTIONS });
        this.add(this.population);
    }
    process(player) {
        this.wood.text(player.resources.wood);
        this.food.text(player.resources.food);
        this.gold.text(player.resources.gold);
        this.stone.text(player.resources.stone);
        this.population.text(`${player.population}/${player.max_population}`);
    }
}
TopBar.IMAGE = Sprites.Sprite("img/interface/greek/topbar.png");
TopBar.TEXT_OPTIONS = {
    fontSize: 13,
    fontFamily: 'helvetica',
    fontWeight: "bold",
    textBaseline: "top",
    fill: '#000000',
    strokeStyle: 'white',
    lineWidth: 1
};



class BottomBar extends Graphics.Group {
    constructor(viewer, x=0, y=0) {
        super({ x: x, y: y });
        this.image = new Graphics.Image({
            image: BottomBar.IMAGE,
            hasHitmap: true
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
BottomBar.IMAGE = Sprites.Sprite("img/interface/greek/bottombar.png");


class EntityDetails extends Graphics.Group {
    constructor() {
        super(...arguments);
        this.add(new Graphics.Rect({
            x: 7, y: 8,
            fill: '#000',
            width: 123,
            height: 111
        }));
        this.name = new Graphics.Text({
            x: 10, y: 16,
            ...EntityDetails.TEXT_OPTIONS
        });
        this.add(this.name);

        this.avatar = new Graphics.Image({ x: 10, y: 37 });
        this.add(this.avatar);

        this.healthBar = new HealthBarBig({ x: 10, y: 91 });
        this.add(this.healthBar);

        this.hp = new Graphics.Text({
            x: 10, y: 102,
            ...EntityDetails.TEXT_OPTIONS
        });
        this.add(this.hp);

        this.attributes = new EntityAttributes({ x: 65, y: 35 });
        this.add(this.attributes);

    }
    setEntity(entity) {
        this.entity = entity;
        if (this.entity.AVATAR) {
            if (this.entity.player) {
                this.avatar.image(Sprites.Colorize(this.entity.AVATAR, this.entity.player.colour));
            } else {
                this.avatar.image(this.entity.AVATAR);
            }
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
    textBaseline: "top",
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
            if (this.entity.attributes[attr] != null) {
                this[attr].text(this.entity.attributes[attr]);
                this[attr].position({ x: 0, y: offset_y });
                this[attr].show();
                offset_y += EntityAttributes.ATTRIBUTES[attr].height + 1;
            } else this[attr].hide();
        }

    }
}
EntityAttributes.ALL_ATTRIBUTES = [
    "attack", "armor", "progress", "population",
    "food", "wood", "gold", "stone"
];
EntityAttributes.ATTRIBUTES = {
    attack: Sprites.Sprite("img/interface/details/attack.png"),
    food: Sprites.Sprite("img/interface/details/food.png"),
    wood: Sprites.Sprite("img/interface/details/wood.png"),
    gold: Sprites.Sprite("img/interface/details/gold.png"),
    stone: Sprites.Sprite("img/interface/details/stone.png"),
    progress: Sprites.Sprite("img/interface/details/progress.png"),
    population: Sprites.Sprite("img/interface/details/population.png"),
    armor: Sprites.Sprite("img/interface/details/armor.png"),
}

class EntityAttribute extends Graphics.Group {
    constructor(image) {
        super();
        this.hide();
        this.value = new Graphics.Text({
            x: 3 + image.width, y: 5,
            ...EntityDetails.TEXT_OPTIONS
        });
        this.add(this.value);
        this.image = new Graphics.Image({
            image: image,
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
        });
        this.add(this.red);

        var _bar = document.createElement("canvas");
        _bar.setAttribute("width", HealthBarBig.BAR_GREEN.width);
        _bar.setAttribute("height", HealthBarBig.BAR_GREEN.height);
        this._barCtx = _bar.getContext('2d');
        this.setValue(1);

        this.green = new Graphics.Image({
            image: _bar,
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
HealthBarBig.BAR_GREEN = Sprites.Sprite('img/interface/details/health_green_big.png');
HealthBarBig.BAR_RED = Sprites.Sprite('img/interface/details/health_red_big.png');


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
            let btn = new ActionButton(Action, pos, viewer);

            this.add(btn);
            this.action_buttons.push(btn);

            x += Action.prototype.SIZE + Action.prototype.MARGIN * 2;
            if (i % Action.prototype.ACTIONS_PER_ROW == Action.prototype.ACTIONS_PER_ROW - 1) {
                x = Action.prototype.MARGIN;
                y += Action.prototype.SIZE + Action.prototype.MARGIN * 2;
            }
        }
    }
}


class ActionButton extends Graphics.Group {
    constructor(Action, pos, viewer) {
        super({ x: pos.x, y: pos.y });
        this.pressed = false;
        this.bg = new Graphics.Image({
            image: ActionButton.prototype.BACKGROUND_IMAGE,
        })
        this.add(this.bg);

        this.img = new Graphics.Image({
            image: Sprites.Colorize(Action.prototype.IMAGE, viewer.engine.selectedEntity.player.colour),
            x: ActionButton.prototype.BORDER_WIDTH,
            y: ActionButton.prototype.BORDER_WIDTH,
            hasHitmap: true
        });
        this.add(this.img);

        this.text = null;
        if (Action.prototype.SUPPORTS_QUEUE && viewer.engine.selectedEntity.tasks_counts[Action.prototype.HASH]) {
            this.add(this.text = new Graphics.StrokedText(this.TEXT_OPTIONS));
            this.text.text(viewer.engine.selectedEntity.tasks_counts[Action.prototype.HASH]);
        }

        this.img.on("click", function(e) {
            let action = new Action(viewer);
            action.execute();
        });
        this.img.on("mousedown", (e) => {
            this.pressed = true;
        });
        this.img.on("mouseup", (e) => {
            this.pressed = false;
        });
        this.img.on("mouseover", (e) => {
            viewer.tooltip.text(Action.prototype.toolTip());
            viewer.tooltip.show();
        });
        this.img.on("mouseout", (e) => {
            viewer.tooltip.hide();
        });

    }
    draw() {
        if (!this.attrs.visible) return;
        this.bg.draw();
        this.layer.ctx.drawImage(
            this.img.attrs.image,
            0, 0,
            this.img.attrs.image.width - this.pressed,
            this.img.attrs.image.height - this.pressed,
            this.img.absX() + this.pressed,
            this.img.absY() + this.pressed,
            this.img.attrs.image.width - this.pressed,
            this.img.attrs.image.height - this.pressed
        );
        if (this.text) this.text.draw();
        this.img.setHitmap();
    }
}
ActionButton.prototype.BORDER_WIDTH = 2;
ActionButton.prototype.BACKGROUND_IMAGE = Sprites.Sprite("img/interface/greek/button_frame.png")
ActionButton.prototype.TEXT_OPTIONS = {
    x: 6, y: 2,
    fill: 'white',
    fontSize: 13,
    fontFamily: 'helvetica',
    fontWeight: "bold",
    textBaseline: "top",
    strokeStyle: 'black',
    lineWidth: 2
}

class ConstructionIndicator extends Graphics.Group {
    constructor(viewer, options) {
        super(options);
        this.viewer = viewer;
        this.current_opacity = .65;
        this.opacity_delta = .01;
        this.image = null;
        this.building = null;
        this.sub = null;
        this.allow_construction = false;
    }
    move() {
        if (!this.viewer.isPlanningConstruction) return;
        // construction preview coordinates must be adjisted to subtile size
        // therefore we compute position of subtile under cursor and use it
        // to compute screen coordinates of its corner
        this.sub = this.viewer.mapDrawable.screenCoordsToSubtile(
            this.viewer.mouseX + this.viewer.viewPort.x + MapDrawable.TILE_SIZE.width / 2,
            this.viewer.mouseY + this.viewer.viewPort.y + MapDrawable.TILE_SIZE.height / 2
        );
        let W = this.building.prototype.SUBTILE_WIDTH;
        this.sub.x -= Math.round(W / 2);
        this.sub.y -= Math.round(W / 2);
        let screen = this.viewer.mapDrawable.tileCoordsToScreen(
            (this.sub.x / 2),
            (this.sub.y / 2)
        );
        this.position({
            x: screen.x - this.viewer.viewPort.x,
            y: screen.y - this.viewer.viewPort.y
        });

        this.checkSubtiles();

        if (
            this.viewer.mouseY > this.viewer.stage.height() - this.viewer.bottombar.image.height() ||
            this.viewer.mouseY < this.viewer.topbar.image.height()
        ) this.hide();
        else this.show();
    }
    checkSubtiles() {
        let W = this.building.prototype.SUBTILE_WIDTH;
        let map = this.viewer.engine.map;
        if (this.sub.x >= 0 && this.sub.x + W <= map.edge_size * 2 &&
            this.sub.y >= 0 && this.sub.y + W <= map.edge_size * 2 &&
            map.areSubtilesEmpty(this.sub.x, this.sub.y, W) &&
            this.building.prototype.canConstructOn(map.countTerrainTiles(this.sub.x, this.sub.y, W))
        ) {
            this.image.image(Sprites.Colorize(
                this.building.prototype.IMAGES[this.building.prototype.STATE.DONE][0],
                this.viewer.engine.selectedEntity.player.colour
            ));
            this.allow_construction = true;
        } else {
            this.image.image(Graphics.Filters.RedFilter(Sprites.Colorize(
                this.building.prototype.IMAGES[this.building.prototype.STATE.DONE][0],
                this.viewer.engine.selectedEntity.player.colour
            )));
            this.allow_construction = false;
        }
    }
    process() {
        if (!this.viewer.isPlanningConstruction) return;
        this.checkSubtiles();
        this.opacityPulse();
    }
    setBuilding(building) {
        this.building = building;
        this.add(this.image = new Graphics.Image({
            x: - building.prototype.IMAGE_OFFSETS[building.prototype.STATE.DONE].x,
            y: -building.prototype.IMAGE_OFFSETS[building.prototype.STATE.DONE].y,
            image: Sprites.Colorize(
                building.prototype.IMAGES[building.prototype.STATE.DONE][0],
                this.viewer.engine.selectedEntity.player.colour
            ),
            hasHitmap: true
        }));
        this.move();
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
        super();
        this.counter = 0;
        this.frame = 0;
        this.hide();
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            image: this.FRAMES[0],
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
        if (!this.getVisible()) return;
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
MoverOrderIndicator.prototype.FRAMES = Sprites.SpriteSequence("img/interface/misc/move_order_", 6);

export {
    GameViewer, MapDrawable
}