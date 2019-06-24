import { Sprites } from '../../sprites.js';

class AnimatedDetail extends Graphics.Node {
    constructor() {
        super(...arguments)
        this.frame = 0;
        this._frame = 0;
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y,
            image: this.IMAGES[this.frame]
        });
        this.add(this.image);
    }
    draw() {
        super.draw();
        this._frame += this.FRAME_DELTA;
        this.frame = Math.floor(this._frame) % this.IMAGES.length;
        this.image.image(this.IMAGES[this.frame]);
    }
}
AnimatedDetail.prototype.FRAME_DELTA = .5;

class FireSmall extends AnimatedDetail {}
FireSmall.prototype.IMAGES = Sprites.SpriteSequence("img/buildings/details/fire_small_", 20);
FireSmall.prototype.IMAGE_OFFSETS = { x: 6, y: 26 }


class SmokeSmall extends AnimatedDetail {}
SmokeSmall.prototype.IMAGES = Sprites.SpriteSequence("img/buildings/details/smoke_small_", 17);
SmokeSmall.prototype.IMAGE_OFFSETS = { x: 9, y: 27 }


class Flame extends Graphics.Node {
    constructor(x, y, type, size=0, frame=0) {
        super({ x, y })
        this.size = size;
        this.type = type;
        this.frame = frame;
        this._frame = frame;
        this.image = new Graphics.Image({});
        this.add(this.image);
        this.setSize(this.size);
    }
    sizeUp() {
        this.setSize(this.size + 1);
    }
    sizeDown() {
        this.setSize(this.size - 1);
    }
    setPercentage(value) {
        let size = Math.floor(value * (this.IMAGES.length + 1)) - 1;
        this.setSize(size);
    }
    setSize(size) {
        if (size < 0) {
            this.hide();
            this.size = -1;
        } else {
            this.show();
            this.size = Math.min(size, this.IMAGES.length - 1);
            this.image.x(-this.IMAGE_OFFSETS[this.size][this.type].x);
            this.image.y(-this.IMAGE_OFFSETS[this.size][this.type].y);
            this.image.image(this.IMAGES[this.size][this.type][this.frame]);
        }
    }
    draw() {
        if (!this.attrs.visible) return;
        this.image.draw();
        this._frame += this.FRAME_DELTA;
        this.frame = Math.floor(this._frame) % this.IMAGES[this.size][this.type].length;
        this.image.image(this.IMAGES[this.size][this.type][this.frame]);
    }
}
Flame.prototype.IMAGES = [
    [
        Sprites.SpriteSequence("img/buildings/details/flame_small_a_", 20),
        Sprites.SpriteSequence("img/buildings/details/flame_small_b_", 20)
    ],
    [
        Sprites.SpriteSequence("img/buildings/details/flame_medium_a_", 20),
        Sprites.SpriteSequence("img/buildings/details/flame_medium_b_", 20)
    ],
    [
        Sprites.SpriteSequence("img/buildings/details/flame_large_a_", 20),
        Sprites.SpriteSequence("img/buildings/details/flame_large_b_", 20)
    ]
];
Flame.prototype.IMAGE_OFFSETS = [
    [{ x: 30, y: 27 }, { x: 30, y: 27 }],
    [{ x: 33, y: 41 }, { x: 32, y: 35 }],
    [{ x: 44, y: 87 }, { x: 44, y: 87 }],
    [{ x: 44, y: 82 }, { x: 44, y: 82 }],
];
Flame.prototype.FRAME_DELTA = .75;


class SmallWallFlag extends AnimatedDetail {}
SmallWallFlag.prototype.IMAGES = Sprites.SpriteSequence("img/buildings/details/small_wall_flag_01_", 6);
SmallWallFlag.prototype.IMAGE_OFFSETS = { x: 34, y: 36 }


class SailSmall extends Graphics.Node {
    constructor(pos, rotation) {
        super({ x: pos.x, y: pos.y })
        this.frame = 0;
        this._frame = 0;
        this.rotation = rotation;
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y,
            image: this.IMAGES[this.rotation][this.frame]
        });
        this.add(this.image);
    }
    draw() {
        super.draw();
        this._frame += this.FRAME_DELTA;
        this.frame = Math.floor(this._frame) % this.IMAGES[0].length;
        this.image.image(this.IMAGES[this.rotation][this.frame]);
    }
}
SailSmall.prototype.IMAGES = Sprites.DirectionSprites("img/units/sail_small/", 9);
SailSmall.prototype.IMAGE_OFFSETS = { x: 38, y: 48 }
SailSmall.prototype.FRAME_DELTA = .125;


export {
    FireSmall, SmokeSmall, Flame, SmallWallFlag, SailSmall
}
