import { Building } from './building.js';
import { Unit } from '../units/unit.js';
import { FireSmall } from './details.js';
import { Sprites } from '../../sprites.js';
import { Arrow } from '../projectiles.js';
import * as interactions from '../interactions.js';
import { SmallExplosion } from '../explosions.js';


class Tower extends Building {
    constructor() {
        super(...arguments);
        this.torches = [];
    }
    setComplete() {
        super.setComplete();
        this.attributes.attack = this.ATTRIBUTES.ATTACK[0] + this.level;
        this.attributes.range = this.ATTRIBUTES.RANGE[0] + this.level;

        for (let pos of this.TORCH_POSITIONS[this.level]) {
            let torch = new FireSmall();
            this.torches.push(torch);
            this.add(torch);
        }
        this.fixTorches();
    }
    levelUp() {
        super.levelUp();
        this.fixTorches();
        ++this.attributes.attack;
        ++this.attributes.range;
    }
    fixTorches() {
        for (let i = 0; i < this.torches.length; ++i) {
            let pos = this.TORCH_POSITIONS[this.level][i];
            this.torches[i].position({
                x: pos.x - this.getOffset().x,
                y: pos.y - this.getOffset().y
            });
        }
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
    static isResearched(player) {
        return player.possessions.WatchTower;
    }
}
Tower.prototype.NAME = ["Watch Tower", "Sentry Tower"];
Tower.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/tower_01_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_02_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_01_all.png"),
        Sprites.Sprite("img/interface/avatars/tower_01_all.png")
    ]
];
Tower.prototype.MAX_HP = [100, 150];
Tower.prototype.ATTACK_RATE = 7 * 3;
Tower.prototype.SHOT_DELAY = 27;
Tower.prototype.SUBTILE_WIDTH = 4;
Tower.prototype.LEVELS_UP_ON_AGE = false;

Tower.prototype.FLAME_POSITIONS = [{ x: 64, y: 0 }];
Tower.prototype.EXPLOSION = SmallExplosion;

Tower.prototype.ACTION_KEY = "T";
Tower.prototype.COST = {
    food: 0, wood: 0, stone: 150, gold: 0
}

Tower.prototype.ATTRIBUTES = {
    ATTACK: [3],
    RANGE: [5]
}


Tower.prototype.TORCH_POSITIONS = [
    [{ x: 13, y: 10 }, { x: 28, y: 0 }, { x: 37, y: 17 }, { x: 53, y: 11 }],
    [{ x: 24, y: 12 }, { x: 42, y: 1 }, { x: 45, y: 18 }, { x: 66, y: 12 }],
]

Tower.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/tower/01_all.png")],
            [Sprites.Sprite("img/buildings/tower/02_all.png")],
            [Sprites.Sprite("img/buildings/tower/01_all.png")],
            [Sprites.Sprite("img/buildings/tower/01_all.png")]
        ]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/construction_small/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4)
        ]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [
            [Sprites.Sprite("img/buildings/rubble_medium.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")]
        ]
    ]
};

Tower.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: -27, y: 92 }, { x: -17, y: 93 }, { x: -27, y: 92 }, { x: -27, y: 92 }]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: -6, y: 35 }, { x: -6, y: 35 }, { x: -6, y: 35 }, { x: -6, y: 35 }]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [{ x: -3, y: 25 }, { x: -3, y: 25 }, { x: -3, y: 25 }, { x: -3, y: 25 }]
    ]
}


export { Tower }
