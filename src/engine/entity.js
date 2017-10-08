class Entity extends Konva.Group {
    constructor(subtile_x, subtile_y) {
        super({ x: 0, y: 0 });
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.hp = 0;
        this.max_hp = 0;
    }
    resetBoundingBox() {
    }
    boundingBox() {
    }
    setImage() {
    }
}


export { Entity };