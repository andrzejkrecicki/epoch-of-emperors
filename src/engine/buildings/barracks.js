import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { make_image, leftpad } from '../../utils.js';

class Barracks extends Building {
}
Barracks.prototype.NAME = "Barracks";
Barracks.prototype.AVATAR = make_image("img/interface/avatars/barracks_all_1.png");
Barracks.prototype.MAX_HP = 350;
Barracks.prototype.SUBTILE_WIDTH = 5;

Barracks.prototype.COST = {
    food: 0, wood: 125, stone: 0, gold: 0
}

Barracks.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
Barracks.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/barracks/01_all.png")];
Barracks.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(make_image("img/buildings/barracks/01_all.png"))];

Barracks.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 11, y: 82 };

Barracks.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
Barracks.prototype.HITMAP[Barracks.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    make_image("img/buildings/base_hit_big.png"),
    make_image("img/buildings/barracks/01_all.png"),
    Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);


export { Barracks }
