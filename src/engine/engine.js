import { MapFactory } from './map.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { Entity } from './entity.js';
import { TownCenter } from './buildings/town_center.js';
import { Barracks } from './buildings/barracks.js';
import { AStarPathFinder, AStarToEntity } from './algorithms.js';
import { Map } from './map.js';
import { distance } from '../utils.js'

class Engine {
    constructor(viewer, definition) {
        this.framesCount = 0;
        this.loop = null;
        this.viewer = viewer;
        this.definition = Object.assign({}, definition);
        
        this.map = MapFactory(this.definition.map);
        this.units = [];
        this.buildings = [];
        this.addSampleUnits();
    }
    processUnits() {
        for (let entity, i = 0; entity = this.units[i++];) {
            if (entity.state == Unit.prototype.STATE.MOVING) {
                this.processMovingUnit(entity);
            } else if (entity.state == Unit.prototype.STATE.IDLE && entity.path != null) {
                this.processWaitingUnit(entity);
            }
        }
    }
    processMovingUnit(entity) {
        let tmp_target = this.viewer.mapDrawable.tileCoordsToScreen(
            entity.path[entity.path_progress].x / 2,
            entity.path[entity.path_progress].y / 2
        );
        if (distance(entity.realPosition, tmp_target) < entity.SPEED) {
            // transition between two subtiles is done which can be considered as done step
            if (entity.path_progress > 0) {
                // if first step was already done, we have to release previously occupied area
                this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.constructor.SUBTILE_WIDTH, null);
            }
            entity.subtile_x = entity.path[entity.path_progress].x;
            entity.subtile_y = entity.path[entity.path_progress].y;
            this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.constructor.SUBTILE_WIDTH, entity);
            ++entity.path_progress;

