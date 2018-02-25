import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Bush } from '../resources/bush.js';
import { Tree } from '../trees.js';
import { make_image, leftpad, RESOURCE_TYPES, RESOURCE_NAME } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

class Villager extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: Villager.prototype.ATTRIBUTES.ATTACK,
            food: 0,
            wood: 0,
            gold: 0,
            stone: 0
        }
        this.carriedResource = RESOURCE_TYPES.NONE;
    }
    preInitInteraction(object) {
        if (object instanceof Building && object.hp < object.MAX_HP) {
            this.state = Villager.prototype.STATE.BUILDING;
        } else if (object instanceof Tree) {
            this.state = Villager.prototype.STATE.LUMBER;
            this.attributes.food = this.attributes.gold = this.attributes.stone = 0;
        } else if (object instanceof Bush) {
            this.state = Villager.prototype.STATE.FORAGE;
            this.attributes.wood = this.attributes.gold = this.attributes.stone = 0;
        }
    }
    initInteraction(engine) {
        if (this.interactionObject.destroyed) this.terminateInteraction();
        else if (!this.hasFullPath) this.setBaseState(this.STATE.IDLE);
        else if (this.interactionObject instanceof Building) {
            // TODO - check if its our or enymy's building
            if (this.carriedResource && this.interactionObject.acceptsResource(this.carriedResource)) {
                let res_name = RESOURCE_NAME[this.carriedResource];
                this.player.resources[res_name] += this.attributes[res_name];
                this.attributes[res_name] = 0;
                this.carriedResource = RESOURCE_TYPES.NONE;

                if (this.prevInteractionObject == null) {
                    this.terminateInteraction();
                    return;
                } else engine.interactOrder(this, this.prevInteractionObject);
                this.prevInteractionObject = null;
            } else if (this.interactionObject.isComplete) {
                // TODO - repair
                this.setBaseState(this.STATE.IDLE);
            } else {
                this.state = this.STATE.BUILDING;
                this.interaction_type = this.INTERACTION_TYPE.BUILDING;
            }
            this.rotateToEntity(this.interactionObject);
        } else if (this.interactionObject instanceof Bush) {
            this.state = this.STATE.FORAGE;
            this.interaction_type = this.INTERACTION_TYPE.FORAGE;
            this.rotateToEntity(this.interactionObject);
        } else if (this.interactionObject instanceof Tree) {
            this.state = this.STATE.LUMBER;
            this.interaction_type = this.INTERACTION_TYPE.LUMBER;
            this.rotateToEntity(this.interactionObject);
        } else {
            super.initInteraction();
        }
    }
    processInteraction(engine) {
        if (this.interaction_type == this.INTERACTION_TYPE.BUILDING) {
            if (this.interactionObject.isComplete || this.interactionObject.destroyed) this.terminateInteraction();
            else if (engine.framesCount % this.BUILD_RATE == 0) this.interactionObject.constructionTick();
        } else if (this.interaction_type == this.INTERACTION_TYPE.FORAGE) {
            if (this.interactionObject.destroyed) this.terminateInteraction() // TODO: find next berry bush
            else if (engine.framesCount % this.FORAGE_RATE == 0) {
                this.attributes.food += this.interactionObject.getFood();
                this.carriedResource = RESOURCE_TYPES.FOOD;
                if (this.attributes.food == this.CAPACITY.FOOD) this.returnResources(engine);
            }
        } else if (this.interaction_type == this.INTERACTION_TYPE.LUMBER) {
            if (this.interactionObject.destroyed) this.terminateInteraction(); // TODO: find next tree
            else {
                if (this.interactionObject.state == Tree.prototype.STATE.ALIVE) {
                    if (engine.framesCount % this.LUMBER_RATE == 0) this.interactionObject.lumberTick();
                } else {
                    this.state = Villager.prototype.STATE.CHOP;
                    this.interaction_type = Villager.prototype.INTERACTION_TYPE.CHOP;
                }
            }
        } else if (this.interaction_type == this.INTERACTION_TYPE.CHOP) {
            if (this.interactionObject.destroyed) this.terminateInteraction(); // TODO: find next tree
            else if (engine.framesCount % this.CHOP_RATE == 0) {
                this.attributes.wood += this.interactionObject.getWood();
                this.carriedResource = RESOURCE_TYPES.WOOD;
                if (this.attributes.wood == this.CAPACITY.WOOD) this.returnResources(engine);
            }
        }

    }
    returnResources(engine) {
        let building = this.player.getNearestBuilding(this, { NAME: "Town Center" });
        this.prevInteractionObject = this.interactionObject;
        engine.interactOrder(this, building);
    }
    stopInteraction() {
        if (this.interaction_type == this.INTERACTION_TYPE.CHOP) {
            if (this.attributes[RESOURCE_NAME[this.carriedResource]] > 0) this.state = this.STATE.CARRY_WOOD;
            else this.state = this.STATE.LUMBER;
        }
    }
    terminateInteraction() {
        if (this.interaction_type == this.INTERACTION_TYPE.NONE) return;
        this.stopInteraction();
        this.setBaseState(this.STATE.IDLE);
        this.INTERACTION_TYPE.NONE;
        this.frame = 0;
        this.interactionObject = null;
        this.prevInteractionObject = null;
    }
}
Villager.prototype.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = "Villager";
Villager.prototype.AVATAR = make_image("img/interface/avatars/villager.png");
Villager.prototype.MAX_HP = 25;
Villager.prototype.SPEED = 1;
Villager.prototype.BUILD_RATE = 3;
Villager.prototype.FORAGE_RATE = 60;
Villager.prototype.LUMBER_RATE = 15;
Villager.prototype.CHOP_RATE = 60;

Villager.prototype.CAPACITY = {
    FOOD: 10,
    WOOD: 10,
    STONE: 10,
    GOLD: 10
}
Villager.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Villager.prototype.ACTIONS = [
    Actions.Build,
    Actions.Repair,
    Actions.Stop
];
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


Villager.prototype.FRAME_RATE = {}
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.BUILDING] = 2;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.FORAGE] = 4;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.LUMBER] = 3;
Villager.prototype.FRAME_RATE[Villager.prototype.STATE.CHOP] = 3;

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


export { Villager }