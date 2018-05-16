import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Farm } from '../buildings/farm.js';
import { GoldMine } from '../resources/gold.js';
import { StoneMine } from '../resources/stone.js';
import { Bush } from '../resources/bush.js';
import { Animal } from './animal.js';
import { Tree } from '../trees.js';
import { make_image, leftpad, RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';
import { Spear } from '../projectiles.js';
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
        if (this.state & Unit.prototype.STATE.IDLE) return [
            Actions.Build, Actions.Repair
        ]; else return [
            Actions.Build, Actions.Repair, Actions.Stop
        ];
    }
    getInteractionType(object) {
        // TODO: check if its our farm or emymy's
        if (object instanceof Farm && object.isComplete) return interactions.FarmingInteraction;
        // TODO: check if its our building or emymy's
        else if (object instanceof Building) {
            if (this.carriedResource && object.acceptsResource(this.carriedResource)) return interactions.ReturnResourcesInteraction;
            else if (object.hp < object.MAX_HP) return interactions.BuilderInteraction;
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
}
Villager.prototype.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = "Villager";
Villager.prototype.AVATAR = make_image("img/interface/avatars/villager.png");
Villager.prototype.MAX_HP = 25;
Villager.prototype.SPEED = 1;
Villager.prototype.CREATION_TIME = 20 * 35;

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
Villager.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Villager.prototype.ATTRIBUTES = {
    ATTACK: 3
}
Villager.prototype.STATE = Object.assign({}, Villager.prototype.STATE);
Villager.prototype.STATE.BUILDING = 1 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.BUILDING_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.BUILDING;
Villager.prototype.STATE.BUILDING_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.BUILDING;

Villager.prototype.STATE.FORAGE = 2 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.FORAGE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.FORAGE;
Villager.prototype.STATE.FORAGE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.FORAGE;

Villager.prototype.STATE.LUMBER = 3 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.LUMBER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.LUMBER;
Villager.prototype.STATE.LUMBER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.LUMBER;

Villager.prototype.STATE.CHOP = 4 << Unit.prototype.BASE_STATE_MASK_WIDTH;

Villager.prototype.STATE.CARRY_WOOD = 5 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.CARRY_WOOD_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_WOOD;
Villager.prototype.STATE.CARRY_WOOD_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_WOOD;

Villager.prototype.STATE.MINE = 6 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.MINE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.MINE;
Villager.prototype.STATE.MINE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.MINE;

Villager.prototype.STATE.CARRY_GOLD = 7 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.CARRY_GOLD_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_GOLD;
Villager.prototype.STATE.CARRY_GOLD_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_GOLD;

Villager.prototype.STATE.CARRY_STONE = 8 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.CARRY_STONE_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_STONE;
Villager.prototype.STATE.CARRY_STONE_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_STONE;

Villager.prototype.STATE.FARMER = 9 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.FARMER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.FARMER;
Villager.prototype.STATE.FARMER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.FARMER;

Villager.prototype.STATE.CARRY_FARM = 10 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.CARRY_FARM_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_FARM;
Villager.prototype.STATE.CARRY_FARM_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_FARM;

Villager.prototype.STATE.HUNTER = 11 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.HUNTER_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.HUNTER;
Villager.prototype.STATE.HUNTER_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.HUNTER;

Villager.prototype.STATE.BUTCHER = 12 << Unit.prototype.BASE_STATE_MASK_WIDTH;

Villager.prototype.STATE.CARRY_MEAT = 13 << Unit.prototype.BASE_STATE_MASK_WIDTH;
Villager.prototype.STATE.CARRY_MEAT_IDLE = Villager.prototype.STATE.IDLE | Villager.prototype.STATE.CARRY_MEAT;
Villager.prototype.STATE.CARRY_MEAT_MOVING = Villager.prototype.STATE.MOVING | Villager.prototype.STATE.CARRY_MEAT;


Villager.prototype.FRAME_RATE = Object.assign({}, Unit.prototype.FRAME_RATE);
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.BUILDING] = 2;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.FORAGE] = 4;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.LUMBER] = 3;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.CHOP] = 3;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.MINE] = 3;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.FARMER] = 3;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.HUNTER] = 2;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.BUTCHER] = 4;

Villager.prototype.IMAGES = {};

