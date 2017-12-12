import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { make_image, leftpad } from '../../utils.js';

class Barracks extends Building {
}
Barracks.prototype.NAME = "Barracks";
Barracks.prototype.AVATAR = make_image("img/interface/avatars/barracks_all_1.png");
Barracks.prototype.HP = 350;
Barracks.SUBTILE_WIDTH = 6;

Barracks.prototype.IMAGES = {};
Barracks.prototype.IMAGES[Building.prototype.STATE.CONSTRUCTION] = make_image("img/buildings/construction_big_00.png");
Barracks.prototype.IMAGES[Building.prototype.STATE.DONE] = make_image("img/buildings/barracks/01_all.png");

Barracks.prototype.IMAGE_OFFSETS = {};
Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: 2, y: 45 };
Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 5, y: 82 };

export { Barracks }
