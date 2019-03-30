import { Unit } from './unit.js';
import { Animal } from './animal.js';
import { Building } from '../buildings/building.js';
import { TownCenter } from '../buildings/town_center.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';


class Priest extends Unit {
    constructor() {
        super(...arguments);
        this.attributes.progress = '100%';
        this.mana = Priest.prototype.MAX_MANA; // TODO - check rejuvenation rate
    }
    getOwnInteractionType(object) {
        if (this.mana < Priest.prototype.MAX_MANA) return;
        else if (object.player !== this.player) {
            if (object instanceof TownCenter) return;
            else if (object instanceof Building || object instanceof Priest) {
                if (this.player.possessions.Monotheism) return interactions.ConversionInteraction;
                else return;
            } else if (!(object instanceof Animal) && object instanceof Unit) return interactions.ConversionInteraction;
        }
    }
    get ACTIONS() {
        return [Actions.Heal, Actions.Convert, Actions.Stop];
    }
}
Priest.prototype.SUBTILE_WIDTH = 1;
Priest.prototype.NAME = ["Priest"];
Priest.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/priest.png")];
Priest.prototype.TYPE = "infantry";
Priest.prototype.MAX_HP = 25;
Priest.prototype.SPEED = 0.7;
Priest.prototype.CREATION_TIME = 50 * 35;
Priest.prototype.ATTACK_RATE = 5 * 3;
Priest.prototype.CAN_ATTACK = false;
Priest.prototype.MAX_MANA = 100;

Priest.prototype.ACTION_KEY = "T";
Priest.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 125
}

Priest.prototype.ATTRIBUTES = {
    ARMOR: 0,
    RANGE: 10,
}


Priest.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [Priest.prototype.STATE.MOVING]: 3,
    [Priest.prototype.STATE.ATTACK]: 4
}


Priest.prototype.IMAGES = {
    [Priest.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/priest/idle/", 10)],
    [Priest.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/priest/moving/", 15)],
    [Priest.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/priest/attack/", 10)],
    [Priest.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/priest/dying/", 10)],
    [Priest.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/priest/dead/", 6)],
};

Priest.prototype.IMAGE_OFFSETS = {
    [Priest.prototype.STATE.IDLE]: [{ x: 4, y: 40 }],
    [Priest.prototype.STATE.MOVING]: [{ x: 8, y: 43 }],
    [Priest.prototype.STATE.ATTACK]: [{ x: 14, y: 43 }],
    [Priest.prototype.STATE.DYING]: [{ x: 38, y: 41 }],
    [Priest.prototype.STATE.DEAD]: [{ x: 36, y: 23 }],
};

export { Priest }
