import { make_image } from '../utils.js';
import { TownCenter } from './buildings/town_center';
import { Barracks } from './buildings/barracks.js';

class Action {
    constructor(action_set, viewer) {
        this.action_set = action_set;
        this.viewer = viewer;
    }
    execute() { }
}
Action.prototype.SIZE = 50;
Action.prototype.MARGIN = 2;


let MakeCreateBuilding = function(Building) {
    class CreateBuilding extends Action {
        execute() {
            console.log(this.BUILDING.prototype.NAME);
        }
    }
    CreateBuilding.prototype.IMAGE = Building.prototype.AVATAR;
    CreateBuilding.prototype.BUILDING = Building;
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
    MakeCreateBuilding(Barracks),
    MakeCreateBuilding(TownCenter),
    NextBuildingsPage,
    FirstPage
];


class Repair extends Action {
}
Repair.prototype.IMAGE = make_image("img/interface/command/repair.png");

class Stop extends Action {
}
Stop.prototype.IMAGE = make_image("img/interface/command/stop.png");



let Actions = {
    Build, Repair, Stop
};

export { Actions };