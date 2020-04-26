import { Test, ComplexTest } from './test.js';
import { Map } from '../engine/map.js';
import { RESOURCE_TYPES, FPS } from '../utils.js';
import { Actions } from '../engine/actions.js';

import { Villager } from '../engine/units/villager.js';
import { SwordsMan } from '../engine/units/swordsman.js';
import { ImprovedBowMan } from '../engine/units/improved_bowman.js';
import { TransportBoat } from '../engine/units/transport_boat.js';
import { Priest } from '../engine/units/priest.js';
import { TradeBoat } from '../engine/units/trade_boat.js';
import { TownCenter } from '../engine/buildings/town_center.js';
import { Barracks } from '../engine/buildings/barracks.js';
import { Tower } from '../engine/buildings/tower.js';
import { Dock } from '../engine/buildings/dock.js';

import { LeafTree } from '../engine/trees.js';



class TradeTest extends ComplexTest {
    constructor(engine) {
        super(engine)

        this.engine.current_player.resources = {
            wood: 80,
            food: 80,
            stone: 80,
            gold: 80
        };

        this.dock1 = this.building(Dock, 139, 112, 0);
        this.ship = this.unit(TradeBoat, 130, 113, 0);
        this.dock2 = this.building(Dock, 138, 138, 1);

        this.engine.map.makeLake(this.center.x / 2, this.center.y / 2, 8);
        this.engine.map.normalizeNeighbouringTiles();

        this.profit = this.dock2.getTradeProfit(this.engine.current_player);
        this.desired_gold = 80 + ((80 * 3) / 20) * this.profit;

        this.selectEntity(this.ship);
    }
    setup() {
        super.setup();

        this.steps = ([
            function() {
                this.engine.interactOrder(this.ship, this.dock2);
            },
            function() {
                if (this.ship.attributes.gold == null) return false;
                if (this.ship.attributes.gold != this.profit) this.fail("Incorrect amount of returned gold.");
            },
            function() {
                if (this.engine.current_player.resources.wood == 0 &&
                    this.ship.tradedResource == RESOURCE_TYPES.WOOD &&
                    this.ship.attributes.gold == null
                ) {
                    let action = (new Actions.TradeFood(this.viewer));
                    action.execute();
                } else return false;
            },
            function() {
                if (this.engine.current_player.resources.food == 0 &&
                    this.ship.tradedResource == RESOURCE_TYPES.FOOD &&
                    this.ship.attributes.gold == null
                ) {
                    let action = (new Actions.TradeStone(this.viewer));
                    action.execute();
                } else return false;
            },
            function() {
                if (this.dock2.attributes.trade_units >= 20) return false;
            },
            function() {
                if (!this.ship.isAdjecentTo(this.dock2)) return false;
            },
            function() {
                if (this.dock2.attributes.trade_units < 20) return false;
                if (this.ship.ticks_waited <= 1) this.fail("Ship must wait if dock has too little trade units.");
            },
            function() {
                if (this.engine.current_player.resources.food == 0 &&
                    this.engine.current_player.resources.wood == 0 &&
                    this.engine.current_player.resources.gold == this.desired_gold &&
                    this.engine.current_player.resources.stone == 0
                ) this.pass();
                else return false;
            },
        ]).values();
    }
}


class AttackUnitUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.unit1 = this.unit(SwordsMan, 130, 114, 0);
        this.unit2 = this.unit(Villager, 135, 118, 0);

        this.unit3 = this.unit(SwordsMan, 124, 120, 1);
        this.unit4 = this.unit(Villager, 130, 123, 0);

        this.unit5 = this.unit(Villager, 132, 125, 0);
        this.unit6 = this.unit(Villager, 134, 127, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.unit1, this.unit2);
        this.engine.interactOrder(this.unit3, this.unit4);
    }
    check() {
        if (this.unit4.destroyed && this.unit5.destroyed &&
            this.unit6.destroyed && this.unit2.hp == this.unit2.max_hp
        ) this.pass();
    }
}


class DistantAttackUnitUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.unit1 = this.unit(ImprovedBowMan, 120, 124, 1);
        this.unit2 = this.unit(Villager, 130, 131, 0);
        this.unit3 = this.unit(Villager, 132, 133, 0);
        this.unit4 = this.unit(Villager, 134, 135, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.unit1, this.unit2);
    }
    check() {
        if (this.unit2.destroyed && this.unit3.destroyed &&
            this.unit4.destroyed && this.unit1.hp == this.unit1.max_hp
        ) this.pass();
    }
}


class AttackTowerUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.tower = this.building(Tower, 130, 114, 0);
        this.unit = this.unit(Villager, 135, 118, 1);
    }
    setup() {
        super.setup();
        this.engine.interactImmediately(this.tower, this.unit);
    }
    check() {
        if (this.unit.destroyed) this.pass();
    }
}


class ConvertUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.priest = this.unit(Priest, 130, 114, 0);
        this.unit = this.unit(SwordsMan, 135, 118, 1);
        this.towncenter = this.building(TownCenter, 131, 122, 0);
   }
    setup() {
        super.setup();
        this.engine.interactOrder(this.unit, this.towncenter);
        this.engine.interactOrder(this.priest, this.unit);
    }
    check() {
        if (this.unit.player == this.priest.player &&
            this.unit.interaction == null &&
            this.unit.interactionObject == null
        ) this.pass();
    }
}


class HealUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.priest = this.unit(Priest, 130, 114, 0);

        this.unit1 = this.unit(SwordsMan, 135, 118, 0);
        this.unit2 = this.unit(SwordsMan, 137, 120, 1);
        this.unit3 = this.unit(SwordsMan, 139, 122, 0);

        this.unit1.hp = 1;
        this.unit2.hp = 1;
        this.unit3.hp = 1;
   }
    setup() {
        super.setup();
        this.engine.interactOrder(this.priest, this.unit1);
    }
    check() {
        if (this.unit1.hp == this.unit1.max_hp &&
            this.unit2.hp == 1 &&
            this.unit3.hp == this.unit3.max_hp) this.pass();
    }
}


class TransportTest extends ComplexTest {
    constructor(engine) {
        super(engine)
        this.boat = this.unit(TransportBoat, 127, 116, 0);

        this.units = [];
        for (let i = 0; i < 6; ++i) this.units.push(
            this.unit(Villager, 131 - i, 112 - i, 0)
        );

        this.engine.map.makeLake(this.center.x / 2 - 4, this.center.y / 2 + 4, 10);
        this.engine.map.normalizeNeighbouringTiles();

    }
    setup() {
        super.setup();

        this.steps = ([
            function() {
                if (this.boat.attributes.load != "0/5" || this.boat.carriedUnits.length != 0) this.fail();
            },
            function() {
                for (let unit of this.units) this.engine.interactOrder(unit, this.boat);
            },
            this.sleep(350),
            function() {
                if (this.boat.carriedUnits.length > 5) this.fail();
            },
            function() {
                this.selectEntity(this.boat);
                let action = new Actions.Unload(this.viewer);
                action.execute();
                this.engine.moveOrder(this.boat, { x: 120, y: 134 });
            },
            this.sleep(350),
            function() {
                if (this.boat.carriedUnits.length < 5) this.fail();
                else {
                    let action = new Actions.Unload(this.viewer);
                    action.execute();
                    this.engine.moveOrder(this.boat, { x: 146, y: 125 });
                }
            },
            this.sleep(350),
            function() {
                if (this.boat.carriedUnits.length == 0) this.pass();
            }
        ]).values();
    }
}


class RepairTest extends Test {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 135, 118, 0);
        this.towncenter1 = this.building(TownCenter, 129, 120, 0);
        this.towncenter1.takeHit(550, null, this.engine);
        this.towncenter2 = this.building(TownCenter, 136, 113, 0);
        this.towncenter2.takeHit(50, null, this.engine);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.towncenter1);
    }
    check() {
        if (this.towncenter1.hp == this.towncenter1.max_hp && this.towncenter2.hp == this.towncenter2.max_hp) this.pass();
    }
}


class ConstructionTest extends ComplexTest {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 135, 118, 0);

        this.engine.map.terrain_tiles[this.center.x / 2][this.center.y / 2 + 2] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2 + 1][this.center.y / 2 + 2] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2 + 1][this.center.y / 2 + 3] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.terrain_tiles[this.center.x / 2][this.center.y / 2 + 3] = Map.TERRAIN_TYPES.WATER;
        this.engine.map.normalizeNeighbouringTiles();
    }
    setup() {
        super.setup();

        this.steps = ([
            function() {
                this.selectEntity(this.villager);
            },
            function() {
                if (this.villager.ACTIONS.length != 3) this.fail("Wrong initial number of villager actions.");

                let action = new this.villager.ACTIONS[0](this.viewer);
                action.execute();

                let building = new action.ACTIONS[1](this.viewer);
                if (building.BUILDING != Barracks) this.fail("Building at index 1 expected to be Barracks");
                building.execute();
            },
            this.sleep(FPS),
            function() {
                this.mockMouseMove(310, 300);
                this.mockClick(this.viewer.constructionIndicator);
            },
            function() {
                if (this.viewer.isPlanningConstruction || this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction indicator did not disappear.");
                }
            },
            function() {
                if (!this.engine.buildings[0].isComplete) return false;
            },
            function() {
                let action = new this.villager.ACTIONS[0](this.viewer);
                action.execute();

                (new action.ACTIONS[3](this.viewer)).execute();
            },
            function() {
                this.mockMouseMove(360, 350);
                this.mockClick(this.viewer.constructionIndicator);
            },
            function() {
                if (!this.viewer.isPlanningConstruction || !this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction must be forbidden at occupied area.");
                }
            },
            this.sleep(70),
            function() {
                this.mockMouseMove(605, 340);
                this.mockClick(this.viewer.constructionIndicator);
            },
            function() {
                if (!this.viewer.isPlanningConstruction || !this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction must be forbidden at water.");
                }
            },
            function() {
                this.mockClick(this.viewer.constructionIndicator, true);
            },
            this.sleep(FPS),
            function() {
                if (this.viewer.isPlanningConstruction || this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction indicator did not disappear on right click.");
                }
            },
            function() {
                this.pass();
            },
        ]).values();
    }
}


