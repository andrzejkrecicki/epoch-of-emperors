import { MapFactory, Map } from './map.js';
import { Unit } from './units/unit.js';
import { Villager } from './units/villager.js';
import { ClubMan } from './units/clubman.js';
import { BowMan } from './units/bowman.js';
import { FishingBoat } from './units/fishing_boat.js';
import { TradeBoat } from './units/trade_boat.js';
import { ScoutShip } from './units/scout_ship.js';
import { TransportBoat } from './units/transport_boat.js';
import { Gazelle } from './units/gazelle.js';
import { Lion } from './units/lion.js';
import { Alligator } from './units/alligator.js';
import { Elephant } from './units/elephant.js';
import { Entity } from './entity.js';
import { Player } from './player.js';
import { DeadBody, Rubble } from './flat_drawables.js';
import { Building } from './buildings/building.js';
import { TownCenter } from './buildings/town_center.js';
import { Tower } from './buildings/tower.js';
import { Dock } from './buildings/dock.js';
import { Bush } from './resources/bush.js';
import { FishBig } from './resources/fish.js';
import { GoldMine } from './resources/gold.js';
import { StoneMine } from './resources/stone.js';
import { LeafTree } from './trees.js';
import { AStarPathFinder, AStarToEntity, BFSWalker, BFSBroadWalker, StandardQueue } from './algorithms.js';
import { distance, manhatan_subtile_distance, FPS } from '../utils.js'


