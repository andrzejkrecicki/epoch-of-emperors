import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { SailSmall } from '../buildings/details.js';
import { Arrow } from '../projectiles.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';


class ScoutShip extends Unit {
    constructor() {
        super(...arguments);
        if (this.level < 2) {
            this.sail = new SailSmall(this.rotation);
            this.add(this.sail);
        } else this.sail = null;
    }
    updateSprite() {
        super.updateSprite(...arguments);
        if (this.sail) this.sail.rotation = this.rotation;
    }
    getInteractionType(object) {
        if (object instanceof Unit || object instanceof Building) return interactions.DistantAttackInteraction;
    }
    getProjectileType() {
        return Arrow
    }
    getProjectileOffset() {
        return { x: 37, y: -2 }
    }
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
}
ScoutShip.prototype.SUBTILE_WIDTH = 1;
ScoutShip.prototype.NAME = ["Scout Ship"];
ScoutShip.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/scout_ship.png")];
ScoutShip.prototype.MAX_HP = 120;
ScoutShip.prototype.SPEED = 3;
ScoutShip.prototype.CREATION_TIME = 26 * 35;
ScoutShip.prototype.ATTACK_RATE = 5 * 3;
ScoutShip.prototype.SHOT_DELAY = 27;
ScoutShip.prototype.LEAVES_LEFTOVERS = false;

ScoutShip.prototype.ACTION_KEY = "E";
ScoutShip.prototype.COST = {
    food: 135, wood: 0, stone: 0, gold: 0
}

ScoutShip.prototype.ATTRIBUTES = {
    ATTACK: 5,
    ARMOR: 0,
    RANGE: 5
}

ScoutShip.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

ScoutShip.prototype.IMAGES = {
    [ScoutShip.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/scout_ship/idle/", 1)],
    [ScoutShip.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/scout_ship/dying/", 1)],
};
ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.MOVING] = ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.IDLE];
ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.ATTACK] = ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.IDLE];


ScoutShip.prototype.IMAGE_OFFSETS = {
    [ScoutShip.prototype.STATE.IDLE]: [{ x: 58, y: 37 }],
    [ScoutShip.prototype.STATE.MOVING]: [{ x: 58, y: 37 }],
    [ScoutShip.prototype.STATE.ATTACK]: [{ x: 58, y: 37 }],
    [ScoutShip.prototype.STATE.DYING]: [{ x: 22, y: 24 }],
    [ScoutShip.prototype.STATE.DEAD]: [{ x: 58, y: 37 }],
};

export { ScoutShip }
