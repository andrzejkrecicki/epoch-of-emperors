import { Building } from './building.js';
import { ClubMan } from '../units/clubman.js';
import { SwordsMan } from '../units/swordsman.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Barracks extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(ClubMan),
            Actions.RecruitUnitFactory(SwordsMan),
            Technologies.BattleAxe,
            Technologies.ShortSword,
            Technologies.BroadSword
        ]; else return null;
    }
}
Barracks.prototype.NAME = "Barracks";
Barracks.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/barracks_01_all.png"),
        Sprites.Sprite("img/interface/avatars/barracks_01_all.png"),
        Sprites.Sprite("img/interface/avatars/barracks_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/barracks_04_greek.png")
    ]
];
Barracks.prototype.MAX_HP = 350;
Barracks.prototype.SUBTILE_WIDTH = 5;

Barracks.prototype.ACTION_KEY = "B";
Barracks.prototype.COST = {
    food: 0, wood: 125, stone: 0, gold: 0
}

Barracks.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/barracks/01_all.png")],
            [Sprites.Sprite("img/buildings/barracks/01_all.png")],
            [Sprites.Sprite("img/buildings/barracks/03_greek.png")],
            [Sprites.Sprite("img/buildings/barracks/04_greek.png")]
        ]
    ]
};

Barracks.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 11, y: 82 }, { x: 11, y: 82 }, { x: 12, y: 72 }, { x: 15, y: 72 }]
    ]
}


export { Barracks }
