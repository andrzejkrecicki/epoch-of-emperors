import { Building } from './building.js';
import { Sprites } from '../../sprites.js';

class Farm extends Building {
    getResource(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    setComplete() {
        super.setComplete();
        this.attributes.food = 250 + this.player.attributeBonus.farm.food;
    }
    static isResearched(player) {
        return player.possessions.Market && player.possessions.ToolAge;
    }
}
Farm.prototype.NAME = "Farm";
Farm.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/farm.png"),
        Sprites.Sprite("img/interface/avatars/farm.png"),
        Sprites.Sprite("img/interface/avatars/farm.png"),
        Sprites.Sprite("img/interface/avatars/farm.png")
    ]
];
Farm.prototype.MAX_HP = 50;
Farm.prototype.SUBTILE_WIDTH = 5;
Farm.prototype.INTERACT_WHEN_COMPLETE = true;

Farm.prototype.ACTION_KEY = "F";
Farm.prototype.COST = {
    food: 0, wood: 75, stone: 0, gold: 0
}

Farm.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/farm/all.png")],
            [Sprites.Sprite("img/buildings/farm/all.png")],
            [Sprites.Sprite("img/buildings/farm/all.png")],
            [Sprites.Sprite("img/buildings/farm/all.png")]
        ]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [
            [Sprites.Sprite("img/buildings/farm/exhausted.png")],
            [Sprites.Sprite("img/buildings/farm/exhausted.png")],
            [Sprites.Sprite("img/buildings/farm/exhausted.png")],
            [Sprites.Sprite("img/buildings/farm/exhausted.png")]
        ]
    ]
}

Farm.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 17, y: 44 }, { x: 17, y: 44 }, { x: 17, y: 44 }, { x: 17, y: 44 }]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [{ x: -1, y: 33 }, { x: -1, y: 33 }, { x: -1, y: 33 }, { x: -1, y: 33 }]
    ]
}


export { Farm }
