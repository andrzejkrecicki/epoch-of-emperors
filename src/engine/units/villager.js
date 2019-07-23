import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Farm } from '../buildings/farm.js';
import { GoldMine } from '../resources/gold.js';
import { StoneMine } from '../resources/stone.js';
import { Bush } from '../resources/bush.js';
import { FishBig } from '../resources/fish.js';
import { Animal } from './animal.js';
import { Tree } from '../trees.js';
import { Sprites } from '../../sprites.js';
import { RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';

class Villager extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: Villager.prototype.ATTRIBUTES.ATTACK,
            food: null,
            wood: null,
            gold: null,
            stone: null
        }
        this.carriedResource = RESOURCE_TYPES.NONE;
    }
    get ACTIONS() {
        return [
            Actions.Build, Actions.Repair, Actions.Stop
        ];
    }
    getOwnInteractionType(object) {
        if (object instanceof Farm && object.isComplete) return interactions.FarmingInteraction;
        else if (object instanceof Building) {
            if (this.carriedResource && object.acceptsResource(this.carriedResource)) return interactions.ReturnResourcesInteraction;
            else if (!object.isComplete) return interactions.BuilderInteraction;
            else if (object.hp < object.MAX_HP) return interactions.RepairInteraction;
        } else if (object instanceof Tree) {
            if (object.state == Tree.prototype.STATE.ALIVE) return interactions.LumberInteraction;
            else return interactions.ChopInteraction;
        } else if (object instanceof Bush) return interactions.ForageInteraction;
        else if (object instanceof GoldMine) return interactions.GoldMineInteraction;
        else if (object instanceof StoneMine) return interactions.StoneMineInteraction;
        else if (object instanceof FishBig) return interactions.FisherInteraction;
        else if (object instanceof Animal) {
            if (object.hp > 0) return interactions.HunterInteraction;
            else return interactions.ButcherInteraction;
        }
    }
    getProjectileOffset() {
        return { x: 16, y: -30 }
    }
    preDead() {
        if (this.state & Villager.prototype.STATE.ATTACK) this.state = Villager.prototype.STATE.IDLE;
        if (this.state & Villager.prototype.STATE.CHOP.BASE) this.state = Villager.prototype.STATE.LUMBER.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_WOOD.BASE) this.state = Villager.prototype.STATE.LUMBER.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_GOLD.BASE) this.state = Villager.prototype.STATE.MINE_GOLD.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_STONE.BASE) this.state = Villager.prototype.STATE.MINE_STONE.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_FARM.BASE) this.state = Villager.prototype.STATE.FARMER.BASE;
        if (this.state & Villager.prototype.STATE.BUTCHER.BASE) this.state = Villager.prototype.STATE.HUNTER.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_MEAT.BASE) this.state = Villager.prototype.STATE.HUNTER.BASE;
        if (this.state & Villager.prototype.STATE.CARRY_FISH.BASE) this.state = Villager.prototype.STATE.FISHER.BASE;
    }
    takeHit(value, attacker, engine) {
        // take into account armour etc
        this.hp -= value;
        if (this.hp <= 0) {
            this.hp = 0;
            this.frame = 0;
            this.preDead();
            this.setBaseState(Unit.prototype.STATE.DYING);
        }
    }
    getName() {
        return this.NAME[this.getHighState()];
    }
}
Villager.prototype.SUBTILE_WIDTH = 1;
Villager.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/villager.png")];
Villager.prototype.TYPE = "villager";
Villager.prototype.MAX_HP = [25];
Villager.prototype.SPEED = 1;
Villager.prototype.CREATION_TIME = 20 * 35;
Villager.prototype.ATTACK_RATE = 10 * 3;

Villager.prototype.ACTION_KEY = "C";
Villager.prototype.COST = {
    food: 50, wood: 0, stone: 0, gold: 0
}

Villager.prototype.CAPACITY = {
    [RESOURCE_NAME[RESOURCE_TYPES.FOOD]]: 10,
    [RESOURCE_NAME[RESOURCE_TYPES.WOOD]]: 10,
    [RESOURCE_NAME[RESOURCE_TYPES.STONE]]: 10,
    [RESOURCE_NAME[RESOURCE_TYPES.GOLD]]: 10
}
Villager.prototype.ATTRIBUTES = {
    ATTACK: [3]
}


