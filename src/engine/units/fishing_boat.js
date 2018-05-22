import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { FishBig } from '../resources/fish.js';
import { RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';

class FishingBoat extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: null
        }
        this.carriedResource = RESOURCE_TYPES.NONE;
    }
    get ACTIONS() {
        if (this.state & Unit.prototype.STATE.IDLE) return [
            Actions.StandGround
        ]; else return [Actions.StandGround, Actions.Stop]
    }
    getInteractionType(object) {
        if (object instanceof FishBig) return interactions.FishingInteraction;
        else if (object instanceof Building) {
            if (this.carriedResource && object.acceptsResource(this.carriedResource)) return interactions.ReturnResourcesInteraction;
        }
    }
}
FishingBoat.prototype.SUBTILE_WIDTH = 2;
FishingBoat.prototype.NAME = "Fishing Boat";
FishingBoat.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/fishing_boat.png");
FishingBoat.prototype.MAX_HP = 45;
FishingBoat.prototype.SPEED = 2;
FishingBoat.prototype.CREATION_TIME = 26 * 35;

FishingBoat.prototype.ACTION_KEY = "F";
FishingBoat.prototype.COST = {
    food: 0, wood: 50, stone: 0, gold: 0
}
FishingBoat.prototype.CAPACITY = {
    [RESOURCE_NAME[RESOURCE_TYPES.FOOD]]: 15
}

FishingBoat.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

FishingBoat.prototype.STATE = Object.assign({}, FishingBoat.prototype.STATE);
FishingBoat.prototype.STATE.FISHING = 2 << Unit.prototype.BASE_STATE_MASK_WIDTH;

FishingBoat.prototype.FRAME_RATE = {
    [FishingBoat.prototype.STATE.FISHING]: 2
}

FishingBoat.prototype.IMAGES = {
    [FishingBoat.prototype.STATE.IDLE]: Sprites.DirectionSprites("img/units/fishing_boat/regular/", 1),
    [FishingBoat.prototype.STATE.FISHING]: Sprites.DirectionSprites("img/units/fishing_boat/fishing/", 1)
}
FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.MOVING] = FishingBoat.prototype.IMAGES[FishingBoat.prototype.STATE.IDLE];


FishingBoat.prototype.IMAGE_OFFSETS = {
    [FishingBoat.prototype.STATE.IDLE]: { x: 0, y: 29 },
    [FishingBoat.prototype.STATE.MOVING]: { x: 0, y: 29 },
    [FishingBoat.prototype.STATE.FISHING]: { x: 0, y: 29 },
};


export { FishingBoat }
