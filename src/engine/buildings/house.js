import { Building } from './building.js';
import { FireSmall, SmokeSmall } from './details.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class House extends Building {
    constructor() {
        super(...arguments);
        this.add(this.fire_small = new FireSmall({ visible: false }));
        this.add(this.smoke_small = new SmokeSmall({ visible: false }));
    }
    setComplete() {
        super.setComplete();

        if (this.level == 0) {
            this.fire_small.position({
                x: 50 - this.getOffset().x,
                y: 30 - this.getOffset().y
            });
            this.fire_small.show();

            this.smoke_small.position({
                x: 51 - this.getOffset().x,
                y: 23 - this.getOffset().y
            });
            this.smoke_small.show();
        }

        this.player.max_population += House.prototype.PEOPLE_PER_HOUSE;
        let that = this;
        this.attributes = {
            get population() {
                return `${that.player.population}/${that.player.max_population}`;
            }
        }
    }
    levelUp() {
        super.levelUp();
        this.fire_small.hide();
        this.smoke_small.hide();
    }
    destroy(engine) {
        super.destroy(engine);
        if (this.isComplete) this.player.max_population -= House.prototype.PEOPLE_PER_HOUSE;
    }
}
House.prototype.NAME = "House";
House.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/house_01_all.png"),
        Sprites.Sprite("img/interface/avatars/house_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/house_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/house_04_greek.png")
    ]
];
House.prototype.MAX_HP = [75];
House.prototype.SUBTILE_WIDTH = 3;
House.prototype.PEOPLE_PER_HOUSE = 4;

House.prototype.FLAME_POSITIONS = [{ x: 48, y: 0 }];

House.prototype.ACTION_KEY = "E";
House.prototype.COST = {
    food: 0, wood: 30, stone: 0, gold: 0
}

House.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/house/01_all.png")],
            [Sprites.Sprite("img/buildings/house/02_greek.png")],
            [Sprites.Sprite("img/buildings/house/03_greek.png")],
            [Sprites.Sprite("img/buildings/house/04_greek.png")]
        ]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/house/construction_01_all/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4),
            Sprites.SpriteSequence("img/buildings/construction_small/", 4)
        ]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [
            [Sprites.Sprite("img/buildings/house/01_all_rubble.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")],
            [Sprites.Sprite("img/buildings/rubble_medium.png")]
        ]
    ]
}

House.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: -2, y: 30 }, { x: 9, y: 35 }, { x: 9, y: 35 }, { x: 9, y: 35 }]
    ],
    [Building.prototype.STATE.DONE]: [
        [{ x: -9, y: 25 }, { x: -13, y: 45 }, { x: -7, y: 43 }, { x: 10, y: 51 }]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [{ x: -21, y: 17 }, { x: 12, y: 25 }, { x: 12, y: 25 }, { x: 12, y: 25 }]
    ]
}


export { House }
