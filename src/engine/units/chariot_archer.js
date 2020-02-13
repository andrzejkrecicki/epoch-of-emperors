import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import { Arrow } from '../projectiles.js';
import { UNIT_TYPES } from '../../utils.js';

class ChariotArcher extends Unit {
    constructor() {
        super(...arguments);
        this.lastShot = 0;
    }
    getProjectileType() {
        return Arrow
    }
    getProjectileOffset() {
        return { x: 17, y: -25 }
    }
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
    static isResearched(player) {
        return player.possessions.Wheel;
    }
}
ChariotArcher.prototype.SUBTILE_WIDTH = 2;
ChariotArcher.prototype.NAME = ["Chariot Archer"];
ChariotArcher.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/chariot_archer.png")];
ChariotArcher.prototype.TYPE = UNIT_TYPES.ARCHER;
ChariotArcher.prototype.MAX_HP = [70];
ChariotArcher.prototype.SPEED = 2.5;
ChariotArcher.prototype.CREATION_TIME = 40 * 35;
ChariotArcher.prototype.ATTACK_RATE = 7 * 3;
ChariotArcher.prototype.SHOT_DELAY = 27;
ChariotArcher.prototype.ATTACKS_FROM_DISTANCE = true;

ChariotArcher.prototype.ACTION_KEY = "R";
ChariotArcher.prototype.COST = {
    food: 40, wood: 70, stone: 0, gold: 0
}

ChariotArcher.prototype.ATTRIBUTES = {
    ATTACK: [4],
    ARMOR: [0],
    RANGE: [7]
}


ChariotArcher.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [ChariotArcher.prototype.STATE.MOVING]: 2,
    [ChariotArcher.prototype.STATE.ATTACK]: 3
}


ChariotArcher.prototype.IMAGES = {
    [ChariotArcher.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/chariot_archer/idle/", 13)],
    [ChariotArcher.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/chariot_archer/moving/", 10)],
    [ChariotArcher.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/chariot_archer/attack/", 13)],
    [ChariotArcher.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/chariot_archer/dying/", 14)],
    [ChariotArcher.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/chariot_archer/dead/", 6)],
};

ChariotArcher.prototype.IMAGE_OFFSETS = {
    [ChariotArcher.prototype.STATE.IDLE]: [{ x: 38, y: 64 }],
    [ChariotArcher.prototype.STATE.MOVING]: [{ x: 33, y: 61 }],
    [ChariotArcher.prototype.STATE.ATTACK]: [{ x: 34, y: 65 }],
    [ChariotArcher.prototype.STATE.DYING]: [{ x: 44, y: 62 }],
    [ChariotArcher.prototype.STATE.DEAD]: [{ x: 35, y: 54 }],
};

export { ChariotArcher }
