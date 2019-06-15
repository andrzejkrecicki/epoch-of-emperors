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
        this.normalized = false;
    }
    levelUp() {
        super.levelUp();
        this.flag.hide();
    }
    getOffset() {
        return this.IMAGE_OFFSETS[this.state & ~2][this.player.civ][this.level];
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
    normalize(map, depth=1) {
        let v = 0;
        let h = 0;
        for (let vec of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
            let x = this.subtile_x + vec.x * this.SUBTILE_WIDTH;
            let y = this.subtile_y + vec.y * this.SUBTILE_WIDTH;
            if (map.subtiles[x][y] instanceof Wall && map.subtiles[x][y].player == this.player) {
                h += Math.abs(vec.x);
                v += Math.abs(vec.y);
                if (depth && map.subtiles[x][y].state != Wall.prototype.STATE.CONSTRUCTION) map.subtiles[x][y].normalize(map, 0);
            }
        }
        if (v == 2 && h == 0) this.state |= Wall.prototype.STATE.VERTICAL;
        else if (h == 2 && v == 0) this.state |= Wall.prototype.STATE.HORIZONTAL;
        else this.state &= 3;

        if ((this.state | 3) == 3 && this.level == 0) this.flag.show();
        else this.flag.hide();

        this.updateImage();
        this.normalized = true;
    }
    getName() {
        return this.NAME[this.level];
    }
    static isResearched(player) {
        return player.possessions.SmallWall;
    }
}
Wall.prototype.NAME = ["Small Wall", "Medium Wall"];
Wall.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/wall_01_all.png"),
        Sprites.Sprite("img/interface/avatars/wall_02_greek.png"),
        Sprites.Sprite("img/interface/avatars/wall_03_greek.png")
    ]
];
Wall.prototype.MAX_HP = 200;
Wall.prototype.SUBTILE_WIDTH = 2;
Wall.prototype.CONTINUOUS_PREVIEW = true;
Wall.prototype.LEVELS_UP_ON_AGE = false;

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

Wall.prototype.STATE.DAMAGED_H = Wall.prototype.STATE.DAMAGED | Wall.prototype.STATE.HORIZONTAL;
Wall.prototype.STATE.DAMAGED_V = Wall.prototype.STATE.DAMAGED | Wall.prototype.STATE.VERTICAL;


Wall.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Wall.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_x_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DONE_H]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_h_fine.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_h_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DONE_V]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_v_fine.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_v_fine.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_v_fine.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_x_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_x_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_x_damaged.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED_H]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_h_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_h_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/01_all_h_damaged.png")]
        ]
    ],
    [Wall.prototype.STATE.DAMAGED_V]: [
        [
            [Sprites.Sprite("img/buildings/wall/01_all_v_damaged.png")],
            [Sprites.Sprite("img/buildings/wall/02_greek_v_damaged.png")],
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
        [{ x: -8, y: 36 }, { x: -4, y: 43 }, { x: -8, y: 36 }, { x: -8, y: 36 }]
    ],
    [Wall.prototype.STATE.DONE_H]: [
        [{ x: -5, y: 39 }, { x: -16, y: 34 }, { x: -5, y: 39 }, { x: -5, y: 39 }]
    ],
    [Wall.prototype.STATE.DONE_V]: [
        [{ x: -2, y: 37 }, { x: -15, y: 33 }, { x: -2, y: 37 }, { x: -2, y: 37 }]
    ]
}

export { Wall }
