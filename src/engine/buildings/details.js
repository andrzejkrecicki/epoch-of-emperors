import { make_image, leftpad } from '../../utils.js';

class AnimatedDetail extends Graphics.Group {
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
FireSmall.prototype.IMAGES = [];
for (let i = 0; i < 20; ++i) FireSmall.prototype.IMAGES.push(
    make_image(`img/buildings/details/fire_small_${leftpad(i, 2, "0")}.png`)
)
FireSmall.prototype.IMAGE_OFFSETS = { x: 6, y: 26 }


class SmokeSmall extends AnimatedDetail {}
SmokeSmall.prototype.IMAGES = [];
for (let i = 0; i < 17; ++i) SmokeSmall.prototype.IMAGES.push(
    make_image(`img/buildings/details/smoke_small_${leftpad(i, 2, "0")}.png`)
)
SmokeSmall.prototype.IMAGE_OFFSETS = { x: 9, y: 27 }

export {
    FireSmall, SmokeSmall
}
