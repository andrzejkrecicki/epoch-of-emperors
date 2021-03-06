import { Building } from './building.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Market extends Building {
    actions() {
        if (this.isComplete) return [
            Technologies.Domestication,
            Technologies.Woodworking,
            Technologies.StoneMining,
            Technologies.GoldMining,
            Technologies.Artisanship,
            Technologies.Plow,
            Technologies.Wheel
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.Granary && player.possessions.ToolAge;
    }
}
Market.prototype.NAME = "Market";
Market.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/market_01_all.png"),
        Sprites.Sprite("img/interface/avatars/market_01_all.png"),
        Sprites.Sprite("img/interface/avatars/market_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/market_04_greek.png")
    ]
];
Market.prototype.MAX_HP = [350];
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
            [Sprites.Sprite("img/buildings/market/03_greek.png")],
            [Sprites.Sprite("img/buildings/market/04_greek.png")]
        ]
    ]
};

Market.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: -3, y: 45 }, { x: -3, y: 45 }, { x: 12, y: 55 }, { x: 13, y: 65 }]
    ]
}


export { Market }
