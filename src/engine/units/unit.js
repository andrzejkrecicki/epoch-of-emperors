import { Entity } from '../entity.js';
import { MapDrawable } from '../../viewer.js';

class Unit extends Entity {
    constructor(subtile_x, subtile_y, rotation=null) {
        super(...arguments);
        this.hp = this.HP;
        this.max_hp = this.HP;
        this.state = this.STATE.IDLE;
        this.rotation = rotation || Math.floor(Math.random() * 8);
        this.frame = 0;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.path = null;
        this.path_progress = 0;
    }
    setImage() {
        this.image = new Konva.Image({
            x: -this.IMAGE_OFFSETS[this.state].x + MapDrawable.TILE_SIZE.width / 4,
            y: -this.IMAGE_OFFSETS[this.state].y + MapDrawable.TILE_SIZE.height / 4,
            image: this.IMAGES[this.state][this.rotation][this.frame],
            width: this.IMAGES[this.state][this.rotation][this.frame].width,
            height: this.IMAGES[this.state][this.rotation][this.frame].height
        });
        this.add(this.image);
    }
    createSelectionRect() {
        let referenceSprite = this.IMAGES[this.STATE.IDLE][this.ROTATION.N][0];
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS[this.STATE.IDLE].x + MapDrawable.TILE_SIZE.width / 4),
            y: Math.round(-this.IMAGE_OFFSETS[this.STATE.IDLE].y + MapDrawable.TILE_SIZE.height / 4),
            width: referenceSprite.width,
            height: referenceSprite.height
        })
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS[0/*this.state*/].x + MapDrawable.TILE_SIZE.width / 4,
            y: this.y() -this.IMAGE_OFFSETS[0/*this.state*/].y + MapDrawable.TILE_SIZE.height / 4,
            w: this.IMAGES[0/*this.state*/][this.rotation][this.frame].width,
            h: this.IMAGES[0/*this.state*/][this.rotation][this.frame].height
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
Unit.prototype.ROTATION = {
    N: 0, NE: 1, E: 2, SE: 3,
    S: 4, SW: 5, W: 6, NW: 7
}
Unit.prototype.STATE = {
    IDLE: 0,
    MOVING: 1
}

export { Unit }