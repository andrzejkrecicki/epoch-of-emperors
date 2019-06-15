import { Building } from './building.js';
import { BowMan } from '../units/bowman.js';
import { ImprovedBowMan } from '../units/improved_bowman.js';
import { ChariotArcher } from '../units/chariot_archer.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class ArcheryRange extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(BowMan),
            Actions.RecruitUnitFactory(ImprovedBowMan),
            Actions.RecruitUnitFactory(ChariotArcher),
            Technologies.ImprovedBow,
            Technologies.CompositeBow
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.Barracks && player.possessions.ToolAge;
    }
}
ArcheryRange.prototype.NAME = "Archery Range";
ArcheryRange.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/archery_range_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/archery_range_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/archery_range_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/archery_range_04_greek.png")
    ]
];
ArcheryRange.prototype.MAX_HP = 350;
ArcheryRange.prototype.SUBTILE_WIDTH = 5;

ArcheryRange.prototype.ACTION_KEY = "A";
ArcheryRange.prototype.COST = {
    food: 0, wood: 150, stone: 0, gold: 0
}

ArcheryRange.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/archery_range/02_greek.png")],
            [Sprites.Sprite("img/buildings/archery_range/02_greek.png")],
            [Sprites.Sprite("img/buildings/archery_range/02_greek.png")],
            [Sprites.Sprite("img/buildings/archery_range/04_greek.png")]
        ]
    ]
};

ArcheryRange.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 6, y: 60 }, { x: 6, y: 60 }, { x: 6, y: 60 }, { x: 8, y: 78 }]
    ]
}


export { ArcheryRange }
