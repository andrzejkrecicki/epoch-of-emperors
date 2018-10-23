import { Entity } from '../entity.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Building } from '../buildings/building.js';
import * as interactions from '../interactions.js';

class Unit extends Entity {
    constructor(subtile_x, subtile_y, player, level=0, rotation=null) {
        super(...arguments);
        this.hp = this.MAX_HP;
        this.max_hp = this.MAX_HP;
        this.state = this.STATE.IDLE;
        this.level = level;
        this.rotation = rotation != null ? rotation : Math.floor(Math.random() * 8);
        this.frame = 0;
        this.path = null;
        this.path_progress = 0;
        this.interactionObject = null;
        this.prevInteractionObject = null;
        this.hasFullPath = false;
        this.player = player;
        this.player.addUnit(this);

        if (this.ATTRIBUTES.ATTACK != null) this.attributes.attack = this.ATTRIBUTES.ATTACK;
        if (this.ATTRIBUTES.ARMOR != null) this.attributes.armor = this.ATTRIBUTES.ARMOR;
        if (this.ATTRIBUTES.MISSILE_ARMOR != null) this.attributes.missile_armor = this.ATTRIBUTES.MISSILE_ARMOR;
        if (this.ATTRIBUTES.RANGE != null) this.attributes.range = this.ATTRIBUTES.RANGE;

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    getSprite() {
        return this.IMAGES[this.state][this.level][this.rotation][this.frame];
    }
    getOffset() {
        return this.IMAGE_OFFSETS[this.state][this.level];
    }
    updateSprite() {
        this.frame %= this.IMAGES[this.state][this.level][this.rotation].length;
        this.image.image(Sprites.Colorize(this.getSprite(), this.COLORIZE && this.player));
        this.image.x(-this.getOffset().x);
        this.image.y(-this.getOffset().y);
    }
    getAvatar() {
        return this.AVATAR[this.level];
    }
    getName() {
        return this.NAME[this.level];
    }
    levelUp() {
        ++this.level;
        this.updateSprite();
    }
    getSpeed() {
        return this.SPEED;
    }
    destroy(engine) {
        super.destroy(engine);
        --this.player.population;
    }
    static isResearched(player) {
        return true;
    }
    rotateToSubtile(subtile) {
        let index = (subtile.y - this.subtile_y + 1) * 3 + (subtile.x - this.subtile_x) + 1
        if (index !== 4) {
            this.rotation = this.DIFF_TO_ROTATION[index];
        }
    }
    rotateToEntity(entity) {
        let dx = this.subtile_x - entity.subtile_x, dy = this.subtile_y - entity.subtile_y;

        if (dx + this.SUBTILE_WIDTH - 1 < 0) dx = 1;
        else if (dx - entity.SUBTILE_WIDTH + 1 > 0) dx = -1;
        else dx = 0;

        if (dy + this.SUBTILE_WIDTH - 1 < 0) dy = 1;
        else if (dy - entity.SUBTILE_WIDTH + 1 > 0) dy = -1;
        else dy = 0;

        let index = (dy + 1) * 3 + (dx) + 1
        if (index !== 4) {
            this.rotation = this.DIFF_TO_ROTATION[index];
        }
    }
    getOwnInteractionType() {
    }
    getInteractionType(object) {
        if (object instanceof Unit && object.canCarry(this)) return interactions.EnterShipInteraction;
        else if ((object instanceof Unit || object instanceof Building) && object.player != this.player) {
            if (this.ATTACKS_FROM_DISTANCE) return interactions.DistantAttackInteraction;
            else if (this.CAN_ATTACK) return interactions.AttackInteraction;
        } else return this.getOwnInteractionType(object);
    }
    get ACTIONS() {
    }
    getProjectileType() {
    }
    getProjectileOffset() {
        return { x: 0, y: 0 }
    }
    canCarry(object) {
        return false;
    }
    swapPath(path) {
        if (this.path == null) {
            // if unit currently has no path, just assign found path;
            this.path = path;
            this.path_progress = 0;
        } else {
            if (path[1].x == this.path[this.path_progress].x && path[1].y == this.path[this.path_progress].y) {
                // use new path if it starts with the subtile which is current target of our step
                this.path = path;
            } else {
                // otherwise go back to subtile which was beggining of our step and continue from there
                this.subtile_x = this.path[this.path_progress].x;
                this.subtile_y = this.path[this.path_progress].y;
                this.path = [this.path[this.path_progress]].concat(path);
            }
            this.path_progress = 1;
        }
    }
    setBaseState(state) {
        this.state &= this.BASE_STATE_MASK;
        this.state |= state;
        this.actions_changed = true;
    }
    hit(target, engine) {
        let base = this.attributes.attack;
        let bonus = this.player.attributeBonus[this.TYPE].attack;

        target.takeHit(base + bonus, this, engine);
    }
    takeHit(value, attacker, engine) {
        // take into account armour etc
        this.hp -= value;
        if (this.hp <= 0) {
            this.hp = 0;
            this.frame = 0;
            this.state = Unit.prototype.STATE.DYING;
        }
    }
    toggleDead(engine) {
        this.setBaseState(Unit.prototype.STATE.DEAD);
        this.destroy(engine);
    }
    afterStep() {
    }
    afterPath() {
    }
    afterMoveOrder() {
    }
}
Unit.prototype.TOOLTIP = "Click to select this unit.";
Unit.prototype.COLORIZE = true;
Unit.prototype.LEAVES_LEFTOVERS = true;
Unit.prototype.CAN_ENTER_SHIP = true;
Unit.prototype.CAN_ATTACK = true;
Unit.prototype.ATTACKS_FROM_DISTANCE = false;

Unit.prototype.DIFF_TO_ROTATION = [6, 7, 0, 5, null, 1, 4, 3, 2];
Unit.prototype.ROTATION = {
    N: 0, NE: 1, E: 2, SE: 3,
    S: 4, SW: 5, W: 6, NW: 7
}

Unit.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Unit.prototype.TYPE = "infantry";

Unit.prototype.DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
Unit.prototype.DIRECTIONS_DELTA = [
    { x: 0, y: -0.5656854249491516 }, { x: .8, y: -.4 }, { x: 1.1313708498983033, y: 0 }, { x: .8, y: .4 },
    { x: 0, y: 0.5656854249491516 }, { x: -.8, y: .4 }, { x: -1.1313708498983033, y: 0 }, { x: -.8, y: -.4 }
];
Unit.prototype.BASE_STATE_MASK_WIDTH = 10;
Unit.prototype.BASE_STATE_MASK = (
    (~0) >> Unit.prototype.BASE_STATE_MASK_WIDTH
    << Unit.prototype.BASE_STATE_MASK_WIDTH
);
Unit.prototype.STATE = {
    INTERACTION: 0,
    IDLE: 1,
    MOVING: 2,
    DYING: 4,
    DEAD: 8,
    ATTACK: 1 << Unit.prototype.BASE_STATE_MASK_WIDTH
}

Unit.prototype.FRAME_RATE = {
    [Unit.prototype.STATE.MOVING]: 2,
    [Unit.prototype.STATE.ATTACK]: 2,
    [Unit.prototype.STATE.DYING]: 3
}

Unit.prototype.ATTRIBUTES = {};

export { Unit }
