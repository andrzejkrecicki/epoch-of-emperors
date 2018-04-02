import { Unit } from './unit.js';
import { make_image, leftpad } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

class FishingBoat extends Unit {
    constructor() {
        super(...arguments);
    }
    get ACTIONS() {
        if (this.state & Unit.prototype.STATE.IDLE) return [
            Actions.StandGround
        ]; else return [Actions.StandGround, Actions.Stop]
    }
}
FishingBoat.prototype.SUBTILE_WIDTH = 2;
FishingBoat.prototype.NAME = "Fishing Boat";
FishingBoat.prototype.AVATAR = make_image("img/interface/avatars/fishing_boat.png");
FishingBoat.prototype.MAX_HP = 45;
FishingBoat.prototype.SPEED = 2;
FishingBoat.prototype.CREATION_TIME = 26 * 35;

FishingBoat.prototype.ACTION_KEY = "F";
FishingBoat.prototype.COST = {
    food: 0, wood: 50, stone: 0, gold: 0
}
FishingBoat.prototype.CAPACITY = { FOOD: 15 }

FishingBoat.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

FishingBoat.prototype.STATE = Object.assign({}, FishingBoat.prototype.STATE);
FishingBoat.prototype.STATE.FISHING = 1 << Unit.prototype.BASE_STATE_MASK_WIDTH;

FishingBoat.prototype.IMAGES = {};

FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/fishing_boat/regular/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}
FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.MOVING] = FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.IDLE];

FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.FISHING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.FISHING][dir].push(
        make_image(`img/units/fishing_boat/fishing/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

FishingBoat.prototype.IMAGE_OFFSETS = {};
FishingBoat.prototype.IMAGE_OFFSETS[FishingBoat.prototype.STATE.IDLE] = { x: 0, y: 29 };
FishingBoat.prototype.IMAGE_OFFSETS[FishingBoat.prototype.STATE.MOVING] = { x: 0, y: 29 };
FishingBoat.prototype.IMAGE_OFFSETS[FishingBoat.prototype.STATE.FISHING] = { x: 0, y: 29 };


export { FishingBoat }
