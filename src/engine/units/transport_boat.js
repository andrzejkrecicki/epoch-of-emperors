import { Ship } from './ship.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import { SailSmall } from '../buildings/details.js';
import { UNIT_TYPES, FPS } from '../../utils.js';


class TransportBoat extends Ship {
    constructor() {
        super(...arguments);
        this.isUnloading = false;
        this.readyForUnload = false;
        this.load = 0;
        this.capacity = this.MAX_LOAD[this.level];
        this.carriedUnits = [];
        this.attributes.load = `${this.load}/${this.capacity}`;
    }
    hasSail() {
        return this.level < 2;
    }
    canCarry(entity) {
        return entity.CAN_ENTER_SHIP && entity.player == this.player;
    }
    loadUnit(entity) {
        this.carriedUnits.push(entity);
        ++this.load;
        this.attributes.load = `${this.load}/${this.capacity}`;
        this.actions_changed = true;
    }
    afterMoveOrder() {
        if (this.readyForUnload) this.isUnloading = true;
        else this.isUnloading = false;
        this.readyForUnload = false;
    }
    afterPath(engine) {
        if (this.isUnloading && this.load > 0) {
            engine.unloadUnits(this);
            this.actions_changed = true;
        }
        this.isUnloading = false;
    }
    destroy(engine) {
        super.destroy(engine);
        for (let unit of this.carriedUnits) unit.destroy(engine);
    }
    get ACTIONS() {
        return [Actions.Unload, Actions.Stop];
    }
}
TransportBoat.prototype.SUBTILE_WIDTH = 2;
TransportBoat.prototype.NAME = ["Light Transport"];
TransportBoat.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/transport_boat.png")];
TransportBoat.prototype.TYPE = UNIT_TYPES.SHIP;
TransportBoat.prototype.MAX_HP = [150];
TransportBoat.prototype.SPEED = 3;
TransportBoat.prototype.CREATION_TIME = 26 * FPS;
TransportBoat.prototype.MAX_LOAD = [5, 10];
TransportBoat.prototype.LEAVES_LEFTOVERS = false;
TransportBoat.prototype.CAN_ATTACK = false;
TransportBoat.prototype.FLAME_POSITIONS = [{ x: 32, y: 0 }];
TransportBoat.prototype.MAX_FLAME_SIZE = 1/2;


TransportBoat.prototype.ACTION_KEY = "T";
TransportBoat.prototype.COST = {
    food: 0, wood: 150, stone: 0, gold: 0
}

TransportBoat.prototype.IMAGES = {
    [TransportBoat.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/transport_boat/idle/", 1)],
    [TransportBoat.prototype.STATE.DYING]: [
        Sprites.SpriteSequence("img/units/ship_sink_small/", 5, 0, 8),
        Sprites.SpriteSequence("img/units/ship_sink_medium/", 6, 0, 8)
    ],
};
TransportBoat.prototype.IMAGES[TransportBoat.prototype.STATE.MOVING] = TransportBoat.prototype.IMAGES[TransportBoat.prototype.STATE.IDLE];
TransportBoat.prototype.IMAGES[TransportBoat.prototype.STATE.ATTACK] = TransportBoat.prototype.IMAGES[TransportBoat.prototype.STATE.IDLE];


TransportBoat.prototype.IMAGE_OFFSETS = {
    [TransportBoat.prototype.STATE.IDLE]: [{ x: 20, y: 34 }],
    [TransportBoat.prototype.STATE.MOVING]: [{ x: 20, y: 34 }],
    [TransportBoat.prototype.STATE.ATTACK]: [{ x: 20, y: 34 }],
    [TransportBoat.prototype.STATE.DYING]: [{ x: -5, y: 20 }],
    [TransportBoat.prototype.STATE.DEAD]: [{ x: -5, y: 20 }],
};

TransportBoat.prototype.SAIL_OFFSET = [{ x: 35, y: -9 }]

export { TransportBoat }
