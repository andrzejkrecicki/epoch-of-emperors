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
    getOffset() {
        return this.IMAGE_OFFSETS[this.state & ~2][this.player.civ][this.level];
    }
    getPixelPerfectHitmap() {
        return this.HITMAP[this.state & ~2][this.player.civ][this.level];
    }
    takeHit(value, attacker, engine) {
        super.takeHit(value, attacker, engine);
        if (this.hp < this.MAX_HP / 2) {
            this.state &= ~Wall.prototype.STATE.DONE;
            this.state |= Wall.prototype.STATE.DAMAGED;
            this.flag.hide();
            this.updateImage();
        }
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

Wall.prototype.STATE = { ...Building.prototype.STATE };
Wall.prototype.STATE.DAMAGED = 3;
Wall.prototype.STATE.HORIZONTAL = 4;
Wall.prototype.STATE.VERTICAL = 8;

Wall.prototype.STATE.DONE_H = Wall.prototype.STATE.DONE | Wall.prototype.STATE.HORIZONTAL;
Wall.prototype.STATE.DONE_V = Wall.prototype.STATE.DONE | Wall.prototype.STATE.VERTICAL;

Wall.prototype.STATE.DAMAGED_X = Wall.prototype.STATE.DAMAGED | Wall.prototype.STATE.HORIZONTAL | Wall.prototype.STATE.VERTICAL;
Wall.prototype.STATE.DAMAGED_H = Wall.prototype.STATE.DAMAGED | Wall.prototype.STATE.HORIZONTAL;
Wall.prototype.STATE.DAMAGED_V = Wall.prototype.STATE.DAMAGED | Wall.prototype.STATE.VERTICAL;


Wall.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Wall.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DONE_H]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_h_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DONE_V]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_v_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_v_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_v_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED_X]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_x_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_damaged.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED_H]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_h_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_damaged.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED_V]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_v_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_v_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_v_damaged.png")]
        ]
    ],
    [Wall.prototype.STATE.CONSTRUCTION]: [
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
    [Wall.prototype.STATE.CONSTRUCTION]: [
        [{ x: -6, y: 20 }, { x: -6, y: 20 }, { x: -6, y: 20 }, { x: -6, y: 20 }]
    ],
    [Wall.prototype.STATE.DONE]: [
        [{ x: -8, y: 36 }, { x: -8, y: 36 }, { x: -8, y: 36 }, { x: -8, y: 36 }]
    ],
    [Wall.prototype.STATE.DONE_H]: [
        [{ x: -5, y: 39 }, { x: -5, y: 39 }, { x: -5, y: 39 }, { x: -5, y: 39 }]
    ],
    [Wall.prototype.STATE.DONE_V]: [
        [{ x: -2, y: 37 }, { x: -2, y: 37 }, { x: -2, y: 37 }, { x: -2, y: 37 }]
    ]
}

Wall.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Wall.prototype.STATE.DONE]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][0],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][1],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_x_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][2],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE][0][2]
            )
        ]
    ],
    [Wall.prototype.STATE.DONE_H]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_h_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][0],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_H][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_h_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][1],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_H][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_h_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][2],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_H][0][2]
            )
        ]
    ],
    [Wall.prototype.STATE.DONE_V]: [
        [
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_v_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][0],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_V][0][0]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_v_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][1],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_V][0][1]
            ),
            Graphics.Filters.ComposeHitmask(
                Sprites.Sprite("img/buildings/wall/base_hit_01_all.png"),
                Sprites.Sprite("img/buildings/wall/01_all_v_fine.png"),
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.CONSTRUCTION][0][2],
                Wall.prototype.IMAGE_OFFSETS[Wall.prototype.STATE.DONE_V][0][2]
            )
        ]
    ],
}

export { Wall }
