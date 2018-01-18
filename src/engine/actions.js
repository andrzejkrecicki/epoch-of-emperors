import { make_image } from '../utils.js';
import { TownCenter } from './buildings/town_center';
import { Barracks } from './buildings/barracks.js';
import { Villager } from './units/villager.js';
import { rand_choice } from '../utils.js';
import { MapDrawable } from '../viewer.js';

class Action {
    constructor(action_set, viewer) {
        this.action_set = action_set;
        this.viewer = viewer;
        this.entity = this.viewer.engine.selectedEntity;
    }
    execute() { }
}
Action.prototype.SIZE = 50;
Action.prototype.MARGIN = 2;


class RejectConstructionPlan extends Action {
    execute() {
        this.viewer.indicator.removeChildren();
        this.viewer.bottombar.entityActions.popActions();
        this.viewer.isPlanningConstruction = false;
    }
}
RejectConstructionPlan.prototype.IMAGE = make_image("img/interface/command/cancel.png");
RejectConstructionPlan.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN) * 5,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}


let CreateBuildingFactory = function(Building) {
    class CreateBuilding extends Action {
        execute() {
            this.viewer.isPlanningConstruction = true;
            this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
            this.viewer.indicator.setBuilding(this.BUILDING);
            this.viewer.indicator.children[0].on("click", this.handleClick.bind(this));
        }
        handleClick(e) {
            if (e.evt.button == 2 || e.evt.which == 3) this.rejectConstruction(e);
            else this.confirmConstruction(e);
        }
        confirmConstruction(e) {
            // y coordinate needs to get an extra half of MapDrawable.TILE_SIZE.height
            // see comment at screenCoordsToTile
            let sub = this.viewer.mapDrawable.screenCoordsToSubtile(
                this.viewer.mouseX + this.viewer.viewPort.x + MapDrawable.TILE_SIZE.width / 2
                - Math.round(this.BUILDING.SUBTILE_WIDTH / 4 * MapDrawable.TILE_SIZE.width),
                this.viewer.mouseY + this.viewer.viewPort.y + MapDrawable.TILE_SIZE.height
            );
            let screen = this.viewer.mapDrawable.tileCoordsToScreen(sub.x / 2, sub.y / 2);
            sub = this.viewer.mapDrawable.screenCoordsToSubtile(screen.x, screen.y);
            let building = new this.BUILDING(sub.x, sub.y, this.viewer.engine.current_player);
            this.viewer.engine.addBuilding(building);
            this.viewer.addEntity(building);
            this.viewer.indicator.removeChildren();
            this.viewer.bottombar.entityActions.goToFirst();
            this.viewer.isPlanningConstruction = false;
            if (this.viewer.engine.selectedEntity) {
                this.viewer.engine.interactOrder(this.viewer.engine.selectedEntity, building);
            }
        }
        rejectConstruction(e) {
            this.viewer.indicator.removeChildren();
            this.viewer.bottombar.entityActions.popActions();
            this.viewer.isPlanningConstruction = false;
        }
    }
    CreateBuilding.prototype.IMAGE = Building.prototype.AVATAR;
    CreateBuilding.prototype.BUILDING = Building;
    CreateBuilding.prototype.ACTIONS = [
        RejectConstructionPlan
    ];
    return CreateBuilding;
}

class PreviousPage extends Action {
    execute() {
        this.viewer.bottombar.entityActions.popActions();
    }
}
PreviousPage.prototype.IMAGE = make_image("img/interface/command/next.png");
PreviousPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN) * 5,
    y: 0
}

class FirstPage extends Action {
    execute() {
        this.viewer.bottombar.entityActions.goToFirst();
    }
}
FirstPage.prototype.IMAGE = make_image("img/interface/command/cancel.png");
FirstPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN) * 5,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}

class NextBuildingsPage extends Action {
    execute() {
        this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
    }
}
NextBuildingsPage.prototype.IMAGE = make_image("img/interface/command/next.png");
NextBuildingsPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN) * 5,
    y: 0
}
NextBuildingsPage.prototype.ACTIONS = [
    PreviousPage,
    FirstPage,
];


class Build extends Action {
    execute() {
        this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
    }
}
Build.prototype.IMAGE = make_image("img/interface/command/build.png");
Build.prototype.ACTIONS = [
    CreateBuildingFactory(Barracks),
    CreateBuildingFactory(TownCenter),
    NextBuildingsPage,
    FirstPage
];


class Repair extends Action {
}
Repair.prototype.IMAGE = make_image("img/interface/command/repair.png");

class Stop extends Action {
}
Stop.prototype.IMAGE = make_image("img/interface/command/stop.png");


let RecruitUnitFactory = function(Unit) {
    class RecruitUnit extends Action {
        execute() {
            let pos = this.findEmptyArea(this.UNIT.SUBTILE_WIDTH);
            if (pos != null) {
                let unit = new this.UNIT(pos.x, pos.y, this.viewer.engine.current_player);
                this.viewer.engine.addUnit(unit);
                this.viewer.addEntity(unit);
            }
        }
        findEmptyArea(width) {
            // iterate clockwise around all available areas adjecent to building
            // find those which are empty afterwards randomly pick one
            let start, curr;
            start = curr = {
                x: this.entity.subtile_x - width,
                y: this.entity.subtile_y - width
            };
            let directions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];
            let curr_dir = 0;
            let possible_areas = [];
            do {
                let dir = directions[curr_dir];
                let dest = {
                    x: curr.x + (this.entity.constructor.SUBTILE_WIDTH + width) * dir.x,
                    y: curr.y + (this.entity.constructor.SUBTILE_WIDTH + width) * dir.y
                }
                do {
                    if (this.viewer.engine.map.areSubtilesEmpty(curr.x, curr.y, width)) {
                        possible_areas.push(curr);
                    }
                    curr = { x: curr.x + 1 * dir.x, y: curr.y + 1 * dir.y };
                } while (curr.x != dest.x || curr.y != dest.y);
                ++curr_dir;
            } while (start.x != curr.x || start.y != curr.y);

            return rand_choice(possible_areas);
        }
    }
    RecruitUnit.prototype.IMAGE = Unit.prototype.AVATAR;
    RecruitUnit.prototype.UNIT = Unit;
    return RecruitUnit;
}


let Actions = {
    Build, Repair, Stop, RecruitUnitFactory
}

export { Actions };