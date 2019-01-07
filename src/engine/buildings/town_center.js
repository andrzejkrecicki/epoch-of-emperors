import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class TownCenter extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Villager),
            Technologies.ToolAge,
            Technologies.BronzeAge
        ]; else return null;
    }
    acceptsResource(type) {
        return this.isComplete;
    }
    static isResearched(player) {
        return player.possessions.BronzeAge;
    }
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/town_center_01_all.png"),
        Sprites.Sprite("img/interface/avatars/town_center_02_all.png"),
        Sprites.Sprite("img/interface/avatars/town_center_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/town_center_04_greek.png")
    ]
];
TownCenter.prototype.MAX_HP = 600;
TownCenter.prototype.SUBTILE_WIDTH = 5;

TownCenter.prototype.ACTION_KEY = "N";
TownCenter.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

TownCenter.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/town_center/01_all.png")],
            [Sprites.Sprite("img/buildings/town_center/02_all.png")],
            [Sprites.Sprite("img/buildings/town_center/03_greek.png")],
            [Sprites.Sprite("img/buildings/town_center/04_greek.png")]
        ]
    ]
}

TownCenter.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 3, y: 54 }, { x: 10, y: 61 }, { x: -2, y: 58 }, { x: 11, y: 64 }]
    ]
}

TownCenter.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [TownCenter.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/town_center/01_all.png"),
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/town_center/02_all.png"),
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/town_center/01_all.png"),
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/town_center/01_all.png"),
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
}

export { TownCenter }