class InteractionState {
    constructor(id) {
        this.BASE = id << Unit.prototype.BASE_STATE_MASK_WIDTH;
        this.IDLE = Unit.prototype.STATE.IDLE | this.BASE;
        this.MOVING = Unit.prototype.STATE.MOVING | this.BASE;
        this.DYING = Unit.prototype.STATE.DYING | this.BASE;
        this.DEAD = Unit.prototype.STATE.DEAD | this.BASE;
    }
}

Villager.prototype.STATE = {
    ...Villager.prototype.STATE,
    BUILDING: new InteractionState(1),
    REPAIRING: new InteractionState(2),
    FORAGE: new InteractionState(3),
    LUMBER: new InteractionState(4),
    CHOP: new InteractionState(5),
    CARRY_WOOD: new InteractionState(6),
    MINE_GOLD: new InteractionState(7),
    MINE_STONE: new InteractionState(8),
    CARRY_GOLD: new InteractionState(9),
    CARRY_STONE: new InteractionState(10),
    FARMER: new InteractionState(11),
    CARRY_FARM: new InteractionState(12),
    HUNTER: new InteractionState(13),
    BUTCHER: new InteractionState(14),
    CARRY_MEAT: new InteractionState(15),
    FISHER: new InteractionState(16),
    CARRY_FISH: new InteractionState(17)
};


Villager.prototype.NAME = {
    0: "Villager",
    [Villager.prototype.STATE.ATTACK.BASE]: "Villager",
    [Villager.prototype.STATE.BUILDING.BASE]: "Builder",
    [Villager.prototype.STATE.REPAIRING.BASE]: "Repairman",
    [Villager.prototype.STATE.FORAGE.BASE]: "Forager",
    [Villager.prototype.STATE.LUMBER.BASE]: "Woodcutter",
    [Villager.prototype.STATE.CHOP.BASE]: "Woodcutter",
    [Villager.prototype.STATE.CARRY_WOOD.BASE]: "Woodcutter",
    [Villager.prototype.STATE.MINE_GOLD.BASE]: "Gold Miner",
    [Villager.prototype.STATE.MINE_STONE.BASE]: "Stone Miner",
    [Villager.prototype.STATE.CARRY_GOLD.BASE]: "Gold Miner",
    [Villager.prototype.STATE.CARRY_STONE.BASE]: "Stone Miner",
    [Villager.prototype.STATE.FARMER.BASE]: "Farmer",
    [Villager.prototype.STATE.CARRY_FARM.BASE]: "Farmer",
    [Villager.prototype.STATE.HUNTER.BASE]: "Hunter",
    [Villager.prototype.STATE.BUTCHER.BASE]: "Hunter",
    [Villager.prototype.STATE.CARRY_MEAT.BASE]: "Hunter",
    [Villager.prototype.STATE.FISHER.BASE]: "Fisherman",
    [Villager.prototype.STATE.CARRY_FISH.BASE]: "Fisherman",
}


Villager.prototype.FRAME_RATE = { ...Unit.prototype.FRAME_RATE,
    [Villager.prototype.STATE.ATTACK.BASE]: 3,
    [Villager.prototype.STATE.DYING.BASE]: 3,
    [Villager.prototype.STATE.BUILDING.BASE]: 2,
    [Villager.prototype.STATE.REPAIRING.BASE]: 2,
    [Villager.prototype.STATE.FORAGE.BASE]: 4,
    [Villager.prototype.STATE.LUMBER.BASE]: 3,
    [Villager.prototype.STATE.CHOP.BASE]: 3,
    [Villager.prototype.STATE.MINE_GOLD.BASE]: 3,
    [Villager.prototype.STATE.MINE_STONE.BASE]: 3,
    [Villager.prototype.STATE.FARMER.BASE]: 3,
    [Villager.prototype.STATE.HUNTER.BASE]: 2,
    [Villager.prototype.STATE.BUTCHER.BASE]: 4,
    [Villager.prototype.STATE.FISHER.BASE]: 3
}

