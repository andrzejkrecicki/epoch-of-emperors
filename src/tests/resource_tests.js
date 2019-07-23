import { Test } from './test.js';
import { Map } from '../engine/map.js';

import { Villager } from '../engine/units/villager.js';
import { Gazelle } from '../engine/units/gazelle.js';
import { FishingBoat } from '../engine/units/fishing_boat.js';
import { TownCenter } from '../engine/buildings/town_center.js';
import { Dock } from '../engine/buildings/dock.js';
import { Farm } from '../engine/buildings/farm.js';
import { Bush } from '../engine/resources/bush.js';
import { FishBig } from '../engine/resources/fish.js';
import { StoneMine } from '../engine/resources/stone.js';
import { GoldMine } from '../engine/resources/gold.js';
import { LeafTree } from '../engine/trees.js';


class ResourceTest extends Test {
    constructor(engine) {
        super(engine)
        this.states = [];
    }
    pass() {
        for (let i = 0; i < this.DESIRED_STATES.length; ++i) {
            if (this.DESIRED_STATES[i] != this.states[i]) {
                this.fail("Expected states " + this.DESIRED_STATES + " got " + this.states);
                return;
            }
        }
        super.pass();
    }
}


class BushTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.bush = this.entity(Bush, 129, 132);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.bush);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.bush.destroyed &&
            this.engine.current_player.resources.food == 400 + 150 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
BushTest.prototype.DESIRED_STATES = [98, 96, 98, 96];

class TreeTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.tree = this.entity(LeafTree, 129, 132);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.tree);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.tree.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 + 75 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
TreeTest.prototype.DESIRED_STATES = [130, 128, 160, 194, 130, 160, 194, 130];


class GoldTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.gold = this.entity(GoldMine, 129, 132);
        this.gold.attributes.gold = 100;
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.gold);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.gold.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 + 100 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
GoldTest.prototype.MAX_TIME =  20 * 60 * 35;
GoldTest.prototype.DESIRED_STATES = [226, 224, 290, 226, 224, 290];


class StoneTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.stone = this.entity(StoneMine, 129, 132);
        this.stone.attributes.stone = 100;
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.stone);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.stone.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400 + 100
        ) this.pass();
    }
}
StoneTest.prototype.MAX_TIME =  20 * 60 * 35;
StoneTest.prototype.DESIRED_STATES = [258, 256, 322, 258, 256, 322];


class FarmTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.farm = this.building(Farm, 129, 132, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.farm);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.farm.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
FarmTest.prototype.MAX_TIME =  20 * 60 * 35;
FarmTest.prototype.DESIRED_STATES = [354, 352, 386, 354, 352, 386];


class HuntTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.animal = this.unit(Gazelle, 129, 132, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.animal);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.animal.destroyed &&
            this.engine.current_player.resources.food >= 400 + 50 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
// HuntTest.prototype.MAX_TIME =  20 * 60 * 35;
HuntTest.prototype.DESIRED_STATES = [418, 416, 418, 416, 418, 448, 482, 418, 448, 482];


class FisherTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 129, 120, 0);
        this.villager = this.unit(Villager, 135, 118, 0);
        this.fish = this.entity(FishBig, 128, 132);

        this.engine.map.terrain_tiles[this.center.x / 2][this.center.y / 2 + 2] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2 + 1][this.center.y / 2 + 2] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2 + 1][this.center.y / 2 + 3] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2][this.center.y / 2 + 3] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.normalizeNeighbouringTiles();
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.fish);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.fish.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
FisherTest.prototype.DESIRED_STATES = [514, 512, 546, 514, 512, 546];


class FishingTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.dock = this.building(Dock, 139, 112, 0);
        this.ship = this.unit(FishingBoat, 135, 118, 0);
        this.fish = this.entity(FishBig, 128, 132);

        this.engine.map.makeLake(this.center.x / 2, this.center.y / 2, 10);
        this.engine.map.normalizeNeighbouringTiles();
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.ship, this.fish);
    }
    check() {
        if (this.ship.state != this.states[this.states.length - 1]) this.states.push(this.ship.state);
        if (this.fish.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
FishingTest.prototype.MAX_TIME =  20 * 60 * 35;
FishingTest.prototype.DESIRED_STATES = [2, 32, 2, 32];


class NowhereToReturnTest extends ResourceTest {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 135, 118, 0);
        this.tree = this.entity(LeafTree, 131, 131);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.tree);
    }
    check() {
        if (this.villager.state != this.states[this.states.length - 1]) this.states.push(this.villager.state);
        if (this.villager.interaction == null && this.villager.interactionObject == null) this.pass();
    }
}
NowhereToReturnTest.prototype.DESIRED_STATES = [130, 128, 160, 193];


export {
    BushTest,
    TreeTest,
    StoneTest,
    GoldTest,
    FarmTest,
    HuntTest,
    FisherTest,
    FishingTest,
    NowhereToReturnTest,
}