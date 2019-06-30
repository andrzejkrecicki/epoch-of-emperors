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