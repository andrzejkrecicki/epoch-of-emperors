class Entity extends Konva.Group {
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
        this.selectionRect = new Konva.Rect(Object.assign({}, {
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
        this.realPosition = pos;
        super.position({
            x: Math.round(this.realPosition.x),
            y: Math.round(this.realPosition.y)
        });
    }
    getCenterSubtile() {
        return {
            subtile_x: this.subtile_x + this.constructor.SUBTILE_WIDTH / 2 - .5,
            subtile_y: this.subtile_y + this.constructor.SUBTILE_WIDTH / 2 - .5
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