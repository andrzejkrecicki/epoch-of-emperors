import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { make_image, leftpad } from '../../utils.js';

class TownCenter extends Building {
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = make_image("img/interface/avatars/town_center_01_all.png");
TownCenter.prototype.HP = 600;
TownCenter.SUBTILE_WIDTH = 6;

TownCenter.prototype.IMAGES = {};
TownCenter.prototype.IMAGES[Building.prototype.STATE.CONSTRUCTION] = make_image("img/buildings/construction_big_00.png");
TownCenter.prototype.IMAGES[Building.prototype.STATE.DONE] = make_image("img/buildings/town_center/01_all.png");

TownCenter.prototype.IMAGE_OFFSETS = {};
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: 2, y: 45 };
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 3, y: 54 };

Building.prototype.AVAILABLE_UNITS = [
    Villager
];

export { TownCenter }
