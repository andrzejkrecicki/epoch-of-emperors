import { RESOURCE_TYPES, RESOURCE_NAME } from '../utils.js';
import { Spear } from './projectiles.js';
import { Unit } from './units/unit.js';

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
        let bonus = this.active.player.attributeBonus[this.active.TYPE].capacity[this.RESOURCE_NAME];
        let max_capacity = this.active.CAPACITY[this.RESOURCE_NAME] + bonus;
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[this.RESOURCE_NAME]) this.returnResources(this.engine)
                else this.terminate()
            }
        } else if (this.active.attributes[this.RESOURCE_NAME] >= max_capacity) {
            this.returnResources(this.engine);
        } else if (this.active.ticks_waited >= this.RATE - this.active.player.interactionBonus[this.constructor.name]) {
            this.active.attributes[this.RESOURCE_NAME] += this.passive.getResource(this.engine);
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
        this.active.state = this.active.STATE.FARMER;
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
        this.active.state = this.active.STATE.BUILDING;
    }
    process() {
        if (this.passive.destroyed) {
            this.terminate();
        } else if (this.passive.isComplete && this.passive.INTERACT_WHEN_COMPLETE) {
            this.engine.interactImmediately(this.active, this.passive);
        } else if (this.passive.isComplete)
            this.terminate();
        else if (this.active.ticks_waited >= this.RATE - this.active.player.interactionBonus[this.constructor.name]) {
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
            this.active.state = this.active.STATE.IDLE;

            if (this.active.prevInteractionObject == null) {
                this.terminate();
            } else this.engine.interactOrder(this.active, this.active.prevInteractionObject);
            this.active.prevInteractionObject = null;
        } else this.active.setBaseState(this.active.STATE.IDLE);
    }
}

class LumberInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.LUMBER;
        this.active.attributes.food = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]]) this.active.returnResources(this.engine);
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
LumberInteraction.prototype.RATE = 11;


class ChopInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.LUMBER;
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
ChopInteraction.prototype.RATE = 63;


class ForageInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.FORAGE;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
}
ForageInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
ForageInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
ForageInteraction.prototype.RATE = 60;


class GoldMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.MINE;
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
GoldMineInteraction.prototype.RATE = 77;


class StoneMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.MINE;
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
StoneMineInteraction.prototype.RATE = 77;


class HunterInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.HUNTER;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]]) this.active.returnResources(this.engine)
                else this.active.terminateInteraction()
            }
        } else if (this.passive.state == this.passive.STATE.DYING) {
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
        this.active.state = this.active.STATE.HUNTER;
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


class TradeInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.carriedResource = this.active.tradedResource;
        this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] = "";
        this.active.attributes.gold = null;
    }
    init() {
        if (this.active.hasFullPath) {
            this.active.state = this.active.STATE.TRADING;
            super.init();
        } else this.terminate();
    }
    stop() {
        this.active.state = this.active.STATE.IDLE;
    }
    process() {
        let res = RESOURCE_NAME[this.active.tradedResource];
        let cap = this.active.CAPACITY[res];
        if (this.passive.attributes.trade_units >= cap && this.active.player.resources[res] >= cap) {
            this.passive.attributes.trade_units -= cap;
            this.active.player.resources[res] -= cap;
            this.active.attributes[res] = null;
            this.active.carriedResource = RESOURCE_TYPES.GOLD;
            this.active.attributes.gold = this.passive.getTradeProfit(this.active.player);
            this.returnResources(this.engine);
        }
    }
    getReturnBuildingTypes() {
        return ["Dock"];
    }
}


