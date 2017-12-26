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
        this.ticks_waited = 0;
    }
    setImage() {
        this.image = new Konva.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state][this.rotation][this.frame],
            width: this.IMAGES[this.state][this.rotation][this.frame].width,
            height: this.IMAGES[this.state][this.rotation][this.frame].height
        });
        this.add(this.image);
    }
    updateSprite() {
        this.frame %= this.IMAGES[this.state][this.rotation].length;
        this.image.image(this.IMAGES[this.state][this.rotation][this.frame]);
        this.image.x(-this.IMAGE_OFFSETS[this.state].x);
        this.image.y(-this.IMAGE_OFFSETS[this.state].y);
        this.image.width(this.IMAGES[this.state][this.rotation][this.frame].width);
        this.image.height(this.IMAGES[this.state][this.rotation][this.frame].height);
    }
    createSelectionRect() {
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS[this.state].x),
            y: Math.round(-this.IMAGE_OFFSETS[this.state].y),
            width: this.IMAGES[this.state][this.rotation][this.frame].width,
            height: this.IMAGES[this.state][this.rotation][this.frame].height
        })
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS[this.state].x,
            y: this.y() -this.IMAGE_OFFSETS[this.state].y,
            w: this.IMAGES[this.state][this.rotation][this.frame].width,
            h: this.IMAGES[this.state][this.rotation][this.frame].height
        }
    }
    rotateToSubtile(subtile) {
        let index = (subtile.y - this.subtile_y + 1) * 3 + (subtile.x - this.subtile_x) + 1
        if (index !== 4) {
            this.rotation = this.DIFF_TO_ROTATION[index];
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

Unit.prototype.DIFF_TO_ROTATION = [6, 7, 0, 5, null, 1, 4, 3, 2];
Unit.prototype.ROTATION = {
    N: 0, NE: 1, E: 2, SE: 3,
    S: 4, SW: 5, W: 6, NW: 7
}
Unit.prototype.DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
Unit.prototype.DIRECTIONS_DELTA = [
    { x: 0, y: -0.5656854249491516 }, { x: .8, y: -.4 }, { x: 1.1313708498983033, y: 0 }, { x: .8, y: .4 },
    { x: 0, y: 0.5656854249491516 }, { x: -.8, y: .4 }, { x: -1.1313708498983033, y: 0 }, { x: -.8, y: -.4 }
];
Unit.prototype.STATE = {
    IDLE: 0,
    MOVING: 1,
    WAITING: 2
}

export { Unit }