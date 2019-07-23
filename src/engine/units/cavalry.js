import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';

class Cavalry extends Unit {
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
    static isResearched(player) {
        return player.possessions.BronzeAge;
    }
}
Cavalry.prototype.SUBTILE_WIDTH = 2;
Cavalry.prototype.NAME = ["Cavalry"];
Cavalry.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/cavalry.png")];
Cavalry.prototype.TYPE = "cavalry";
Cavalry.prototype.MAX_HP = [150];
Cavalry.prototype.SPEED = 3;
Cavalry.prototype.CREATION_TIME = 40 * 35;
Cavalry.prototype.ATTACK_RATE = 7 * 3;

Cavalry.prototype.ACTION_KEY = "C";
Cavalry.prototype.COST = {
    food: 70, wood: 0, stone: 0, gold: 80
}

Cavalry.prototype.ATTRIBUTES = {
    ATTACK: [8],
    ARMOR: [0]
}


Cavalry.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [Cavalry.prototype.STATE.ATTACK]: 3
}


Cavalry.prototype.IMAGES = {
    [Cavalry.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/cavalry/idle/", 13)],
    [Cavalry.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/cavalry/moving/", 10)],
    [Cavalry.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/cavalry/attack/", 13)],
    [Cavalry.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/cavalry/dying/", 13)],
    [Cavalry.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/cavalry/dead/", 6)],
};

Cavalry.prototype.IMAGE_OFFSETS = {
    [Cavalry.prototype.STATE.IDLE]: [{ x: 13, y: 48 }],
    [Cavalry.prototype.STATE.MOVING]: [{ x: 7, y: 48 }],
    [Cavalry.prototype.STATE.ATTACK]: [{ x: 9, y: 60 }],
    [Cavalry.prototype.STATE.DYING]: [{ x: 74, y: 64 }],
    [Cavalry.prototype.STATE.DEAD]: [{ x: 97, y: 59 }],
};

export { Cavalry }
