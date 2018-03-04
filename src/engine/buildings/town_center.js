import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { Actions } from '../actions.js';
import { make_image, leftpad } from '../../utils.js';

class TownCenter extends Building {
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Villager)
        ]; else return null;
    }
    acceptsResource(type) {
        return this.isComplete;
    }
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = make_image("img/interface/avatars/town_center_01_all.png");
TownCenter.prototype.MAX_HP = 600;
TownCenter.prototype.SUBTILE_WIDTH = 5;

TownCenter.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
TownCenter.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/town_center/01_all.png")];
TownCenter.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(make_image("img/buildings/town_center/01_all.png"))];

TownCenter.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 3, y: 54 };

TownCenter.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
TownCenter.prototype.HITMAP[TownCenter.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    make_image("img/buildings/base_hit_big.png"),
    make_image("img/buildings/town_center/01_all.png"),
    TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);

export { TownCenter }
