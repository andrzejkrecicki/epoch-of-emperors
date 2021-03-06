import { Building } from './building.js';
import { Priest } from '../units/priest.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Temple extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Priest),
            Technologies.Astrology,
            Technologies.Mysticism,
            Technologies.Polytheism,
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.BronzeAge && player.possessions.Market;
    }
}
Temple.prototype.NAME = "Temple";
Temple.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/temple_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/temple_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/temple_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/temple_04_greek.png")
    ]
];
Temple.prototype.MAX_HP = [350];
Temple.prototype.SUBTILE_WIDTH = 5;

Temple.prototype.ACTION_KEY = "P";
Temple.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

Temple.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/temple/03_greek.png")],
            [Sprites.Sprite("img/buildings/temple/03_greek.png")],
            [Sprites.Sprite("img/buildings/temple/03_greek.png")],
            [Sprites.Sprite("img/buildings/temple/04_greek.png")]
        ]
    ]
};

Temple.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 28, y: 82 }, { x: 28, y: 82 }, { x: 28, y: 82 }, { x: 23, y: 80 }]
    ]
}


export { Temple }
