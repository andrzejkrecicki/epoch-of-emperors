import { MapFactory, Map } from './map.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { Entity } from './entity.js';
import { Player } from './player.js';
import { DeadBody } from './flat_drawables.js';
import { Building } from './buildings/building.js';
import { TownCenter } from './buildings/town_center.js';
import { Bush } from './resources/bush.js';
import { GoldMine } from './resources/gold.js';
import { StoneMine } from './resources/stone.js';
import { LeafTree } from './trees.js';
import { AStarPathFinder, AStarToEntity, BFSWalker, StandardQueue } from './algorithms.js';
import { distance, manhatan_subtile_distance } from '../utils.js'


class Engine {
    constructor(viewer, definition) {
        this.framesCount = 0;
        this.loop = null;
        this.viewer = viewer;
        this.definition = { ...definition };

        this.players = [];
        for (let i = 0; i < this.definition.players.length; ++i) {
            this.players.push(new Player(this.definition.players[i], this.definition.map));
        }
        this.current_player = this.players[0];

        this.map = MapFactory(this.definition.map);
        this.units = [];
        this.buildings = [];
        this.projectiles = [];
        this.drawables = [];
        this.addSampleUnits();
    }
    processUnits() {
        for (let entity of this.units) {
            if (entity.state & Unit.prototype.STATE.MOVING) {
                this.processMovingUnit(entity);
            } else if (entity.state & Unit.prototype.STATE.IDLE && entity.path != null) {
                this.processWaitingUnit(entity);
            } else if ((entity.state & ~Unit.prototype.BASE_STATE_MASK) == 0) {
                this.processInteractingUnit(entity);
            } else if (entity.state & Unit.prototype.STATE.DYING) {
                if (entity.frame < entity.IMAGES[Unit.prototype.STATE.DYING][entity.level][0].length) {
                    entity.updateSprite();
                    if (this.framesCount % entity.FRAME_RATE[Unit.prototype.STATE.DYING] == 0) ++entity.frame;
                } else entity.toggleDead(this);
            } else if (!entity.hasFullPath && entity.interactionObject != null) {
                if (Math.random() > .85) ++entity.ticks_waited;
                if (entity.ticks_waited > Engine.prototype.UNIT_MAX_WAIT_TIME * 3 && Math.random() > .85) {
                    entity.ticks_waited = 0;
                    let dist = manhatan_subtile_distance(entity.getCenterSubtile(), entity.interactionObject.getCenterSubtile());
                    this.interactOrder(entity, entity.interactionObject, Math.floor((dist + 5) ** 2));
                }
            }
        }
        this.units = this.units.filter((u) => !u.destroyed);
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
            entity.hasPrelocatedArea = false;

            entity.afterStep();
            if (entity.state != Unit.prototype.STATE.DYING && entity.path_progress < entity.path.length) {
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
                    entity.hasPrelocatedArea = true;
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.WAIT) {
                    // if area is temporarily taken wait until it frees
                    entity.setBaseState(Unit.prototype.STATE.IDLE);
                } else if (entrance == Engine.prototype.AREA_ENTRANCE_RESOLUTION.BYPASS) {
                    this.bypassOrder(entity);
                }
            } else if (entity.state == Unit.prototype.STATE.DYING || entity.path.length == entity.path_progress) {
                if (entity.state != Unit.prototype.STATE.DYING) entity.setBaseState(Unit.prototype.STATE.IDLE);
                entity.path_progress = 0;
                entity.path = null;
                if (entity.interaction === null) {
                    entity.frame = 0;
                    entity.interactionObject = null;
                    entity.afterPath(this);
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
        if (this.framesCount % entity.FRAME_RATE[entity.STATE.MOVING] == entity.FRAME_RATE[entity.STATE.MOVING] - 1) ++entity.frame;
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
            entity.hasPrelocatedArea = true;
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
    findInteractionSuccessor(active, entity) {
        if (entity.interactionSuccessor != null) {
            this.interactOrder(active, entity.interactionSuccessor);
            return entity.interactionSuccessor;
        }
        let seed = { x: entity.subtile_x, y: entity.subtile_y };
        let found = null;
        let count = 0
        let walker = new BFSWalker(seed, new StandardQueue, (node) => {
                let { x, y } = node;
                if (this.map.subtiles[x][y] != null && this.map.subtiles[x][y] != entity &&
                    this.map.subtiles[x][y] instanceof entity.constructor &&
                    !this.map.subtiles[x][y].destroyed
                ) found = this.map.subtiles[x][y];
                ++count;
            }, (x, y, node) => ({ x, y }),
            () => (found != null || count > 1000),
            0, this.map.edge_size * 2 - 1
        );
        walker.run();
        entity.interactionSuccessor = found;
        if (found) this.interactOrder(active, found);
        return found;
    }
    unloadUnits(carrier) {
        let count = 0;
        let seed = { x: carrier.subtile_x, y: carrier.subtile_y };
        let walker = new BFSWalker(seed, new StandardQueue, (node) => {
                let { x, y } = node;
                let unit = carrier.carriedUnits[carrier.load - 1];
                if (this.map.areSubtilesEmpty(x, y, unit.SUBTILE_WIDTH) && this.map.isSuitableForUnit(x, y, unit)) {
                    unit.subtile_x = x;
                    unit.subtile_y = y;
                    unit.position(this.viewer.mapDrawable.tileCoordsToScreen(unit.subtile_x / 2, unit.subtile_y / 2));
                    this.viewer.entitiesHolder.add(unit);
                    this.map.fillSubtilesWith(unit.subtile_x, unit.subtile_y, unit.SUBTILE_WIDTH, unit);
                    --carrier.load;
                    carrier.attributes.load = `${carrier.load}/${carrier.capacity}`;
                    carrier.carriedUnits.pop();
                }
                ++count;
            }, (x, y, node) => ({ x, y }),
            () => (carrier.load == 0 || count > 100),
            0, this.map.edge_size * 2 - 1
        );
        walker.run();
    }
    processBuildings() {
        for (let entity of this.buildings) {
            entity.process(this);
            if (!entity.normalized) entity.normalize(this.map);
        }
        this.buildings = this.buildings.filter((b) => !b.destroyed);
    }
    processProjectiles() {
        for (let projectile of this.projectiles) {
            let target = projectile.victim.getExactSubtileCenter();
            let target_pos = this.viewer.mapDrawable.tileCoordsToScreen(target.subtile_x / 2, target.subtile_y / 2);

            if (--projectile.TTL == 0) projectile.destroy();
            else if (distance(projectile.realPosition, target_pos) - projectile.RADIUS <= projectile.SPEED / 2) {
                projectile.victim.takeHit(projectile.attributes.attack, projectile.thrower, this);
                projectile.destroy();
            } else if (distance(projectile.realPosition, projectile.target) - projectile.RADIUS <= projectile.SPEED / 2) {
                let { x, y } = this.viewer.mapDrawable.screenCoordsToSubtile(projectile.target.x, projectile.target.y);
                if (this.map.subtiles[x][y] instanceof Unit || this.map.subtiles[x][y] instanceof Building) {
                    this.map.subtiles[x][y].takeHit(projectile.attributes.attack, projectile.thrower, this);
                }
                projectile.destroy();
            } else {
                let pos = {
                    x: projectile.realPosition.x + projectile.delta.x,
                    y: projectile.realPosition.y + projectile.delta.y
                };
                let subtile = this.viewer.mapDrawable.screenCoordsToSubtile(pos.x, pos.y);
                projectile.subtile_x = subtile.x;
                projectile.subtile_y = subtile.y;
                projectile.position(pos);
            }
        }
        this.projectiles = this.projectiles.filter((p) => !p.destroyed);
    }
    processDrawables() {
        for (let drawable of this.drawables) {
            drawable.process(engine);
        }
        this.drawables = this.drawables.filter((p) => !p.destroyed);
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
        this.processBuildings();
        this.processProjectiles();
        this.processDrawables();
        this.viewer.stage.draw();
    }
    handleRightClick(point) {
        if (this.selectedEntity instanceof Unit) {
            let target = this.map.subtiles[point.x][point.y];
            if (target == null || target == this.selectedEntity) {
                this.moveOrder(this.selectedEntity, point);
            } else if (target instanceof Entity) {
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
            unit.afterMoveOrder();
        }
    }
    interactOrder(active, passive, subtilesLimit) {
        let Interaction = active.getInteractionType(passive);
        let distance = Interaction == null ? 0 : Interaction.getDistance(active);

        let finder = new AStarToEntity(active, this.map, passive, distance, subtilesLimit);
        let path = finder.run();
        if (path !== null) {
            active.stopInteraction();
            active.interactionObject = passive;
            active.hasFullPath = finder.done;
            if (path.length) {
                active.swapPath(path);
                active.rotateToSubtile(active.path[0]);
                if (Interaction) active.interaction = new Interaction(active, passive, this);
                active.preInitInteraction();
                active.setBaseState(Unit.prototype.STATE.MOVING);
            } else {
                active.path = null;
                active.path_progress = 0;
                active.setBaseState(Unit.prototype.STATE.IDLE);
                if (Interaction) active.interaction = new Interaction(active, passive, this);
                active.preInitInteraction();
                active.initInteraction();
            }
        }
    }
    interactImmediately(active, passive) {
        let Interaction = active.getInteractionType(passive);
        if (Interaction) active.interaction = new Interaction(active, passive, this);
        active.preInitInteraction();
        active.initInteraction();
    }
    escapeOrder(unit, attacker=null) {
        let angle = Math.random() * Math.PI * 2;
        if (attacker) {
            angle = Math.atan2(unit.subtile_y - attacker.subtile_y, unit.subtile_x - attacker.subtile_x);
            angle += (Math.random() * Math.PI / 2) - Math.PI / 4
        }
        let target = {
            x: unit.subtile_x + Math.floor((5 + Math.random() * 6) * Math.cos(angle)),
            y: unit.subtile_y + Math.floor((5 + Math.random() * 6) * Math.sin(angle))
        }

        this.moveOrder(unit, target);
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
        ++unit.player.population
    }
    addBuilding(building) {
        this.map.fillSubtilesWith(building.subtile_x, building.subtile_y, building.SUBTILE_WIDTH, building);
        this.map.entities.push(building);
        this.buildings.push(building);
    }
    destroyEntity(entity) {
        if (!isNaN(entity.subtile_x + entity.subtile_y)) {
            this.map.fillSubtilesWith(entity.subtile_x, entity.subtile_y, entity.SUBTILE_WIDTH, null);
        }
        if (entity.hasPrelocatedArea) this.map.fillSubtilesWith(
            entity.path[entity.path_progress].x,
            entity.path[entity.path_progress].y,
            entity.SUBTILE_WIDTH,
            null
        );
        if (this.selectedEntity == entity) this.viewer.deselectEntity();
        if (isNaN(entity.subtile_x + entity.subtile_y)) return;

        if (entity.LEFTOVERS != null) {
            let leftovers = new entity.LEFTOVERS(entity.subtile_x, entity.subtile_y);
            this.drawables.push(leftovers);
            this.viewer.addEntity(leftovers);
        } else if (entity instanceof Unit && entity.LEAVES_LEFTOVERS) {
            let dead = new DeadBody(
                entity.subtile_x,
                entity.subtile_y,
                entity.position(),
                entity.IMAGES[entity.state][entity.level][entity.rotation],
                entity.IMAGE_OFFSETS[entity.state][entity.level],
                entity.player
            );
            this.drawables.push(dead);
            this.viewer.addEntity(dead, true);
        }
    }
    makeProjectile(Projectile, thrower, victim) {
        let source = thrower.getCenterSubtile();
        let source_pix = this.viewer.mapDrawable.tileCoordsToScreen(source.subtile_x / 2, source.subtile_y / 2);
        let offset = thrower.getProjectileOffset();
        source_pix.x += offset.x;
        source_pix.y += offset.y;

        let target = victim.getExactSubtileCenter();
        let target_pix = this.viewer.mapDrawable.tileCoordsToScreen(target.subtile_x / 2, target.subtile_y / 2);
        let projectile = new Projectile(
            thrower, victim,
            source_pix, target_pix,
            source.subtile_x, source.subtile_y
        );
        this.projectiles.push(projectile);
        this.viewer.entitiesHolder.add(projectile);
    }
    addSampleUnits() {

        let d = { x: Math.floor(Map.SIZES[this.map.definition.size]), y: Math.floor(Map.SIZES[this.map.definition.size]) }

        let bush = new Bush(129, 132);
        this.map.fillSubtilesWith(bush.subtile_x, bush.subtile_y, bush.SUBTILE_WIDTH, bush);
        this.map.entities.push(bush);

        bush = new Bush(131, 135);
        this.map.fillSubtilesWith(bush.subtile_x, bush.subtile_y, bush.SUBTILE_WIDTH, bush);
        this.map.entities.push(bush);

        bush = new Bush(131, 138);
        this.map.fillSubtilesWith(bush.subtile_x, bush.subtile_y, bush.SUBTILE_WIDTH, bush);
        this.map.entities.push(bush);

        bush = new Bush(126, 135);
        this.map.fillSubtilesWith(bush.subtile_x, bush.subtile_y, bush.SUBTILE_WIDTH, bush);
        this.map.entities.push(bush);

        bush = new Bush(123, 135);
        this.map.fillSubtilesWith(bush.subtile_x, bush.subtile_y, bush.SUBTILE_WIDTH, bush);
        this.map.entities.push(bush);



        let tree = new LeafTree(141, 131, 4);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);

        tree = new LeafTree(141, 125, 1);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);

        tree = new LeafTree(147, 127, 4);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);

        tree = new LeafTree(145, 133, 2);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);

