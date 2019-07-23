import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';

class Chariot extends Unit {
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
    static isResearched(player) {
        return player.possessions.Wheel;
    }
}
Chariot.prototype.SUBTILE_WIDTH = 2;
Chariot.prototype.NAME = ["Chariot"];
Chariot.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/chariot.png")];
Chariot.prototype.TYPE = "cavalry";
Chariot.prototype.MAX_HP = [100];
Chariot.prototype.SPEED = 2.5;
Chariot.prototype.CREATION_TIME = 40 * 35;
Chariot.prototype.ATTACK_RATE = 9 * 3;

Chariot.prototype.ACTION_KEY = "R";
Chariot.prototype.COST = {
    food: 40, wood: 60, stone: 0, gold: 0
}

Chariot.prototype.ATTRIBUTES = {
    ATTACK: [7],
    ARMOR: [0]
}


Chariot.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [Chariot.prototype.STATE.ATTACK]: 3
}


Chariot.prototype.IMAGES = {
    [Chariot.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/chariot/idle/", 13)],
    [Chariot.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/chariot/moving/", 10)],
    [Chariot.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/chariot/attack/", 14)],
    [Chariot.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/chariot/dying/", 15)],
    [Chariot.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/chariot/dead/", 6)],
};

Chariot.prototype.IMAGE_OFFSETS = {
    [Chariot.prototype.STATE.IDLE]: [{ x: 40, y: 69 }],
    [Chariot.prototype.STATE.MOVING]: [{ x: 54, y: 63 }],
    [Chariot.prototype.STATE.ATTACK]: [{ x: 43, y: 64 }],
    [Chariot.prototype.STATE.DYING]: [{ x: 72, y: 75 }],
    [Chariot.prototype.STATE.DEAD]: [{ x: 73, y: 37 }],
};

export { Chariot }
