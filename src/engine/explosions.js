import { Sprites } from '../sprites.js';

class SmallExplosion extends Graphics.Node {
    constructor(position, subtile_x, subtile_y) {
        super({ x: position.x, y: position.y });
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.age = 0;
        this.imgIdx = 0;
        this.setImage();
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.getOffset().x,
            y: -this.getOffset().y,
            image: this.getSprite(),
        });
        this.add(this.image);
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS.x,
            y: this.y() -this.IMAGE_OFFSETS.y,
            w: this.IMAGES[0].width,
            h: this.IMAGES[0].height
        }
    }
    getSprite() {
        return this.IMAGES[this.imgIdx];
    }
    getOffset() {
        return this.IMAGE_OFFSETS;
    }
    process(engine) {
        if (++this.age % 3 == 0) {
            if (++this.imgIdx >= this.IMAGES.length) this.destroy(engine);
            else this.image.image(this.IMAGES[this.imgIdx]);
        }
    }
    destroy() {
        this.destroyed = true;
        this.remove();
    }
}
SmallExplosion.prototype.SUBTILE_WIDTH = 0;
SmallExplosion.prototype.IMAGES = Sprites.SpriteSequence("img/explosions/small/", 10);
SmallExplosion.prototype.IMAGE_OFFSETS = { x: 97, y: 59 }


export { SmallExplosion }