        tree = new LeafTree(139, 136, 5);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);

        tree = new LeafTree(143, 137, 5);
        this.map.fillSubtilesWith(tree.subtile_x, tree.subtile_y, tree.SUBTILE_WIDTH, tree);
        this.map.entities.push(tree);



        let gold = new GoldMine(114, 120, 4);
        this.map.fillSubtilesWith(gold.subtile_x, gold.subtile_y, gold.SUBTILE_WIDTH, gold);
        this.map.entities.push(gold);

        gold = new GoldMine(116, 120, 3);
        this.map.fillSubtilesWith(gold.subtile_x, gold.subtile_y, gold.SUBTILE_WIDTH, gold);
        this.map.entities.push(gold);

        gold = new GoldMine(116, 118, 5);
        this.map.fillSubtilesWith(gold.subtile_x, gold.subtile_y, gold.SUBTILE_WIDTH, gold);
        this.map.entities.push(gold);

        gold = new GoldMine(118, 118, 1);
        this.map.fillSubtilesWith(gold.subtile_x, gold.subtile_y, gold.SUBTILE_WIDTH, gold);
        this.map.entities.push(gold);

        gold = new GoldMine(118, 122, 5);
        this.map.fillSubtilesWith(gold.subtile_x, gold.subtile_y, gold.SUBTILE_WIDTH, gold);
        this.map.entities.push(gold);


        let stone = new StoneMine(124, 114, 6);
        this.map.fillSubtilesWith(stone.subtile_x, stone.subtile_y, stone.SUBTILE_WIDTH, stone);
        this.map.entities.push(stone);

        stone = new StoneMine(126, 114, 4);
        this.map.fillSubtilesWith(stone.subtile_x, stone.subtile_y, stone.SUBTILE_WIDTH, stone);
        this.map.entities.push(stone);

        stone = new StoneMine(124, 112, 4);
        this.map.fillSubtilesWith(stone.subtile_x, stone.subtile_y, stone.SUBTILE_WIDTH, stone);
        this.map.entities.push(stone);

        stone = new StoneMine(126, 112, 3);
        this.map.fillSubtilesWith(stone.subtile_x, stone.subtile_y, stone.SUBTILE_WIDTH, stone);
        this.map.entities.push(stone);

        this.addUnit(new Villager(d.x - 1, d.y - 6, this.current_player));
        this.addUnit(new Villager(d.x + 7, d.y - 10, this.current_player));
        this.addUnit(new Villager(d.x + 2, d.y, this.current_player));

        let towncenter = new TownCenter(d.x + 1, d.y - 8, this.current_player);
        towncenter.setComplete();
        this.addBuilding(towncenter);

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
