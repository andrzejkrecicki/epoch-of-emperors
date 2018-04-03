import { Building } from './building.js';
import { FishingBoat } from '../units/fishing_boat.js';
import { Actions } from '../actions.js';
import { make_image, leftpad } from '../../utils.js';

class Dock extends Building {
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(FishingBoat)
        ]; else return null;
    }
}
Dock.prototype.NAME = "Dock";
Dock.prototype.AVATAR = make_image("img/interface/avatars/dock_01_all.png");
Dock.prototype.MAX_HP = 350;
Dock.prototype.SUBTILE_WIDTH = 4;

Dock.prototype.ACTION_KEY = "D";
Dock.prototype.COST = {
    food: 0, wood: 100, stone: 0, gold: 0
}

Dock.prototype.IMAGES = {}
Dock.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/dock/01_all.png")];
Dock.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(make_image("img/buildings/dock/01_all.png"))];

Dock.prototype.IMAGES[Building.prototype.STATE.CONSTRUCTION] = [
    make_image("img/buildings/dock/construction_01_all_00.png"),
    make_image("img/buildings/dock/construction_01_all_01.png"),
    make_image("img/buildings/dock/construction_01_all_02.png")
];


Dock.prototype.IMAGE_OFFSETS = {}
Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: -21, y: 36 };
Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: -22, y: 36 };

Dock.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
Dock.prototype.HITMAP[Dock.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    make_image("img/buildings/base_hit_big.png"),
    make_image("img/buildings/dock/01_all.png"),
    Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    Dock.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);


export { Dock }
