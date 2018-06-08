import { Entity } from '../entity.js';

class Unit extends Entity {
    constructor(subtile_x, subtile_y, player, rotation=null) {
        super(...arguments);
        this.hp = this.MAX_HP;
        this.max_hp = this.MAX_HP;
        this.state = this.STATE.IDLE;
        this.rotation = rotation != null ? rotation : Math.floor(Math.random() * 8);
        this.frame = 0;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.path = null;
        this.path_progress = 0;
        this.interaction = null;
        this.interactionObject = null;
        this.prevInteractionObject = null;
        this.hasFullPath = false;
        this.player = player;
        this.player.addUnit(this);
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state][this.rotation][this.frame],
            hasHitmap: true
        });
        this.add(this.image);
    }
    updateSprite() {
        this.frame %= this.IMAGES[this.state][this.rotation].length;
        this.image.image(this.IMAGES[this.state][this.rotation][this.frame]);
        this.image.x(-this.IMAGE_OFFSETS[this.state].x);
        this.image.y(-this.IMAGE_OFFSETS[this.state].y);
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
    destroy(engine) {
        super.destroy(engine);
        --this.player.population;
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
    getInteractionType(object) {
    }
    getProjectileOffset() {
        return { x: 0, y: 0 }
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
        this.actions_changed = true;
    }
    hit(target, engine) {
        // take into account technological attack bonuses etc
        target.takeHit(this.attributes.attack, this, engine);
    }
    takeHit(value, attacker, engine) {
        // take into account armour etc
        this.hp -= value;
        if (this.hp <= 0) {
            this.hp = 0;
            this.frame = 0;
            this.state = Unit.prototype.STATE.DYING;
        }
    }
    toggleDead(engine) {
        this.setBaseState(Unit.prototype.STATE.DEAD);
        this.destroy(engine);
    }
    afterStep() {
    }
    preInitInteraction() {
        this.interaction && this.interaction.preInit();
    }
    initInteraction() {
        this.ticks_waited = 0;
        this.interaction && this.interaction.init();
    }
    processInteraction() {
        if (this.interaction == null) return;
        this.interaction.process();
        ++this.ticks_waited;
    }
    stopInteraction() {
        this.interaction && this.interaction.stop();
        this.interaction = null;
    }
    terminateInteraction() {
        this.interaction && this.interaction.terminate();
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
Unit.prototype.TOOLTIP = "Click to select this unit.";
Unit.prototype.COLORIZE = true;

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
Unit.prototype.BASE_STATE_MASK_WIDTH = 10;
Unit.prototype.BASE_STATE_MASK = (
    (~0) >> Unit.prototype.BASE_STATE_MASK_WIDTH
    << Unit.prototype.BASE_STATE_MASK_WIDTH
);
Unit.prototype.STATE = {
    INTERACTION: 0,
    IDLE: 1,
    MOVING: 2,
    DYING: 4,
    DEAD: 8,
    ATTACK: 1 << Unit.prototype.BASE_STATE_MASK_WIDTH
}

Unit.prototype.FRAME_RATE = {
    [Unit.prototype.STATE.MOVING]: 2,
    [Unit.prototype.STATE.ATTACK]: 2,
    [Unit.prototype.STATE.DYING]: 3
}

export { Unit }