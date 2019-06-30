import { Test, ComplexTest } from './test.js';
import { Map } from '../engine/map.js';
import { RESOURCE_TYPES } from '../utils.js';
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


class TradeTest extends ComplexTest {
    constructor(engine) {
        super(engine)

        this.engine.current_player.resources = {
            wood: 80,
            food: 80,
            stone: 80,
            gold: 80
        };

        this.dock1 = this.building(Dock, 1 + 10, -8 - 8, 0);
        this.ship = this.unit(TradeBoat, 2, -15, 0);
        this.dock2 = this.building(Dock, 10, 10, 1);

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
        this.unit1 = this.unit(SwordsMan, 2, -14, 0);
        this.unit2 = this.unit(Villager, 7, -10, 0);

        this.unit3 = this.unit(SwordsMan, -4, -8, 1);
        this.unit4 = this.unit(Villager, 2, -5, 0);

        this.unit5 = this.unit(ImprovedBowMan, -8, -4, 1);
        this.unit6 = this.unit(Villager, -2, -1, 0);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.unit1, this.unit2);
        this.engine.interactOrder(this.unit3, this.unit4);
        this.engine.interactOrder(this.unit5, this.unit6);
    }
    check() {
        if (this.unit4.destroyed &&
            this.unit6.destroyed &&
            this.unit2.hp == this.unit2.max_hp
        ) this.pass();
    }
}


class AttackTowerUnitTest extends Test {
    constructor(engine) {
        super(engine)
        this.tower = this.building(Tower, 2, -14, 0);
        this.unit = this.unit(Villager, 7, -10, 1);
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
        this.priest = this.unit(Priest, 2, -14, 0);
        this.unit = this.unit(SwordsMan, 7, -10, 1);
        this.towncenter = this.building(TownCenter, 3, -6, 0);
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
        this.priest = this.unit(Priest, 2, -14, 0);
        this.unit = this.unit(SwordsMan, 7, -10, 0);
        this.unit.hp = 1;
   }
    setup() {
        super.setup();
        this.engine.interactOrder(this.priest, this.unit);
    }
    check() {
        if (this.unit.hp == this.unit.max_hp) this.pass();
    }
}


class TransportTest extends ComplexTest {
    constructor(engine) {
        super(engine)
        this.boat = this.unit(TransportBoat, -1, -12, 0);

        this.units = [];
        for (let i = 0; i < 6; ++i) this.units.push(
            this.unit(Villager, -1 - i + 4, -12 - i - 4, 0)
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
        this.towncenter = this.building(TownCenter, 1, -8, 0);
        this.villager = this.unit(Villager, 7, -10, 0);
        this.towncenter.takeHit(550, null, this.engine);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.towncenter);
    }
    check() {
        if (this.towncenter.hp == this.towncenter.max_hp) this.pass();
    }
}


class ConstructionTest extends ComplexTest {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 7, -10, 0);

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
            this.sleep(35),
            function() {
                this.mouseMove(310, 300);
                this.click(310, 300);
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
                this.mouseMove(360, 350);
                this.click(360, 350);
            },
            function() {
                if (!this.viewer.isPlanningConstruction || !this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction must be forbidden at occupied area.");
                }
            },
            this.sleep(70),
            function() {
                this.mouseMove(605, 340);
                this.click(605, 340);
            },
            function() {
                if (!this.viewer.isPlanningConstruction || !this.viewer.constructionIndicator.visible()) {
                    this.fail("Construction must be forbidden at water.");
                }
            },
            function() {
                this.click(310, 300, true);
            },
            this.sleep(35),
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




export {
    TradeTest, AttackUnitUnitTest, AttackTowerUnitTest, ConvertUnitTest,
    HealUnitTest, TransportTest, RepairTest, ConstructionTest
}