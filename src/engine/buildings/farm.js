import { Building } from './building.js';
import { ExhaustedFarm } from '../flat_drawables.js';
import { Sprites } from '../../sprites.js';

class Farm extends Building {
    constructor() {
        super(...arguments);
    }
    getResource(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    setComplete() {
        super.setComplete();
        this.attributes.food = 250;
    }
}
Farm.prototype.NAME = "Farm";
Farm.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/farm.png");
Farm.prototype.MAX_HP = 50;
Farm.prototype.SUBTILE_WIDTH = 5;
Farm.prototype.INTERACT_WHEN_COMPLETE = true;
Farm.prototype.LEFTOVERS = ExhaustedFarm;

Farm.prototype.ACTION_KEY = "F";
Farm.prototype.COST = {
    food: 0, wood: 75, stone: 0, gold: 0
}

Farm.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
Farm.prototype.IMAGES[Building.prototype.STATE.DONE] = [Sprites.Sprite("img/buildings/farm/all.png")];
Farm.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(Sprites.Sprite("img/buildings/farm/all.png"))];

Farm.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
Farm.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 17, y: 44 };

Farm.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
Farm.prototype.HITMAP[Farm.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    Sprites.Sprite("img/buildings/base_hit_big.png"),
    Sprites.Sprite("img/buildings/farm/all.png"),
    Farm.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    Farm.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);

export { Farm }
