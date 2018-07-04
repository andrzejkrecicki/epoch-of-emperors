import { RESOURCE_TYPES, RESOURCE_NAME } from '../utils.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { Spear } from './projectiles.js';

class Interaction {
    constructor(active, passive, engine) {
        this.active = active;
        this.passive = passive;
        this.engine = engine;
    }
    preInit() {}
    init() {
        if (this.passive.destroyed) this.interactWithSuccessor();
        else if (!this.active.hasFullPath) this.active.setBaseState(this.active.STATE.IDLE);
        else {
            this.active.frame = 0;
            this.active.rotateToEntity(this.passive);
            this.active.setBaseState(this.active.STATE.INTERACTION);
        }
    }
    preProcess() {}
    process() {}
    stop() {
        this.active.setBaseState(this.active.STATE.IDLE);
    }
    interactWithSuccessor() {
        if (this.passive.interactionSuccessor) this.engine.interactOrder(this.active, this.passive.interactionSuccessor);
        else this.terminate();
    }
    terminate() {
        this.stop();
        this.active.frame = 0;
        this.active.ticks_waited = 0;
        this.active.interactionObject = null;
        this.active.prevInteractionObject = null;
        this.active.interaction = null;
    }
    static getDistance() {
        return Interaction.prototype.DISTANCE;
    }
}
Interaction.prototype.DISTANCE = 0;


class ResourceExtractionInteraction extends Interaction {
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[this.RESOURCE_NAME]) this.returnResources(engine)
                else this.terminate()
            }
        } else if (this.active.attributes[this.RESOURCE_NAME] == this.active.CAPACITY[this.RESOURCE_NAME]) {
            this.returnResources(engine);
        } else if (this.active.ticks_waited == this.RATE) {
            this.active.attributes[this.RESOURCE_NAME] += this.passive.getResource(engine);
            this.active.carriedResource = this.RESOURCE_TYPE;
            this.active.ticks_waited = 0;
        }
    }
    getReturnBuildingTypes() {
        if (this.RESOURCE_TYPE == RESOURCE_TYPES.FOOD) return ["Town Center", "Granary"];
        else return ["Town Center", "Storage Pit"];
    }
    returnResources() {
        let types = this.getReturnBuildingTypes();
        let building = this.active.player.getNearestBuilding(this.active, { NAME: types, isComplete: [true] });
        this.active.prevInteractionObject = this.active.interactionObject;
        this.engine.interactOrder(this.active, building);
    }

}

class FarmingInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.FARMER;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_FARM;
        else this.active.state = this.active.STATE.FARMER;
        super.stop();
    }
}
FarmingInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
FarmingInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
FarmingInteraction.prototype.RATE = 60;


class BuilderInteraction extends Interaction {
    preInit() {
        this.active.state = Villager.prototype.STATE.BUILDING;
    }
    process() {
        if (this.passive.destroyed) {
            this.terminate();
        } else if (this.passive.isComplete && this.passive.INTERACT_WHEN_COMPLETE) {
            this.engine.interactImmediately(this.active, this.passive);
        } else if (this.passive.isComplete)
            this.terminate();
        else if (this.active.ticks_waited == this.RATE) {
            this.passive.constructionTick();
            this.active.ticks_waited = 0;
        }
    }
}
BuilderInteraction.prototype.RATE = 3;


class ReturnResourcesInteraction extends Interaction {
    init() {
        if (this.passive.destroyed) {
            this.interactWithSuccessor();
        } else if (this.active.hasFullPath) {
            let res_name = RESOURCE_NAME[this.active.carriedResource];
            this.active.player.resources[res_name] += this.active.attributes[res_name];
            this.active.attributes[res_name] = null;
            this.active.carriedResource = RESOURCE_TYPES.NONE;
            this.active.state = Villager.prototype.STATE.IDLE;

            if (this.active.prevInteractionObject == null) {
                this.terminate();
            } else this.engine.interactOrder(this.active, this.active.prevInteractionObject);
            this.active.prevInteractionObject = null;
        } else this.active.setBaseState(this.active.STATE.IDLE);
    }
}

class LumberInteraction extends Interaction {
    preInit() {
        this.active.state = Villager.prototype.STATE.LUMBER;
        this.active.attributes.food = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]]) this.active.returnResources(engine);
                else this.terminate()
            }
        } else {
            if (this.passive.state == this.passive.STATE.ALIVE) {
                if (this.active.ticks_waited == this.RATE) {
                    this.passive.lumberTick();
                    this.active.ticks_waited = 0;
                }
            } else this.engine.interactImmediately(this.active, this.passive);
        }
    }
}
LumberInteraction.prototype.RATE = 15;


class ChopInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.LUMBER;
        this.active.attributes.food = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_WOOD;
        else this.active.state = this.active.STATE.LUMBER;
        super.stop();
    }
}
ChopInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.WOOD;
ChopInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.WOOD];
ChopInteraction.prototype.RATE = 60;


class ForageInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.FORAGE;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
}
ForageInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
ForageInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
ForageInteraction.prototype.RATE = 60;


class GoldMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.MINE;
        this.active.attributes.food = this.active.attributes.wood = this.active.attributes.stone = null;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_GOLD;
        else this.active.state = this.active.STATE.MINE;
        super.stop();
    }
}
GoldMineInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.GOLD;
GoldMineInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.GOLD];
GoldMineInteraction.prototype.RATE = 60;


class StoneMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.MINE;
        this.active.attributes.food = this.active.attributes.wood = this.active.attributes.gold = null;

    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_STONE;
        else this.active.state = this.active.STATE.MINE;
        super.stop();
    }
}
StoneMineInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.STONE;
StoneMineInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.STONE];
StoneMineInteraction.prototype.RATE = 60;


class HunterInteraction extends Interaction {
    preInit() {
        this.active.state = Villager.prototype.STATE.HUNTER;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]]) this.active.returnResources(engine)
                else this.active.terminateInteraction()
            }
        } else if (this.passive.state == Unit.prototype.STATE.DYING) {
            this.engine.interactOrder(this.active, this.passive);
        } else if (this.active.ticks_waited == this.RATE) {
            this.engine.makeProjectile(Spear, this.active, this.passive);
            // this.active.hit(this.passive, engine);
        } else if (this.active.frame == this.active.IMAGES[this.active.STATE.HUNTER][this.active.level][0].length) {
            this.engine.interactOrder(this.active, this.passive);
        }
    }
    static getDistance() {
        return HunterInteraction.prototype.DISTANCE;
    }
}
HunterInteraction.prototype.RATE = 10;
HunterInteraction.prototype.DISTANCE = 6;


class ButcherInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = Villager.prototype.STATE.HUNTER;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    init() {
        if (this.active.hasFullPath) this.active.state = this.active.STATE.BUTCHER;
        super.init();
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_MEAT;
        else this.active.state = this.active.STATE.HUNTER;
        super.stop();
    }
}
ButcherInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
ButcherInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
ButcherInteraction.prototype.RATE = 60;


class FishingInteraction extends ResourceExtractionInteraction {
    init() {
        if (this.active.hasFullPath) this.active.state = this.active.STATE.FISHING;
        super.init();
    }
    stop() {
        this.active.state = this.active.STATE.IDLE;
    }
    getReturnBuildingTypes() {
        return ["Dock"];
    }
}
FishingInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
FishingInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
FishingInteraction.prototype.RATE = 60;


class AttackInteraction extends Interaction {
    init() {
        if (this.active.hasFullPath) {
            if (!this.active.isAdjecentTo(this.passive)) {
                let frame = this.active.frame;
                this.engine.interactOrder(this.active, this.passive);
                this.active.frame = frame;
            } else {
                this.active.state = Unit.prototype.STATE.ATTACK;
                super.init();
            }
        } else {
            this.active.state = this.active.STATE.IDLE;
        }
    }
    stop() {
        this.active.state = this.active.STATE.IDLE;
    }
    process() {
        if (this.passive.destroyed || this.passive.hp <= 0) {
            this.terminate();
        } else if (!this.active.isAdjecentTo(this.passive)) {
            this.engine.interactOrder(this.active, this.passive);
            return;
        } else if (this.active.ticks_waited == this.active.ATTACK_RATE) {
            this.active.hit(this.passive, this.engine);
        } else if (this.active.frame == this.active.IMAGES[this.active.STATE.ATTACK][this.active.level][0].length) {
            this.active.ticks_waited = 0;
        }
        this.active.rotateToEntity(this.passive);
    }
}


export {
    FarmingInteraction, BuilderInteraction, ReturnResourcesInteraction, LumberInteraction,
    ChopInteraction, ForageInteraction, GoldMineInteraction, StoneMineInteraction,
    HunterInteraction, ButcherInteraction, FishingInteraction, AttackInteraction
}
