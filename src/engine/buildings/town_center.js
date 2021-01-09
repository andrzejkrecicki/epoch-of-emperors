import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { Actions } from '../actions.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class TownCenter extends Building {
    constructor(subtile_x, subtile_y, player) {
        super(subtile_x, subtile_y, player);
        this.player.possessions[this.constructor.name] = (this.player.possessions[this.constructor.name] || 0) + 1;
    }
    setComplete() {
        super.setComplete();
        // Town Center possessions is already increased in constructor so we need to
        // fix redundant increase from parent class method
        --this.player.possessions[this.constructor.name];
    }
    destroy(engine) {
        // we need to make sure that incomplete Town Center is taken into account
        // complete Town Center is handled in parent class method
        if (this.player && !this.isComplete) --this.player.possessions[this.constructor.name];
        super.destroy(engine);
    }
    actions() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Villager),
            Technologies.ToolAge,
            Technologies.BronzeAge,
            Technologies.IronAge
        ]; else return null;
    }
    acceptsResource(type) {
        return this.isComplete;
    }
    static isResearched(player) {
        return player.possessions.TownCenter == 0 ||
            (player.possessions.BronzeAge && player.possessions.GovernmentCenter);
    }
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/town_center_01_all.png"),
        Sprites.Sprite("img/interface/avatars/town_center_02_all.png"),
        Sprites.Sprite("img/interface/avatars/town_center_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/town_center_04_greek.png")
    ]
];
TownCenter.prototype.MAX_HP = [600];
TownCenter.prototype.SUBTILE_WIDTH = 5;

TownCenter.prototype.ACTION_KEY = "N";
TownCenter.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

TownCenter.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/town_center/01_all.png")],
            [Sprites.Sprite("img/buildings/town_center/02_all.png")],
            [Sprites.Sprite("img/buildings/town_center/03_greek.png")],
            [Sprites.Sprite("img/buildings/town_center/04_greek.png")]
        ]
    ]
}

TownCenter.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 3, y: 54 }, { x: 10, y: 61 }, { x: -2, y: 58 }, { x: 11, y: 64 }]
    ]
}


export { TownCenter }
