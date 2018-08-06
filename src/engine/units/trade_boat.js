import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Dock } from '../buildings/dock.js';
import { RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';

class TradeBoat extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: null,
            wood: "",
            stone: null,
            gold: null,
        }
        this.carriedResource = RESOURCE_TYPES.NONE;
        this.tradedResource = RESOURCE_TYPES.WOOD;
    }
    get ACTIONS() {
        return [Actions.TradeFood, Actions.TradeWood, Actions.TradeStone, Actions.Stop]
    }
    getInteractionType(object) {
        if (object instanceof Dock) {
            if (object.player != this.player) return interactions.TradeInteraction;
            else return interactions.ReturnResourcesInteraction
        }
    }
}
TradeBoat.prototype.SUBTILE_WIDTH = 2;
TradeBoat.prototype.NAME = ["Trade Boat"];
TradeBoat.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/trade_boat.png")];
TradeBoat.prototype.MAX_HP = 200;
TradeBoat.prototype.SPEED = 3;
TradeBoat.prototype.CREATION_TIME = 26 * 35;

TradeBoat.prototype.ACTION_KEY = "R";
TradeBoat.prototype.COST = {
    food: 0, wood: 100, stone: 0, gold: 0
}
TradeBoat.prototype.CAPACITY = {
    [RESOURCE_NAME[RESOURCE_TYPES.FOOD]]: 20,
    [RESOURCE_NAME[RESOURCE_TYPES.WOOD]]: 20,
    [RESOURCE_NAME[RESOURCE_TYPES.STONE]]: 20,
    [RESOURCE_NAME[RESOURCE_TYPES.GOLD]]: 75
}

TradeBoat.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

TradeBoat.prototype.STATE = { ...TradeBoat.prototype.STATE };
TradeBoat.prototype.STATE.TRADING = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 1);

TradeBoat.prototype.IMAGES = {
    [TradeBoat.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/trade_boat/", 1)],
}
TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.MOVING] = TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.IDLE];
TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.TRADING] = TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.IDLE];


TradeBoat.prototype.IMAGE_OFFSETS = {
    [TradeBoat.prototype.STATE.IDLE]: [{ x: 13, y: 41 }],
    [TradeBoat.prototype.STATE.MOVING]: [{ x: 13, y: 41 }],
    [TradeBoat.prototype.STATE.TRADING]: [{ x: 13, y: 41 }],
};


export { TradeBoat }
