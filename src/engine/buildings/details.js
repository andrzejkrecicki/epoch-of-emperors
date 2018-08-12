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
        this._frame = this._frame + this.FRAME_DELTA;
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
        this._frame = this._frame + this.FRAME_DELTA;
        this.frame = Math.floor(this._frame) % this.IMAGES[0].length;
        this.image.image(this.IMAGES[this.rotation][this.frame]);
    }
}
SailSmall.prototype.IMAGES = Sprites.DirectionSprites("img/units/sail_small/", 9);
SailSmall.prototype.IMAGE_OFFSETS = { x: 38, y: 48 }
SailSmall.prototype.FRAME_DELTA = .125;


export {
    FireSmall, SmokeSmall, SmallWallFlag, SailSmall
}
