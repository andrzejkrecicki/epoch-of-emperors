import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';

class Hoplite extends Unit {
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
}
Hoplite.prototype.SUBTILE_WIDTH = 1;
Hoplite.prototype.NAME = ["Hoplite"];
Hoplite.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/hoplite.png")];
Hoplite.prototype.TYPE = "infantry";
Hoplite.prototype.MAX_HP = [120];
Hoplite.prototype.SPEED = 1;
Hoplite.prototype.CREATION_TIME = 36 * 35;
Hoplite.prototype.ATTACK_RATE = 8 * 3;

Hoplite.prototype.ACTION_KEY = "T";
Hoplite.prototype.COST = {
    food: 60, wood: 0, stone: 0, gold: 40
}

Hoplite.prototype.ATTRIBUTES = {
    ATTACK: [17],
    ARMOR: [5]
}


Hoplite.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [Hoplite.prototype.STATE.MOVING]: 3,
    [Hoplite.prototype.STATE.ATTACK]: 3
}


Hoplite.prototype.IMAGES = {
    [Hoplite.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/hoplite/idle/", 5)],
    [Hoplite.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/hoplite/moving/", 10)],
    [Hoplite.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/hoplite/attack/", 15)],
    [Hoplite.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/hoplite/dying/", 10)],
    [Hoplite.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/hoplite/dead/", 6)],
};

Hoplite.prototype.IMAGE_OFFSETS = {
    [Hoplite.prototype.STATE.IDLE]: [{ x: 34, y: 48 }],
    [Hoplite.prototype.STATE.MOVING]: [{ x: 32, y: 47 }],
    [Hoplite.prototype.STATE.ATTACK]: [{ x: 49, y: 50 }],
    [Hoplite.prototype.STATE.DYING]: [{ x: 66, y: 41 }],
    [Hoplite.prototype.STATE.DEAD]: [{ x: 71, y: 31 }],
};

export { Hoplite }
