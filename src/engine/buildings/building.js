import { Entity } from '../entity.js';


class Building extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.hp = 1;
        this.max_hp = this.HP;
        this.isComplete = false;
        this.state = this.STATE.CONSTRUCTION;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.tasks = [];
    }
    setImage() {
        this.removeChildren();
        this.image = new Konva.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state],
            width: this.IMAGES[this.state].width,
            height: this.IMAGES[this.state].height
        });
        this.add(this.image);
    }
    createSelectionRect() {
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS[this.state].x),
            y: Math.round(-this.IMAGE_OFFSETS[this.state].y),
            width: this.IMAGES[this.state].width,
            height: this.IMAGES[this.state].height
        })
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS[this.state].x,
            y: this.y() -this.IMAGE_OFFSETS[this.state].y,
            w: this.IMAGES[this.state].width,
            h: this.IMAGES[this.state].height
        }
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    height() {
        return this.image.height();
    }
    width() {
        return this.image.width();
    }
}

Building.prototype.STATE = {
    CONSTRUCTION: 0,
    DONE: 1,
}

export { Building }
