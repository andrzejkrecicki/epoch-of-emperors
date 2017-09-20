class Entity extends Konva.Group {
    constructor(x, y) {
        super({ x: 0, y: 0 });
        this.tile_x = x;
        this.tile_y = y;
        this.hp = 0;
        this.max_hp = 0;
    }
    setImage() {
    }
}


export { Entity };