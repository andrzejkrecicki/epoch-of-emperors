import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';

class ClubMan extends Unit {
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
}
ClubMan.prototype.SUBTILE_WIDTH = 1;
ClubMan.prototype.NAME = ["Clubman", "Axeman"];
ClubMan.prototype.AVATAR = [
    Sprites.Sprite("img/interface/avatars/clubman.png"),
    Sprites.Sprite("img/interface/avatars/axeman.png")
];
ClubMan.prototype.MAX_HP = 40;
ClubMan.prototype.SPEED = 1;
ClubMan.prototype.CREATION_TIME = 26 * 35;
ClubMan.prototype.ATTACK_RATE = 10 * 3;

ClubMan.prototype.ACTION_KEY = "T";
ClubMan.prototype.COST = {
    food: 50, wood: 0, stone: 0, gold: 0
}

ClubMan.prototype.ATTRIBUTES = {
    ATTACK: 3,
    ARMOR: 0
}

ClubMan.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [ClubMan.prototype.STATE.ATTACK]: 3
}


ClubMan.prototype.IMAGES = {
    [ClubMan.prototype.STATE.IDLE]: [
        Sprites.DirectionSprites("img/units/clubman/idle/", 6),
        Sprites.DirectionSprites("img/units/axeman/idle/", 8)
    ],
    [ClubMan.prototype.STATE.MOVING]: [
        Sprites.DirectionSprites("img/units/clubman/moving/", 15),
        Sprites.DirectionSprites("img/units/axeman/moving/", 15)
    ],
    [ClubMan.prototype.STATE.ATTACK]: [
        Sprites.DirectionSprites("img/units/clubman/attack/", 15),
        Sprites.DirectionSprites("img/units/axeman/attack/", 15)
    ],
    [ClubMan.prototype.STATE.DYING]: [
        Sprites.DirectionSprites("img/units/clubman/dying/", 10),
        Sprites.DirectionSprites("img/units/axeman/dying/", 10)
    ],
    [ClubMan.prototype.STATE.DEAD]: [
        Sprites.DirectionSprites("img/units/clubman/dead/", 6),
        Sprites.DirectionSprites("img/units/axeman/dead/", 6)
    ],
};

ClubMan.prototype.IMAGE_OFFSETS = {
    [ClubMan.prototype.STATE.IDLE]: [{ x: 3, y: 34 }, { x: 4, y: 35 }],
    [ClubMan.prototype.STATE.MOVING]: [{ x: 2, y: 34 }, { x: 6, y: 35 }],
    [ClubMan.prototype.STATE.ATTACK]: [{ x: 27, y: 45 }, { x: 30, y: 43 }],
    [ClubMan.prototype.STATE.DYING]: [{ x: 50, y: 40 }, { x: 47, y: 39 }],
    [ClubMan.prototype.STATE.DEAD]: [{ x: 55, y: 29 }, { x: 52, y: 23 }],
};

export { ClubMan }
