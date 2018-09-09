import { Building } from './building.js';
import { Unit } from '../units/unit.js';
import { FireSmall } from './details.js';
import { Sprites } from '../../sprites.js';
import { Arrow } from '../projectiles.js';
import * as interactions from '../interactions.js';


class Tower extends Building {
    constructor() {
        super(...arguments);
        this.flames = [];
    }
    setComplete() {
        super.setComplete();
        this.attributes.attack = this.ATTRIBUTES.ATTACK + this.level;
        this.attributes.range = this.ATTRIBUTES.RANGE + this.level;

        if (this.level == 0) {
            for (let pos of this.FLAMES_POSITIONS) {
                let flame = new FireSmall({
                    x: pos.x - this.getOffset().x,
                    y: pos.y - this.getOffset().y
                });
                this.flames.push(flame);
                this.add(flame);
            }
        }
    }
    levelUp() {
        super.levelUp();
        ++this.attributes.attack;
        ++this.attributes.range;
    }
    getProjectileType() {
        return Arrow
    }
    getProjectileOffset() {
        return { x: 15, y: -55 }
    }
    getInteractionType(object) {
        if ((object instanceof Unit || object instanceof Building) && object.player != this.player) {
            return interactions.TowerAttackInteraction;
        }
    }
    getName() {
        return this.NAME[this.level];
    }
}
Tower.prototype.NAME = ["Watch Tower"];
Tower.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/tower_01_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_01_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_01_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_01_all.png")
    ]
];
Tower.prototype.MAX_HP = 100;
Tower.prototype.ATTACK_RATE = 7 * 3;
Tower.prototype.SHOT_DELAY = 27;
Tower.prototype.SUBTILE_WIDTH = 4;

Tower.prototype.ACTION_KEY = "T";
Tower.prototype.COST = {
    food: 0, wood: 0, stone: 150, gold: 0
}

Tower.prototype.ATTRIBUTES = {
    ATTACK: 3,
    RANGE: 5
}


Tower.prototype.FLAMES_POSITIONS = [{ x: 13, y: 10 }, { x: 28, y: 0 }, { x: 37, y: 17 }, { x: 53, y: 11 }]

Tower.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/tower/01_all.png")],
            [Sprites.Sprite("img/buildings/tower/01_all.png")],
            [Sprites.Sprite("img/buildings/tower/01_all.png")],
            [Sprites.Sprite("img/buildings/tower/01_all.png")]
        ]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/construction_small_", 4),
            Sprites.SpriteSequence("img/buildings/construction_small_", 4),
            Sprites.SpriteSequence("img/buildings/construction_small_", 4),
            Sprites.SpriteSequence("img/buildings/construction_small_", 4)
        ]
    ]
};

Tower.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: -27, y: 92 }, { x: -27, y: 92 }, { x: -27, y: 92 }, { x: -27, y: 92 }]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: -6, y: 35 }, { x: -6, y: 35 }, { x: -6, y: 35 }, { x: -6, y: 35 }]
    ]
}

Tower.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Tower.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Sprites.Sprite("img/buildings/tower/01_all.png"),
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Sprites.Sprite("img/buildings/tower/01_all.png"),
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Sprites.Sprite("img/buildings/tower/01_all.png"),
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Sprites.Sprite("img/buildings/tower/01_all.png"),
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][3],
                Tower.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][3]
            )
        ]
    ],
    [Tower.prototype.STATE.CONSTRUCTION]: [
        [
            Graphics.Filters.BasicHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Tower.prototype.IMAGE_OFFSETS[Tower.prototype.STATE.CONSTRUCTION][0][0]
            ),
            Graphics.Filters.BasicHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Tower.prototype.IMAGE_OFFSETS[Tower.prototype.STATE.CONSTRUCTION][0][1]
            ),
            Graphics.Filters.BasicHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Tower.prototype.IMAGE_OFFSETS[Tower.prototype.STATE.CONSTRUCTION][0][2]
            ),
            Graphics.Filters.BasicHitmask(
                Sprites.Sprite("img/buildings/base_hit_small.png"),
                Tower.prototype.IMAGE_OFFSETS[Tower.prototype.STATE.CONSTRUCTION][0][3]
            )
        ]
    ]
};


export { Tower }
