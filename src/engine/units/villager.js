import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Farm } from '../buildings/farm.js';
import { GoldMine } from '../resources/gold.js';
import { StoneMine } from '../resources/stone.js';
import { Bush } from '../resources/bush.js';
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
        if (this.state & Villager.prototype.STATE.CHOP) this.state = Villager.prototype.STATE.LUMBER;
        if (this.state & Villager.prototype.STATE.CARRY_WOOD) this.state = Villager.prototype.STATE.LUMBER;
        if (this.state & Villager.prototype.STATE.CARRY_GOLD) this.state = Villager.prototype.STATE.MINE;
        if (this.state & Villager.prototype.STATE.CARRY_STONE) this.state = Villager.prototype.STATE.MINE;
        if (this.state & Villager.prototype.STATE.CARRY_FARM) this.state = Villager.prototype.STATE.FARMER;
        if (this.state & Villager.prototype.STATE.BUTCHER) this.state = Villager.prototype.STATE.HUNTER;
        if (this.state & Villager.prototype.STATE.CARRY_MEAT) this.state = Villager.prototype.STATE.HUNTER;
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
}
Villager.prototype.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = ["Villager"];
Villager.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/villager.png")];
Villager.prototype.TYPE = "villager";
Villager.prototype.MAX_HP = 25;
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
    ATTACK: 3
}

Villager.prototype.STATE = { ...Villager.prototype.STATE };
Villager.prototype.STATE.BUILDING = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 1);
Villager.prototype.STATE.BUILDING_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.BUILDING;
Villager.prototype.STATE.BUILDING_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.BUILDING;
Villager.prototype.STATE.BUILDING_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.BUILDING;
Villager.prototype.STATE.BUILDING_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.BUILDING;

Villager.prototype.STATE.FORAGE = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 2);
Villager.prototype.STATE.FORAGE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.FORAGE;
Villager.prototype.STATE.FORAGE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.FORAGE;
Villager.prototype.STATE.FORAGE_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.FORAGE;
Villager.prototype.STATE.FORAGE_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.FORAGE;

Villager.prototype.STATE.LUMBER = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 3);
Villager.prototype.STATE.LUMBER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.LUMBER;
Villager.prototype.STATE.LUMBER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.LUMBER;
Villager.prototype.STATE.LUMBER_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.LUMBER;
Villager.prototype.STATE.LUMBER_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.LUMBER;

Villager.prototype.STATE.CHOP = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 4);

Villager.prototype.STATE.CARRY_WOOD = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 5);
Villager.prototype.STATE.CARRY_WOOD_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_WOOD;
Villager.prototype.STATE.CARRY_WOOD_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_WOOD;

Villager.prototype.STATE.MINE = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 6);
Villager.prototype.STATE.MINE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.MINE;
Villager.prototype.STATE.MINE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.MINE;
Villager.prototype.STATE.MINE_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.MINE;
Villager.prototype.STATE.MINE_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.MINE;

Villager.prototype.STATE.CARRY_GOLD = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 7);
Villager.prototype.STATE.CARRY_GOLD_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_GOLD;
Villager.prototype.STATE.CARRY_GOLD_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_GOLD;

Villager.prototype.STATE.CARRY_STONE = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 8);
Villager.prototype.STATE.CARRY_STONE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_STONE;
Villager.prototype.STATE.CARRY_STONE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_STONE;

Villager.prototype.STATE.FARMER = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 9);
Villager.prototype.STATE.FARMER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.FARMER;
Villager.prototype.STATE.FARMER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.FARMER;
Villager.prototype.STATE.FARMER_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.FARMER;
Villager.prototype.STATE.FARMER_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.FARMER;

Villager.prototype.STATE.CARRY_FARM = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 10);
Villager.prototype.STATE.CARRY_FARM_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_FARM;
Villager.prototype.STATE.CARRY_FARM_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_FARM;

Villager.prototype.STATE.HUNTER = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 11);
Villager.prototype.STATE.HUNTER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.HUNTER;
Villager.prototype.STATE.HUNTER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.HUNTER;
Villager.prototype.STATE.HUNTER_DYING = Villager.prototype.STATE.DYING | Villager.prototype.STATE.HUNTER;
Villager.prototype.STATE.HUNTER_DEAD = Villager.prototype.STATE.DEAD | Villager.prototype.STATE.HUNTER;

