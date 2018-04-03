import { make_image } from '../utils.js';
import { TownCenter } from './buildings/town_center';
import { Barracks } from './buildings/barracks.js';
import { Farm } from './buildings/farm.js';
import { StoragePit } from './buildings/storage_pit.js';
import { Dock } from './buildings/dock.js';
import { Granary } from './buildings/granary.js';
import { House } from './buildings/house.js';
import { Villager } from './units/villager.js';
import { rand_choice } from '../utils.js';
import { MapDrawable } from '../viewer.js';

class Action {
    constructor(viewer) {
        this.viewer = viewer;
        this.entity = this.viewer.engine.selectedEntity;
        this.player = this.viewer.engine.current_player;
        this.failed = false;
    }
    toolTip() {
        let chunks = [this.TOOLTIP];
        if (this.ACTION_KEY) chunks.push(`(${this.ACTION_KEY})`);
        let cost = this.getCost();
        if (cost) chunks.push(`(${this.costToString(cost)})`);
        return chunks.join(" ");
    }
    getCost() {
        return null;
    }
    costToString(cost) {
        let result = [];
        if (cost.wood) result.push(`Wood: ${cost.wood}`);
        if (cost.food) result.push(`Food: ${cost.food}`);
        if (cost.gold) result.push(`Gold: ${cost.gold}`);
        if (cost.stone) result.push(`Stone: ${cost.stone}`);
        return result.join(" ");
    }
    execute() { }
    init() {
        return true;
    }
    finalize() {
        return true;
    }
}
Action.prototype.SIZE = 54;
Action.prototype.MARGIN = 2;
Action.prototype.ACTIONS_PER_ROW = 5;
Action.prototype.SUPPORTS_QUEUE = false;
Action.prototype.ACTION_KEY = null;

class RejectConstructionPlan extends Action {
    execute() {
        this.viewer.constructionIndicator.removeChildren();
        this.viewer.bottombar.entityActions.popActions();
        this.viewer.isPlanningConstruction = false;
    }
}
RejectConstructionPlan.prototype.IMAGE = make_image("img/interface/command/cancel.png");
RejectConstructionPlan.prototype.TOOLTIP = "Cancel";
RejectConstructionPlan.prototype.ACTION_KEY = "Esc";
RejectConstructionPlan.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * Action.prototype.ACTIONS_PER_ROW + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}


let CreateBuildingFactory = function(Building) {
    class CreateBuilding extends Action {
        execute() {
            let deficit = this.player.deficitResource(this.BUILDING.prototype.COST);
            if (deficit != null) {
                this.viewer.setErrorMessage(`Not enough ${deficit}.`);
                return;
            }

            this.viewer.isPlanningConstruction = true;
            this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
            this.viewer.constructionIndicator.setBuilding(this.BUILDING);
            this.viewer.constructionIndicator.children[0].on("click", this.handleClick.bind(this));
        }
        getCost() {
            return this.BUILDING.prototype.COST;
        }
        handleClick(e) {
            if (e.evt.button == 2 || e.evt.which == 3) this.rejectConstruction(e);
            else this.confirmConstruction(e);
        }
        confirmConstruction(e) {
            if (!this.viewer.constructionIndicator.allow_construction) return;

            let deficit = this.player.deficitResource(this.BUILDING.prototype.COST);
            if (deficit != null) {
                this.viewer.setErrorMessage(`Not enough ${deficit}.`);
                return;
            }
            this.player.subtractResources(this.BUILDING.prototype.COST);

            let sub = this.viewer.constructionIndicator.sub;
            let building = new this.BUILDING(sub.x, sub.y, this.player);
            this.viewer.engine.addBuilding(building);
            this.viewer.addEntity(building);
            this.viewer.constructionIndicator.removeChildren();
            this.viewer.bottombar.entityActions.goToFirst();
            this.viewer.isPlanningConstruction = false;
            if (this.viewer.engine.selectedEntity) {
                this.viewer.engine.interactOrder(this.viewer.engine.selectedEntity, building);
            }
        }
        rejectConstruction(e) {
            this.viewer.constructionIndicator.removeChildren();
            this.viewer.bottombar.entityActions.popActions();
            this.viewer.isPlanningConstruction = false;
        }
    }
    CreateBuilding.prototype.IMAGE = Building.prototype.AVATAR;
    CreateBuilding.prototype.BUILDING = Building;
    CreateBuilding.prototype.TOOLTIP = `Build ${Building.prototype.NAME}`;
    CreateBuilding.prototype.ACTION_KEY = Building.prototype.ACTION_KEY;
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
PreviousPage.prototype.TOOLTIP = "Previous";
PreviousPage.prototype.ACTION_KEY = "X";
PreviousPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * Action.prototype.ACTIONS_PER_ROW + Action.prototype.MARGIN,
    y: 0
}

