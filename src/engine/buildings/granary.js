import { Building } from './building.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class Granary extends Building {
    acceptsResource(type) {
        return this.isComplete && type == RESOURCE_TYPES.FOOD;
    }
}
Granary.prototype.NAME = "Granary";
Granary.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/granary_01_greek.png");
Granary.prototype.MAX_HP = 350;
Granary.prototype.SUBTILE_WIDTH = 5;

Granary.prototype.ACTION_KEY = "G";
Granary.prototype.COST = {
    food: 0, wood: 120, stone: 0, gold: 0
}

Granary.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
Granary.prototype.IMAGES[Building.prototype.STATE.DONE] = [Sprites.Sprite("img/buildings/granary/01_greek.png")];
Granary.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(Sprites.Sprite("img/buildings/granary/01_greek.png"))];

Granary.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: -11, y: 70 };

Granary.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
Granary.prototype.HITMAP[Granary.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    Sprites.Sprite("img/buildings/base_hit_big.png"),
    Sprites.Sprite("img/buildings/granary/01_greek.png"),
    Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    Granary.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);

export { Granary }
