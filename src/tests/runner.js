import { Entity } from '../engine/entity.js';
import { Player } from '../engine/player.js';

import { Test } from './test.js';

class TestRunner {
    constructor(game, results) {
        this.game = game;
        this.viewer = null;
        this.running = true;
        this.results = document.getElementById(results);

        this.syncTests = [];

        this.MAX_TIME =  10 * 60 * 35;
    }
    run() {
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
                    if (this.engine.framesCount - T0 > this.MAX_TIME) {
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
    loop(skip_draw=false) {
        ++this.engine.framesCount;
        this.engine.viewer.process();
        this.engine.processProjectiles();
        this.engine.processUnits();
        this.engine.processBuildings();
        this.engine.processDrawables();
    }
    cleanUp() {
        for (let unit of this.engine.units) unit.toggleDead(this.engine);

        for (let entity of engine.map.entities) entity.destroy(engine);

        for (let building of this.engine.buildings) building.destroy(this.engine);
        for (let projectile of this.engine.projectiles) projectile.destroy(this.engine);
        for (let drawable of this.engine.drawables) drawable.destroy(this.engine);

        let W = this.viewer.entitiesHolder.grid.length;
        let H = this.viewer.entitiesHolder.grid[0].length;

        this.viewer.entitiesHolder.grid = new Array(W).fill(null).map(
            () => new Array(H).fill(null).map(() => [])
        );

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
        this.game.navigator.startGame(this.game.navigator.currentMenu.game_definition);
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
