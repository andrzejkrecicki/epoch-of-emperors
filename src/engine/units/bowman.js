import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import { Arrow } from '../projectiles.js';
import { UNIT_TYPES, FPS } from '../../utils.js';

class BowMan extends Unit {
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
}
BowMan.prototype.SUBTILE_WIDTH = 1;
BowMan.prototype.NAME = ["Bowman"];
BowMan.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/bowman.png")];
BowMan.prototype.TYPE = UNIT_TYPES.ARCHER;
BowMan.prototype.MAX_HP = [35];
BowMan.prototype.SPEED = 1.1;
BowMan.prototype.CREATION_TIME = 26 * FPS;
BowMan.prototype.ATTACK_RATE = 7 * 3;
BowMan.prototype.SHOT_DELAY = 27;
BowMan.prototype.ATTACKS_FROM_DISTANCE = true;

BowMan.prototype.ACTION_KEY = "T";
BowMan.prototype.COST = {
    food: 40, wood: 20, stone: 0, gold: 0
}

BowMan.prototype.ATTRIBUTES = {
    ATTACK: [3],
    ARMOR: [0],
    RANGE: [5]
}


BowMan.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [BowMan.prototype.STATE.MOVING]: 3,
    [BowMan.prototype.STATE.ATTACK]: 3
}


BowMan.prototype.IMAGES = {
    [BowMan.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/bowman/idle/", 5)],
    [BowMan.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/bowman/moving/", 10)],
    [BowMan.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/bowman/attack/", 10)],
    [BowMan.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/bowman/dying/", 10)],
    [BowMan.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/bowman/dead/", 6)],
};

BowMan.prototype.IMAGE_OFFSETS = {
    [BowMan.prototype.STATE.IDLE]: [{ x: 7, y: 34 }],
    [BowMan.prototype.STATE.MOVING]: [{ x: 4, y: 37 }],
    [BowMan.prototype.STATE.ATTACK]: [{ x: 13, y: 46 }],
    [BowMan.prototype.STATE.DYING]: [{ x: 29, y: 37 }],
    [BowMan.prototype.STATE.DEAD]: [{ x: 31, y: 23 }],
};

export { BowMan }
