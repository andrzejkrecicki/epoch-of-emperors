import { Building } from './building.js';
import { make_image, RESOURCE_TYPES } from '../../utils.js';

class House extends Building {
}
House.prototype.NAME = "House";
House.prototype.AVATAR = make_image("img/interface/avatars/house_01_all.png");
House.prototype.MAX_HP = 75;
House.prototype.SUBTILE_WIDTH = 3;

House.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
House.prototype.IMAGES[Building.prototype.STATE.DONE] = [make_image("img/buildings/house/01_all.png")];
House.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(make_image("img/buildings/house/01_all.png"))];

House.prototype.IMAGES[Building.prototype.STATE.CONSTRUCTION] = [
    make_image("img/buildings/house/construction_01_all_00.png"),
    make_image("img/buildings/house/construction_01_all_01.png"),
    make_image("img/buildings/house/construction_01_all_02.png"),
    make_image("img/buildings/house/construction_01_all_03.png")
];

House.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: -2, y: 30 };
House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: -9, y: 25 };

House.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
House.prototype.HITMAP[House.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    make_image("img/buildings/house/base_hit_01_all.png"),
    make_image("img/buildings/house/01_all.png"),
    House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);

export { House }
