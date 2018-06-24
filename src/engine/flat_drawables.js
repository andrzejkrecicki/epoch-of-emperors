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


class ExhaustedFarm extends FlatDrawable {
}
ExhaustedFarm.prototype.IMAGES = [Sprites.Sprite('img/buildings/farm/exhausted.png')];
ExhaustedFarm.prototype.IMAGE_OFFSET = { x: 17 - 15, y: 44 - 10 }
ExhaustedFarm.prototype.MAX_AGE = 35 * 45;


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
DeadBody.prototype.HAS_HITMASK = false;
DeadBody.prototype.COLORIZE = true;


export { TreeStump, ExhaustedFarm, DeadBody }
