import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { Actions } from '../actions.js';
import { make_image, leftpad } from '../../utils.js';

class TownCenter extends Building {
    get ACTIONS() {
        return [
            Actions.RecruitUnitFactory(Villager)
        ];
    }
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = make_image("img/interface/avatars/town_center_01_all.png");
TownCenter.prototype.HP = 600;
TownCenter.SUBTILE_WIDTH = 5;

TownCenter.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
TownCenter.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/town_center/01_all.png")];
TownCenter.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(make_image("img/buildings/town_center/01_all.png"))];

TownCenter.prototype.IMAGE_OFFSETS = {};
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: 5, y: 47 };
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 3, y: 54 };

export { TownCenter }
