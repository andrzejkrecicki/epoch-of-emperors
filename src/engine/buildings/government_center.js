import { Building } from './building.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class GovernmentCenter extends Building {
    actions() {
        if (this.isComplete) return [
            Technologies.Nobility,
            Technologies.Writing,
            Technologies.Architecture
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.BronzeAge && player.possessions.Market;
    }
}
GovernmentCenter.prototype.NAME = "Government Center";
GovernmentCenter.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/government_center_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/government_center_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/government_center_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/government_center_04_greek.png")
    ]
];
GovernmentCenter.prototype.MAX_HP = [350];
GovernmentCenter.prototype.SUBTILE_WIDTH = 5;

GovernmentCenter.prototype.ACTION_KEY = "C";
GovernmentCenter.prototype.COST = {
    food: 0, wood: 175, stone: 0, gold: 0
}

GovernmentCenter.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/government_center/03_greek.png")],
            [Sprites.Sprite("img/buildings/government_center/03_greek.png")],
            [Sprites.Sprite("img/buildings/government_center/03_greek.png")],
            [Sprites.Sprite("img/buildings/government_center/04_greek.png")]
        ]
    ]
};

GovernmentCenter.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 22, y: 93 }, { x: 22, y: 93 }, { x: 22, y: 93 }, { x: 22, y: 95 }]
    ]
}


export { GovernmentCenter }
