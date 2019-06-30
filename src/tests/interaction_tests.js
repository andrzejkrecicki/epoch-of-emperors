import { Test } from './test.js';
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
import { Tower } from '../engine/buildings/tower.js';
import { Dock } from '../engine/buildings/dock.js';



class TradeTest extends Test {
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

        let profit = this.dock2.getTradeProfit(this.engine.current_player);
        this.desired_gold = 80 + ((80 * 3) / 20) * profit;

        this.selectEntity(this.ship);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.ship, this.dock2);
    }
    check() {

        if (this.engine.current_player.resources.food == 0 &&
            this.engine.current_player.resources.wood == 0 &&
            this.engine.current_player.resources.gold == this.desired_gold &&
            this.engine.current_player.resources.stone == 0
        ) this.pass();
        else if (this.engine.current_player.resources.wood == 0 &&
            this.ship.tradedResource == RESOURCE_TYPES.WOOD &&
            this.ship.attributes.gold == null
        ) {
            let action = (new Actions.TradeFood(this.viewer));
            action.execute();
        } else if (this.engine.current_player.resources.food == 0 &&
            this.ship.tradedResource == RESOURCE_TYPES.FOOD &&
            this.ship.attributes.gold == null
        ) {
            let action = (new Actions.TradeStone(this.viewer));
            action.execute();
        }
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



export {
    TradeTest, AttackUnitUnitTest, AttackTowerUnitTest, ConvertUnitTest,
    HealUnitTest
}