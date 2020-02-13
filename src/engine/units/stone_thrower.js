import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import { Stone } from '../projectiles.js';
import { UNIT_TYPES } from '../../utils.js';

class StoneThrower extends Unit {
    constructor() {
        super(...arguments);
        this.lastShot = 0;
    }
    getProjectileType() {
        return Stone
    }
    getProjectileOffset() {
        return { x: 22, y: -63 }
    }
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
}
StoneThrower.prototype.SUBTILE_WIDTH = 3;
StoneThrower.prototype.NAME = ["Stone Thrower"];
StoneThrower.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/stone_thrower.png")];
StoneThrower.prototype.TYPE = UNIT_TYPES.SIEGE;
StoneThrower.prototype.MAX_HP = [75];
StoneThrower.prototype.SPEED = 0.72;
StoneThrower.prototype.CREATION_TIME = 60 * 35;
StoneThrower.prototype.ATTACK_RATE = 3 * 3;
StoneThrower.prototype.SHOT_DELAY = 35 * 5;
StoneThrower.prototype.ATTACKS_FROM_DISTANCE = true;

StoneThrower.prototype.ACTION_KEY = "C";
StoneThrower.prototype.COST = {
    food: 0, wood: 180, stone: 0, gold: 80
}

StoneThrower.prototype.ATTRIBUTES = {
    ATTACK: [50],
    ARMOR: [0],
    RANGE: [10],
}


StoneThrower.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [StoneThrower.prototype.STATE.MOVING]: 8,
    [StoneThrower.prototype.STATE.ATTACK]: 3,
    [StoneThrower.prototype.STATE.DYING]: 4
}


StoneThrower.prototype.IMAGES = {
    [StoneThrower.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/stone_thrower/idle/", 1)],
    [StoneThrower.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/stone_thrower/moving/", 4)],
    [StoneThrower.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/stone_thrower/attack/", 8)],
    [StoneThrower.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/stone_thrower/dying/", 4)],
    [StoneThrower.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/stone_thrower/dead/", 3)],
};

StoneThrower.prototype.IMAGE_OFFSETS = {
    [StoneThrower.prototype.STATE.IDLE]: [{ x: -4, y: 52 }],
    [StoneThrower.prototype.STATE.MOVING]: [{ x: -5, y: 52 }],
    [StoneThrower.prototype.STATE.ATTACK]: [{ x: 18, y: 78 }],
    [StoneThrower.prototype.STATE.DYING]: [{ x: 23, y: 52 }],
    [StoneThrower.prototype.STATE.DEAD]: [{ x: 19, y: 44 }],
};

export { StoneThrower }