class AttackInteraction extends Interaction {
    init() {
        if (this.active.hasFullPath) {
            if (!this.active.isAdjecentTo(this.passive)) {
                let frame = this.active.frame;
                this.engine.interactOrder(this.active, this.passive);
                this.active.frame = frame;
            } else {
                this.active.state = this.active.STATE.ATTACK;
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


class DistantAttackInteraction extends Interaction {
    init() {
        if (this.active.hasFullPath) {
            this.active.state = this.active.STATE.ATTACK;
            super.init();
        } else {
            this.active.state = this.active.STATE.IDLE;
        }
    }
    stop() {
        this.active.state = this.active.STATE.IDLE;
    }
    process() {
        let total_frames = this.active.IMAGES[this.active.STATE.ATTACK][this.active.level][0].length;

        if (this.engine.framesCount - this.active.lastShot < this.active.SHOT_DELAY) {
            this.active.frame = 0;
            this.active.ticks_waited = 0;
        } else if (this.passive.destroyed || this.passive.hp <= 0) {
            this.terminate();
        } else if (this.active.ticks_waited == this.active.ATTACK_RATE) {
            this.engine.makeProjectile(this.active.getProjectileType(), this.active, this.passive);
        } else if (this.active.ticks_waited > this.active.ATTACK_RATE &&
            this.active.ticks_waited >= total_frames * this.active.FRAME_RATE[this.active.STATE.ATTACK]
        ) {
            this.active.lastShot = this.engine.framesCount;
            this.engine.interactOrder(this.active, this.passive);
        }
        this.active.rotateToEntity(this.passive);
    }
    static getDistance(active) {
        return Math.round(active.attributes.range * 1.5);
    }
}


class TowerAttackInteraction extends Interaction {
    init() {
        if (this.passive.destroyed) this.terminate();
    }
    stop() {
    }
    terminate() {
        this.active.ticks_waited = 0;
        this.active.interaction = null;
    }
    process() {
        let dist = Math.max(
            Math.abs(this.active.getCenterSubtile().subtile_x - this.passive.getCenterSubtile().subtile_x),
            Math.abs(this.active.getCenterSubtile().subtile_y - this.passive.getCenterSubtile().subtile_y)
        );

        if (dist > (this.active.SUBTILE_WIDTH + this.passive.SUBTILE_WIDTH) / 2 + this.active.attributes.range * 1.5) {
            this.terminate();
        } else if (this.engine.framesCount - this.active.lastShot < this.active.SHOT_DELAY) {
            this.active.ticks_waited = 0;
        } else if (this.passive.destroyed || this.passive.hp <= 0) {
            this.terminate();
        } else if (this.active.ticks_waited == this.active.ATTACK_RATE) {
            this.engine.makeProjectile(this.active.getProjectileType(), this.active, this.passive);
        } else if (this.active.ticks_waited > this.active.ATTACK_RATE) {
            this.active.lastShot = this.engine.framesCount;
            this.engine.interactImmediately(this.active, this.passive);
        }
    }
    static getDistance(active) {
        return Math.round(active.attributes.range * 1.5);
    }
}


class EnterShipInteraction extends Interaction {
    init() {
        if (this.passive.destroyed) {
            this.interactWithSuccessor();
        } else if (this.active.hasFullPath) {
            this.terminate();

            if (this.passive.load < this.passive.capacity) {
                this.engine.map.fillSubtilesWith(
                    this.active.subtile_x,
                    this.active.subtile_y,
                    this.active.SUBTILE_WIDTH,
                    null
                );
                if (this.engine.selectedEntity == this.active) this.engine.viewer.deselectEntity();
                this.active.remove();
                this.active.subtile_x = NaN;
                this.active.subtile_y = NaN;
                this.passive.loadUnit(this.active);
            }

        } else this.active.setBaseState(this.active.STATE.IDLE);
    }
}


class ConversionInteraction extends Interaction {
    init() {
        let convertionError = this.active.canConvert(this.passive);

        if (!this.active.hasFullPath) {
            this.active.state = this.active.STATE.IDLE;
        } else if (convertionError) {
            this.terminate();
            this.engine.viewer.setErrorMessage(convertionError);
        } else {
            this.active.state = this.active.STATE.ATTACK;
            super.init();
        }
    }
    stop() {
        this.active.state = this.active.STATE.IDLE;
    }
    process() {
        let chance = this.SUCCESS_PROBABILITY * (1 + this.active.player.interactionBonus.ConversionInteraction);
        let dist = Math.max(
            Math.abs(this.active.getCenterSubtile().subtile_x - this.passive.getCenterSubtile().subtile_x),
            Math.abs(this.active.getCenterSubtile().subtile_y - this.passive.getCenterSubtile().subtile_y)
        );

        if (dist > (this.active.SUBTILE_WIDTH + this.passive.SUBTILE_WIDTH) / 2 + this.active.attributes.range * 1.5) {
            this.engine.interactOrder(this.active, this.passive);
        } else if (this.passive.destroyed || this.passive.hp <= 0) {
            this.terminate();
        } else if (this.active.ticks_waited > this.MINIMAL_TIME && Math.random() < chance) {
            this.passive.wasConverted = true;
            this.passive.terminateInteraction();

            if (this.passive instanceof Unit) {
                this.passive.stopMoving();
                --this.passive.player.population;
                ++this.active.player.population;
                this.passive.player = this.active.player;
                this.passive.updateSprite();
            } else {
                this.passive.player = this.active.player;
                this.passive.updateImage();
            }

            this.active.mana = 0;
            this.active.attributes.progress = '0%';
            this.active.needsProcessing = true;
            this.terminate();
        }
        this.active.rotateToEntity(this.passive);
    }
    static getDistance(active) {
        return active.attributes.range;
    }
}
ConversionInteraction.prototype.SUCCESS_PROBABILITY = 1 / 200;
ConversionInteraction.prototype.MINIMAL_TIME = 35 * 4;


class HealInteraction extends Interaction {
    init() {
        if (this.active.hasFullPath) {
            if (!this.active.isAdjecentTo(this.passive)) {
                let frame = this.active.frame;
                this.engine.interactOrder(this.active, this.passive);
                this.active.frame = frame;
            } else {
                this.active.state = this.active.STATE.HEAL;
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
        if (this.passive.destroyed || this.passive.hp == this.passive.max_hp) {
            this.terminate();
        } else if (!this.active.isAdjecentTo(this.passive)) {
            this.engine.interactOrder(this.active, this.passive);
            return;
        } else if (this.active.ticks_waited == this.RATE) {
            ++this.passive.hp;
            this.active.ticks_waited = 0;
        }
        this.active.rotateToEntity(this.passive);
    }
}
HealInteraction.prototype.RATE = 12;


export {
    FarmingInteraction, BuilderInteraction, ReturnResourcesInteraction, LumberInteraction,
    ChopInteraction, ForageInteraction, GoldMineInteraction, StoneMineInteraction,
    HunterInteraction, ButcherInteraction, FishingInteraction, TradeInteraction,
    AttackInteraction, DistantAttackInteraction, TowerAttackInteraction, EnterShipInteraction,
    ConversionInteraction, HealInteraction
}
