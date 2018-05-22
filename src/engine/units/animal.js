import { Unit } from './unit.js';
import { TERRAIN_TYPES } from '../terrain.js';
import * as interactions from '../interactions.js';

class Animal extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: this.ATTRIBUTES.ATTACK,
        }
    }
    getResource(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    getInteractionType(object) {
        if (object instanceof Unit) return interactions.AttackInteraction;
    }
    toggleDead(engine) {
        if (this.attributes.food > 0 && this.ticks_waited > Animal.prototype.DECAY_RATE) {
            --this.attributes.food;
            this.ticks_waited = 0;
        } else ++this.ticks_waited;

        if (this.attributes.food == 0 && !this.destroyed) {
            this.destroy(engine);
        }
    }
    takeHit(value, engine) {
        this.hp -= value;
        if (this.hp > 0) {
            if (this.path == null) engine.escapeOrder(this);
        } else {
            this.hp = 0;
            if (this.path == null) this.setBaseState(Animal.prototype.STATE.DYING);
        }
    }
    afterStep() {
        if (this.hp <= 0) {
            this.path = null;
            this.setBaseState(Animal.prototype.STATE.DYING);
        }
    }
}
Animal.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Animal.prototype.DECAY_RATE = 4 * 35;

export { Animal }
