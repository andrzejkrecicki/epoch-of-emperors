import { Ship } from './ship.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { SailSmall } from '../buildings/details.js';
import { Arrow } from '../projectiles.js';
import { Actions } from '../actions.js';
import { UNIT_TYPES, FPS } from '../../utils.js';


class ScoutShip extends Ship {
    hasSail() {
        return this.level < 2;
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
ScoutShip.prototype.SUBTILE_WIDTH = 3;
ScoutShip.prototype.NAME = ["Scout Ship", "War Gallery"];
ScoutShip.prototype.AVATAR = [
    Sprites.Sprite("img/interface/avatars/scout_ship.png"),
    Sprites.Sprite("img/interface/avatars/war_gallery.png")
];
ScoutShip.prototype.TYPE = UNIT_TYPES.SHIP;
ScoutShip.prototype.MAX_HP = [120, 160];
ScoutShip.prototype.SPEED = 3;
ScoutShip.prototype.CREATION_TIME = 26 * FPS;
ScoutShip.prototype.ATTACK_RATE = 5 * 3;
ScoutShip.prototype.SHOT_DELAY = 27;
ScoutShip.prototype.LEAVES_LEFTOVERS = false;
ScoutShip.prototype.ATTACKS_FROM_DISTANCE = true;
ScoutShip.prototype.FLAME_POSITIONS = [{ x: 48, y: 0 }];
ScoutShip.prototype.MAX_FLAME_SIZE = 1/2;


ScoutShip.prototype.ACTION_KEY = "E";
ScoutShip.prototype.COST = {
    food: 0, wood: 135, stone: 0, gold: 0
}

ScoutShip.prototype.ATTRIBUTES = {
    ATTACK: [5, 8],
    ARMOR: [0, 0],
    RANGE: [5, 6]
}

ScoutShip.prototype.IMAGES = {
    [ScoutShip.prototype.STATE.IDLE]: [
        Sprites.DirectionSprites("img/units/scout_ship/idle/", 1),
        Sprites.DirectionSprites("img/units/war_gallery/idle/", 1)
    ],
    [ScoutShip.prototype.STATE.DYING]: [
        Sprites.SpriteSequence("img/units/ship_sink_small/", 5, 0, 8),
        Sprites.SpriteSequence("img/units/ship_sink_medium/", 6, 0, 8)
    ],
};
ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.MOVING] = ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.IDLE];
ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.ATTACK] = ScoutShip.prototype.IMAGES[ScoutShip.prototype.STATE.IDLE];


ScoutShip.prototype.IMAGE_OFFSETS = {
    [ScoutShip.prototype.STATE.IDLE]: [{ x: 39, y: 39 }, { x: 21, y: 45 }],
    [ScoutShip.prototype.STATE.MOVING]: [{ x: 39, y: 39 }, { x: 21, y: 45 }],
    [ScoutShip.prototype.STATE.ATTACK]: [{ x: 39, y: 39 }, { x: 21, y: 45 }],
    [ScoutShip.prototype.STATE.DYING]: [{ x: -17, y: 16 }, { x: 22, y: 24 }]
};

ScoutShip.prototype.SAIL_OFFSET = [{ x: 49, y: -2 }, { x: 49, y: -2 }];

export { ScoutShip }
