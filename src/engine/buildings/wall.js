import { Building } from './building.js';
import { SmallWallFlag } from './details.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class Wall extends Building {
    constructor() {
        super(...arguments);
        this.add(this.flag = new SmallWallFlag({ visible: false }));
    }
    setComplete() {
        super.setComplete();

        if (this.level == 0) {
            this.flag.position({
                x: 51 - this.getOffset().x,
                y: 23 - this.getOffset().y
            });
            this.flag.show();
        }
    }
    levelUp() {
        super.levelUp();
        this.flag.hide();
    }
}
Wall.prototype.NAME = "Small Wall";
Wall.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/wall_01_all.png"),
        Sprites.Sprite("img/interface/avatars/wall_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/wall_03_greek.png")
    ]
];
Wall.prototype.MAX_HP = 200;
Wall.prototype.SUBTILE_WIDTH = 2;

Wall.prototype.ACTION_KEY = "W";
Wall.prototype.COST = {
    food: 0, wood: 0, stone: 5, gold: 0
}

Wall.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")]
        ]
    ],
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/wall/construction_all_all_", 4),
            Sprites.SpriteSequence("img/buildings/wall/construction_all_all_", 4),
            Sprites.SpriteSequence("img/buildings/wall/construction_all_all_", 4),
            Sprites.SpriteSequence("img/buildings/wall/construction_all_all_", 4)
        ]
    ]
}

Wall.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: -6, y: 20 }, { x: -6, y: 20 }, { x: -6, y: 20 }, { x: -6, y: 20 }]
    ],
    [Building.prototype.STATE.DONE]: [
        [{ x: -8, y: 36 }, { x: -8, y: 36 }, { x: -8, y: 36 }, { x: -8, y: 36 }]
    ]
}

Wall.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Wall.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][0],
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][1],
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION][0][2],
                Wall.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE][0][2]
            )
        ]
    ]
}

export { Wall }
