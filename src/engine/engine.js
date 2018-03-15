import { MapFactory } from './map.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { Entity } from './entity.js';
import { Player } from './player.js';
import { Building } from './buildings/building.js';
import { TownCenter } from './buildings/town_center.js';
import { Barracks } from './buildings/barracks.js';
import { Bush } from './resources/bush.js';
import { AStarPathFinder, AStarToEntity } from './algorithms.js';
import { Map } from './map.js';
import { distance, manhatan_subtile_distance } from '../utils.js'


class Engine {
    constructor(viewer, definition) {
        this.framesCount = 0;
        this.loop = null;
        this.viewer = viewer;
        this.definition = Object.assign({}, definition);

        this.players = [];
        for (let i = 0; i < this.definition.players.length; ++i) {
            this.players.push(new Player(this.definition.players[i]));
        }
        this.current_player = this.players[0];

        this.map = MapFactory(this.definition.map);
        this.units = [];
        this.buildings = [];
        this.addSampleUnits();
    }
    processUnits() {
        for (let entity, i = 0; entity = this.units[i++];) {
            if (entity.state & Unit.prototype.STATE.MOVING) {
                this.processMovingUnit(entity);
            } else if (entity.state & Unit.prototype.STATE.IDLE && entity.path != null) {
                this.processWaitingUnit(entity);
            } else if (!(entity.state & Unit.prototype.STATE.IDLE)) {
                this.processInteractingUnit(entity);
            } else if (!entity.hasFullPath && entity.interactionObject != null) {
                if (Math.random() > .85) ++entity.ticks_waited;
                if (entity.ticks_waited > Engine.prototype.UNIT_MAX_WAIT_TIME * 3 && Math.random() > .85) {
                    entity.ticks_waited = 0;
                    let dist = manhatan_subtile_distance(entity.getCenterSubtile(), entity.interactionObject.getCenterSubtile());
                    this.interactOrder(entity, entity.interactionObject, Math.floor((dist + 5) ** 2));
                }
            }
        }
    }
    processMovingUnit(entity) {
        let tmp_target = this.viewer.mapDrawable.tileCoordsToScreen(
            entity.path[entity.path_progress].x / 2,
            entity.path[entity.path_progress].y / 2
        );
        if (distance(entity.realPosition, tmp_target) < entity.SPEED * distance(entity.DIRECTIONS_DELTA[entity.rotation], { x: 0, y: 0 })) {
            // transition between two subtiles is done which can be considered as done step
            if (entity.path_progress > 0) {
                // if first step was already done, we have to release previously occupied area
                this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.SUBTILE_WIDTH, null);
            }
            entity.subtile_x = entity.path[entity.path_progress].x;
            entity.subtile_y = entity.path[entity.path_progress].y;
            entity.position(tmp_target);
            this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.SUBTILE_WIDTH, entity);
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
                        entity.SUBTILE_WIDTH,
                        entity
                    );
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.WAIT) {
                    // if area is temporarily taken wait until it frees
                    entity.setBaseState(Unit.prototype.STATE.IDLE);
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS) {
                    this.bypassOrder(entity);
                }
            } else if (entity.path.length == entity.path_progress) {
                entity.path_progress = 0;
                entity.path = null;
                entity.frame = 0;
                if (entity.interactionObject === null) {
                    entity.setBaseState(Unit.prototype.STATE.IDLE);
                } else {
                    entity.initInteraction(this);
                }
            }
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
            entity.setBaseState(Unit.prototype.STATE.MOVING);
            this.map.fillSubtilesWith(
                entity.path[entity.path_progress].x,
                entity.path[entity.path_progress].y,
                entity.SUBTILE_WIDTH,
                entity
            );
        } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS) {
            this.bypassOrder(entity);
        } else {
            // if unit is waiting for too long use randomized way of computing new route
            if (Math.random() > .85) ++entity.ticks_waited;
            if (entity.ticks_waited > Engine.prototype.UNIT_MAX_WAIT_TIME && Math.random() > .85) {
                entity.ticks_waited = 0;
                this.bypassOrder(entity);
            }
        }
    }
    processInteractingUnit(entity) {
        entity.processInteraction(this);
        entity.updateSprite();
        if (this.framesCount % entity.FRAME_RATE[entity.state & Unit.prototype.BASE_STATE_MASK] == 0) ++entity.frame;
    }
    // check if subtile is not occupied by other entity
    canEnterSubtile(subtile_x, subtile_y, entity) {
        for (let x = subtile_x; x < subtile_x + entity.SUBTILE_WIDTH; ++x) {
            for (let y = subtile_y; y < subtile_y + entity.SUBTILE_WIDTH; ++y) {
                if (this.map.subtiles[x][y] != null && this.map.subtiles[x][y] != entity) {
                    if (this.map.subtiles[x][y].path != null) {
                        return Engine.prototype.AREA_ENTRANCE_RESOLUTION.WAIT
                    } else if (
                        (this.map.subtiles[x][y] instanceof Unit && !(this.map.subtiles[x][y].state & Unit.prototype.STATE.MOVING)) ||
                        (this.map.subtiles[x][y] instanceof Building)
                    ) {
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
            if (this.map.subtiles[point.x][point.y] == null) {
                this.moveOrder(this.selectedEntity, point);
            } else if (this.map.subtiles[point.x][point.y] instanceof Entity) {
                this.interactOrder(this.selectedEntity, this.map.subtiles[point.x][point.y]);
            }
        }
    }
    moveOrder(unit, point) {
        let finder = new AStarPathFinder(unit, this.map, point);
        let path = finder.run();
        if (path !== null && path.length > 0) {
            unit.terminateInteraction();
            unit.swapPath(path);
            unit.setBaseState(Unit.prototype.STATE.MOVING);
            unit.rotateToSubtile(unit.path[0]);
        }
    }
    interactOrder(active, passive, subtilesLimit) {
        let finder = new AStarToEntity(active, this.map, passive, subtilesLimit);
        let path = finder.run();
        if (path !== null) {
            active.stopInteraction();
            active.interactionObject = passive;
            active.hasFullPath = finder.done;
            if (path.length) {
                active.swapPath(path);
                active.rotateToSubtile(active.path[0]);
                active.preInitInteraction(passive);
                active.setBaseState(Unit.prototype.STATE.MOVING);
            } else {
                active.path = null;
                active.path_progress = 0;
                active.initInteraction(this);
            }
        }
    }
    bypassOrder(entity) {
        let target = entity.path && entity.path[entity.path.length - 1];
        entity.path = null;
        entity.path_progress = 0;
        entity.setBaseState(Unit.prototype.STATE.IDLE);

        if (entity.interactionObject == null) this.moveOrder(entity, target);
        else {
            let dist = manhatan_subtile_distance(entity.getCenterSubtile(), entity.interactionObject.getCenterSubtile());
            this.interactOrder(entity, entity.interactionObject, (dist + 5) ** 2);
        }
    }
    addUnit(unit) {
        this.map.fillSubtilesWith(unit.subtile_x, unit.subtile_y, unit.SUBTILE_WIDTH, unit);
        this.map.entities.push(unit);
        this.units.push(unit);
    }
    addBuilding(building) {
        this.map.fillSubtilesWith(building.subtile_x, building.subtile_y, building.SUBTILE_WIDTH, building);
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