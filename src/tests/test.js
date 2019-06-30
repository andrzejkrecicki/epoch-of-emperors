class Test {
    constructor(engine) {
        this.engine = engine;
        this.viewer = this.engine.viewer;
        this.map = this.engine.map;

        this.center = {
            x: this.map.edge_size,
            y: this.map.edge_size
        };

        this.state = this.STATE.RUNNING;
    }
    setup() {
        this.viewer.resetEntitiesCoords();
        this.viewer.addEntities();
    }
    check() {
    }
    fail() {
        this.state = this.STATE.FAILED;
    }
    pass() {
        this.state = this.STATE.PASSED;
    }
    unit(Unit, x, y, player) {
        let unit = new Unit(this.center.x + x, this.center.y + y, this.engine.players[player]);
        this.engine.addUnit(unit);
        this.viewer.addEntity(unit);
        return unit;
    }
    building(Building, x, y, player, complete=true) {
        let building = new Building(this.center.x + x, this.center.y + y, this.engine.players[player]);
        if (complete) building.setComplete();
        this.engine.addBuilding(building);
        this.viewer.addEntity(building);
        return building;
    }
    entity(Entity, x, y) {
        let entity = new Entity(this.center.x + x, this.center.y + y);
        this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.SUBTILE_WIDTH, entity);
        this.map.entities.push(entity);
        return entity;
    }
}
Test.prototype.STATE = {
    RUNNING: 0,
    PASSED: 1,
    FAILED: 2,
    TIMEOUT: 3,
    0: "RUNNING",
    1: "PASSED",
    2: "FAILED",
    3: "TIMEOUT",
};


export { Test }