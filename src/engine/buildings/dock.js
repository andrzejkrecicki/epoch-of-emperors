import { Building } from './building.js';
import { FishingBoat } from '../units/fishing_boat.js';
import { TradeBoat } from '../units/trade_boat.js';
import { TransportBoat } from '../units/transport_boat.js';
import { ScoutShip } from '../units/scout_ship.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { RESOURCE_TYPES, manhatan_subtile_distance } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Sprites } from '../../sprites.js';


class Dock extends Building {
    constructor() {
        super(...arguments);
        this.attributes.trade_units = Dock.prototype.MAX_TRADE_UNITS;
    }
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(FishingBoat),
            Actions.RecruitUnitFactory(TradeBoat),
            Actions.RecruitUnitFactory(TransportBoat),
            Actions.RecruitUnitFactory(ScoutShip),
            Technologies.FishingShip
        ]; else return null;
    }
    canConstructOn(terrain_counts) {
        return terrain_counts.get(TERRAIN_TYPES.WATER) > 0 &&
            terrain_counts.get(TERRAIN_TYPES.WATER) < (this.SUBTILE_WIDTH / 2) ** 2;
    }
    acceptsResource(type) {
        return this.isComplete && type == RESOURCE_TYPES.FOOD;
    }
    process(engine) {
        if (engine.framesCount % Dock.prototype.TRADE_UNITS_RESTORE_DELAY == 0) {
            this.attributes.trade_units = Math.min(Dock.prototype.MAX_TRADE_UNITS, this.attributes.trade_units + 1);
        }
        super.process();
    }
    getTradeProfit(other) {
        let min_dist = Infinity;
        for (let building of other.buildings) if (building instanceof Dock) {
            let curr_dist = manhatan_subtile_distance(building, this);
            if (min_dist > curr_dist) min_dist = curr_dist;
        }
        let value = Math.round((17 / 112) * min_dist - 19 / 7);
        return Math.max(7, Math.min(75, value))
    }
    setSelected(value, engine) {
        if (engine != null && this.player != engine.current_player) {
            this.attributes.trade_profit = `${this.getTradeProfit(engine.current_player)}/20`;
        } else this.attributes.trade_profit = null;
        super.setSelected(value);
    }
}
Dock.prototype.NAME = "Dock";
Dock.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/dock_01_all.png"),
        Sprites.Sprite("img/interface/avatars/dock_01_all.png"),
        Sprites.Sprite("img/interface/avatars/dock_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/dock_04_greek.png")
    ]
];
Dock.prototype.MAX_HP = 350;
Dock.prototype.SUBTILE_WIDTH = 4;

Dock.prototype.ACTION_KEY = "D";
Dock.prototype.COST = {
    food: 0, wood: 100, stone: 0, gold: 0
}

Dock.prototype.MAX_TRADE_UNITS = 100;
Dock.prototype.TRADE_UNITS_RESTORE_DELAY = 35;

Dock.prototype.IMAGES = {
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/dock/01_all.png")],
            [Sprites.Sprite("img/buildings/dock/01_all.png")],
            [Sprites.Sprite("img/buildings/dock/03_greek.png")],
            [Sprites.Sprite("img/buildings/dock/04_greek.png")]
        ]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/dock/construction_01_all_", 3),
            Sprites.SpriteSequence("img/buildings/dock/construction_01_all_", 3),
            Sprites.SpriteSequence("img/buildings/dock/construction_01_all_", 3),
            Sprites.SpriteSequence("img/buildings/dock/construction_01_all_", 3)
        ]
    ]
}


Dock.prototype.IMAGE_OFFSETS = {
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: -21, y: 36 }, { x: -21, y: 36 }, { x: -21, y: 36 }, { x: -21, y: 36 }]
    ],
    [Building.prototype.STATE.DONE]: [
        [{ x: -22, y: 36 }, { x: -22, y: 36 }, { x: 11, y: 45 }, { x: 3, y: 55 }]
    ]
}

Dock.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Dock.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/dock/01_all.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/dock/01_all.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/dock/03_greek.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/dock/04_greek.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
}


export { Dock }
