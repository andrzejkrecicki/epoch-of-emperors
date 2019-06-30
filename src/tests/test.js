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
        this.message = null;
    }
    setup() {
        this.viewer.resetEntitiesCoords();
        this.viewer.addEntities();
    }
    check() {
    }
    fail(message=null) {
        this.state = this.STATE.FAILED;
        if (message) this.message = message;
    }
    pass() {
        this.state = this.STATE.PASSED;
    }
    unit(Unit, x, y, player) {
        let unit = new Unit(this.center.x + x, this.center.y + y, this.engine.players[player]);
        this.engine.addUnit(unit);
        return unit;
    }
    building(Building, x, y, player, complete=true) {
        let building = new Building(this.center.x + x, this.center.y + y, this.engine.players[player]);
        if (complete) building.setComplete();
        this.engine.addBuilding(building);
        return building;
    }
    entity(Entity, x, y) {
        let entity = new Entity(this.center.x + x, this.center.y + y);
        this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.SUBTILE_WIDTH, entity);
        this.map.entities.push(entity);
        return entity;
    }
    selectEntity(entity) {
        this.viewer.handleLeftClick({
            evt: {},
            target: {
                parent: entity
            }
        });
    }
}
Test.prototype.MAX_TIME =  10 * 60 * 35;
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



class ComplexTest extends Test {
    constructor(engine) {
        super(engine);
        this.lastFrame = this.engine.framesCount;
        this.step = null;
    }
    nextStep() {
        this.lastFrame = this.engine.framesCount;
        this.step = this.steps.next().value;
    }
    sleep(time) {
        return function() {
            if (this.engine.framesCount - this.lastFrame < time) return false;
        }
    }
    check() {
        if (this.step == null) this.nextStep();
        if (this.step() !== false) this.nextStep();
    }
}


export { Test, ComplexTest }