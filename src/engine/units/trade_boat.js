import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';

class TradeBoat extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: null
        }
        this.carriedResource = RESOURCE_TYPES.NONE;
    }
    get ACTIONS() {
        return [Actions.TradeFood, Actions.TradeWood, Actions.TradeStone, Actions.Stop]
    }
    getInteractionType(object) {

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
    [RESOURCE_NAME[RESOURCE_TYPES.FOOD]]: 15
}

TradeBoat.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

TradeBoat.prototype.IMAGES = {
    [TradeBoat.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/trade_boat/", 1)],
}
TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.MOVING] = TradeBoat.prototype.IMAGES[TradeBoat.prototype.STATE.IDLE];


TradeBoat.prototype.IMAGE_OFFSETS = {
    [TradeBoat.prototype.STATE.IDLE]: [{ x: 13, y: 41 }],
    [TradeBoat.prototype.STATE.MOVING]: [{ x: 13, y: 41 }],
};


export { TradeBoat }
