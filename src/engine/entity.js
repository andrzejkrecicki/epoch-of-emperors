import { Sprites } from '../sprites.js';

class Entity extends Graphics.Node {
    constructor(subtile_x, subtile_y) {
        super();
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.realPosition = { x: null, y: null };
        this.hp = null;
        this.max_hp = 0;
        this.ticks_waited = 0;
        this.selected = false;
        this.attributes = {};
        this.actions_changed = false;
        this.interaction = null;
        this.interactionSuccessor = null;
        this.destroyed = false;
        this.isFlat = false;
        this.player = null;
        this.wasConverted = false;
        this.level = 0;

        this.createSelectionRect();
    }
    createSelectionRect() {
        this.selectionRect = new Graphics.SelectionRect(this.SUBTILE_WIDTH);
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
        super.draw();
        if (this.HAS_BITMAP_HITMASK) this.setHitmap();
    }
    setHitmap() {
        let offset = this.getOffset();
        let hitmap = Sprites.Hitmask(this.getSprite());
        hitmap.fillStyle = this.image.hitColor;
        // hitmask bitmaps use source-in as a composite operation
        // therefore fillRect bellow does not overlay whole hitmask
        // but instead repaints only its non-transparent pixels
        hitmap.fillRect(
            0, 0,
            hitmap.canvas.width,
            hitmap.canvas.height
        );

        this.layer.hitmap.drawImage(
            hitmap.canvas,
            this.absX() - offset.x,
            this.absY() - offset.y
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
    setImage() {
        this.image = new Graphics.Image({
            x: -this.getOffset().x,
            y: -this.getOffset().y,
            image: Sprites.Colorize(this.getSprite(), this.COLORIZE && this.player),
            hasHitmap: !this.HAS_BITMAP_HITMASK && this.HAS_HITMASK
        });
        this.add(this.image);
    }
    getAvatar() {
        return this.AVATAR;
    }
    getName() {
        return this.NAME;
    }
    updateImage() {
        this.image.image(Sprites.Colorize(this.getSprite(), this.COLORIZE && this.player));
        this.image.x(-this.getOffset().x);
        this.image.y(-this.getOffset().y);
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
    stop() {}
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.getOffset().x,
            y: this.y() -this.getOffset().y,
            w: this.getSprite().width,
            h: this.getSprite().height
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
    setSelected(value) {
        this.selected = !!value;
        this.selectionRect.setVisible(this.selected);
    }
    destroy(engine) {
        if (this.player) --this.player.possessions[this.constructor.name];
        this.destroyed = true;
        if (this.parent) this.remove();
        engine.destroyEntity(this);
    }
}
Entity.prototype.HAS_BITMAP_HITMASK = true;
Entity.prototype.HAS_HITMASK = true;
Entity.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 0
}
Entity.prototype.COLORIZE = false;

export { Entity }