Villager.prototype.IMAGES = {
    [Villager.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/villager/idle/", 1)],
    [Villager.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/villager/moving/", 15)],
    [Villager.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/villager/attack/", 15)],
    [Villager.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/villager/dying/", 10)],
    [Villager.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/villager/dead/", 6)],

    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_WOOD, "img/units/villager/carry_wood/", 15),
    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_GOLD, "img/units/villager/carry_gold/", 15),
    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_STONE, "img/units/villager/carry_stone/", 15),
    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_FARM, "img/units/villager/carry_farm/", 15),
    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_MEAT, "img/units/villager/carry_meat/", 15),
    ...Sprites.CarrySprites(Villager.prototype.STATE.CARRY_FISH, "img/units/villager/carry_fish/", 15),

    ...Sprites.InteractionSprites(Villager.prototype.STATE.BUILDING, "img/units/villager/builder", 16, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.REPAIRING, "img/units/villager/builder", 16, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.FORAGE, "img/units/villager/forage", 27, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.LUMBER, "img/units/villager/lumber", 11, 1, 15, 10, 6),
    [Villager.prototype.STATE.CHOP.BASE]: [Sprites.DirectionSprites("img/units/villager/chop/", 15)],
    ...Sprites.InteractionSprites(Villager.prototype.STATE.MINE_GOLD, "img/units/villager/mine", 13, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.MINE_STONE, "img/units/villager/mine", 13, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.FARMER, "img/units/villager/farmer", 29, 1, 15, 10, 6),
    ...Sprites.InteractionSprites(Villager.prototype.STATE.HUNTER, "img/units/villager/hunter", 23, 1, 15, 10, 6),
    [Villager.prototype.STATE.BUTCHER.BASE]: [Sprites.DirectionSprites("img/units/villager/butcher/", 12)],
    [Villager.prototype.STATE.FISHER.BASE]: [Sprites.DirectionSprites("img/units/villager/fisher/", 16)],
    [Villager.prototype.STATE.FISHER.IDLE]: [Sprites.DirectionSprites("img/units/villager/fisher_idle/", 1)],
    [Villager.prototype.STATE.FISHER.MOVING]: [Sprites.DirectionSprites("img/units/villager/hunter_moving/", 15)],
    [Villager.prototype.STATE.FISHER.DYING]: [Sprites.DirectionSprites("img/units/villager/hunter_dying/", 10)],
    [Villager.prototype.STATE.FISHER.DEAD]: [Sprites.DirectionSprites("img/units/villager/hunter_dead/", 6)],
}