class Engine {
    constructor(viewer, definition) {
        this.framesCount = 0;
        this.loop = null;
        this.viewer = viewer;
        this.definition = { ...definition };

        this.players = [];
        for (let definition of this.definition.players) {
            this.players.push(new Player(definition));
        }
        this.current_player = this.players[0];

        this.map = MapFactory(this.definition.map);
        this.units = [];
        this.buildings = [];
        this.projectiles = [];
        this.drawables = [];
        if (this.definition.map.addSampleUnits) this.addSampleUnits();
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
                if (entity.attempts_count >= Engine.prototype.UNIT_MAX_INTERACTION_ATTEMPTS) {
                    entity.terminateInteraction();
                } else if (entity.ticks_waited > Engine.prototype.UNIT_MAX_WAIT_TIME * 3 && Math.random() > .85) {
                    entity.ticks_waited = 0;
                    ++entity.attempts_count;
                    let dist = manhatan_subtile_distance(entity.getCenterSubtile(), entity.interactionObject.getCenterSubtile());
                    this.interactOrder(entity, entity.interactionObject, Math.floor((dist + 5) ** 2), false);
                }
            }
            if (entity.needsProcessing) entity.process();
        }
        this.units = this.units.filter((u) => !u.destroyed);
    }
    processMovingUnit(entity) {
        let tmp_target = this.viewer.mapDrawable.tileCoordsToScreen(
            entity.path[entity.path_progress].x / 2,
            entity.path[entity.path_progress].y / 2
        );
        if (distance(entity.realPosition, tmp_target) < entity.getSpeed() * distance(entity.DIRECTIONS_DELTA[entity.rotation], { x: 0, y: 0 })) {
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
                x: entity.realPosition.x + entity.getSpeed() * entity.DIRECTIONS_DELTA[entity.rotation].x,
                y: entity.realPosition.y + entity.getSpeed() * entity.DIRECTIONS_DELTA[entity.rotation].y
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
        let walker = new BFSWalker(seed, new StandardQueue, ({ x, y }) => {
                let tile = this.map.subtiles[x][y];
                if (tile != null && tile != entity && 
                    active.interaction.canBeSuccessor(tile) && !tile.destroyed
                ) found = tile;
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
                    unit.frame = 0;
                    unit.position(this.viewer.mapDrawable.tileCoordsToScreen(unit.subtile_x / 2, unit.subtile_y / 2));
                    unit.resetBoundingBox();
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
            let striked_entity = null;

            if (--projectile.TTL == 0) projectile.destroy();
            else if (projectile.hasReachedVictim(target_pos)) {
                projectile.victim.takeHit(projectile.attributes.attack, projectile.thrower, this);
                striked_entity = projectile.victim;
                projectile.destroy();
            } else if (projectile.hasReachedSubitle()) {
                let { x, y } = this.viewer.mapDrawable.screenCoordsToSubtile(projectile.target.x, projectile.target.y);
                if (this.map.subtiles[x][y] instanceof Unit || this.map.subtiles[x][y] instanceof Building) {
                    this.map.subtiles[x][y].takeHit(projectile.attributes.attack, projectile.thrower, this);
                    striked_entity = this.map.subtiles[x][y];
                }
                projectile.destroy();
            } else {
                if (projectile.TRACE) {
                    let trace = new projectile.TRACE(projectile.subtile_x, projectile.subtile_y);
                    trace.position(projectile.position());
                    this.drawables.push(trace);
                    this.viewer.addEntity(trace, true);
                }
                projectile.move(this.viewer.mapDrawable);
                let pos = projectile.position();
                let subtile = this.viewer.mapDrawable.screenCoordsToSubtile(pos.x, pos.y);
                projectile.subtile_x = subtile.x;
                projectile.subtile_y = subtile.y;
                projectile.resetBoundingBox();

                if (projectile.shadow) {
                    let pos = projectile.shadow.position();
                    let subtile = this.viewer.mapDrawable.screenCoordsToSubtile(pos.x, pos.y);
                    projectile.shadow.subtile_x = subtile.x;
                    projectile.shadow.subtile_y = subtile.y;
                    projectile.shadow.resetBoundingBox();
                }
            }

            if (projectile.destroyed && projectile.EXPLOSION) {
                let explosion = new projectile.EXPLOSION(projectile.position(), projectile.subtile_x, projectile.subtile_y);
                this.drawables.push(explosion);
                this.viewer.addEntity(explosion);

                if (projectile.EXPLOSION_RADIUS > 1) {
                    let seed = { x: projectile.subtile_x, y: projectile.subtile_y };
                    let victims = new Set();
                    let reached_radius = false

                    let walker = new BFSBroadWalker(seed, new StandardQueue, ({ x, y }) => {
                            if (distance({ x, y }, seed) > projectile.EXPLOSION_RADIUS) {
                                return reached_radius = true;
                            }
                            let tile = this.map.subtiles[x][y];
                            if (tile != null && tile != striked_entity && !tile.destroyed &&
                                tile instanceof Unit || tile instanceof Building
                            ) victims.add(tile);
                        }, (x, y, node) => ({ x, y }),
                        () => reached_radius,
                        0, this.map.edge_size * 2 - 1
                    );
                    walker.run();
                    for (const victim of victims) victim.takeHit(projectile.attributes.attack, projectile.thrower, this);
                }
            }
        }
        this.projectiles = this.projectiles.filter((p) => !p.destroyed);
    }
    processDrawables() {
        for (let drawable of this.drawables) {
            drawable.process(this);
        }
        this.drawables = this.drawables.filter((p) => !p.destroyed);
    }
    processPlayers() {
        for (const player of this.players) {
            player.units = player.units.filter(u => !u.destroyed);
            player.buildings = player.buildings.filter(b => !b.destroyed);
        }
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
        this.processProjectiles();
        this.processUnits();
        this.processBuildings();
        this.processPlayers();
        this.processDrawables();
        this.map.process();
        this.viewer.stage.draw();
    }
    handleRightClick(point) {
        let target = this.viewer.hoveredEntity;
        if (this.selectedEntity instanceof Unit) {
            if (target == null || target == this.selectedEntity) {
                this.moveOrder(this.selectedEntity, point);
            } else if (target instanceof Entity) {
                this.interactOrder(this.selectedEntity, target);
            }
        } else if (this.selectedEntity instanceof Building && target instanceof Entity) {
            this.interactImmediately(this.selectedEntity, target);
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
    interactOrder(active, passive, subtilesLimit, resetAttempts=true) {
        let Interaction = active.getInteractionType(passive);
        let distance = Interaction == null ? 0 : Interaction.getDistance(active);
        if (resetAttempts) active.attempts_count = 0;

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
        } else if (entity instanceof Building && entity.LEAVES_LEFTOVERS) {
            let rubble = new Rubble(
                entity.subtile_x,
                entity.subtile_y,
                entity.IMAGES[entity.state][entity.player.civ][entity.level][0],
                entity.IMAGE_OFFSETS[entity.state][entity.player.civ][entity.level],
            );
            this.drawables.push(rubble);
            this.viewer.addEntity(rubble);
        }

        if (entity instanceof Building && entity.EXPLOSION) {
            let sub = entity.getCenterSubtile();
            let pos = this.viewer.mapDrawable.tileCoordsToScreen(sub.subtile_x / 2, sub.subtile_y / 2);
            let explosion = new entity.EXPLOSION(pos, sub.subtile_x, sub.subtile_y);
            this.drawables.push(explosion);
            this.viewer.addEntity(explosion);
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
        if (projectile.shadow) {
            this.viewer.entitiesHolder.add(projectile.shadow);
            projectile.shadow.resetBoundingBox();
        }
    }
    addSampleUnits() {

        let d = { x: Math.floor(this.map.edge_size), y: Math.floor(this.map.edge_size) }

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

        this.addUnit(new ClubMan(d.x - 1, d.y - 6, this.current_player));
        this.addUnit(new ClubMan(d.x - 5, d.y - 6, this.players[1]));
        this.addUnit(new Villager(d.x + 7, d.y - 10, this.current_player));
        this.addUnit(new BowMan(d.x + 2, d.y, this.current_player));

        var vill;
        vill = new Villager(150, 100, this.current_player, 0, 3);
        this.addUnit(vill);
        vill = new Villager(151, 100, this.current_player, 0, 4);
        this.addUnit(vill);
        vill = new Villager(151, 101, this.current_player, 0, 5);
        this.addUnit(vill);
        vill = new Villager(151, 102, this.current_player, 0, 6);
        this.addUnit(vill);
        vill = new Villager(150, 102, this.current_player, 0, 7);
        this.addUnit(vill);
        vill = new Villager(149, 102, this.current_player, 0, 0);
        this.addUnit(vill);
        vill = new Villager(149, 101, this.current_player, 0, 1);
        this.addUnit(vill);
        vill = new Villager(149, 100, this.current_player, 0, 2);
        this.addUnit(vill);

        let ship = new Tower(140, 90, this.current_player)
        this.addBuilding(ship)

        var vill;
        for (let i = 0; i < 14; ++i) {
            vill = new Villager(130 + i, 100, this.current_player);
            this.addUnit(vill);
            setTimeout((function(vill) {
                this.interactOrder(vill, ship)
            }).bind(this, vill))
        }



        this.addUnit(new Gazelle(d.x + 10, d.y - 8, this.current_player))
        let lion = new Lion(150, 107, this.current_player);
        this.addUnit(lion)
        this.addUnit(new Alligator(150, 110, this.current_player))
        let elephant = new Elephant(150, 120, this.current_player)
        this.addUnit(elephant)

        for (let i = 0; i < 5; ++i) this.addUnit(new Villager(145 + i, 115, this.current_player));
        for (let i = 0; i < 5; ++i) this.addUnit(new Villager(145 + i, 118, this.players[1]));
        for (let i = 0; i < 5; ++i) this.addUnit(new Villager(145 + i, 121, this.players[2]));
        for (let i = 0; i < 5; ++i) this.addUnit(new Villager(145 + i, 124, this.players[3]));


        let towncenter = new TownCenter(d.x + 1, d.y - 8, this.current_player);
        towncenter.setComplete();
        this.addBuilding(towncenter);

        this.addUnit(new TransportBoat(106, 138, this.current_player))
        this.addUnit(new Villager(114, 133, this.current_player))
        this.addUnit(new Villager(115, 132, this.current_player))
        this.addUnit(new Villager(116, 131, this.current_player))
        this.addUnit(new Villager(117, 130, this.current_player))
        this.addUnit(new Villager(118, 129, this.current_player))
        this.addUnit(new Villager(119, 128, this.current_player))
        this.addUnit(new Villager(120, 127, this.current_player))

        let dock_1 = new Dock(107, 128, this.current_player);
        dock_1.setComplete();
        this.addBuilding(dock_1);

        let dock_2 = new Dock(111, 167, this.players[1]);
        dock_2.setComplete();
        this.addBuilding(dock_2);

        let dock_3 = new Dock(246, 246, this.players[1]);
        dock_3.setComplete();
        this.addBuilding(dock_3);

        let dock_4 = new Dock(7, 246, this.players[1]);
        dock_4.setComplete();
        this.addBuilding(dock_4);

        this.addUnit(new FishingBoat(110, 145, this.current_player));

        let fish = new FishBig(110, 150);
        this.map.fillSubtilesWith(fish.subtile_x, fish.subtile_y, fish.SUBTILE_WIDTH, fish);
        this.map.entities.push(fish);
    }
}
Engine.prototype.frameRate = FPS;
Engine.prototype.AREA_ENTRANCE_RESOLUTION = {
    GO: 0, // area is not occupied - free to go
    WAIT: 1, // area is temporarily occupied - wait until it's free
    BYPASS: 2 // area was permanently taken - bypass needed
};
Engine.prototype.UNIT_MAX_WAIT_TIME = 15;
Engine.prototype.UNIT_MAX_INTERACTION_ATTEMPTS = 5;

export {
    Engine
}
