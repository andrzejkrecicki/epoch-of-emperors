import { Entity } from '../entity.js';
import { MapDrawable } from '../../viewer.js';


class Unit extends Entity {
    constructor(subtile_x, subtile_y, player, rotation=null) {
        super(...arguments);
        this.hp = this.MAX_HP;
        this.max_hp = this.MAX_HP;
        this.state = this.STATE.IDLE;
        this.rotation = rotation || Math.floor(Math.random() * 8);
        this.frame = 0;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.path = null;
        this.path_progress = 0;
        this.interaction_type = Unit.prototype.INTERACTION_TYPE.NONE;
        this.interactionObject = null;
        this.prevInteractionObject = null;
        this.hasFullPath = false;
        this.ticks_waited = 0;
        this.player = player;
        this.player.addUnit(this);
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state][this.rotation][this.frame],
            width: this.IMAGES[this.state][this.rotation][this.frame].width,
            height: this.IMAGES[this.state][this.rotation][this.frame].height,
            hasHitmap: true
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
    rotateToEntity(entity) {
        let dx = this.subtile_x - entity.subtile_x, dy = this.subtile_y - entity.subtile_y;

        if (dx + this.SUBTILE_WIDTH - 1 < 0) dx = 1;
        else if (dx - entity.SUBTILE_WIDTH + 1 > 0) dx = -1;
        else dx = 0;

        if (dy + this.SUBTILE_WIDTH - 1 < 0) dy = 1;
        else if (dy - entity.SUBTILE_WIDTH + 1 > 0) dy = -1;
        else dy = 0;

        let index = (dy + 1) * 3 + (dx) + 1
        if (index !== 4) {
            this.rotation = this.DIFF_TO_ROTATION[index];
        }
    }
    swapPath(path) {
        if (this.path == null) {
            // if unit currently has no path, just assign found path;
            this.path = path;
            this.path_progress = 0;
        } else {
            if (path[1].x == this.path[this.path_progress].x && path[1].y == this.path[this.path_progress].y) {
                // use new path if it starts with the subtile which is current target of our step
                this.path = path;
            } else {
                // otherwise go back to subtile which was beggining of our step and continue from there
                this.subtile_x = this.path[this.path_progress].x;
                this.subtile_y = this.path[this.path_progress].y;
                this.path = [this.path[this.path_progress]].concat(path);
            }
            this.path_progress = 1;
        }
    }
    setBaseState(state) {
        this.state &= this.BASE_STATE_MASK;
        this.state |= state;
    }
    preInitInteraction(object) {
        
    }
    initInteraction() {
        if (false) {
            // attack enymy unit
            this.rotateToEntity(this.interactionObject);
        } else {
            this.setBaseState(this.STATE.IDLE);
        }
    }
    processInteraction() {
        
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
    INTERACTION: 0,
    IDLE: 1,
    MOVING: 2
}
Unit.prototype.BASE_STATE_MASK_WIDTH = 10;
Unit.prototype.BASE_STATE_MASK = (
    (~0) >> Unit.prototype.BASE_STATE_MASK_WIDTH
    << Unit.prototype.BASE_STATE_MASK_WIDTH
);

Unit.prototype.INTERACTION_TYPE = {
    NONE: 0,
    BUILDING: 1,
    FORAGE: 2,
    LUMBER: 3,
    CHOP: 4
}

export { Unit }