import { MapFactory } from './map.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { AStarPathFinder } from './algorithms.js';
import { Map } from './map.js';

class Engine {
    constructor(viewer, definition) {
        this.framesCount = 0;
        this.loop = null;
        this.viewer = viewer;
        this.definition = Object.assign({}, definition);
        
        this.map = MapFactory(this.definition.map);
        this.addSampleUnits();
    }
    processEntities() {
        if (this.framesCount % 5 == 0) {
            for (let entity, i = 0; entity = this.map.entities[i++];) {
                if (entity.state == Unit.prototype.STATE.MOVING) {
                    entity.subtile_x = entity.path[entity.path_progress].x;
                    entity.subtile_y = entity.path[entity.path_progress].y;
                    ++entity.path_progress;
                    if (entity.path.length == entity.path_progress) {
                        entity.path_progress = 0;
                        entity.path = null;
                        entity.state = Unit.prototype.STATE.IDLE;
                    }
                    entity.position(this.viewer.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
                    entity.resetBoundingBox();
                }
            }
        }
    }
    startLoop() {
        this.loop = window.setInterval(this.processLoop.bind(this), 1000 / this.frameRate);
    }
    processLoop() {
        ++this.framesCount;
        this.viewer.handleScroll();
        this.processEntities();
        this.viewer.stage.draw();
    }
    handleRightClick(point) {
        if (this.selectedEntity instanceof Unit) this.moveOrder(this.selectedEntity, point);
    }
    moveOrder(unit, point) {
        let finder = new AStarPathFinder(unit, this.map, point);
        let path = finder.run();
        if (path.length > 0) {
            this.selectedEntity.path = path;
            this.selectedEntity.path_progress = 0;
            this.selectedEntity.state = Unit.prototype.STATE.MOVING;
        }
    }
    addSampleUnits() {
        let d = { x: Math.floor(Map.SIZES[this.map.definition.size]), y: Math.floor(Map.SIZES[this.map.definition.size]) }
        let villager;
        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y);
            this.map.fillSubtilesWith(d.x + i, d.y, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }
        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y+1);
            this.map.fillSubtilesWith(d.x + i, d.y+1, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }
        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y + 2);
            this.map.fillSubtilesWith(d.x + i, d.y + 2, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }

        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y+5);
            this.map.fillSubtilesWith(d.x + i, d.y+5, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }
        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y+6);
            this.map.fillSubtilesWith(d.x + i, d.y+6, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }
        for (let i = -10; i < 10; ++i) {
            villager = new Villager(d.x + i, d.y+7);
            this.map.fillSubtilesWith(d.x + i, d.y+7, Villager.SUBTILE_WIDTH, villager);
            this.map.entities.push(villager);
        }

        villager = new Villager(d.x - 16, d.y + 3 );
        this.map.fillSubtilesWith(d.x - 16, d.y + 3 , Villager.SUBTILE_WIDTH, villager);
        this.map.entities.push(villager);
    }
}
Engine.prototype.frameRate = 25;

export {
    Engine
}