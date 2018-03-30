class Entity extends Graphics.Group {
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
    }
    createSelectionRect(options) {
        this.selectionRect = new Graphics.Rect(Object.assign({}, {
            stroke: 'white',
            strokeWidth: 1,
            visible: false,
        }, options));
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
        this.layer.hitmap.fillStyle = this.hitColor;

        let imageData = this.layer.hitmap.getImageData(
            this.absX() - this.HITMAP[this.state].offset.x,
            this.absY() - this.HITMAP[this.state].offset.y,
            this.HITMAP[this.state].imageData.width,
            this.HITMAP[this.state].imageData.height
        );

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (this.HITMAP[this.state].imageData.data[i + 3] != 0) {
                imageData.data[i] = (this.image.UUID & 0xff0000) >> 16;
                imageData.data[i + 1] = (this.image.UUID & 0x00ff00) >> 8;
                imageData.data[i + 2] = (this.image.UUID & 0x0000ff);
                imageData.data[i + 3] = 255;
            }
        }
        this.layer.hitmap.putImageData(imageData,
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


export { Entity };