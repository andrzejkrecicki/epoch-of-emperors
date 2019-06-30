import { Entity } from '../engine/entity.js';
import { Player } from '../engine/player.js';

import { Test } from './test.js';
import * as resource from './resource_tests';


class TestRunner {
    constructor(game, results) {
        this.game = game;
        this.viewer = null;
        this.running = true;
        this.results = document.getElementById(results);

        this.syncTests = [
            resource.BushTest,
            resource.TreeTest,
            resource.StoneTest,
            resource.GoldTest,
            resource.FarmTest,
            resource.HuntTest,
            resource.FisherTest,
            resource.FishingTest,
        ];
        this.asyncTests = [];
    }
    run(async=false) {
        if (async) {
            this.asyncTests = [...this.syncTests];
            this.asyncRun();
            return;
        }

        this.initGame();

        for (let Test of this.syncTests) {
            this.cleanUp();
            let exception = null;
            let test = null;

            try {
                test = new Test(this.engine);
                test.setup();
                let T0 = this.engine.framesCount;

                while (test.state == Test.prototype.STATE.RUNNING) {
                    if (this.engine.framesCount - T0 > test.MAX_TIME) {
                        test.state = Test.prototype.STATE.TIMEOUT
                    } else {
                        this.loop(true);
                        test.check();
                    }
                }
            } catch (e) {
                exception = e;
            }

            this.engine.viewer.stage.draw();
            this.pushResult(Test, test, exception);
        }
    }
    asyncRun() {
        this.initGame();

        let exception = null;
        let test = null;
        let T0 = 0;

        let tests = this.asyncTests.entries();
        let nextTest = () => {
            let next = tests.next();
            return next.value && next.value[1];
        }
        let Test = nextTest();

        let subtask = () => {
            if (Test == null) window.clearInterval(interval);
            else if (test == null) {
               this.cleanUp();

                try {
                    test = new Test(this.engine);
                    test.setup();
                    T0 = this.engine.framesCount;
                } catch (e) {
                    exception = e;
                    if (test) test.fail();
                    else test = {};
                }
            } else if (test.state == Test.prototype.STATE.RUNNING) {
                if (this.engine.framesCount - T0 > test.MAX_TIME) {
                    test.state = Test.prototype.STATE.TIMEOUT
                } else {
                    try {
                        for (let i = 0; i < 35; ++i) {
                            this.loop(true);
                            test.check();
                        }
                        this.engine.viewer.stage.draw();
                    } catch (e) {
                        exception = e;
                        test.fail();
                    }
                }
            } else {
                this.pushResult(Test, test, exception);
                exception = null;
                test = null;
                Test = nextTest();
            }
        };

        let interval = window.setInterval(subtask, 0);
    }
    loop() {
        ++this.engine.framesCount;
        this.engine.viewer.process();
        this.engine.processProjectiles();
        this.engine.processUnits();
        this.engine.processBuildings();
        this.engine.processDrawables();
    }
    cleanUp() {
        let W = this.viewer.entitiesHolder.grid.length;
        let H = this.viewer.entitiesHolder.grid[0].length;

        this.viewer.entitiesHolder.grid = new Array(W).fill(null).map(
            () => new Array(H).fill(null).map(() => [])
        );

        this.engine.map.reset();
        this.engine.map.setInitialTiles();

        this.engine.players = [];
        for (let i = 0; i < this.engine.definition.players.length; ++i) {
            this.engine.players.push(new Player(this.engine.definition.players[i], this.engine.definition.map));
        }
        this.engine.current_player = this.engine.players[0];

        this.engine.map.entities = [];
        this.engine.units = [];
        this.engine.buildings = [];
        this.engine.projectiles = [];
        this.engine.drawables = [];
    }
    initGame() {
        this.game.navigator.navigate("SinglePlayerMenu");
        this.game.navigator.navigate("RandomMapMenu");
        let definition = this.game.navigator.currentMenu.game_definition;
        definition.map.addSampleUnits = false;
        definition.map.type = 4;
        this.game.navigator.startGame(definition);
        this.viewer = this.game.navigator.gameViewer;
        this.engine = this.game.navigator.gameViewer.engine;
        this.map = this.game.navigator.gameViewer.engine.map;
        window.clearInterval(this.engine.loop);
    }
    pushResult(Test, test, exception) {
        let row = document.createElement("tr");
        if (exception == null) {
            let state = Test.prototype.STATE[test.state];
            row.innerHTML = (
                `<td>${Test.name}</td>` +
                `<td class="${state}">${state}</td>`
            );
        } else {
            row.innerHTML = (
                `<td>${Test.name}</td>` +
                `<td class="FAILED">${exception.stack}</td>`
            );
        }
        this.results.appendChild(row);
    }
}


export {
    TestRunner
}
