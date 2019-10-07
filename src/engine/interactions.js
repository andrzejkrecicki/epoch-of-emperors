import { RESOURCE_TYPES, RESOURCE_NAME } from '../utils.js';
import { Spear } from './projectiles.js';
import { Unit } from './units/unit.js';
import { Building } from './buildings/building.js';
import { Tree } from './trees.js';

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
    canBeSuccessor(candidate) {
        return false;
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
    toolTip() {
        return this.TOOLTIP;
    }
}
Interaction.prototype.DISTANCE = 0;
Interaction.prototype.CURSOR = 'pointer';
Interaction.prototype.TOOLTIP = '';


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
    canBeSuccessor(candidate) {
        return candidate instanceof this.passive.constructor;
    }
    getReturnBuildingTypes() {
        if (this.RESOURCE_TYPE == RESOURCE_TYPES.FOOD) return ["Town Center", "Granary"];
        else return ["Town Center", "Storage Pit"];
    }
    returnResources() {
        let types = this.getReturnBuildingTypes();
        let building = this.active.player.getNearestBuilding(this.active, { NAME: types, isComplete: [true] });
        this.active.prevInteractionObject = this.active.interactionObject;
        if (building) this.engine.interactOrder(this.active, building);
        else this.terminate();
    }
}

class FarmingInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.FARMER.BASE;
    }
    canBeSuccessor(candidate) {
        return candidate instanceof this.passive.constructor && candidate.player === this.active.player;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_FARM.BASE;
        else this.active.state = this.active.STATE.FARMER.BASE;
        super.stop();
    }
}
FarmingInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
FarmingInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
FarmingInteraction.prototype.RATE = 60;
FarmingInteraction.prototype.TOOLTIP = 'Right-click to farm here.';


class BuilderInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.BUILDING.BASE;
    }
    init() {
        if (this.passive.isComplete) this.interactWithSuccessor();
        else super.init();
    }
    canBeSuccessor(candidate) {
        return candidate instanceof Building && !candidate.isComplete && candidate.player === this.active.player
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                this.terminate();
            }
        } else if (this.passive.isComplete && this.passive.INTERACT_WHEN_COMPLETE) {
            this.engine.interactImmediately(this.active, this.passive);
        } else if (this.passive.isComplete) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                this.terminate();
            }
        } else if (this.active.ticks_waited >= this.RATE - this.active.player.interactionBonus[this.constructor.name]) {
            this.passive.constructionTick();
            this.active.ticks_waited = 0;
        }
    }
}
BuilderInteraction.prototype.RATE = 3;
BuilderInteraction.prototype.TOOLTIP = 'Right-click to construct this building.';


class RepairInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.REPAIRING.BASE;
    }
    canBeSuccessor(candidate) {
        return candidate instanceof Building && candidate.isComplete &&
            candidate.player === this.active.player && candidate.hp < candidate.max_hp
    }
    process() {
        if (this.passive.destroyed) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                this.terminate();
            }
        } else if (this.passive.hp == this.passive.max_hp) {
            if (this.engine.findInteractionSuccessor(this.active, this.passive) == null) {
                this.terminate();
            }
        } else if (this.active.ticks_waited >= this.RATE - this.active.player.interactionBonus[this.constructor.name]) {
            this.passive.repairTick();
            this.active.ticks_waited = 0;
        }
    }
}
RepairInteraction.prototype.RATE = 10;
RepairInteraction.prototype.TOOLTIP = 'Right-click to repair this building.';


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
ReturnResourcesInteraction.prototype.TOOLTIP = 'Right-click to return resources.';


class LumberInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.LUMBER.BASE;
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
    canBeSuccessor(candidate) {
        return candidate instanceof Tree;
    }
}
LumberInteraction.prototype.RATE = 11;
LumberInteraction.prototype.TOOLTIP = 'Right-click to chop down this tree.';


class ChopInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.LUMBER.BASE;
        this.active.attributes.food = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    init() {
        super.init();
        if (this.active.state == this.active.STATE.LUMBER.BASE) this.active.state = this.active.STATE.CHOP.BASE
    }
    canBeSuccessor(candidate) {
        return candidate instanceof Tree;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_WOOD.BASE;
        else this.active.state = this.active.STATE.LUMBER.BASE;
        super.stop();
    }
}
ChopInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.WOOD;
ChopInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.WOOD];
ChopInteraction.prototype.RATE = 63;
ChopInteraction.prototype.TOOLTIP = 'Right-click to chop down this tree.';


class ForageInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.FORAGE.BASE;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
}
ForageInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
ForageInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
ForageInteraction.prototype.RATE = 60;
ForageInteraction.prototype.TOOLTIP = 'Right-click to forage here.';


class GoldMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.MINE_GOLD.BASE;
        this.active.attributes.food = this.active.attributes.wood = this.active.attributes.stone = null;
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_GOLD.BASE;
        else this.active.state = this.active.STATE.MINE_GOLD.BASE;
        super.stop();
    }
}
GoldMineInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.GOLD;
GoldMineInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.GOLD];
GoldMineInteraction.prototype.RATE = 77;
GoldMineInteraction.prototype.TOOLTIP = 'Right-click to mine for gold.';


class StoneMineInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.MINE_STONE.BASE;
        this.active.attributes.food = this.active.attributes.wood = this.active.attributes.gold = null;

    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_STONE.BASE;
        else this.active.state = this.active.STATE.MINE_STONE.BASE;
        super.stop();
    }
}
StoneMineInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.STONE;
StoneMineInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.STONE];
StoneMineInteraction.prototype.RATE = 77;
StoneMineInteraction.prototype.TOOLTIP = 'Right-click to mine for stone.';


class FisherInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.FISHER.BASE;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;

    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_FISH.BASE;
        else this.active.state = this.active.STATE.FISHER.BASE;
        super.stop();
    }
}
FisherInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
FisherInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
FisherInteraction.prototype.RATE = 54;
FisherInteraction.prototype.TOOLTIP = 'Right-click to fish here.';


class HunterInteraction extends Interaction {
    preInit() {
        this.active.state = this.active.STATE.HUNTER.BASE;
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
        } else if (this.active.frame == this.active.IMAGES[this.active.STATE.HUNTER.BASE][this.active.level][0].length) {
            this.engine.interactOrder(this.active, this.passive);
        }
    }
    canBeSuccessor(candidate) {
        return candidate instanceof Unit && candidate.TYPE === "animal";
    }
    static getDistance() {
        return HunterInteraction.prototype.DISTANCE;
    }
}
HunterInteraction.prototype.RATE = 10;
HunterInteraction.prototype.DISTANCE = 6;
HunterInteraction.prototype.TOOLTIP = 'Right-click to hunt this animal.';


class ButcherInteraction extends ResourceExtractionInteraction {
    preInit() {
        this.active.state = this.active.STATE.HUNTER.BASE;
        this.active.attributes.wood = this.active.attributes.gold = this.active.attributes.stone = null;
    }
    init() {
        if (this.active.hasFullPath) this.active.state = this.active.STATE.BUTCHER.BASE;
        super.init();
    }
    canBeSuccessor(candidate) {
        return candidate instanceof Unit && candidate.TYPE === "animal";
    }
    stop() {
        if (this.active.attributes[RESOURCE_NAME[this.active.carriedResource]] > 0) this.active.state = this.active.STATE.CARRY_MEAT.BASE;
        else this.active.state = this.active.STATE.HUNTER.BASE;
        super.stop();
    }
}
ButcherInteraction.prototype.RESOURCE_TYPE = RESOURCE_TYPES.FOOD;
ButcherInteraction.prototype.RESOURCE_NAME = RESOURCE_NAME[RESOURCE_TYPES.FOOD];
ButcherInteraction.prototype.RATE = 60;
ButcherInteraction.prototype.TOOLTIP = 'Right-click to hunt this animal.';


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
FishingInteraction.prototype.TOOLTIP = 'Right-click to fish here.';


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


class BaseAttackInteraction extends Interaction {
    toolTip() {
        if (this.passive instanceof Unit && this.passive.TYPE == "animal") return this.TOOLTIPS[0];
        else if (this.passive instanceof Unit && this.passive.TYPE == "ship") return this.TOOLTIPS[1];
        else if (this.passive instanceof Unit && this.passive.TYPE == "fishing_boat") return this.TOOLTIPS[1];
        else if (this.passive instanceof Unit) return this.TOOLTIPS[2];
        else return this.TOOLTIPS[3];
    }
}
BaseAttackInteraction.prototype.CURSOR = 'attack';
BaseAttackInteraction.prototype.TOOLTIPS = [
    'Right-click to attack this animal.',
    'Right-click to attack this boat.',
    'Right-click to attack this unit.',
    'Right-click to attack this building.'
];


class AttackInteraction extends BaseAttackInteraction {
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

class DistantAttackInteraction extends BaseAttackInteraction {
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
DistantAttackInteraction.prototype.CURSOR = 'attack';


class TowerAttackInteraction extends BaseAttackInteraction {
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
TowerAttackInteraction.prototype.CURSOR = 'attack';


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
EnterShipInteraction.prototype.CURSOR = 'affect';
EnterShipInteraction.prototype.TOOLTIP = 'Right-click to board this transport.';


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
                this.passive.stop();
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
    toolTip() {
        if (this.passive instanceof Unit) return this.TOOLTIPS[0];
        else return this.TOOLTIPS[1];
    }
    static getDistance(active) {
        return active.attributes.range;
    }
}
ConversionInteraction.prototype.SUCCESS_PROBABILITY = 1 / 200;
ConversionInteraction.prototype.MINIMAL_TIME = 35 * 4;
ConversionInteraction.prototype.CURSOR = 'affect';
ConversionInteraction.prototype.TOOLTIPS = [
    'Right-click to convert this unit.',
    'Right-click to convert this building.'
]


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
HealInteraction.prototype.CURSOR = 'affect';
HealInteraction.prototype.TOOLTIP = 'Right-click to heal this unit.';


export {
    FarmingInteraction, BuilderInteraction, RepairInteraction, ReturnResourcesInteraction,
    LumberInteraction, ChopInteraction, ForageInteraction, GoldMineInteraction,
    StoneMineInteraction, FisherInteraction, HunterInteraction, ButcherInteraction,
    FishingInteraction, TradeInteraction, AttackInteraction, DistantAttackInteraction,
    TowerAttackInteraction, EnterShipInteraction, ConversionInteraction, HealInteraction
}
