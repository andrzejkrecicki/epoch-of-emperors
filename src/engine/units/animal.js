import { Unit } from './unit.js';
import { UNIT_TYPES, FPS } from '../../utils.js';
import * as interactions from '../interactions.js';

class Animal extends Unit {
    getResource(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) {
                this.setBaseState(Unit.prototype.STATE.DEAD);
                this.destroy(engine);
            }
            return 1;
        }
        return 0;
    }
    getOwnInteractionType(object) {
        if (object instanceof Unit) return interactions.AttackInteraction;
    }
    toggleDead(engine) {
        this.isFlat = true;

        if (this.attributes.food > 0 && this.ticks_waited > Animal.prototype.DECAY_RATE) {
            --this.attributes.food;
            this.ticks_waited = 0;
        } else ++this.ticks_waited;

        if (this.attributes.food == 0 && !this.destroyed) {
            this.setBaseState(Unit.prototype.STATE.DEAD);
            this.destroy(engine);
        }
    }
    takeHit(value, attacker, engine) {
        this.hp -= value;
        if (this.hp > 0) {
            if (this.state & Animal.prototype.STATE.IDLE) engine.interactOrder(this, attacker);
        } else {
            this.hp = 0;
            if (this.path == null) {
                this.frame = 0;
                this.state = Animal.prototype.STATE.DYING;
            }
        }
    }
    afterStep() {
        if (this.hp <= 0) {
            this.terminateInteraction();
            this.path = null;
            this.frame = 0;
            this.state = Animal.prototype.STATE.DYING;
            this.hasPrelocatedArea = false;
        }
    }
    toolTip() {
        return this.TOOLTIP;
    }
    getAvatar() {
        return this.AVATAR;
    }
}
Animal.prototype.DECAY_RATE = 4 * FPS;
Animal.prototype.COLORIZE = false;
Animal.prototype.TYPE = UNIT_TYPES.ANIMAL;
Animal.prototype.TOOLTIP = "Hunt this animal for food.";

export { Animal }
