import { Entity } from './entity.js';
import { make_image } from '../utils.js';

class FlatDrawable extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.isFlat = true;
        this.imgIdx = 0;
        this.setImage();
    }
    setImage() {
        this.add(this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            image: this.IMAGES[this.imgIdx]
        }))
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() - this.IMAGE_OFFSET.x,
            y: this.y() - this.IMAGE_OFFSET.y,
            w: this.image.width(),
            h: this.image.height()
        }
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    process() {}
}


class TreeStump extends FlatDrawable {
}
TreeStump.prototype.SUBTILE_WIDTH = 0;
TreeStump.prototype.IMAGES = [make_image('/img/trees/stump.png')];
TreeStump.prototype.IMAGE_OFFSET = { x: -11, y: 10 }


class ExhaustedFarm extends FlatDrawable {
}
ExhaustedFarm.prototype.SUBTILE_WIDTH = 0;
ExhaustedFarm.prototype.IMAGES = [make_image('/img/buildings/farm/exhausted.png')];
ExhaustedFarm.prototype.IMAGE_OFFSET = { x: 17 - 15, y: 44 - 10 }


export { TreeStump, ExhaustedFarm }
