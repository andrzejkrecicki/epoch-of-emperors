import { Building } from './building.js';
import { FishingBoat } from '../units/fishing_boat.js';
import { TradeBoat } from '../units/trade_boat.js';
import { Actions } from '../actions.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Sprites } from '../../sprites.js';


class Dock extends Building {
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(FishingBoat),
            Actions.RecruitUnitFactory(TradeBoat)
        ]; else return null;
    }
    canConstructOn(terrain_counts) {
        return terrain_counts.get(TERRAIN_TYPES.WATER) > 0 &&
            terrain_counts.get(TERRAIN_TYPES.WATER) < (this.SUBTILE_WIDTH / 2) ** 2;
    }
    acceptsResource(type) {
        return this.isComplete && type == RESOURCE_TYPES.FOOD;
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

Dock.prototype.IMAGES = {
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/dock/01_all.png")],
            [Sprites.Sprite("img/buildings/dock/01_all.png")],
            [Sprites.Sprite("img/buildings/dock/01_all.png")],
            [Sprites.Sprite("img/buildings/dock/01_all.png")]
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
        [{ x: -22, y: 36 }, { x: -22, y: 36 }, { x: -22, y: 36 }, { x: -22, y: 36 }]
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
                Sprites.Sprite("img/buildings/dock/01_all.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/dock/01_all.png"),
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
}


export { Dock }
