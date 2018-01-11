import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { make_image, leftpad } from '../../utils.js';

class Barracks extends Building {
}
Barracks.prototype.NAME = "Barracks";
Barracks.prototype.AVATAR = make_image("img/interface/avatars/barracks_all_1.png");
Barracks.prototype.HP = 350;
Barracks.SUBTILE_WIDTH = 5;

Barracks.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
Barracks.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/barracks/01_all.png")];

Barracks.prototype.IMAGE_OFFSETS = {};
Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: 5, y: 47 };
Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 11, y: 82 };

export { Barracks }
