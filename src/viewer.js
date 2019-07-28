import { Engine } from './engine/engine.js';
import { Map } from './engine/map.js';
import { Sprites } from './sprites.js';
import { Tree } from './engine/trees.js';
import { Unit } from './engine/units/unit.js';
import { Building } from './engine/buildings/building.js';
import { Entity } from './engine/entity.js';
import { MINIMAP_PIXEL_COLORS, TERRAIN_IMAGES } from './mapdrawable_assets.js';
import { getCanvasContext } from './utils.js';


class GameViewer {
    constructor(definition, navigator, layers) {
        this.navigator = navigator;
        this.stage = navigator.stage;
        this.layers = layers;

        this.engine = new Engine(this, definition);

        this.mouseX = this.stage.width() / 2;
        this.mouseY = this.stage.height() / 2;

        let size = this.engine.map.edge_size;
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
            width: size * MapDrawable.TILE_SIZE.width,
            height: size * MapDrawable.TILE_SIZE.height,
            viewPortWidth: this.stage.width(),
            viewPortHeight: this.stage.height() - BottomBar.IMAGE.height
        });
        this.layers.entities.add(this.entitiesHolder);

        this.addEntities();

        this.layers.terrain.on("click", this.handleClick.bind(this));
        this.layers.entities.on("click", this.handleClick.bind(this));
        this.stage.on("mousemove", this.handleMouseMove.bind(this));
        this.stage.on("mouseout", this.handleMouseOut.bind(this));

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

        this.hoveredEntity = null;

        this.scroll_acc = {
            x: 0,
            y: 0
        };

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

        let entity = e.target.parent || this.hoveredEntity;
        if (entity instanceof Entity) {
            this.engine.selectedEntity = entity;
            entity.setSelected(true, this.engine);
            this.bottombar.showDetails(entity);
        }
    }
    handleRightClick(e) {
        if (this.engine.selectedEntity instanceof Unit || this.engine.selectedEntity instanceof Building) {
            let sx = (e.evt.layerX - this.mapDrawable.x());
            let sy = (e.evt.layerY - this.mapDrawable.y());
            let subtile = this.mapDrawable.screenCoordsToSubtile(sx, sy);

            if (!this.isPlanningConstruction && !this.hoveredEntity) {
                if (this.engine.selectedEntity instanceof Unit) this.orderIndicator.show(e.evt.layerX, e.evt.layerY);
            }
            this.engine.handleRightClick(subtile);
        }
        e.evt.preventDefault();
        return false;
    }
    setErrorMessage(text) {
        this.errorMessage.text(text);
        this.errorMessage.show();
        this.errorMessageTimeout = GameViewer.prototype.ERROR_MESSAGE_TIMEOUT;
    }
    addEntities() {
        for (let entity of this.engine.map.entities) {
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
        for (let entity of this.engine.map.entities) {
            entity.position(this.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
            entity.resetBoundingBox();
        }
    }
    handleMouseMove(e) {
        this.mouseX = e.evt.layerX;
        this.mouseY = e.evt.layerY;
    }
    handleMouseOut(e) {
        this.mouseX = NaN;
        this.mouseY = NaN;
    }
    handleScroll() {
        if (this.mouseX < GameViewer.prototype.SCROLL_MARGIN) {
            this.scroll_acc.x = Math.min(this.scroll_acc.x + 1, GameViewer.prototype.MAX_SCROLL_SPEED);
        } else if (this.mouseX > this.stage.width() - GameViewer.prototype.SCROLL_MARGIN) {
            this.scroll_acc.x = Math.max(this.scroll_acc.x - 1, -GameViewer.prototype.MAX_SCROLL_SPEED);
        } else {
            this.scroll_acc.x -= Math.sign(this.scroll_acc.x) * 2;
            this.scroll_acc.x &= -2;
        }

        if (this.mouseY < GameViewer.prototype.SCROLL_MARGIN) {
            this.scroll_acc.y = Math.min(this.scroll_acc.y + 1, GameViewer.prototype.MAX_SCROLL_SPEED);
        } else if (this.mouseY > this.stage.height() - GameViewer.prototype.SCROLL_MARGIN) {
            this.scroll_acc.y = Math.max(this.scroll_acc.y - 1, -GameViewer.prototype.MAX_SCROLL_SPEED);
        } else {
            this.scroll_acc.y -= Math.sign(this.scroll_acc.y) * 2;
            this.scroll_acc.y &= -2
        }

        this.viewPort.x -= this.scroll_acc.x;
        this.mapDrawable.x(-this.viewPort.x);
        this.entitiesHolder.x(-this.viewPort.x);
        this.orderIndicator.attrs.x += this.scroll_acc.x;

        this.viewPort.y -= this.scroll_acc.y;
        this.mapDrawable.y(-this.viewPort.y);
        this.entitiesHolder.y(-this.viewPort.y);
        this.orderIndicator.attrs.y += this.scroll_acc.y;
    }
    setCursor() {
        if (isNaN(this.mouseX) || isNaN(this.mouseY)) return;
        let cursor = "arrow";

        if (this.hoveredEntity != null) cursor = "pointer";

        if (this.engine.selectedEntity instanceof Unit || this.engine.selectedEntity instanceof Building) {
            if (this.hoveredEntity != null && this.engine.selectedEntity != this.hoveredEntity) {
                let Interaction = this.engine.selectedEntity.getInteractionType(this.hoveredEntity);
                if (Interaction) cursor = Interaction.prototype.CURSOR;
            }
        }
        this.stage.container.className = cursor;
    }
    setBottomBarActions() {
        this.bottombar.entityDetails.setEntity(this.engine.selectedEntity);

        if (this.engine.selectedEntity.actions_changed) {
            this.engine.selectedEntity.actions_changed = false;
            this.bottombar.entityActions.setEntity(this.engine.selectedEntity);
        }
    }
    setHoveredEntity() {
        if (isNaN(this.mouseX) || isNaN(this.mouseY)) return;

        this.hoveredEntity = null;
        if (this.layers.interface.getNodeAt(this.mouseX, this.mouseY) == null) {
            this.tooltip.hide();

            let node = this.layers.entities.getNodeAt(this.mouseX, this.mouseY);
            if (node) this.hoveredEntity = node.parent;
            else {
                let subtile = this.mapDrawable.screenCoordsToSubtile(
                    this.mouseX - this.mapDrawable.x(),
                    this.mouseY - this.mapDrawable.y()
                );
                let size = this.engine.map.edge_size;
                if (size * 2 > subtile.x && subtile.x > 0 && size * 2 > subtile.y && subtile.y > 0) {
                    this.hoveredEntity = this.engine.map.getEntityAtSubtile(subtile.x, subtile.y);
                }
            }

            if (this.hoveredEntity) {
                this.tooltip.text(this.hoveredEntity.toolTip());
                this.tooltip.show();
            }
            if (this.engine.selectedEntity instanceof Unit || this.engine.selectedEntity instanceof Building) {
                if (this.hoveredEntity != null && this.engine.selectedEntity != this.hoveredEntity) {
                    let Interaction = this.engine.selectedEntity.getInteractionType(this.hoveredEntity);
                    if (Interaction) {
                        let interaction = new Interaction(this.selectedEntity, this.hoveredEntity, this.engine);
                        this.tooltip.text(interaction.toolTip());
                        this.tooltip.show();
                    }
                }
            }
        }
    }
    process() {
        if (this.moved) this.reposition();
        this.handleScroll();
        this.topbar.process(this.engine.current_player);
        if (this.engine.selectedEntity != null) this.setBottomBarActions();
        if (this.errorMessageTimeout > 0) if (--this.errorMessageTimeout == 0) this.errorMessage.hide();
        this.constructionIndicator.process();
        this.orderIndicator.process();
        this.setHoveredEntity();
        this.setCursor();
    }
}
GameViewer.prototype.ERROR_MESSAGE_TIMEOUT = 35 * 6;
GameViewer.prototype.MAX_SCROLL_SPEED = 40;
GameViewer.prototype.SCROLL_MARGIN = 30;
GameViewer.prototype.TOOLTIP_OPTIONS = {
    fontSize: 15,
    fontFamily: 'helvetica',
    fontWeight: "bold",
    textBaseline: "bottom",
    strokeStyle: 'black',
    lineWidth: 3
}


class MapDrawable extends Graphics.Node {
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
        let miniCtx = getCanvasContext(this.map.edge_size, this.map.edge_size);

        for (let y = 0; y < this.map.edge_size; ++y) {
            for (let x = 0; x < this.map.edge_size; ++x) {

                miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS[this.map.terrain_tiles[x][y]];
                if (this.map.getEntityAtSubtile(x * 2, y * 2) instanceof Tree) miniCtx.fillStyle = MapDrawable.MINIMAP_PIXEL_COLORS.TREE;

                miniCtx.fillRect(x, y, 1, 1);
            }
        }

        miniCtx.canvas.className = "tmpMiniMap";
        document.body.appendChild(miniCtx.canvas);
    }
    tileCoordsToScreen(tx, ty) {
        let H = MapDrawable.TILE_SIZE.height;
        let W = MapDrawable.TILE_SIZE.width;
        let UH = MapDrawable.TILE_SIZE.height * this.map.edge_size;

        let x = tx * W * 0.5 + ty * W * 0.5;
        let y = 0.5 * UH - tx * 0.5 * H + ty * 0.5 * H;
        return { x, y };
    }
    screenCoordsToTile(sx, sy) {
        let H = MapDrawable.TILE_SIZE.height;
        let W = MapDrawable.TILE_SIZE.width;
        let UH = MapDrawable.TILE_SIZE.height * this.map.edge_size;

        let x = Math.floor((sx * H - W * sy + 0.5 * W * UH) / (W * H));
        let y = Math.floor((sy - 0.5 * UH) / (0.5 * H) + (sx * H - W * sy + 0.5 * UH * W) / (H * W));
        return { x, y };
    }
    screenCoordsToSubtile(sx, sy) {
        let H = MapDrawable.TILE_SIZE.height / 2;
        let W = MapDrawable.TILE_SIZE.width / 2;
        let UH = MapDrawable.TILE_SIZE.height * this.map.edge_size;

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


class TopBar extends Graphics.Node {
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


class BottomBar extends Graphics.Node {
    constructor(viewer, x=0, y=0) {
        super({ x, y });
        this.image = new Graphics.Image({
            image: BottomBar.IMAGE,
            hasHitmap: true
        });
        this.add(this.image);

        this.viewer = viewer;
        this.entityDetails = new EntityDetails;
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


class EntityDetails extends Graphics.Node {
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
                this.avatar.image(Sprites.Colorize(this.entity.getAvatar(), this.entity.player));
            } else {
                this.avatar.image(this.entity.getAvatar());
            }
            this.avatar.show();
        } else {
            this.avatar.hide();
        }
        this.name.text(this.entity.getName());
        if (this.entity.hp != null) {
            this.healthBar.setValue(this.entity.hp / this.entity.max_hp);
            this.healthBar.show();
            this.hp.text(`${this.entity.hp}/${this.entity.max_hp}`);
            this.hp.show();
        } else {
            this.healthBar.hide();
            this.hp.hide();
        }

        this.attributes.setEntity(entity);
    }
}
EntityDetails.TEXT_OPTIONS = {
    fontSize: 12,
    fontFamily: 'helvetica',
    textBaseline: "top",
    fill: '#ffffff',
};

class EntityAttributes extends Graphics.Node {
    constructor() {
        super(...arguments);
        for (let attr of EntityAttributes.ALL_ATTRIBUTES) {
            this[attr] = new EntityAttribute(EntityAttributes.ATTRIBUTES[attr]);
            this.add(this[attr]);
        }
    }
    setEntity(entity) {
        this.entity = entity;
        let offset_y = 0;
        for (let attr of EntityAttributes.ALL_ATTRIBUTES) {
            let base = this.entity.attributes[attr];
            let bonus = this.entity.player && this.entity.player.attributeBonus[this.entity.TYPE][attr];

            if (base != null || bonus) {
                base = base || 0;
                if (bonus) this[attr].text(`${base}+${bonus}`);
                else this[attr].text(base);
                this[attr].position({ x: 0, y: offset_y });
                this[attr].show();
                offset_y += EntityAttributes.ATTRIBUTES[attr].height + 1;
            } else this[attr].hide();
        }

    }
}
EntityAttributes.ALL_ATTRIBUTES = [
    "attack", "armor", "missile_armor", "range", "progress",
    "population", "food", "wood", "gold", "stone",
    "trade_units", "trade_profit", "load"
];
EntityAttributes.ATTRIBUTES = {
    attack: Sprites.Sprite("img/interface/details/attack.png"),
    food: Sprites.Sprite("img/interface/details/food.png"),
    wood: Sprites.Sprite("img/interface/details/wood.png"),
    gold: Sprites.Sprite("img/interface/details/gold.png"),
    stone: Sprites.Sprite("img/interface/details/stone.png"),
    trade_units: Sprites.Sprite("img/interface/details/trade_units.png"),
    trade_profit: Sprites.Sprite("img/interface/details/gold.png"),
    progress: Sprites.Sprite("img/interface/details/progress.png"),
    load: Sprites.Sprite("img/interface/details/population.png"),
    population: Sprites.Sprite("img/interface/details/population.png"),
    armor: Sprites.Sprite("img/interface/details/armor.png"),
    missile_armor: Sprites.Sprite("img/interface/details/missile_armor.png"),
    range: Sprites.Sprite("img/interface/details/range.png"),
}

class EntityAttribute extends Graphics.Node {
    constructor(image) {
        super();
        this.hide();
        this.value = new Graphics.Text({
            x: 3 + image.width, y: 5,
            ...EntityDetails.TEXT_OPTIONS
        });
        this.add(this.value);
        this.image = new Graphics.Image({ image });
        this.add(this.image);
    }
    text() {
        this.value.text(...arguments);
    }
}

class HealthBarBig extends Graphics.Node {
    constructor() {
        super(...arguments);
        this.init();
    }
    init() {
        this.red = new Graphics.Image({
            image: HealthBarBig.BAR_RED,
        });
        this.add(this.red);

        this._barCtx = getCanvasContext(HealthBarBig.BAR_GREEN.width, HealthBarBig.BAR_GREEN.height);
        this.setValue(1);

        this.green = new Graphics.Image({
            image: this._barCtx.canvas,
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


class EntityActions extends Graphics.Node {
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
        if (entity.ACTIONS) {
            let actions = entity.ACTIONS.filter((a) => a.isVisible(entity));
            if (actions.length) this.pushActions(actions);
        }
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


class ActionsSet extends Graphics.Node {
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


class ActionButton extends Graphics.Node {
    constructor(Action, pos, viewer) {
        super({ x: pos.x, y: pos.y });
        let entity = viewer.engine.selectedEntity;

        this.pressed = false;
        this.viewer = viewer;
        this.possible = Action.isPossible(entity);
        this.bg = new Graphics.Image({
            image: ActionButton.prototype.BACKGROUND_IMAGE,
        })
        this.add(this.bg);

        this.img = new Graphics.Image({
            image: Sprites.Colorize(Action.getImage(entity), entity.player),
            x: ActionButton.prototype.BORDER_WIDTH,
            y: ActionButton.prototype.BORDER_WIDTH,
            hasHitmap: true
        });
        if (!this.possible) this.img.opacity(.75);
        this.add(this.img);

        this.text = null;
        if (Action.prototype.SUPPORTS_QUEUE && entity.tasks_counts[Action.prototype.HASH]) {
            this.add(this.text = new Graphics.StrokedText(this.TEXT_OPTIONS));
            this.text.text(entity.tasks_counts[Action.prototype.HASH]);
        }

        this.img.on("click", (e) => {
            if (!this.possible) return;
            let action = new Action(viewer);
            action.execute();
        });
        this.img.on("mousedown", (e) => {
            if (this.possible) this.pressed = true;
        });
        this.img.on("mouseup", (e) => {
            this.pressed = false;
        });
        this.img.on("mouseover", (e) => {
            viewer.tooltip.text(Action.prototype.toolTip(entity.player));
            viewer.tooltip.show();
        });
        this.img.on("mouseout", (e) => {
            viewer.tooltip.hide();
        });
    }
    draw() {
        if (!this.attrs.visible) return;
        this.bg.draw();
        let oldAlpha = this.layer.ctx.globalAlpha;
        this.layer.ctx.globalAlpha *= this.img.attrs.opacity;

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
        this.layer.ctx.globalAlpha = oldAlpha;
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


class ConstructionIndicator extends Graphics.Node {
    constructor(viewer, options) {
        super(options);
        this.viewer = viewer;
        this.current_opacity = .65;
        this.opacity_delta = .01;
        this.image = null;
        this.BUILDING = null;
        this.vec = { x: 0, y: 0 };
        this.sub = null;
        this.end_sub = null;
        this.start_sub = null;
        this.allow_construction = false;
        this.player = null;
        this.moved = false;
    }
    move() {
        if (!this.viewer.isPlanningConstruction) return;
        this.moved = true;
        let W = this.BUILDING.prototype.SUBTILE_WIDTH;

        // construction preview coordinates must be adjisted to subtile size
        // therefore we compute position of subtile under cursor and use it
        // to compute screen coordinates of its corner
        this.sub = this.viewer.mapDrawable.screenCoordsToSubtile(
            this.viewer.mouseX + this.viewer.viewPort.x + MapDrawable.TILE_SIZE.width / 2,
            this.viewer.mouseY + this.viewer.viewPort.y
        );
        this.sub.x -= Math.round(W / 2);
        this.sub.y -= Math.round(W / 2);

    }
    reposition() {
        this.moved = false;
        let W = this.BUILDING.prototype.SUBTILE_WIDTH;

        if (this.BUILDING.prototype.CONTINUOUS_PREVIEW) {
            this.sub.x -= this.sub.x % W;
            this.sub.y -= this.sub.y % W;
        }
        let screen = this.viewer.mapDrawable.tileCoordsToScreen(this.sub.x / 2, this.sub.y / 2);

        let diff = this.start_sub && {
            x: this.sub.x - this.start_sub.x,
            y: this.sub.y - this.start_sub.y
        };


        if (this.BUILDING.prototype.CONTINUOUS_PREVIEW && this.start_sub) {
            this.removeChildren();
            this.vec = { x: 0, y: 0 };
            if (Math.abs(diff.x) > Math.abs(diff.y)) this.vec.x = W * (diff.x > 0 ? 1 : -1);
            else this.vec.y = W * (diff.y > 0 ? 1 : -1);

            this.end_sub = { ...this.sub };
            this.sub = { ...this.start_sub };

            let pos = this.viewer.mapDrawable.tileCoordsToScreen(this.start_sub.x / 2, this.start_sub.y / 2);
            let count = 1;

            this.add(this.image = new Graphics.Image({
                x: -this.getOffset().x - (screen.x - pos.x),
                y: -this.getOffset().y - (screen.y - pos.y),
                image: Sprites.Colorize(this.getSprite(), this.player),
                hasHitmap: true
            }));
            this.checkSubtiles();

            while ((this.vec.x && Math.abs(this.sub.x - this.end_sub.x) >= W) || (this.vec.y && Math.abs(this.sub.y - this.end_sub.y) >= W)) {
                ++count;
                this.sub.x += this.vec.x;
                this.sub.y += this.vec.y;
                let pos = this.viewer.mapDrawable.tileCoordsToScreen(this.sub.x / 2, this.sub.y / 2);

                this.add(this.image = new Graphics.Image({
                    x: -this.getOffset().x - (screen.x - pos.x),
                    y: -this.getOffset().y - (screen.y - pos.y),
                    image: Sprites.Colorize(this.getSprite(), this.player),
                    hasHitmap: true
                }));
                this.checkSubtiles();
            }
            this.viewer.tooltip.text(this.costToString(count));
            this.viewer.tooltip.show();
        }
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
    costToString(count) {
        let cost = { ...this.BUILDING.prototype.COST };
        let result = [];
        if (cost.wood) result.push(`Wood: ${cost.wood * count}`);
        if (cost.food) result.push(`Food: ${cost.food * count}`);
        if (cost.gold) result.push(`Gold: ${cost.gold * count}`);
        if (cost.stone) result.push(`Stone: ${cost.stone * count}`);
        return result.join(" ");
    }
    handleMouseDown(e) {
        if (e.evt.button == 0) this.start_sub = { x: this.sub.x, y: this.sub.y };
    }
    handleMouseUp(e) {
        if (e.evt.button == 2 || e.evt.which == 3) this.fire("reject");
        else {
            if (!this.BUILDING.prototype.CONTINUOUS_PREVIEW) this.fire("confirm");
            else {
                let diff = this.start_sub && {
                    x: this.sub.x - this.start_sub.x,
                    y: this.sub.y - this.start_sub.y
                };
                let W = this.BUILDING.prototype.SUBTILE_WIDTH;

                this.vec = { x: 0, y: 0 };
                if (Math.abs(diff.x) > Math.abs(diff.y)) this.vec.x = W * (diff.x > 0 ? 1 : -1);
                else this.vec.y = W * (diff.y > 0 ? 1 : -1);

                let last = this.sub;
                this.sub = { ...this.start_sub };
                while ((this.vec.x && Math.abs(last.x - this.sub.x) >= W) || (this.vec.y && Math.abs(last.y - this.sub.y) >= W)) {
                    this.sub.x += this.vec.x;
                    this.sub.y += this.vec.y;
                    this.checkSubtiles();
                    if (this.allow_construction) this.fire("confirm");
                }
                this.sub = this.start_sub;
                this.checkSubtiles();
                if (this.allow_construction) this.fire("confirm");

                this.viewer.bottombar.entityActions.goToFirst();
                this.viewer.isPlanningConstruction = false;
                this.hide();
            }
        }
        this.viewer.tooltip.hide();
    }
    checkSubtiles() {
        let W = this.BUILDING.prototype.SUBTILE_WIDTH;
        let map = this.viewer.engine.map;

        if (this.sub.x >= 0 && this.sub.x + W <= map.edge_size * 2 &&
            this.sub.y >= 0 && this.sub.y + W <= map.edge_size * 2 &&
            map.areSubtilesEmpty(this.sub.x, this.sub.y, W) &&
            this.BUILDING.prototype.canConstructOn(map.countTerrainTiles(this.sub.x, this.sub.y, W))
        ) {
            this.image.image(Sprites.Colorize(this.getSprite(), this.player));
            this.allow_construction = true;
        } else {
            this.image.image(Graphics.Filters.RedFilter(Sprites.Colorize(this.getSprite(), this.player)));
            this.allow_construction = false;
        }
    }
    getSpriteState() {
        let state = Building.prototype.STATE.DONE;
        if (this.BUILDING.prototype.CONTINUOUS_PREVIEW && this.sub && this.end_sub) {
            if ((this.sub.x != this.end_sub.x && this.sub.x != this.start_sub.x) ||
                (this.sub.y != this.end_sub.y && this.sub.y != this.start_sub.y)
            ) {
                if (this.vec.x) state = this.BUILDING.prototype.STATE.DONE_H;
                else if (this.vec.y) state = this.BUILDING.prototype.STATE.DONE_V;
            }
        }
        return state;
    }
    getSprite() {
        return this.BUILDING.prototype.IMAGES[this.getSpriteState()][this.player.civ][this.getLevel()][0];
    }
    getOffset() {
        return this.BUILDING.prototype.IMAGE_OFFSETS[this.getSpriteState()][this.player.civ][this.getLevel()];
    }
    getLevel() {
        let level = this.player.defaultEntityLevel[this.BUILDING.name];
        if (level == null) level = this.player.age;
        return level;
    }
    process() {
        if (!this.viewer.isPlanningConstruction) return;
        if (this.moved) {
            this.reposition();
            this.checkSubtiles();
        }
        this.opacityPulse();
    }
    draw() {
        if (!this.attrs.visible) return;
        super.draw();
        this.layer.hitmap.fillStyle = this.hitColor;
        this.layer.hitmap.fillRect(0, 0, this.layer.stage.width(), this.layer.stage.height());
    }
    setBuilding(building) {
        this.events = {};
        this.on("mousedown", this.handleMouseDown.bind(this));
        this.on("mouseup", this.handleMouseUp.bind(this));

        this.removeChildren();
        this.start_sub = null;
        this.end_sub = null;
        this.show();
        this.BUILDING = building;
        this.player = this.viewer.engine.selectedEntity.player;

        this.add(this.image = new Graphics.Image({
            x: -this.getOffset().x,
            y: -this.getOffset().y,
            image: Sprites.Colorize(this.getSprite(), this.player),
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


class MoverOrderIndicator extends Graphics.Node {
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
        this.position({ x, y });
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
MoverOrderIndicator.prototype.FRAMES = Sprites.SpriteSequence("img/interface/misc/move_order/", 6);

export {
    GameViewer, MapDrawable
}
