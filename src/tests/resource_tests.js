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


class BushTest extends Test {
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
        if (this.bush.destroyed &&
            this.engine.current_player.resources.food == 400 + 150 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}

class TreeTest extends Test {
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
        if (this.tree.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 + 75 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}


class GoldTest extends Test {
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
        if (this.gold.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 + 100 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
GoldTest.prototype.MAX_TIME =  20 * 60 * 35;


class StoneTest extends Test {
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
        if (this.stone.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400 + 100
        ) this.pass();
    }
}
StoneTest.prototype.MAX_TIME =  20 * 60 * 35;


class FarmTest extends Test {
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
        if (this.farm.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
FarmTest.prototype.MAX_TIME =  20 * 60 * 35;


class HuntTest extends Test {
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
        if (this.animal.destroyed &&
            this.engine.current_player.resources.food >= 400 + 50 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
// HuntTest.prototype.MAX_TIME =  20 * 60 * 35;


class FisherTest extends Test {
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
        if (this.fish.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}


class FishingTest extends Test {
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
        if (this.fish.destroyed &&
            this.engine.current_player.resources.food == 400 + 250 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}
FishingTest.prototype.MAX_TIME =  20 * 60 * 35;


class NowhereToReturnTest extends Test {
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
        if (this.villager.interaction == null && this.villager.interactionObject == null) this.pass();
    }
}


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