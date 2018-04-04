import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { FishBig } from '../resources/fish.js';
import { make_image, leftpad, RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

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
    initInteraction(engine) {
        // TODO - remove all the redundancy
        this.ticks_waited = 0;
        if (this.interactionObject.destroyed) {
            if (this.interactionObject.interactionSuccessor) engine.interactOrder(this, this.interactionObject.interactionSuccessor);
            else this.terminateInteraction();
        } else if (!this.hasFullPath) this.setBaseState(this.STATE.IDLE);
        else if (this.interactionObject instanceof FishBig) {
            this.rotateToEntity(this.interactionObject);
            this.state = this.STATE.FISHING;
            this.interaction_type = this.INTERACTION_TYPE.FISHING;
        } else if (this.interactionObject instanceof Building) {
            // TODO - check if its our or enymy's building
            if (this.carriedResource && this.interactionObject.acceptsResource(this.carriedResource)) {
                let res_name = RESOURCE_NAME[this.carriedResource];
                this.player.resources[res_name] += this.attributes[res_name];
                this.attributes[res_name] = null;
                this.carriedResource = RESOURCE_TYPES.NONE;

                if (this.prevInteractionObject == null) {
                    this.terminateInteraction();
                    return;
                } else engine.interactOrder(this, this.prevInteractionObject);
                this.prevInteractionObject = null;
            }
        }
    }
    processInteraction(engine) {
        if (this.interaction_type == this.INTERACTION_TYPE.FISHING) {
            if (this.interactionObject.destroyed) {
                if (engine.findInteractionSuccessor(this, this.interactionObject) == null) {
                    if (this.attributes[RESOURCE_NAME[this.carriedResource]]) this.returnResources(engine)
                    else this.terminateInteraction()
                }
            } else if (this.attributes.food == this.CAPACITY.FOOD) this.returnResources(engine);
            else if (this.ticks_waited % this.FISHING_RATE == 0) {
                this.attributes.food += this.interactionObject.getFood(engine);
                this.carriedResource = RESOURCE_TYPES.FOOD;
            }
        }
        ++this.ticks_waited;
    }
    returnResources(engine) {
        let building = this.player.getNearestBuilding(this, { NAME: ["Dock"], isComplete: [true] });
        this.prevInteractionObject = this.interactionObject;
        engine.interactOrder(this, building);
    }
}
FishingBoat.prototype.SUBTILE_WIDTH = 2;
FishingBoat.prototype.NAME = "Fishing Boat";
FishingBoat.prototype.AVATAR = make_image("img/interface/avatars/fishing_boat.png");
FishingBoat.prototype.MAX_HP = 45;
FishingBoat.prototype.SPEED = 2;
FishingBoat.prototype.CREATION_TIME = 26 * 35;

FishingBoat.prototype.FISHING_RATE = 60;

FishingBoat.prototype.ACTION_KEY = "F";
FishingBoat.prototype.COST = {
    food: 0, wood: 50, stone: 0, gold: 0
}
FishingBoat.prototype.CAPACITY = { FOOD: 15 }

FishingBoat.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.WATER]);

FishingBoat.prototype.STATE = Object.assign({}, FishingBoat.prototype.STATE);
FishingBoat.prototype.STATE.FISHING = 1 << Unit.prototype.BASE_STATE_MASK_WIDTH;

FishingBoat.prototype.FRAME_RATE = {}
FishingBoat.prototype.FRAME_RATE[FishingBoat.prototype.STATE.FISHING] = 2;


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
