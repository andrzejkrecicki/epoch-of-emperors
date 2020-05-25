import { Test, ComplexTest } from './test.js';
import { RESOURCE_TYPES, FPS } from '../utils.js';

import { Villager } from '../engine/units/villager.js';
import { TownCenter } from '../engine/buildings/town_center.js';
import { Barracks } from '../engine/buildings/barracks.js';



class BuildingCountersTest extends ComplexTest {
    constructor(engine) {
        super(engine)
        this.villager = this.unit(Villager, 135, 118, 0);
        this.towncenter1 = null;
        this.towncenter2 = null;
        this.towncenter3 = null;

        this.barracks1 = null;
        this.barracks2 = null;
    }
    setup() {
        super.setup();

        this.steps = ([
            function() {
                if (this.engine.players[0].possessions.TownCenter != null) this.fail("Wrong initial possessions count");
            },
            function() {
                this.towncenter1 = this.building(TownCenter, 120, 115, 0, false);
                this.viewer.addEntity(this.towncenter1);
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 1) this.fail("Expected TownCenter count to be 1");
            },
            function() {
                this.engine.interactOrder(this.villager, this.towncenter1);
            },
            function() {
                return this.towncenter1.isComplete;
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 1) this.fail("Expected TownCenter count to be 1");
            },
            function() {
                this.towncenter2 = this.building(TownCenter, 120, 122, 0, false);
                this.viewer.addEntity(this.towncenter2);

                this.towncenter3 = this.building(TownCenter, 120, 129, 0, false);
                this.viewer.addEntity(this.towncenter3);
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 3) this.fail("Expected TownCenter count to be 3");
            },
            function() {
                this.towncenter1.takeHit(600, null, this.engine);
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 2) this.fail("Expected TownCenter count to be 2");
            },
            function() {
                this.towncenter2.takeHit(600, null, this.engine);
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 1) this.fail("Expected TownCenter count to be 1");
            },
            function() {
                this.towncenter3.takeHit(600, null, this.engine);
            },
            function() {
                if (this.engine.players[0].possessions.TownCenter != 0) this.fail("Expected TownCenter count to be 0");
            },
            function() {
                if (this.engine.players[0].possessions.Barracks != null) this.fail("Wrong initial Barracks count");
            },
            function() {
                this.barracks1 = this.building(Barracks, 127, 122, 0, false);
                this.viewer.addEntity(this.barracks1);
            },
            function() {
                if (this.engine.players[0].possessions.Barracks == 1) this.fail("Expected Barracks count to be 0");
            },
            function() {
                this.engine.interactOrder(this.villager, this.barracks1);
            },
            function() {
                return this.barracks1.isComplete;
            },
            function() {
                if (this.engine.players[0].possessions.Barracks != 1) this.fail("Expected Barracks count to be 1");
            },
            function() {
                this.barracks2 = this.building(Barracks, 127, 129, 0, false);
                this.viewer.addEntity(this.barracks2);
            },
            function() {
                if (this.engine.players[0].possessions.Barracks != 1) this.fail("Expected Barracks count to be 1");
            },
            function() {
                this.barracks2.takeHit(350, null, this.engine);
            },
            function() {
                if (this.engine.players[0].possessions.Barracks != 1) this.fail("Expected Barracks count to be 1");
            },
            function() {
                this.barracks1.takeHit(350, null, this.engine);
            },
            function() {
                if (this.engine.players[0].possessions.Barracks != 0) this.fail("Expected Barracks count to be 0");
            },
            function() {
                this.pass();
            },
        ]).values();
    }
}


export {
    BuildingCountersTest
}