import { Building } from './building.js';
import { Hoplite } from '../units/hoplite.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Academy extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Hoplite),
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.BronzeAge && player.possessions.Stable;
    }
}
Academy.prototype.NAME = "Academy";
Academy.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/academy_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/academy_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/academy_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/academy_03_greek.png")
    ]
];
Academy.prototype.MAX_HP = [350];
Academy.prototype.SUBTILE_WIDTH = 5;

Academy.prototype.ACTION_KEY = "Y";
Academy.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

Academy.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/academy/03_greek.png")],
            [Sprites.Sprite("img/buildings/academy/03_greek.png")],
            [Sprites.Sprite("img/buildings/academy/03_greek.png")],
            [Sprites.Sprite("img/buildings/academy/03_greek.png")]
        ]
    ]
};

Academy.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 17, y: 65 }, { x: 17, y: 65 }, { x: 17, y: 65 }, { x: 17, y: 65 }]
    ]
}


export { Academy }
