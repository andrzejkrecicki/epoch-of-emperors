import { Building } from './building.js';
import { StoneThrower } from '../units/stone_thrower.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class SiegeWorkshop extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(StoneThrower)
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.BronzeAge && player.possessions.ArcheryRange;
    }
}
SiegeWorkshop.prototype.NAME = "Siege Workshop";
SiegeWorkshop.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/siege_workshop_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/siege_workshop_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/siege_workshop_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/siege_workshop_03_greek.png")
    ]
];
SiegeWorkshop.prototype.MAX_HP = [350];
SiegeWorkshop.prototype.SUBTILE_WIDTH = 5;

SiegeWorkshop.prototype.ACTION_KEY = "K";
SiegeWorkshop.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

SiegeWorkshop.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/siege_workshop/03_greek.png")],
            [Sprites.Sprite("img/buildings/siege_workshop/03_greek.png")],
            [Sprites.Sprite("img/buildings/siege_workshop/03_greek.png")],
            [Sprites.Sprite("img/buildings/siege_workshop/03_greek.png")]
        ]
    ]
};

SiegeWorkshop.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 13, y: 82 }, { x: 13, y: 82 }, { x: 13, y: 82 }, { x: 23, y: 80 }]
    ]
}


export { SiegeWorkshop }