Villager.prototype.IMAGES[Villager.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/villager/idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING_IDLE][dir].push(
        make_image(`img/units/villager/builder_idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE_IDLE][dir].push(
        make_image(`img/units/villager/forage_idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER_IDLE][dir].push(
        make_image(`img/units/villager/lumber_idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}


Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_WOOD_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_WOOD_IDLE][dir].push(
        make_image(`img/units/villager/carry_wood/${Unit.prototype.DIRECTIONS[dir]}_12.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.MINE_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.MINE_IDLE][dir].push(
        make_image(`img/units/villager/mine_idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_GOLD_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_GOLD_IDLE][dir].push(
        make_image(`img/units/villager/carry_gold/${Unit.prototype.DIRECTIONS[dir]}_12.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_STONE_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_STONE_IDLE][dir].push(
        make_image(`img/units/villager/carry_stone/${Unit.prototype.DIRECTIONS[dir]}_12.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER_IDLE][dir].push(
        make_image(`img/units/villager/farmer_idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_FARM_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_FARM_IDLE][dir].push(
        make_image(`img/units/villager/carry_farm/${Unit.prototype.DIRECTIONS[dir]}_12.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER_IDLE][dir].push(
        make_image(`img/units/villager/hunter_idle/${Unit.prototype.DIRECTIONS[dir]}_00.png`)
    );
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_MEAT_IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_MEAT_IDLE][dir].push(
        make_image(`img/units/villager/carry_meat/${Unit.prototype.DIRECTIONS[dir]}_12.png`)
    );
}





Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/villager/moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 16; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING][dir].push(
            make_image(`img/units/villager/building/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.BUILDING_MOVING][dir].push(
            make_image(`img/units/villager/builder_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 27; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE][dir].push(
            make_image(`img/units/villager/forage/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.FORAGE_MOVING][dir].push(
            make_image(`img/units/villager/forage_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 11; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER][dir].push(
            make_image(`img/units/villager/lumber/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.LUMBER_MOVING][dir].push(
            make_image(`img/units/villager/lumber_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.CHOP] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CHOP][dir].push(
            make_image(`img/units/villager/chop/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_WOOD_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_WOOD_MOVING][dir].push(
            make_image(`img/units/villager/carry_wood/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.MINE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 13; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.MINE][dir].push(
            make_image(`img/units/villager/mine/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.MINE_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.MINE_MOVING][dir].push(
            make_image(`img/units/villager/mine_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_GOLD_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_GOLD_MOVING][dir].push(
            make_image(`img/units/villager/carry_gold/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_STONE_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_STONE_MOVING][dir].push(
            make_image(`img/units/villager/carry_stone/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 29; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER][dir].push(
            make_image(`img/units/villager/farming/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.FARMER_MOVING][dir].push(
            make_image(`img/units/villager/farmer_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_FARM_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_FARM_MOVING][dir].push(
            make_image(`img/units/villager/carry_farm/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 23; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER][dir].push(
            make_image(`img/units/villager/hunter/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.HUNTER_MOVING][dir].push(
            make_image(`img/units/villager/hunter_moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGES[Villager.prototype.STATE.BUTCHER] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 12; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.BUTCHER][dir].push(
            make_image(`img/units/villager/butcher/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_MEAT_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.CARRY_MEAT_MOVING][dir].push(
            make_image(`img/units/villager/carry_meat/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}



Villager.prototype.IMAGE_OFFSETS = {};
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.IDLE] = { x: 0, y: 35 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MOVING] = { x: 6, y: 33 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.BUILDING] = { x: 12, y: 33 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.BUILDING_IDLE] = { x: -1, y: 32 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.BUILDING_MOVING] = { x: 6, y: 33 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FORAGE] = { x: 17, y: 39 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FORAGE_IDLE] = { x: 4, y: 33 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FORAGE_MOVING] = { x: 11, y: 34 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.LUMBER] = { x: 12, y: 47 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.LUMBER_IDLE] = { x: 8, y: 33 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.LUMBER_MOVING] = { x: 8, y: 33 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CHOP] = { x: 17, y: 43 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_WOOD_MOVING] = { x: 8, y: 33 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_WOOD_IDLE] = { x: 8, y: 33 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MINE] = { x: 14, y: 45 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MINE_IDLE] = { x: 0, y: 31 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MINE_MOVING] = { x: 10, y: 32 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_GOLD_MOVING] = { x: 3, y: 34 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_GOLD_IDLE] = { x: 3, y: 34 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_STONE_MOVING] = { x: 3, y: 34 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_STONE_IDLE] = { x: 3, y: 34 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FARMER] = { x: 19, y: 33 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FARMER_IDLE] = { x: -1, y: 34 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.FARMER_MOVING] = { x: 14, y: 35 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_FARM_IDLE] = { x: 11, y: 35 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_FARM_MOVING] = { x: 11, y: 35 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.HUNTER] = { x: 33, y: 54 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.HUNTER_IDLE] = { x: 22, y: 34 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.HUNTER_MOVING] = { x: 15, y: 42 };

Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.BUTCHER] = { x: 11, y: 32 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_MEAT_MOVING] = { x: 3, y: 36 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.CARRY_MEAT_IDLE] = { x: 3, y: 36 };


export { Villager }