Villager.prototype.IMAGE_OFFSETS = {
    [Villager.prototype.STATE.IDLE]: [{ x: -5, y: 33 }],
    [Villager.prototype.STATE.MOVING]: [{ x: 2, y: 33 }],
    [Villager.prototype.STATE.ATTACK]: [{ x: 30, y: 46 }],
    [Villager.prototype.STATE.DYING]: [{ x: 27, y: 40 }],
    [Villager.prototype.STATE.DEAD]: [{ x: 28, y: 23 }],

    [Villager.prototype.STATE.BUILDING.BASE]: [{ x: 8, y: 31 }],
    [Villager.prototype.STATE.BUILDING.IDLE]: [{ x: -5, y: 32 }],
    [Villager.prototype.STATE.BUILDING.MOVING]: [{ x: 2, y: 33 }],
    [Villager.prototype.STATE.BUILDING.DYING]: [{ x: 43, y: 40 }],
    [Villager.prototype.STATE.BUILDING.DEAD]: [{ x: 43, y: 22 }],

    [Villager.prototype.STATE.REPAIRING.BASE]: [{ x: 8, y: 31 }],
    [Villager.prototype.STATE.REPAIRING.IDLE]: [{ x: -5, y: 32 }],
    [Villager.prototype.STATE.REPAIRING.MOVING]: [{ x: 2, y: 33 }],
    [Villager.prototype.STATE.REPAIRING.DYING]: [{ x: 43, y: 40 }],
    [Villager.prototype.STATE.REPAIRING.DEAD]: [{ x: 43, y: 22 }],

    [Villager.prototype.STATE.FORAGE.BASE]: [{ x: 17, y: 39 }],
    [Villager.prototype.STATE.FORAGE.IDLE]: [{ x: 1, y: 31 }],
    [Villager.prototype.STATE.FORAGE.MOVING]: [{ x: 7, y: 33 }],
    [Villager.prototype.STATE.FORAGE.DYING]: [{ x: 34, y: 40 }],
    [Villager.prototype.STATE.FORAGE.DEAD]: [{ x: 41, y: 28 }],

    [Villager.prototype.STATE.LUMBER.BASE]: [{ x: 1, y: 46 }],
    [Villager.prototype.STATE.LUMBER.IDLE]: [{ x: 1, y: 32 }],
    [Villager.prototype.STATE.LUMBER.MOVING]: [{ x: 3, y: 33 }],
    [Villager.prototype.STATE.LUMBER.DYING]: [{ x: 34, y: 43 }],
    [Villager.prototype.STATE.LUMBER.DEAD]: [{ x: 34, y: 22 }],

    [Villager.prototype.STATE.CHOP.BASE]: [{ x: 17, y: 43 }],
    [Villager.prototype.STATE.CARRY_WOOD.MOVING]: [{ x: 4, y: 32 }],
    [Villager.prototype.STATE.CARRY_WOOD.IDLE]: [{ x: 4, y: 32 }],

    [Villager.prototype.STATE.MINE_GOLD.BASE]: [{ x: 14, y: 45 }],
    [Villager.prototype.STATE.MINE_GOLD.IDLE]: [{ x: 0, y: 31 }],
    [Villager.prototype.STATE.MINE_GOLD.MOVING]: [{ x: 6, y: 32 }],
    [Villager.prototype.STATE.MINE_GOLD.DYING]: [{ x: 38, y: 48 }],
    [Villager.prototype.STATE.MINE_GOLD.DEAD]: [{ x: 38, y: 25 }],

    [Villager.prototype.STATE.MINE_STONE.BASE]: [{ x: 14, y: 45 }],
    [Villager.prototype.STATE.MINE_STONE.IDLE]: [{ x: 0, y: 31 }],
    [Villager.prototype.STATE.MINE_STONE.MOVING]: [{ x: 6, y: 32 }],
    [Villager.prototype.STATE.MINE_STONE.DYING]: [{ x: 38, y: 48 }],
    [Villager.prototype.STATE.MINE_STONE.DEAD]: [{ x: 38, y: 25 }],

    [Villager.prototype.STATE.CARRY_GOLD.MOVING]: [{ x: 0, y: 32 }],
    [Villager.prototype.STATE.CARRY_GOLD.IDLE]: [{ x: 0, y: 32 }],

    [Villager.prototype.STATE.CARRY_STONE.MOVING]: [{ x: 0, y: 33 }],
    [Villager.prototype.STATE.CARRY_STONE.IDLE]: [{ x: 0, y: 33 }],

    [Villager.prototype.STATE.FARMER.BASE]: [{ x: 12, y: 34 }],
    [Villager.prototype.STATE.FARMER.IDLE]: [{ x: -3, y: 35 }],
    [Villager.prototype.STATE.FARMER.MOVING]: [{ x: 12, y: 37 }],
    [Villager.prototype.STATE.FARMER.DYING]: [{ x: 56, y: 45 }],
    [Villager.prototype.STATE.FARMER.DEAD]: [{ x: 56, y: 32 }],

    [Villager.prototype.STATE.CARRY_FARM.IDLE]: [{ x: 7, y: 35 }],
    [Villager.prototype.STATE.CARRY_FARM.MOVING]: [{ x: 7, y: 35 }],

    [Villager.prototype.STATE.HUNTER.BASE]: [{ x: 29, y: 54 }],
    [Villager.prototype.STATE.HUNTER.IDLE]: [{ x: 17, y: 32 }],
    [Villager.prototype.STATE.HUNTER.MOVING]: [{ x: 10, y: 41 }],
    [Villager.prototype.STATE.HUNTER.DYING]: [{ x: 51, y: 51 }],
    [Villager.prototype.STATE.HUNTER.DEAD]: [{ x: 51, y: 26 }],

    [Villager.prototype.STATE.BUTCHER.BASE]: [{ x: 11, y: 32 }],
    [Villager.prototype.STATE.CARRY_MEAT.MOVING]: [{ x: -1, y: 34 }],
    [Villager.prototype.STATE.CARRY_MEAT.IDLE]: [{ x: -1, y: 34 }],

    [Villager.prototype.STATE.FISHER.BASE]: [{ x: 30, y: 49 }],
    [Villager.prototype.STATE.FISHER.IDLE]: [{ x: -1, y: 40 }],
    [Villager.prototype.STATE.FISHER.MOVING]: [{ x: 10, y: 41 }],
    [Villager.prototype.STATE.FISHER.DYING]: [{ x: 51, y: 51 }],
    [Villager.prototype.STATE.FISHER.DEAD]: [{ x: 51, y: 26 }],

    [Villager.prototype.STATE.CARRY_FISH.MOVING]: [{ x: 1, y: 34 }],
    [Villager.prototype.STATE.CARRY_FISH.IDLE]: [{ x: 1, y: 34 }],
};


export { Villager }
