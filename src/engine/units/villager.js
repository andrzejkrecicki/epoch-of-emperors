import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { make_image, leftpad } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

class Villager extends Unit {
    initInteraction() {
        // TODO - check if interactionObject still exists
        if (this.interactionObject instanceof Building) {
            // TODO - check if its our or enymy's building
            if (this.interactionObject.isComplete) {
                // TODO - repair
                this.state = this.STATE.IDLE;
            } else {
                this.state = this.STATE.BUILDING;
                this.interaction_type = this.INTERACTION_TYPE.BUILDING;
            }
        } else {
            super.initInteraction();
        }
    }
    processInteraction(framesCount) {
        if (this.interaction_type == this.INTERACTION_TYPE.BUILDING) {
            // TODO - check if interactionObject still exists
            if (this.interactionObject.hp >= this.interactionObject.HP) {
                this.interactionObject.setComplete();
                this.state = this.STATE.IDLE;
                this.frame = 0;
                this.interactionObject = null;
            } else {
                if (framesCount % this.BUILD_RATE == 0) {
                    ++this.interactionObject.hp;
                }
            }
        }
    }

}
Villager.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = "Villager";
Villager.prototype.AVATAR = make_image("img/interface/avatars/villager.png");
Villager.prototype.HP = 25;
Villager.prototype.SPEED = 1;
Villager.prototype.BUILD_RATE = 3;
Villager.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Villager.prototype.ACTIONS = [
    Actions.Build,
    Actions.Repair,
    Actions.Stop
];
Villager.prototype.STATE = Object.assign({
    BUILDING: 3
}, Villager.prototype.STATE);

Villager.prototype.INTERACTION_TYPE = {
    BUILDING: 0
}

Villager.prototype.IMAGES = {};
Villager.prototype.IMAGES[Villager.prototype.STATE.IDLE] = [
    [make_image("img/units/villager/idle/N.png")],
    [make_image("img/units/villager/idle/NE.png")],
    [make_image("img/units/villager/idle/E.png")],
    [make_image("img/units/villager/idle/SE.png")],
    [make_image("img/units/villager/idle/S.png")],
    [make_image("img/units/villager/idle/SW.png")],
    [make_image("img/units/villager/idle/W.png")],
    [make_image("img/units/villager/idle/NW.png")],
];
Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/villager/moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 16; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING][dir].push(
            make_image(`img/units/villager/building/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGE_OFFSETS = {};
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.IDLE] = { x: 0, y: 35 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MOVING] = { x: 9, y: 35 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.BUILDING] = { x: 13, y: 37 };


export { Villager }