            if (entity.path_progress < entity.path.length) {
                // if there are further steps check if next area is unoccupied
                let entrance = this.canEnterSubtile(
                    entity.path[entity.path_progress].x,
                    entity.path[entity.path_progress].y,
                    entity
                );

                if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.GO) {
                    // if destination area is not occupied allocate it
                    this.map.fillSubtilesWith(
                        entity.path[entity.path_progress].x,
                        entity.path[entity.path_progress].y,
                        entity.constructor.SUBTILE_WIDTH,
                        entity
                    );
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.WAIT) {
                    // if area is temporarily taken wait until it frees
                    entity.state = Unit.prototype.STATE.IDLE;
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS) {
                    this.moveOrder(entity, entity.path[entity.path.length - 1]);
                }
            }
        }
        if (entity.path.length == entity.path_progress) {
            entity.path_progress = 0;
            entity.path = null;
            entity.frame = 0;
            entity.state = Unit.prototype.STATE.IDLE;
            entity.position(this.viewer.mapDrawable.tileCoordsToScreen(entity.subtile_x / 2, entity.subtile_y / 2));
        } else {
            let old_rotation = entity.rotation;
            entity.rotateToSubtile(entity.path[entity.path_progress]);
            if (old_rotation != entity.rotation) entity.frame = 0;

            entity.position({
                x: entity.realPosition.x + entity.SPEED * entity.DIRECTIONS_DELTA[entity.rotation].x,
                y: entity.realPosition.y + entity.SPEED * entity.DIRECTIONS_DELTA[entity.rotation].y
            });
        }
        entity.updateSprite();
        entity.resetBoundingBox();
        this.viewer.setEntityVisibility(entity);
        if (this.framesCount % 2) ++entity.frame;
    }
    processWaitingUnit(entity) {
        // process unit which is waiting for another unit to release currently desired area
        let entrance = this.canEnterSubtile(
            entity.path[entity.path_progress].x,
            entity.path[entity.path_progress].y,
            entity
        );

        if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.GO) {
            entity.state = Unit.prototype.STATE.MOVING;
            this.map.fillSubtilesWith(
                entity.path[entity.path_progress].x,
                entity.path[entity.path_progress].y,
                entity.constructor.SUBTILE_WIDTH,
                entity
            );
        } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS) {
            this.moveOrder(entity, entity.path[entity.path.length - 1]);
        } else {
            // if unit is waiting for too long use randomized way of computing new route
            if (Math.random() > .85) ++entity.ticks_waited;
            if (entity.ticks_waited > Engine.prototype.UNIT_MAX_WAIT_TIME && Math.random() > .85) {
                entity.ticks_waited = 0;
                this.moveOrder(entity, entity.path[entity.path.length - 1]);
            }
        }
    }
    // check if subtile is not occupied by other entity
    canEnterSubtile(subtile_x, subtile_y, entity) {
        for (let x = subtile_x; x < subtile_x + entity.constructor.SUBTILE_WIDTH; ++x) {
            for (let y = subtile_y; y < subtile_y + entity.constructor.SUBTILE_WIDTH; ++y) {
                if (this.map.subtiles_map[x][y] != null && this.map.subtiles_map[x][y] != entity) {
                    if (this.map.subtiles_map[x][y].path != null) {
                        return Engine.prototype.AREA_ENTRANCE_RESOLUTION.WAIT
                    } else if (this.map.subtiles_map[x][y].state == Unit.prototype.STATE.IDLE) {
                        return Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS
                    }
                }
            }
        }
        return Engine.prototype.AREA_ENTRANCE_RESOLUTION.GO;
    }
    startLoop() {
        this.loop = window.setInterval(this.processLoop.bind(this), 1000 / this.frameRate);
    }
    processLoop() {
        ++this.framesCount;
        this.viewer.process();
        this.processUnits();
        this.viewer.stage.draw();
    }
    handleRightClick(point) {
        if (this.selectedEntity instanceof Unit) {
            if (this.map.subtiles_map[point.x][point.y] == null) {
                this.moveOrder(this.selectedEntity, point);
            } else if (this.map.subtiles_map[point.x][point.y] instanceof Entity) {
                this.interactOrder(this.selectedEntity, this.map.subtiles_map[point.x][point.y]);
            }
        }
    }
    moveOrder(unit, point) {
        let finder = new AStarPathFinder(unit, this.map, point);
        let path = finder.run();
        if (path.length > 0) {
            unit.swapPath(path);
            unit.state = Unit.prototype.STATE.MOVING;
            unit.rotateToSubtile(unit.path[0]);
        }
    }
    interactOrder(active, passive) {
        let finder = new AStarToEntity(active, this.map, passive);
        let path = finder.run();
        if (path.length > 0) {
            active.swapPath(path);
            active.state = Unit.prototype.STATE.MOVING;
            active.rotateToSubtile(active.path[0]);
        }
    }
    addUnit(unit) {
        this.map.fillSubtilesWith(unit.subtile_x, unit.subtile_y, unit.constructor.SUBTILE_WIDTH, unit);
        this.map.entities.push(unit);
        this.units.push(unit);
    }
    addBuilding(building) {
        this.map.fillSubtilesWith(building.subtile_x, building.subtile_y, building.constructor.SUBTILE_WIDTH, building);
        this.map.entities.push(building);
        this.buildings.push(building);
    }
    addSampleUnits() {

        let d = { x: Math.floor(Map.SIZES[this.map.definition.size]), y: Math.floor(Map.SIZES[this.map.definition.size]) }
        this.addUnit(new Villager(d.x, d.y ));

        let towncenter = new TownCenter(d.x + 3, d.y + 3 );
        towncenter.state = 1;
        towncenter.setImage();
        this.addBuilding(towncenter);

        let barracks = new Barracks(d.x + 3, d.y + 12 );
        barracks.state = 1;
        barracks.setImage();
        this.addBuilding(barracks);
    }
}
Engine.prototype.frameRate = 35;
Engine.prototype.AREA_ENTRANCE_RESOLUTION = {
    GO: 0, // area is not occupied - free to go
    WAIT: 1, // area is temporarily occupied - wait until it's free
    BYPASS: 2 // area was permanently taken - bypass needed
};
Engine.prototype.UNIT_MAX_WAIT_TIME = 15;

export {
    Engine
}