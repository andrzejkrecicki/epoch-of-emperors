import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import { Arrow } from '../projectiles.js';

class ImprovedBowMan extends Unit {
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
        return player.possessions.ImprovedBow;
    }
}
ImprovedBowMan.prototype.SUBTILE_WIDTH = 1;
ImprovedBowMan.prototype.NAME = ["Improved Bowman", "Composite Bowman"];
ImprovedBowMan.prototype.AVATAR = [
    Sprites.Sprite("img/interface/avatars/improved_bowman.png"),
    Sprites.Sprite("img/interface/avatars/composite_bowman.png")
];
ImprovedBowMan.prototype.TYPE = "archer";
ImprovedBowMan.prototype.MAX_HP = [40, 45];
ImprovedBowMan.prototype.SPEED = 1.1;
ImprovedBowMan.prototype.CREATION_TIME = 30 * 35;
ImprovedBowMan.prototype.ATTACK_RATE = 6 * 3;
ImprovedBowMan.prototype.SHOT_DELAY = 27;
ImprovedBowMan.prototype.ATTACKS_FROM_DISTANCE = true;

ImprovedBowMan.prototype.ACTION_KEY = "A";
ImprovedBowMan.prototype.COST = {
    food: 40, wood: 0, stone: 0, gold: 20
}

ImprovedBowMan.prototype.ATTRIBUTES = {
    ATTACK: [4, 5],
    ARMOR: [0, 0],
    RANGE: [6, 7]
}


ImprovedBowMan.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [ImprovedBowMan.prototype.STATE.MOVING]: 3,
    [ImprovedBowMan.prototype.STATE.ATTACK]: 3
}


ImprovedBowMan.prototype.IMAGES = {
    [ImprovedBowMan.prototype.STATE.IDLE]: [
        Sprites.DirectionSprites("img/units/improved_bowman/idle/", 5),
        Sprites.DirectionSprites("img/units/composite_bowman/idle/", 5)
    ],
    [ImprovedBowMan.prototype.STATE.MOVING]: [
        Sprites.DirectionSprites("img/units/improved_bowman/moving/", 10),
        Sprites.DirectionSprites("img/units/composite_bowman/moving/", 10)
    ],
    [ImprovedBowMan.prototype.STATE.ATTACK]: [
        Sprites.DirectionSprites("img/units/improved_bowman/attack/", 10),
        Sprites.DirectionSprites("img/units/composite_bowman/attack/", 10)
    ],
    [ImprovedBowMan.prototype.STATE.DYING]: [
        Sprites.DirectionSprites("img/units/improved_bowman/dying/", 10),
        Sprites.DirectionSprites("img/units/composite_bowman/dying/", 10)
    ],
    [ImprovedBowMan.prototype.STATE.DEAD]: [
        Sprites.DirectionSprites("img/units/improved_bowman/dead/", 6),
        Sprites.DirectionSprites("img/units/composite_bowman/dead/", 6)
    ],
};

ImprovedBowMan.prototype.IMAGE_OFFSETS = {
    [ImprovedBowMan.prototype.STATE.IDLE]: [{ x: 10, y: 35 }, { x: 10, y: 36 }],
    [ImprovedBowMan.prototype.STATE.MOVING]: [{ x: 8, y: 43 }, { x: 11, y: 44 }],
    [ImprovedBowMan.prototype.STATE.ATTACK]: [{ x: 13, y: 49 }, { x: 15, y: 50 }],
    [ImprovedBowMan.prototype.STATE.DYING]: [{ x: 31, y: 35 }, { x: 49, y: 52 }],
    [ImprovedBowMan.prototype.STATE.DEAD]: [{ x: 34, y: 20 }, { x: 59, y: 24 }],
};

export { ImprovedBowMan }
