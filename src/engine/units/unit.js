import { Entity } from '../entity.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Building } from '../buildings/building.js';
import * as interactions from '../interactions.js';

class Unit extends Entity {
    constructor(subtile_x, subtile_y, player, level=0, rotation=null) {
        super(...arguments);
        this.hp = Math.floor(this.MAX_HP[this.level] * player.attributeBonus[this.TYPE].hp_multiplier);
        this.max_hp = Math.floor(this.MAX_HP[this.level] * player.attributeBonus[this.TYPE].hp_multiplier);
        this.player = player;
        this.state = this.STATE.IDLE;
        this.setLevel(level);
        this.rotation = rotation != null ? rotation : Math.floor(Math.random() * 8);
        this.frame = 0;
        this.needsProcessing = false;
        this.path = null;
        this.path_progress = 0;
        this.interactionObject = null;
        this.prevInteractionObject = null;
        this.hasFullPath = false;
        this.player.addUnit(this);

        this.setImage();
        this.resetBoundingBox();
        this.createHealthBar();
    }
    getSprite() {
        let set = this.IMAGES[this.state][this.level][this.rotation]
        return set[this.frame % set.length];
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
        this.setLevel(this.level + 1);
        this.recalculateMaxHP();
        this.updateSprite();
    }
    setLevel(level) {
        this.level = level;
        this.recalculateMaxHP();

        if (this.ATTRIBUTES.ATTACK != null && this.ATTRIBUTES.ATTACK[level]) {
            this.attributes.attack = this.ATTRIBUTES.ATTACK[level];
        }
        if (this.ATTRIBUTES.ARMOR != null && this.ATTRIBUTES.ARMOR[level]) {
            this.attributes.armor = this.ATTRIBUTES.ARMOR[level];
        }
        if (this.ATTRIBUTES.MISSILE_ARMOR != null && this.ATTRIBUTES.MISSILE_ARMOR[level]) {
            this.attributes.missile_armor = this.ATTRIBUTES.MISSILE_ARMOR[level];
        }
        if (this.ATTRIBUTES.RANGE != null && this.ATTRIBUTES.RANGE[level]) {
            this.attributes.range = this.ATTRIBUTES.RANGE[level];
        }
    }
    getSpeed() {
        return this.player ? this.SPEED + this.player.attributeBonus[this.TYPE].speed : this.SPEED;
    }
    toolTip() {
        return this.TOOLTIP[this.TYPE];
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
        else if ((object instanceof Unit || object instanceof Building) &&
            object.player != this.player && this.CAN_ATTACK &&
            !(this.TYPE == "villager" && object.TYPE == "animal")) {
            if (this.ATTACKS_FROM_DISTANCE) return interactions.DistantAttackInteraction;
            else return interactions.AttackInteraction;
        } else return this.getOwnInteractionType(object);
    }
    get ACTIONS() {
    }
    process() {
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
    stop() {
       if (this.path && this.path.length >= this.path_progress) {
           this.path = [{ x: this.subtile_x, y: this.subtile_y }, this.path[this.path_progress]];
           this.path_progress = 1;
       } else {
           this.path = null;
           this.frame = 0;
           this.path_progress = 0;
           this.setBaseState(Unit.prototype.STATE.IDLE);
       }
    }
    setBaseState(state) {
        this.state &= this.BASE_STATE_MASK;
        this.state |= state;
        this.actions_changed = true;
    }
    getHighState() {
        return this.state & this.BASE_STATE_MASK;
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
Unit.prototype.TOOLTIP = {
    "villager": "Click to select this villager.",
    "infantry": "Click to select this military unit.",
    "archer": "Click to select this military unit.",
    "cavalry": "Click to select this military unit.",
    "fishing_boat": "Click to select this boat.",
    "ship": "Click to select this boat.",
    "priest": "Click to select this priest.",
    "siege": "Click to select this siege weapon.",
};
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
Unit.prototype.BASE_STATE_MASK_WIDTH = 5;
Unit.prototype.BASE_STATE_MASK = (
    (~0) >> (Unit.prototype.BASE_STATE_MASK_WIDTH - 1)
    << (Unit.prototype.BASE_STATE_MASK_WIDTH - 1)
);
Unit.prototype.STATE = {
    INTERACTION: 0,
    IDLE: 1,
    MOVING: 2,
    DYING: 4,
    DEAD: 8,
    ATTACK: 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH - 1)
}

Unit.prototype.FRAME_RATE = {
    [Unit.prototype.STATE.MOVING]: 2,
    [Unit.prototype.STATE.ATTACK]: 2,
    [Unit.prototype.STATE.DYING]: 3
}

Unit.prototype.ATTRIBUTES = {};

export { Unit }
