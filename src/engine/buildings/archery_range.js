import { Building } from './building.js';
import { BowMan } from '../units/bowman.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class ArcheryRange extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(BowMan)
        ]; else return null;
    }
    static isResearched(player) {
        return entity.player.possessions.Barracks && entity.player.possessions.ToolAge;
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
        [{ x: 86 - 80, y: 60 }, { x: 86 - 80, y: 60 }, { x: 86 - 80, y: 60 }, { x: 88, y: 78 }]
    ]
}

ArcheryRange.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [ArcheryRange.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/archery_range/02_greek.png"),
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/archery_range/02_greek.png"),
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/archery_range/02_greek.png"),
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/archery_range/04_greek.png"),
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                ArcheryRange.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
};


export { ArcheryRange }
