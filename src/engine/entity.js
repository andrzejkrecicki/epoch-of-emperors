class Entity extends Graphics.Group {
    constructor(subtile_x, subtile_y) {
        super({ x: 0, y: 0 });
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.realPosition = { x: null, y: null };
        this.hp = 0;
        this.max_hp = 0;
        this.selected = false;
        this.attributes = {};
    }
    createSelectionRect(options) {
        this.selectionRect = new Graphics.Rect(Object.assign({}, {
            stroke: 'white',
            strokeWidth: 1,
            opacity: 1,
            alpha: 0,
            visible: false,
            perfectDrawEnabled: false,
            shadowForStrokeEnabled: false,
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


export { Entity };