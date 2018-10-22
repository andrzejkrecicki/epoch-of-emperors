import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';

class SwordsMan extends Unit {
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
    static isResearched(player) {
        return player.possessions.ShortSword;
    }
}
SwordsMan.prototype.SUBTILE_WIDTH = 1;
SwordsMan.prototype.NAME = ["Short Swordsman", "Broad Swordsman"];
SwordsMan.prototype.AVATAR = [
    Sprites.Sprite("img/interface/avatars/short_swordsman.png"),
    Sprites.Sprite("img/interface/avatars/broad_swordsman.png")
];
SwordsMan.prototype.MAX_HP = 60;
SwordsMan.prototype.SPEED = 1;
SwordsMan.prototype.CREATION_TIME = 26 * 35;
SwordsMan.prototype.ATTACK_RATE = 8 * 3;

SwordsMan.prototype.ACTION_KEY = "Z";
SwordsMan.prototype.COST = {
    food: 35, wood: 0, stone: 0, gold: 15
}

SwordsMan.prototype.ATTRIBUTES = {
    ATTACK: 7,
    ARMOR: 1
}


SwordsMan.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [SwordsMan.prototype.STATE.MOVING]: 3,
    [SwordsMan.prototype.STATE.ATTACK]: 3
}


SwordsMan.prototype.IMAGES = {
    [SwordsMan.prototype.STATE.IDLE]: [
        Sprites.DirectionSprites("img/units/short_swordsman/idle/", 8),
        Sprites.DirectionSprites("img/units/broad_swordsman/idle/", 4)
    ],
    [SwordsMan.prototype.STATE.MOVING]: [
        Sprites.DirectionSprites("img/units/short_swordsman/moving/", 10),
        Sprites.DirectionSprites("img/units/broad_swordsman/moving/", 10)
    ],
    [SwordsMan.prototype.STATE.ATTACK]: [
        Sprites.DirectionSprites("img/units/short_swordsman/attack/", 15),
        Sprites.DirectionSprites("img/units/broad_swordsman/attack/", 15)
    ],
    [SwordsMan.prototype.STATE.DYING]: [
        Sprites.DirectionSprites("img/units/short_swordsman/dying/", 10),
        Sprites.DirectionSprites("img/units/broad_swordsman/dying/", 10)
    ],
    [SwordsMan.prototype.STATE.DEAD]: [
        Sprites.DirectionSprites("img/units/short_swordsman/dead/", 6),
        Sprites.DirectionSprites("img/units/broad_swordsman/dead/", 6)
    ],
};

SwordsMan.prototype.IMAGE_OFFSETS = {
    [SwordsMan.prototype.STATE.IDLE]: [{ x: 0, y: 37 }, { x: -3, y: 36 }],
    [SwordsMan.prototype.STATE.MOVING]: [{ x: 12, y: 37 }, { x: 10, y: 38 }],
    [SwordsMan.prototype.STATE.ATTACK]: [{ x: 29, y: 43 }, { x: 24, y: 41 }],
    [SwordsMan.prototype.STATE.DYING]: [{ x: 48, y: 44 }, { x: 49, y: 43 }],
    [SwordsMan.prototype.STATE.DEAD]: [{ x: 55, y: 26 }, { x: 54, y: 23 }],
};

export { SwordsMan }
