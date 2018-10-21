import { Building } from './building.js';
import { Scout } from '../units/scout.js';
import { Cavalry } from '../units/cavalry.js';
import { Chariot } from '../units/chariot.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class Stable extends Building {
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Scout),
            Actions.RecruitUnitFactory(Cavalry),
            Actions.RecruitUnitFactory(Chariot)
        ]; else return null;
    }
    static isResearched(player) {
        return player.possessions.Barracks && player.possessions.ToolAge;
    }
}
Stable.prototype.NAME = "Stable";
Stable.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/stable_02_all.png"),
        Sprites.Sprite("img/interface/avatars/stable_02_all.png"),
        Sprites.Sprite("img/interface/avatars/stable_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/stable_03_greek.png")
    ]
];
Stable.prototype.MAX_HP = 350;
Stable.prototype.SUBTILE_WIDTH = 5;

Stable.prototype.ACTION_KEY = "L";
Stable.prototype.COST = {
    food: 0, wood: 150, stone: 0, gold: 0
}

Stable.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/stable/02_all.png")],
            [Sprites.Sprite("img/buildings/stable/02_all.png")],
            [Sprites.Sprite("img/buildings/stable/03_greek.png")],
            [Sprites.Sprite("img/buildings/stable/03_greek.png")]
        ]
    ]
};

Stable.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 9, y: 55 }, { x: 9, y: 55 }, { x: 7, y: 70 }, { x: 7, y: 70 }]
    ]
}

Stable.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Stable.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/stable/02_all.png"),
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/stable/02_all.png"),
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/stable/03_greek.png"),
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_big.png"),
                Sprites.Sprite("img/buildings/stable/03_greek.png"),
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Stable.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ]
};


export { Stable }
