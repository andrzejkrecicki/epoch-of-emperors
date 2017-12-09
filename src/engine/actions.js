import { make_image } from '../utils.js';

class Action {

}


class Build extends Action {
}
Build.prototype.IMAGE = make_image("img/interface/command/build.png");

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