class FirstPage extends Action {
    execute() {
        this.viewer.bottombar.entityActions.goToFirst();
    }
}
FirstPage.prototype.IMAGE = make_image("img/interface/command/cancel.png");
FirstPage.prototype.TOOLTIP = "Cancel";
FirstPage.prototype.ACTION_KEY = "Esc";
FirstPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * Action.prototype.ACTIONS_PER_ROW + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}

class NextBuildingsPage extends Action {
    execute() {
        this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
    }
}
NextBuildingsPage.prototype.IMAGE = make_image("img/interface/command/next.png");
NextBuildingsPage.prototype.TOOLTIP = "Next";
NextBuildingsPage.prototype.ACTION_KEY = "X";
NextBuildingsPage.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * Action.prototype.ACTIONS_PER_ROW + Action.prototype.MARGIN,
    y: 0
}
NextBuildingsPage.prototype.ACTIONS = [
    PreviousPage,
    FirstPage,
];

class StandGround extends Action {
}
StandGround.prototype.IMAGE = make_image("img/interface/command/stand_ground.png");
StandGround.prototype.TOOLTIP = "Stand Ground";
StandGround.prototype.ACTION_KEY = "D";


class Build extends Action {
    execute() {
        this.viewer.bottombar.entityActions.pushActions(this.ACTIONS);
    }
}
Build.prototype.IMAGE = make_image("img/interface/command/build.png");
Build.prototype.TOOLTIP = "Build";
Build.prototype.ACTION_KEY = "B";
Build.prototype.ACTIONS = [
    CreateBuildingFactory(House),
    CreateBuildingFactory(Barracks),
    CreateBuildingFactory(Granary),
    CreateBuildingFactory(StoragePit),
    CreateBuildingFactory(Dock),
    CreateBuildingFactory(Farm),
    CreateBuildingFactory(TownCenter),
    NextBuildingsPage,
    FirstPage
];


class Repair extends Action {
}
Repair.prototype.IMAGE = make_image("img/interface/command/repair.png");
Repair.prototype.TOOLTIP = "Repair";
Repair.prototype.ACTION_KEY = "R";

class Stop extends Action {
}
Stop.prototype.IMAGE = make_image("img/interface/command/stop.png");
Stop.prototype.TOOLTIP = "Stop";
Stop.prototype.ACTION_KEY = "S";


let RecruitUnitFactory = function(Unit) {
    class RecruitUnit extends Action {
        execute() {
            let deficit = this.player.deficitResource(this.UNIT.prototype.COST);
            if (deficit != null) {
                this.viewer.setErrorMessage(`Not enough ${deficit}.`);
                return;
            }
            this.player.subtractResources(this.UNIT.prototype.COST);
            this.entity.addTask(this);
        }
        init() {
            if (this.player.population >= this.player.max_population) {
                if (!this.failed) this.viewer.setErrorMessage('You need to build more houses.');
                this.failed = true;
                return false;
            } else {
                this.failed = false;
                return true;
            }
        }
        finalize() {
            let pos = this.findEmptyArea(this.UNIT.prototype.SUBTILE_WIDTH);
            if (pos == null) {
                if (!this.failed) this.viewer.setErrorMessage('Not enough room to place unit.');
                this.failed = true;
                return false;
            }
            if (this.player.population >= this.player.max_population) {
                if (!this.failed) this.viewer.setErrorMessage('You need to build more houses.');
                this.failed = true;
                return false;
            }

            let unit = new this.UNIT(pos.x, pos.y, this.player);
            this.viewer.engine.addUnit(unit);
            this.viewer.addEntity(unit);
            return true;
        }
        getCost() {
            return this.UNIT.prototype.COST;
        }
        time() {
            return this.UNIT.prototype.CREATION_TIME;
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
                    x: curr.x + (this.entity.SUBTILE_WIDTH + width) * dir.x,
                    y: curr.y + (this.entity.SUBTILE_WIDTH + width) * dir.y
                }
                do {
                    let terrain_counts = this.viewer.engine.map.countTerrainTiles(curr.x, curr.y, width);
                    let allowed_terrain = true;
                    for (let terrain of terrain_counts.keys())
                        if (!this.UNIT.prototype.SUPPORTED_TERRAIN.has(terrain)) allowed_terrain = false;

                    let empty = this.viewer.engine.map.areSubtilesEmpty(curr.x, curr.y, width);
                    if (empty && allowed_terrain) {
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
    RecruitUnit.prototype.TOOLTIP = `Create ${Unit.prototype.NAME}`;
    RecruitUnit.prototype.ACTION_KEY = Unit.prototype.ACTION_KEY;
    RecruitUnit.prototype.UNIT = Unit;
    RecruitUnit.prototype.SUPPORTS_QUEUE = true;
    RecruitUnit.prototype.HASH = Unit.prototype.NAME;
    return RecruitUnit;
}


let Actions = {
    StandGround, Build, Repair, Stop, RecruitUnitFactory
}

export { Actions };