class MultipleConstructionsTest extends Test {
    constructor(engine) {
        super(engine)
        this.building1 = this.building(TownCenter, 129, 120, 0, false);
        this.building2 = this.building(TownCenter, 136, 113, 0, false);
        this.villager = this.unit(Villager, 135, 118, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.building1);
    }
    check() {
        if (this.building1.isComplete && this.building2.isComplete) this.pass();
    }
}


class ImpossibleToReachInteractionTest extends Test {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 135, 118, 0);
        this.tree = this.entity(LeafTree, 131, 131);

        let cx = this.center.x / 2;
        let cy = this.center.y / 2;

        for (let dy = 0; dy < 4; ++dy) {
            for (let dx = 0; dx < 4; ++dx) {
                this.engine.map.terrain_tiles[cx + dx][cy + dy] = Map.TERRAIN_TYPES.WATER;

            }
        }
        this.engine.map.normalizeNeighbouringTiles();
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.tree);
    }
    check() {
        if (this.villager.attempts_count == 5 &&
            this.villager.interaction == null &&
            this.villager.interactionObject == null) this.pass();
    }
}


class UnitsBuildingsCleanUpTest extends Test {
    constructor(engine) {
        super(engine)
        this.unit1 = this.unit(ImprovedBowMan, 130, 114, 1);
        this.unit2 = this.unit(Villager, 135, 118, 0);

        this.unit3 = this.unit(SwordsMan, 124, 120, 1);
        this.towncenter = this.building(TownCenter, 131, 122, 0);

        this.villager = this.unit(Villager, 120, 130, 1);
        this.tree = this.entity(LeafTree, 125, 135);
        this.tree.hp = 1;
        this.tree.lumberTick();
        this.tree.attributes.wood = 10;
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.unit1, this.unit2);
        this.engine.interactOrder(this.unit3, this.towncenter);
        this.engine.interactOrder(this.villager, this.tree);

        if (!(
            this.engine.players[0].units.length == 1 &&
            this.engine.players[0].buildings.length == 1 &&
            this.engine.players[1].units.length == 3 &&
            this.engine.players[1].buildings.length == 0 &&
            this.engine.drawables.length == 0 &&
            this.engine.projectiles.length == 0 &&
            this.engine.units.length == 4 &&
            this.engine.buildings.length == 1
        )) this.fail("Failed to initialize Engine's object lists");

        if (this.nonNullSubtilesCount() != 30) this.fail("Failed to fill subtiles with entities");
    }
    nonNullSubtilesCount() {
        let count = 0;
        for (let x = 100; x < 160; ++x) {
            for (let y = 85; y < 145; ++y) {
                if (this.engine.map.subtiles[x][y] != null) ++count;
            }
        }
        return count;
    }
    check() {
        if (this.unit2.destroyed && this.towncenter.destroyed &&
            this.unit1.hp == this.unit1.max_hp &&
            this.unit3.hp == this.unit3.max_hp &&
            this.engine.players[0].units.length == 0 &&
            this.engine.players[1].units.length == 3 &&
            this.engine.players[0].buildings.length == 0 &&
            this.engine.drawables.length == 0 &&
            this.engine.projectiles.length == 0 &&
            this.engine.units.length == 3 &&
            this.engine.buildings.length == 0 &&
            this.nonNullSubtilesCount() == 3
        ) this.pass();
    }
}


export {
    TradeTest, AttackUnitUnitTest, DistantAttackUnitUnitTest, AttackTowerUnitTest,
    ConvertUnitTest, HealUnitTest, TransportTest, RepairTest, ConstructionTest,
    MultipleConstructionsTest, ImpossibleToReachInteractionTest,
    UnitsBuildingsCleanUpTest
}