Villager.prototype.STATE.BUTCHER = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 12);

Villager.prototype.STATE.CARRY_MEAT = 1 << (Unit.prototype.BASE_STATE_MASK_WIDTH + 13);
Villager.prototype.STATE.CARRY_MEAT_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_MEAT;
Villager.prototype.STATE.CARRY_MEAT_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_MEAT;


Villager.prototype.FRAME_RATE = { ...Unit.prototype.FRAME_RATE,
    [Villager.prototype.STATE.ATTACK]: 3,
    [Villager.prototype.STATE.DYING]: 3,
    [Villager.prototype.STATE.BUILDING]: 2,
    [Villager.prototype.STATE.FORAGE]: 4,
    [Villager.prototype.STATE.LUMBER]: 3,
    [Villager.prototype.STATE.CHOP]: 3,
    [Villager.prototype.STATE.MINE]: 3,
    [Villager.prototype.STATE.FARMER]: 3,
    [Villager.prototype.STATE.HUNTER]: 2,
    [Villager.prototype.STATE.BUTCHER]: 4
}

Villager.prototype.IMAGES = {
    [Villager.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/villager/idle/", 1)],
    [Villager.prototype.STATE.BUILDING_IDLE]: [Sprites.DirectionSprites("img/units/villager/builder_idle/", 1)],
    [Villager.prototype.STATE.FORAGE_IDLE]: [Sprites.DirectionSprites("img/units/villager/forage_idle/", 1)],
    [Villager.prototype.STATE.LUMBER_IDLE]: [Sprites.DirectionSprites("img/units/villager/lumber_idle/", 1)],
    [Villager.prototype.STATE.CARRY_WOOD_IDLE]: [Sprites.DirectionSprites("img/units/villager/carry_wood/", 1, 12)],
    [Villager.prototype.STATE.MINE_IDLE]: [Sprites.DirectionSprites("img/units/villager/mine_idle/", 1)],
    [Villager.prototype.STATE.CARRY_GOLD_IDLE]: [Sprites.DirectionSprites("img/units/villager/carry_gold/", 1, 12)],
    [Villager.prototype.STATE.CARRY_STONE_IDLE]: [Sprites.DirectionSprites("img/units/villager/carry_stone/", 1, 12)],
    [Villager.prototype.STATE.FARMER_IDLE]: [Sprites.DirectionSprites("img/units/villager/farmer_idle/", 1)],
    [Villager.prototype.STATE.CARRY_FARM_IDLE]: [Sprites.DirectionSprites("img/units/villager/carry_farm/", 1, 12)],
    [Villager.prototype.STATE.HUNTER_IDLE]: [Sprites.DirectionSprites("img/units/villager/hunter_idle/", 1)],
    [Villager.prototype.STATE.CARRY_MEAT_IDLE]: [Sprites.DirectionSprites("img/units/villager/carry_meat/", 1, 12)],

    [Villager.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/villager/moving/", 15)],
    [Villager.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/villager/attack/", 15)],
    [Villager.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/villager/dying/", 10)],
    [Villager.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/villager/dead/", 6)],
    [Villager.prototype.STATE.BUILDING]: [Sprites.DirectionSprites("img/units/villager/building/", 16)],
    [Villager.prototype.STATE.BUILDING_MOVING]: [Sprites.DirectionSprites("img/units/villager/builder_moving/", 15)],
    [Villager.prototype.STATE.BUILDING_DYING]: [Sprites.DirectionSprites("img/units/villager/builder_dying/", 10)],
    [Villager.prototype.STATE.BUILDING_DEAD]: [Sprites.DirectionSprites("img/units/villager/builder_dead/", 6)],

    [Villager.prototype.STATE.FORAGE]: [Sprites.DirectionSprites("img/units/villager/forage/", 27)],
    [Villager.prototype.STATE.FORAGE_MOVING]: [Sprites.DirectionSprites("img/units/villager/forage_moving/", 15)],
    [Villager.prototype.STATE.FORAGE_DYING]: [Sprites.DirectionSprites("img/units/villager/forage_dying/", 10)],
    [Villager.prototype.STATE.FORAGE_DEAD]: [Sprites.DirectionSprites("img/units/villager/forage_dead/", 6)],

    [Villager.prototype.STATE.LUMBER]: [Sprites.DirectionSprites("img/units/villager/lumber/", 11)],
    [Villager.prototype.STATE.LUMBER_MOVING]: [Sprites.DirectionSprites("img/units/villager/lumber_moving/", 15)],
    [Villager.prototype.STATE.LUMBER_DYING]: [Sprites.DirectionSprites("img/units/villager/lumber_dying/", 10)],
    [Villager.prototype.STATE.LUMBER_DEAD]: [Sprites.DirectionSprites("img/units/villager/lumber_dead/", 6)],

    [Villager.prototype.STATE.CHOP]: [Sprites.DirectionSprites("img/units/villager/chop/", 15)],
    [Villager.prototype.STATE.CARRY_WOOD_MOVING]: [Sprites.DirectionSprites("img/units/villager/carry_wood/", 15)],

    [Villager.prototype.STATE.MINE]: [Sprites.DirectionSprites("img/units/villager/mine/", 13)],
    [Villager.prototype.STATE.MINE_MOVING]: [Sprites.DirectionSprites("img/units/villager/mine_moving/", 15)],
    [Villager.prototype.STATE.MINE_DYING]: [Sprites.DirectionSprites("img/units/villager/mine_dying/", 10)],
    [Villager.prototype.STATE.MINE_DEAD]: [Sprites.DirectionSprites("img/units/villager/mine_dead/", 6)],

    [Villager.prototype.STATE.CARRY_GOLD_MOVING]: [Sprites.DirectionSprites("img/units/villager/carry_gold/", 15)],
    [Villager.prototype.STATE.CARRY_STONE_MOVING]: [Sprites.DirectionSprites("img/units/villager/carry_stone/", 15)],

    [Villager.prototype.STATE.FARMER]: [Sprites.DirectionSprites("img/units/villager/farming/", 29)],
    [Villager.prototype.STATE.FARMER_MOVING]: [Sprites.DirectionSprites("img/units/villager/farmer_moving/", 15)],
    [Villager.prototype.STATE.FARMER_DYING]: [Sprites.DirectionSprites("img/units/villager/farmer_dying/", 10)],
    [Villager.prototype.STATE.FARMER_DEAD]: [Sprites.DirectionSprites("img/units/villager/farmer_dead/", 6)],
    [Villager.prototype.STATE.CARRY_FARM_MOVING]: [Sprites.DirectionSprites("img/units/villager/carry_farm/", 15)],

    [Villager.prototype.STATE.HUNTER]: [Sprites.DirectionSprites("img/units/villager/hunter/", 23)],
    [Villager.prototype.STATE.HUNTER_MOVING]: [Sprites.DirectionSprites("img/units/villager/hunter_moving/", 15)],
    [Villager.prototype.STATE.HUNTER_DYING]: [Sprites.DirectionSprites("img/units/villager/hunter_dying/", 10)],
    [Villager.prototype.STATE.HUNTER_DEAD]: [Sprites.DirectionSprites("img/units/villager/hunter_dead/", 6)],

    [Villager.prototype.STATE.BUTCHER]: [Sprites.DirectionSprites("img/units/villager/butcher/", 12)],
    [Villager.prototype.STATE.CARRY_MEAT_MOVING]: [Sprites.DirectionSprites("img/units/villager/carry_meat/", 15)]


}

Villager.prototype.IMAGE_OFFSETS = {
    [Villager.prototype.STATE.IDLE]: [{ x: -5, y: 33 }],
    [Villager.prototype.STATE.MOVING]: [{ x: 2, y: 33 }],
    [Villager.prototype.STATE.ATTACK]: [{ x: 30, y: 46 }],
    [Villager.prototype.STATE.DYING]: [{ x: 27, y: 40 }],
    [Villager.prototype.STATE.DEAD]: [{ x: 28, y: 23 }],

    [Villager.prototype.STATE.BUILDING]: [{ x: 8, y: 31 }],
    [Villager.prototype.STATE.BUILDING_IDLE]: [{ x: -5, y: 32 }],
    [Villager.prototype.STATE.BUILDING_MOVING]: [{ x: 2, y: 33 }],
    [Villager.prototype.STATE.BUILDING_DYING]: [{ x: 43, y: 40 }],
    [Villager.prototype.STATE.BUILDING_DEAD]: [{ x: 43, y: 22 }],

    [Villager.prototype.STATE.FORAGE]: [{ x: 17, y: 39 }],
    [Villager.prototype.STATE.FORAGE_IDLE]: [{ x: 1, y: 31 }],
    [Villager.prototype.STATE.FORAGE_MOVING]: [{ x: 7, y: 33 }],
    [Villager.prototype.STATE.FORAGE_DYING]: [{ x: 34, y: 40 }],
    [Villager.prototype.STATE.FORAGE_DEAD]: [{ x: 41, y: 28 }],

    [Villager.prototype.STATE.LUMBER]: [{ x: 1, y: 46 }],
    [Villager.prototype.STATE.LUMBER_IDLE]: [{ x: 1, y: 32 }],
    [Villager.prototype.STATE.LUMBER_MOVING]: [{ x: 3, y: 33 }],
    [Villager.prototype.STATE.LUMBER_DYING]: [{ x: 34, y: 43 }],
    [Villager.prototype.STATE.LUMBER_DEAD]: [{ x: 34, y: 22 }],

    [Villager.prototype.STATE.CHOP]: [{ x: 17, y: 43 }],
    [Villager.prototype.STATE.CARRY_WOOD_MOVING]: [{ x: 4, y: 32 }],
    [Villager.prototype.STATE.CARRY_WOOD_IDLE]: [{ x: 4, y: 32 }],

    [Villager.prototype.STATE.MINE]: [{ x: 14, y: 45 }],
    [Villager.prototype.STATE.MINE_IDLE]: [{ x: 0, y: 31 }],
    [Villager.prototype.STATE.MINE_MOVING]: [{ x: 6, y: 32 }],
    [Villager.prototype.STATE.MINE_DYING]: [{ x: 38, y: 48 }],
    [Villager.prototype.STATE.MINE_DEAD]: [{ x: 38, y: 25 }],

    [Villager.prototype.STATE.CARRY_GOLD_MOVING]: [{ x: 0, y: 32 }],
    [Villager.prototype.STATE.CARRY_GOLD_IDLE]: [{ x: 0, y: 32 }],

    [Villager.prototype.STATE.CARRY_STONE_MOVING]: [{ x: 0, y: 33 }],
    [Villager.prototype.STATE.CARRY_STONE_IDLE]: [{ x: 0, y: 33 }],

    [Villager.prototype.STATE.FARMER]: [{ x: 12, y: 34 }],
    [Villager.prototype.STATE.FARMER_IDLE]: [{ x: -3, y: 35 }],
    [Villager.prototype.STATE.FARMER_MOVING]: [{ x: 12, y: 37 }],
    [Villager.prototype.STATE.FARMER_DYING]: [{ x: 56, y: 45 }],
    [Villager.prototype.STATE.FARMER_DEAD]: [{ x: 56, y: 32 }],

    [Villager.prototype.STATE.CARRY_FARM_IDLE]: [{ x: 7, y: 35 }],
    [Villager.prototype.STATE.CARRY_FARM_MOVING]: [{ x: 7, y: 35 }],

    [Villager.prototype.STATE.HUNTER]: [{ x: 29, y: 54 }],
    [Villager.prototype.STATE.HUNTER_IDLE]: [{ x: 17, y: 32 }],
    [Villager.prototype.STATE.HUNTER_MOVING]: [{ x: 10, y: 41 }],
    [Villager.prototype.STATE.HUNTER_DYING]: [{ x: 51, y: 51 }],
    [Villager.prototype.STATE.HUNTER_DEAD]: [{ x: 51, y: 26 }],

    [Villager.prototype.STATE.BUTCHER]: [{ x: 11, y: 32 }],
    [Villager.prototype.STATE.CARRY_MEAT_MOVING]: [{ x: -1, y: 34 }],
    [Villager.prototype.STATE.CARRY_MEAT_IDLE]: [{ x: -1, y: 34 }],
};


export { Villager }
