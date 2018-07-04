import { Building } from './building.js';
import { ClubMan } from '../units/clubman.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Barracks extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(ClubMan),
            Technologies.BattleAxe
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
            [Sprites.Sprite("img/buildings/barracks/01_all.png")],
            [Sprites.Sprite("img/buildings/barracks/01_all.png")]
        ]
    ]
};

Barracks.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 11, y: 82 }, { x: 11, y: 82 }, { x: 11, y: 82 }, { x: 11, y: 82 }]
    ]
}

Barracks.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Barracks.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/barracks/01_all.png"),
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/barracks/01_all.png"),
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/barracks/01_all.png"),
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/barracks/01_all.png"),
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
};


export { Barracks }
