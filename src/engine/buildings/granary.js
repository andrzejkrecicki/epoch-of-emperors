import { Building } from './building.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Granary extends Building {
    actions() {
        if (this.isComplete) return [
            Technologies.SmallWall,
            Technologies.WatchTower,
            Technologies.MediumWall,
            Technologies.SentryTower
        ]; else return null;
    }
    acceptsResource(type) {
        return this.isComplete && type == RESOURCE_TYPES.FOOD;
    }
}
Granary.prototype.NAME = "Granary";
Granary.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/granary_01_greek.png"),
        Sprites.Sprite("img/interface/avatars/granary_01_greek.png"),
        Sprites.Sprite("img/interface/avatars/granary_01_greek.png"),
        Sprites.Sprite("img/interface/avatars/granary_04_greek.png")
    ]
];
Granary.prototype.MAX_HP = 350;
Granary.prototype.SUBTILE_WIDTH = 5;

Granary.prototype.ACTION_KEY = "G";
Granary.prototype.COST = {
    food: 0, wood: 120, stone: 0, gold: 0
}

Granary.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/granary/01_greek.png")],
            [Sprites.Sprite("img/buildings/granary/01_greek.png")],
            [Sprites.Sprite("img/buildings/granary/01_greek.png")],
            [Sprites.Sprite("img/buildings/granary/04_greek.png")]
        ]
    ]
}

Granary.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: -11, y: 70 }, { x: -11, y: 70 }, { x: -11, y: 70 }, { x: -18, y: 59 }]
    ]
}

Granary.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Granary.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/granary/01_greek.png"),
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/granary/01_greek.png"),
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/granary/01_greek.png"),
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/granary/04_greek.png"),
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
}

export { Granary }
