import { Entity } from './entity.js';
import { Sprites } from '../sprites.js';

class FlatDrawable extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.isFlat = true;
        this.age = 0;
        this.imgIdx = 0;
        this.setImage();
    }
    getSprite() {
        return this.IMAGES[this.imgIdx];
    }
    getOffset() {
        return this.IMAGE_OFFSET;
    }
    process(engine) {
        if (++this.age >= this.MAX_AGE) this.destroy(engine);
    }
}
FlatDrawable.prototype.SUBTILE_WIDTH = 0;
FlatDrawable.prototype.MAX_AGE = Infinity;
FlatDrawable.prototype.HAS_HITMASK = false;


class TreeStump extends FlatDrawable {
}
TreeStump.prototype.IMAGES = [Sprites.Sprite('img/trees/stump.png')];
TreeStump.prototype.IMAGE_OFFSET = { x: -11, y: 10 }



class DeadBody extends Entity {
    constructor(subtile_x, subtile_y, position, images, offsets, player) {
        super(subtile_x, subtile_y);
        this.position(position);
        this.isFlat = true;
        this.imgIdx = 0;
        this.images = images;
        this.offsets = offsets;
        this.player = player;
        this.setImage();
        this.age = 0;
        this.max_age = this.images.length * 15 * 35;
    }
    getSprite() {
        return this.images[this.imgIdx];
    }
    getOffset() {
        return this.offsets;
    }
    process(engine) {
        ++this.age;
        if (this.age >= this.max_age) this.destroy(engine);
        else if (this.age % (15 * 35) == 0) {
            this.image.image(Sprites.Colorize(this.images[++this.imgIdx], this.player));
        }
    }
}
DeadBody.prototype.SUBTILE_WIDTH = 0;
DeadBody.prototype.HAS_BITMAP_HITMASK = false;
DeadBody.prototype.HAS_HITMASK = false;
DeadBody.prototype.COLORIZE = true;

class Rubble extends Entity {
    constructor(subtile_x, subtile_y, image, offset) {
        super(subtile_x, subtile_y);
        this.isFlat = true;
        this.image = image;
        this.offset = offset;
        this.setImage();
        this.age = 0;
        this.max_age = 60 * 35;
    }
    getSprite() {
        return this.image;
    }
    getOffset() {
        return this.offset;
    }
    process(engine) {
        ++this.age;
        if (this.age >= this.max_age) {
            if (this.attrs.opacity > 0.04) {
                this.attrs.opacity -= 0.04;
            } else this.destroy(engine);
        }
    }
}
Rubble.prototype.SUBTILE_WIDTH = 0;
Rubble.prototype.HAS_BITMAP_HITMASK = false;
Rubble.prototype.HAS_HITMASK = false;


export { TreeStump, DeadBody, Rubble }
