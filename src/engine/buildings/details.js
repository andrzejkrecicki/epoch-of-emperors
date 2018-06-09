import { Sprites } from '../../sprites.js';

class AnimatedDetail extends Graphics.Node {
    constructor() {
        super(...arguments)
        this.frame = 0;
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y,
            image: this.IMAGES[this.frame]
        });
        this.add(this.image);
    }
    draw() {
        super.draw();
        this.frame = (this.frame + .5) % this.IMAGES.length;
        this.image.image(this.IMAGES[Math.floor(this.frame)]);
    }
}

class FireSmall extends AnimatedDetail {}
FireSmall.prototype.IMAGES = Sprites.SpriteSequence("img/buildings/details/fire_small_", 20);
FireSmall.prototype.IMAGE_OFFSETS = { x: 6, y: 26 }


class SmokeSmall extends AnimatedDetail {}
SmokeSmall.prototype.IMAGES = Sprites.SpriteSequence("img/buildings/details/smoke_small_", 17);
SmokeSmall.prototype.IMAGE_OFFSETS = { x: 9, y: 27 }

export {
    FireSmall, SmokeSmall
}
