import { Sprites } from '../sprites.js';

class Entity extends Graphics.Node {
    constructor(subtile_x, subtile_y) {
        super();
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.realPosition = { x: null, y: null };
        this.hp = 0;
        this.max_hp = 0;
        this.ticks_waited = 0;
        this.selected = false;
        this.attributes = {};
        this.actions_changed = false;
        this.interactionSuccessor = null;
        this.destroyed = false;
        this.isFlat = false;
        this.player = null;
    }
    createSelectionRect(options) {
        this.selectionRect = new Graphics.Rect({
            stroke: 'white',
            strokeWidth: 1,
            visible: false,
            ...options
        });
        this.add(this.selectionRect);
    }
    position(pos) {
        if (pos == null) return super.position();
        let old = {
            x: this.attrs.x,
            y: this.attrs.y
        };
        this.realPosition = pos;
        super.position({
            x: Math.round(this.realPosition.x),
            y: Math.round(this.realPosition.y)
        });
        if (this.parent != null) this.parent.updateBucket(this, old);
    }
    draw() {
        if (!this.attrs.visible) return;
        if (this.COLORIZE) this.image.attrs.image = Sprites.Colorize(this.image.attrs.image, this.player.color);
        super.draw();
        if (this.HAS_BITMAP_HITMASK) this.setHitmap();
    }
    setHitmap() {
        this.HITMAP[this.state].ctx.fillStyle = this.image.hitColor;
        // hitmask bitmaps use source-in as a composite operation
        // therefore fillRect bellow does not overlay whole hitmask
        // but instead repaints only its non-transparent pixels
        this.HITMAP[this.state].ctx.fillRect(
            0, 0,
            this.HITMAP[this.state].width,
            this.HITMAP[this.state].height
        );

        this.layer.hitmap.drawImage(this.HITMAP[this.state].ctx.canvas,
            this.absX() - this.HITMAP[this.state].offset.x,
            this.absY() - this.HITMAP[this.state].offset.y
        );
    }
    getCenterSubtile() {
        return {
            subtile_x: this.subtile_x + this.SUBTILE_WIDTH / 2 - .5,
            subtile_y: this.subtile_y + this.SUBTILE_WIDTH / 2 - .5
        }
    }
    getExactSubtileCenter() {
        return {
            subtile_x: this.subtile_x + this.SUBTILE_WIDTH / 2,
            subtile_y: this.subtile_y + this.SUBTILE_WIDTH / 2
        }
    }
    isAdjecentTo(entity) {
        let center_1 = this.getCenterSubtile();
        let center_2 = entity.getCenterSubtile();
        let dist = (this.SUBTILE_WIDTH + entity.SUBTILE_WIDTH) / 2;
        return (
            Math.abs(center_1.subtile_x - center_2.subtile_x) <= dist &&
            Math.abs(center_1.subtile_y - center_2.subtile_y) <= dist
        );
    }
    destroy(engine) {
        this.destroyed = true;
        this.remove();
        engine.destroyEntity(this);
    }
    resetBoundingBox() {
    }
    boundingBox() {
    }
    setImage() {
    }
    setSelected(value) {
        this.selected = !!value;
        this.selectionRect.setVisible(this.selected);
    }
}
Entity.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 0
}
Entity.prototype.COLORIZE = false;

export { Entity };