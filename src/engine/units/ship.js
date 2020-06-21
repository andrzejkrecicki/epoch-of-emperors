import { Unit } from './unit.js';
import { UNIT_TYPES, FPS } from '../../utils.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import { Flame, SailSmall } from '../buildings/details.js';

class Ship extends Unit {
    constructor() {
        super(...arguments);
        this.createSail();
        this.createFlames();
    }
    createFlames() {
        this.flames = [];
        for (let pos of this.FLAME_POSITIONS) {
            let flame = new Flame(pos.x, pos.y, this.flames.length % 2, -1);
            this.flames.push(flame);
            this.add(flame);
        }
    }
    repairTick() {
        ++this.hp;
        this.adjustFlames((this.max_hp - this.hp) / this.max_hp);
    }
    adjustFlames(percentage) {
        for (let flame of this.flames) flame.setPercentage(Math.min(percentage, this.MAX_FLAME_SIZE));
    }
    createSail() {
        if (this.hasSail()) {
            this.sail = new SailSmall(this.SAIL_OFFSET[this.level], this.rotation);
            this.sail.rotation = this.rotation;
            this.add(this.sail);
        } else this.sail = null;
    }
    hasSail() {
        return false;
    }
    updateSprite() {
        super.updateSprite(...arguments);
        if (this.sail) this.sail.rotation = this.rotation;
    }
    takeHit(value, attacker, engine) {
        super.takeHit(value, attacker, engine);
        if (this.hp <= 0 && this.sail != null) this.sail.hide();
        this.adjustFlames((this.max_hp - this.hp) / this.max_hp);
    }
}
Ship.prototype.TYPE = UNIT_TYPES.SHIP;
Ship.prototype.CAN_ENTER_SHIP = false;
Ship.prototype.FLAME_POSITIONS = [];
Ship.prototype.MAX_FLAME_SIZE = 1;
Ship.prototype.SAIL_OFFSET = null;

Ship.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

export { Ship }
