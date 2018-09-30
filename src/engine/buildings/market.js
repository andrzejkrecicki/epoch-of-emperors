import { Building } from './building.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Market extends Building {
    actions() {
        if (this.isComplete) return [
            Technologies.Domestication,
            Technologies.Woodworking,
            Technologies.StoneMining,
            Technologies.GoldMining
        ]; else return null;
    }
    static isResearched(player) {
        return entity.player.possessions.Granary && entity.player.possessions.ToolAge;
    }
}
Market.prototype.NAME = "Market";
Market.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/market_01_all.png"),
        Sprites.Sprite("img/interface/avatars/market_01_all.png"),
        Sprites.Sprite("img/interface/avatars/market_01_all.png"),
        Sprites.Sprite("img/interface/avatars/market_01_all.png")
    ]
];
Market.prototype.MAX_HP = 350;
Market.prototype.SUBTILE_WIDTH = 5;

Market.prototype.ACTION_KEY = "M";
Market.prototype.COST = {
    food: 0, wood: 150, stone: 0, gold: 0
}

Market.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/market/01_all.png")],
            [Sprites.Sprite("img/buildings/market/01_all.png")],
            [Sprites.Sprite("img/buildings/market/01_all.png")],
            [Sprites.Sprite("img/buildings/market/04_greek.png")]
        ]
    ]
};

Market.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: -3, y: 45 }, { x: -3, y: 45 }, { x: -3, y: 45 }, { x: 13, y: 65 }]
    ]
}

Market.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Market.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/market/01_all.png"),
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/market/01_all.png"),
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/market/01_all.png"),
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/market/04_greek.png"),
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Market.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
};


export { Market }
